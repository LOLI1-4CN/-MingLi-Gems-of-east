/**
 * MingLi Gems - Google Sheets Integration
 * 自动同步订单数据到Google Sheets
 * 
 * 配置步骤：
 * 1. 创建Google Sheets并获取Spreadsheet ID
 * 2. 创建Google Apps Script Web App
 * 3. 在index.html中引入此脚本并配置GOOGLE_SHEETS_WEB_APP_URL
 */

// ==================== 配置区域 ====================
const GOOGLE_SHEETS_CONFIG = {
    // Google Apps Script Web App URL (需要用户自行配置)
    WEB_APP_URL: localStorage.getItem('google_sheets_webapp_url') || '',
    
    // 是否启用同步
    ENABLED: true,
    
    // 同步重试次数
    MAX_RETRIES: 3,
    
    // 同步延迟（毫秒）
    SYNC_DELAY: 1000
};

// ==================== 核心功能 ====================

/**
 * 发送订单到Google Sheets
 * @param {Object} orderData - 订单数据
 * @returns {Promise<Object>} - 同步结果
 */
async function syncOrderToGoogleSheets(orderData) {
    if (!GOOGLE_SHEETS_CONFIG.ENABLED) {
        console.log('[Google Sheets] 同步已禁用');
        return { success: false, reason: 'disabled' };
    }

    if (!GOOGLE_SHEETS_CONFIG.WEB_APP_URL) {
        console.warn('[Google Sheets] 未配置Web App URL');
        // 保存到待同步队列
        queueOrderForSync(orderData);
        return { success: false, reason: 'not_configured', message: '已加入待同步队列' };
    }

    const payload = formatOrderForSheets(orderData);
    
    for (let attempt = 1; attempt <= GOOGLE_SHEETS_CONFIG.MAX_RETRIES; attempt++) {
        try {
            const response = await fetch(GOOGLE_SHEETS_CONFIG.WEB_APP_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            
            if (result.success) {
                console.log('[Google Sheets] 订单同步成功:', orderData.orderId);
                markOrderAsSynced(orderData.orderId);
                return { success: true, data: result };
            } else {
                throw new Error(result.message || '同步失败');
            }

        } catch (error) {
            console.error(`[Google Sheets] 同步尝试 ${attempt} 失败:`, error);
            
            if (attempt === GOOGLE_SHEETS_CONFIG.MAX_RETRIES) {
                // 最终失败，加入队列稍后重试
                queueOrderForSync(orderData);
                return { 
                    success: false, 
                    reason: 'sync_failed',
                    error: error.message,
                    message: '已加入待同步队列，稍后将自动重试'
                };
            }
            
            // 等待后重试
            await delay(GOOGLE_SHEETS_CONFIG.SYNC_DELAY * attempt);
        }
    }
}

/**
 * 格式化订单数据为Sheets格式
 */
function formatOrderForSheets(orderData) {
    const timestamp = new Date().toISOString();
    
    return {
        action: 'addOrder',
        timestamp: timestamp,
        order: {
            orderId: orderData.orderId,
            date: orderData.date || new Date().toLocaleDateString('zh-CN'),
            time: orderData.time || new Date().toLocaleTimeString('zh-CN'),
            
            // 客户信息
            customerName: orderData.customerName || '',
            customerEmail: orderData.customerEmail || '',
            customerPhone: orderData.customerPhone || '',
            shippingAddress: orderData.shippingAddress || '',
            city: orderData.city || '',
            state: orderData.state || '',
            zipCode: orderData.zipCode || '',
            country: orderData.country || '',
            
            // 产品信息
            productName: orderData.productName || 'Custom Bracelet',
            productDetails: orderData.productDetails || '',
            braceletType: orderData.braceletType || '',
            braceletSize: orderData.braceletSize || '',
            quantity: orderData.quantity || 1,
            
            // 价格信息
            basePrice: orderData.basePrice || 0,
            sizeUpgradePrice: orderData.sizeUpgradePrice || 0,
            shippingCost: orderData.shippingCost || 0,
            totalAmount: orderData.totalAmount || 0,
            currency: orderData.currency || 'USD',
            
            // 支付信息
            paymentMethod: orderData.paymentMethod || 'PayPal',
            paymentStatus: orderData.paymentStatus || 'Paid',
            paypalOrderId: orderData.paypalOrderId || '',
            
            // 订单状态
            orderStatus: orderData.orderStatus || 'Processing',
            trackingNumber: orderData.trackingNumber || '',
            carrier: orderData.carrier || '',
            
            // 备注
            customerNotes: orderData.customerNotes || '',
            internalNotes: orderData.internalNotes || ''
        }
    };
}

/**
 * 将订单加入待同步队列
 */
function queueOrderForSync(orderData) {
    const queue = JSON.parse(localStorage.getItem('pending_sync_orders') || '[]');
    
    // 检查是否已存在
    const exists = queue.some(item => item.orderId === orderData.orderId);
    if (!exists) {
        queue.push({
            ...orderData,
            _queuedAt: new Date().toISOString(),
            _retryCount: 0
        });
        localStorage.setItem('pending_sync_orders', JSON.stringify(queue));
        console.log('[Google Sheets] 订单已加入同步队列:', orderData.orderId);
    }
}

/**
 * 标记订单为已同步
 */
function markOrderAsSynced(orderId) {
    const synced = JSON.parse(localStorage.getItem('synced_orders') || '[]');
    if (!synced.includes(orderId)) {
        synced.push(orderId);
        localStorage.setItem('synced_orders', JSON.stringify(synced));
    }
    
    // 从待同步队列中移除
    const queue = JSON.parse(localStorage.getItem('pending_sync_orders') || '[]');
    const updatedQueue = queue.filter(item => item.orderId !== orderId);
    localStorage.setItem('pending_sync_orders', JSON.stringify(updatedQueue));
}

/**
 * 重试待同步队列
 */
async function retryPendingSyncs() {
    const queue = JSON.parse(localStorage.getItem('pending_sync_orders') || '[]');
    
    if (queue.length === 0) {
        console.log('[Google Sheets] 没有待同步的订单');
        return;
    }
    
    console.log(`[Google Sheets] 开始重试 ${queue.length} 个待同步订单`);
    
    for (const orderData of queue) {
        // 最多重试5次
        if ((orderData._retryCount || 0) >= 5) {
            console.warn('[Google Sheets] 订单超过最大重试次数:', orderData.orderId);
            continue;
        }
        
        orderData._retryCount = (orderData._retryCount || 0) + 1;
        await syncOrderToGoogleSheets(orderData);
        await delay(500); // 间隔500ms避免请求过快
    }
}

/**
 * 延迟函数
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 设置Google Sheets Web App URL
 */
function setGoogleSheetsUrl(url) {
    localStorage.setItem('google_sheets_webapp_url', url);
    GOOGLE_SHEETS_CONFIG.WEB_APP_URL = url;
    console.log('[Google Sheets] URL已配置');
}

/**
 * 获取同步统计
 */
function getSyncStats() {
    const synced = JSON.parse(localStorage.getItem('synced_orders') || '[]');
    const pending = JSON.parse(localStorage.getItem('pending_sync_orders') || '[]');
    
    return {
        totalSynced: synced.length,
        pendingSync: pending.length,
        isConfigured: !!GOOGLE_SHEETS_CONFIG.WEB_APP_URL
    };
}

/**
 * 导出待同步订单为CSV（备用方案）
 */
function exportPendingOrdersToCSV() {
    const queue = JSON.parse(localStorage.getItem('pending_sync_orders') || '[]');
    
    if (queue.length === 0) {
        alert('没有待同步的订单');
        return;
    }
    
    const headers = [
        'Order ID', 'Date', 'Customer Name', 'Email', 'Product', 
        'Quantity', 'Total Amount', 'Status'
    ];
    
    const rows = queue.map(order => [
        order.orderId,
        order.date,
        order.customerName,
        order.customerEmail,
        order.productName,
        order.quantity,
        order.totalAmount,
        order.orderStatus
    ]);
    
    const csv = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pending_orders_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

// ==================== 页面加载时重试同步 ====================
document.addEventListener('DOMContentLoaded', function() {
    // 页面加载后30秒开始重试待同步队列
    setTimeout(retryPendingSyncs, 30000);
});

// 暴露到全局
window.GoogleSheetsIntegration = {
    syncOrder: syncOrderToGoogleSheets,
    setUrl: setGoogleSheetsUrl,
    getStats: getSyncStats,
    retryPending: retryPendingSyncs,
    exportCSV: exportPendingOrdersToCSV
};
