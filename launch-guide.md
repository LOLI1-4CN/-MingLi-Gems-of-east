# MingLi Gems 独立站开通指南

## 📋 开通前准备清单

---

## 第一阶段：基础设施（1-3天）

### 1. 域名注册
**推荐平台**：
- Namecheap（性价比高，隐私保护免费）
- GoDaddy（老牌，中文界面）
- 阿里云/腾讯云（国内管理方便）

**建议域名**：
- `mingligems.com` ← 首选
- `fatebracelet.com`
- `chinesefengshuistore.com`
- `wuzibracelet.com`（五行拼音）

**费用**：$10-15/年

---

### 2. 服务器/托管
**方案A：静态托管（当前）**
- Netlify / Vercel（免费！）
- GitHub Pages（免费）
- Cloudflare Pages（免费+CDN）

**方案B：WordPress电商（推荐上线后）**
- SiteGround / Hostinger / Bluehost
- 阿里云ECS / 腾讯云CVM

**费用**：免费 ~ $10/月

---

### 3. SSL证书
- 大部分托管商免费提供
- 必须开启HTTPS（Google排名 + 用户信任）

---

## 第二阶段：支付接入（2-5天）

### 4. Stripe 账户
**适用**：信用卡/借记卡
**费率**：2.9% + $0.30/笔
**注册**：stripe.com
**需要**：
- 公司注册证明 或 个人身份证明
- 银行账户（支持中国银行卡收款）
- 网站URL（可以先提交测试站）

**技术接入**：
```javascript
// Stripe 快速集成示例
const stripe = Stripe('pk_test_...');
const checkout = await stripe.redirectToCheckout({
  lineItems: [{price: 'price_xxx', quantity: 1}],
  mode: 'payment',
  successUrl: 'https://mingligems.com/success',
  cancelUrl: 'https://mingligems.com/cancel',
});
```

---

### 5. PayPal 商业账户
**适用**：PayPal余额、信用卡
**费率**：2.9% + $0.30/笔
**注册**：paypal.com/business
**优势**：欧美用户信任度高

---

### 6. 备选支付方式
- **Klarna/Afterpay**：分期付款（欧美年轻用户偏好）
- **Apple Pay / Google Pay**：移动端转化率高

---

## 第三阶段：物流与供应链（3-7天）

### 7. 供应商对接
**方案A：自发货**
- 1688找手串厂家
- 要求：支持定制刻字、一件代发
- 谈判要点：包装白标、质检标准、退换货政策

**方案B：海外仓**
- ShipBob / Deliverr（美国仓）
- 适合：有一定订单量后

---

### 8. 物流方案
| 方案 | 时效 | 费用 | 适合 |
|------|------|------|------|
| 中国邮政挂号小包 | 15-30天 | $3-8 | 低价引流款 |
| ePacket | 10-20天 | $5-12 | 常规款 |
| DHL/UPS | 3-7天 | $15-30 | 高客单价 |
| YunExpress/燕文 | 8-15天 | $6-15 | 综合推荐 |

**建议**：前期用YunExpress专线，后期量大了谈海外仓

---

## 第四阶段：合规与法务（并行处理）

### 9. 隐私政策 + 服务条款
- 用 Termly 或 Shopify 模板生成
- 必须包含：GDPR合规、退款政策、配送说明

### 10. 商标注册（长期）
- 美国USPTO：$250-400/类
- 欧盟EUIPO：€850/类

---

## 第五阶段：营销推广准备

### 11. 社媒账号
- **TikTok**：@mingligems（玄学内容+手串展示）
- **Instagram**：mingligems_official（精美产品图）
- **Pinterest**：高转化渠道（玄学/珠宝类目）
- **Facebook Page**：广告投放必备

### 12. SEO基础
- 安装 Google Analytics 4
- 提交 Google Search Console
- 每个产品页独立Title/Description

### 13. 邮件营销
- Klaviyo（电商专用，免费500订阅）
- Mailchimp（通用，免费1000订阅）
- 设置：欢迎邮件、购物车挽回、售后跟进

---

## 📅 建议执行时间表

| 天数 | 任务 |
|------|------|
| Day 1 | 注册域名 + 部署到Netlify |
| Day 2-3 | 申请Stripe + PayPal账户 |
| Day 3-4 | 找供应商谈判，拿样品 |
| Day 4-5 | 完善网站：隐私政策、退换货政策 |
| Day 5-6 | 设置物流方案，测试下单流程 |
| Day 7 | 注册社媒账号，准备内容 |
| Week 2 | 正式上线，开始TikTok内容测试 |

---

## ✅ 上线前检查清单

- [ ] 域名解析正确
- [ ] SSL证书生效（https://）
- [ ] 支付流程测试通过
- [ ] 下单后能收到邮件通知
- [ ] 手机端显示正常
- [ ] 页面加载速度 < 3秒
- [ ] 退换货政策页面已发布
- [ ] 联系邮箱能正常收发
- [ ] Google Analytics已安装
- [ ] 至少有3个产品完整上架

---

## 💡 避坑指南

1. **不要先做App**：独立站先用响应式网页
2. **不要囤太多货**：前期一件代发测试市场
3. **不要忽略移动端**：60%+流量来自手机
4. **不要只做英语**：西班牙语/德语市场也很大
5. **不要期望免费流量**：预算至少$500/月广告测试

---

## 📞 需要我协助的下一步

1. **部署到免费服务器** → 我可以操作Netlify部署
2. **接入Stripe支付** → 提供代码和接入文档
3. **迁移到WordPress+WooCommerce** → 完整电商功能
4. **SEO优化方案** → 关键词研究 + 内容策略
5. **TikTok内容脚本** → 10条爆款视频脚本

告诉我你想先做哪一步？
