/**
 * MingLi Gems - 统一配置文件
 * 
 * 此文件集中管理所有配置项，便于维护和部署
 * 
 * 使用方法:
 * 在所有HTML文件中引入: <script src="config.js"></script>
 * 然后通过 window.MINGLI_CONFIG 访问配置
 */

(function() {
    'use strict';
    
    // ============================================
    // 基础配置
    // ============================================
    const CONFIG = {
        // 应用信息
        app: {
            name: 'MingLi Gems',
            version: '1.0.0',
            url: 'https://fengshui-east.com',
            email: '75576061@qq.com'
        },
        
        // ============================================
        // API 配置
        // ============================================
        api: {
            // 主API地址
            baseUrl: 'https://mingli-gems-api.vercel.app',
            
            // 超时设置（毫秒）
            timeout: 10000,
            
            // 重试次数
            retries: 3,
            
            // 端点
            endpoints: {
                orders: '/api/orders',
                health: '/api/health',
                adminOrders: '/api/admin/orders'
            }
        },
        
        // ============================================
        // 存储键名（统一命名空间）
        // ============================================
        storage: {
            // localStorage 键名
            keys: {
                cart: 'mg_cart',
                orders: 'mg_orders',
                baziReportOrder: 'mg_bazi_report_order',
                pendingSyncOrders: 'mg_pending_sync_orders',
                syncedOrders: 'mg_synced_orders',
                googleSheetsUrl: 'mg_google_sheets_webapp_url',
                userPreferences: 'mg_user_preferences'
            },
            
            // sessionStorage 键名
            sessionKeys: {
                adminLoggedIn: 'mg_admin_session',
                loginAttempts: 'mg_login_attempts'
            }
        },
        
        // ============================================
        // 支付配置
        // ============================================
        payment: {
            // PayPal 配置
            paypal: {
                // 从环境变量或外部配置加载
                clientId: window.MINGLI_PAYPAL_CLIENT_ID || '',
                currency: 'USD',
                intent: 'capture'
            },
            
            // 连连支付配置
            lianlian: {
                enabled: true,
                bankName: 'Deutsche Bank Trust Company Americas',
                bankAddress: '1 Columbus Circle, New York, NY 10019',
                branch: '60 Wall Street, 15th FL, New York, NY 10005',
                routingNumber: '021001033',
                swiftCode: 'BKTRUS33',
                accountNumber: '003744757743'
            },
            
            // 银行转账配置
            bankTransfer: {
                enabled: true,
                instructions: 'Please include your Order ID in the transfer reference.'
            }
        },
        
        // ============================================
        // EmailJS 配置
        // ============================================
        emailjs: {
            // 这些值需要在部署前配置
            serviceId: window.MINGLI_EMAILJS_SERVICE_ID || '',
            templateId: window.MINGLI_EMAILJS_TEMPLATE_ID || '',
            publicKey: window.MINGLI_EMAILJS_PUBLIC_KEY || ''
        },
        
        // ============================================
        // Google Sheets 配置
        // ============================================
        googleSheets: {
            enabled: true,
            webAppUrl: localStorage.getItem('mg_google_sheets_webapp_url') || '',
            maxRetries: 3,
            syncDelay: 1000
        },
        
        // ============================================
        // 管理员配置
        // ============================================
        admin: {
            // 登录设置
            login: {
                maxAttempts: 5,
                lockoutDuration: 15 * 60 * 1000, // 15分钟
                sessionDuration: 24 * 60 * 60 * 1000 // 24小时
            },
            
            // API Key 应该从环境变量获取
            apiKey: window.MINGLI_ADMIN_API_KEY || ''
        },
        
        // ============================================
        // 产品配置
        // ============================================
        products: {
            basePrice: 269,
            currency: 'USD',
            
            // 尺寸加价
            sizeUpgrades: {
                'S': 0,
                'M': 0,
                'L': 0,
                'XL': 29,
                'XXL': 49
            },
            
            // 运费
            shipping: {
                standard: 0, // 免费
                express: 29
            }
        },
        
        // ============================================
        // 功能开关
        // ============================================
        features: {
            googleSheetsSync: false,      // Google Sheets 同步
            emailNotifications: true,     // 邮件通知
            cloudOrderStorage: true,      // 云端订单存储
            localBackup: true,            // 本地备份
            baziCalculator: true,         // 八字计算器
            premiumReports: true          // 付费报告
        },
        
        // ============================================
        // 调试配置
        // ============================================
        debug: {
            enabled: false,  // 生产环境设为 false
            logLevel: 'warn' // 'debug' | 'info' | 'warn' | 'error'
        }
    };
    
    // ============================================
    // 工具函数
    // ============================================
    
    /**
     * 获取配置值
     * @param {string} path - 配置路径，如 'api.baseUrl'
     * @param {*} defaultValue - 默认值
     * @returns {*} 配置值
     */
    CONFIG.get = function(path, defaultValue) {
        const keys = path.split('.');
        let value = this;
        
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return defaultValue;
            }
        }
        
        return value;
    };
    
    /**
     * 更新配置（运行时）
     * @param {string} path - 配置路径
     * @param {*} value - 新值
     */
    CONFIG.set = function(path, value) {
        const keys = path.split('.');
        let target = this;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (!(keys[i] in target)) {
                target[keys[i]] = {};
            }
            target = target[keys[i]];
        }
        
        target[keys[keys.length - 1]] = value;
    };
    
    /**
     * 日志输出（根据debug设置）
     * @param {string} level - 日志级别
     * @param {...*} args - 日志内容
     */
    CONFIG.log = function(level, ...args) {
        const levels = { debug: 0, info: 1, warn: 2, error: 3 };
        const currentLevel = levels[this.debug.logLevel] || 1;
        const messageLevel = levels[level] || 1;
        
        if (this.debug.enabled && messageLevel >= currentLevel) {
            console[level](`[MingLi Gems]`, ...args);
        }
    };
    
    // ============================================
    // 暴露到全局
    // ============================================
    window.MINGLI_CONFIG = CONFIG;
    
    // 兼容性别名
    window.MINGLI = CONFIG;
    
    // ============================================
    // 环境检查
    // ============================================
    if (CONFIG.debug.enabled) {
        console.log('[MingLi Gems] Config loaded:', {
            version: CONFIG.app.version,
            apiUrl: CONFIG.api.baseUrl,
            features: CONFIG.features
        });
    }
    
})();