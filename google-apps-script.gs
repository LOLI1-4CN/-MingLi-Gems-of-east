/**
 * Google Apps Script - MingLi Gems Order Sync
 * 
 * 部署步骤：
 * 1. 打开 https://script.google.com
 * 2. 创建新项目
 * 3. 粘贴此代码
 * 4. 点击"部署" → "新建部署"
 * 5. 类型选择"Web应用"
 * 6. 执行身份：我
 * 7. 访问权限：任何人
 * 8. 复制Web应用URL到前端配置
 */

// Spreadsheet ID - 替换为你的表格ID
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';

/**
 * Web App入口点
 */
function doPost(e) {
    try {
        const data = JSON.parse(e.postData.contents);
        
        if (data.action === 'addOrder') {
            return addOrderToSheet(data.order);
        } else if (data.action === 'updateOrder') {
            return updateOrderInSheet(data.orderId, data.updates);
        } else {
            return jsonResponse({ success: false, message: '未知操作' });
        }
        
    } catch (error) {
        return jsonResponse({ 
            success: false, 
            message: '处理失败: ' + error.message 
        });
    }
}

/**
 * GET请求处理（用于测试）
 */
function doGet(e) {
    return jsonResponse({ 
        success: true, 
        message: 'MingLi Gems Order Sync API is running',
        timestamp: new Date().toISOString()
    });
}

/**
 * 添加订单到表格
 */
function addOrderToSheet(order) {
    try {
        const sheet = getOrCreateSheet('Orders');
        
        // 表头（如果是新表格）
        const headers = [
            'Order ID', 'Date', 'Time', 'Customer Name', 'Email', 'Phone',
            'Shipping Address', 'City', 'State', 'Zip Code', 'Country',
            'Product Name', 'Product Details', 'Bracelet Type', 'Bracelet Size',
            'Quantity', 'Base Price', 'Size Upgrade', 'Shipping Cost', 'Total Amount', 'Currency',
            'Payment Method', 'Payment Status', 'PayPal Order ID',
            'Order Status', 'Tracking Number', 'Carrier',
            'Customer Notes', 'Internal Notes', 'Synced At'
        ];
        
        // 检查并添加表头
        if (sheet.getLastRow() === 0) {
            sheet.appendRow(headers);
            // 设置表头格式
            const headerRange = sheet.getRange(1, 1, 1, headers.length);
            headerRange.setFontWeight('bold');
            headerRange.setBackground('#C9A96E');
            headerRange.setFontColor('#FFFFFF');
        }
        
        // 添加订单数据
        const rowData = [
            order.orderId,
            order.date,
            order.time,
            order.customerName,
            order.customerEmail,
            order.customerPhone,
            order.shippingAddress,
            order.city,
            order.state,
            order.zipCode,
            order.country,
            order.productName,
            order.productDetails,
            order.braceletType,
            order.braceletSize,
            order.quantity,
            order.basePrice,
            order.sizeUpgradePrice,
            order.shippingCost,
            order.totalAmount,
            order.currency,
            order.paymentMethod,
            order.paymentStatus,
            order.paypalOrderId,
            order.orderStatus,
            order.trackingNumber,
            order.carrier,
            order.customerNotes,
            order.internalNotes,
            new Date().toISOString()
        ];
        
        sheet.appendRow(rowData);
        
        // 自动调整列宽
        sheet.autoResizeColumns(1, headers.length);
        
        return jsonResponse({ 
            success: true, 
            message: '订单已添加到表格',
            orderId: order.orderId
        });
        
    } catch (error) {
        return jsonResponse({ 
            success: false, 
            message: '添加失败: ' + error.message 
        });
    }
}

/**
 * 更新订单状态
 */
function updateOrderInSheet(orderId, updates) {
    try {
        const sheet = getOrCreateSheet('Orders');
        const data = sheet.getDataRange().getValues();
        
        // 查找订单行
        let rowIndex = -1;
        for (let i = 1; i < data.length; i++) {
            if (data[i][0] === orderId) {
                rowIndex = i + 1; // +1 因为表格行号从1开始
                break;
            }
        }
        
        if (rowIndex === -1) {
            return jsonResponse({ 
                success: false, 
                message: '订单未找到: ' + orderId 
            });
        }
        
        // 更新字段
        const columnMap = {
            'orderStatus': 25,
            'trackingNumber': 26,
            'carrier': 27,
            'internalNotes': 29
        };
        
        for (const [field, value] of Object.entries(updates)) {
            const col = columnMap[field];
            if (col) {
                sheet.getRange(rowIndex, col).setValue(value);
            }
        }
        
        // 更新时间戳
        sheet.getRange(rowIndex, 30).setValue(new Date().toISOString());
        
        return jsonResponse({ 
            success: true, 
            message: '订单已更新',
            orderId: orderId
        });
        
    } catch (error) {
        return jsonResponse({ 
            success: false, 
            message: '更新失败: ' + error.message 
        });
    }
}

/**
 * 获取或创建工作表
 */
function getOrCreateSheet(sheetName) {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
        sheet = ss.insertSheet(sheetName);
    }
    
    return sheet;
}

/**
 * JSON响应封装
 */
function jsonResponse(data) {
    return ContentService
        .createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 初始化表格（手动运行）
 */
function initSpreadsheet() {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // 创建订单表
    const orderSheet = getOrCreateSheet('Orders');
    
    // 创建统计数据表
    const statsSheet = getOrCreateSheet('Statistics');
    if (statsSheet.getLastRow() === 0) {
        statsSheet.appendRow(['Metric', 'Value', 'Last Updated']);
        statsSheet.appendRow(['Total Orders', 0, new Date()]);
        statsSheet.appendRow(['Total Revenue', 0, new Date()]);
        statsSheet.appendRow(['Pending Orders', 0, new Date()]);
        statsSheet.appendRow(['Shipped Orders', 0, new Date()]);
    }
    
    Logger.log('初始化完成！');
}
