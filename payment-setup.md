# 支付接入指南 - MingLi Gems

## 一、支付方案选择

| 支付方式 | 个人账户 | 个体户/公司 | 费率 | 适合阶段 |
|---------|---------|------------|------|---------|
| **PayPal** | ✅ 可用（限额$5000/月） | ✅ 推荐 | 2.9% + $0.30 | 起步/验证 |
| **Stripe** | ❌ 不可 | ✅ 必须 | 2.9% + $0.30 | 正式运营 |
| **信用卡收单** | ❌ 不可 | ✅ 必须 | 3-5% | 规模化 |

## 二、PayPal 接入（推荐先接入）

### 2.1 注册 PayPal 商业账号

1. 访问：https://www.paypal.com/business
2. 点击 "Sign Up" → 选择 "Business Account"
3. 填写信息：
   - Business Type: 选 "Individual" 或 "Sole Proprietorship"（个体户）
   - Business Name: `MingLi Gems`
   - Business Category: "Jewelry & Watches" 或 "Gifts & Special Event Supplies"
4. 验证邮箱和银行卡

### 2.2 获取 API 凭证

1. 登录 PayPal 开发者中心：https://developer.paypal.com/
2. 点击 "Apps & Credentials"
3. 创建 App：
   - App Name: `MingLi Gems Store`
   - 选择 "Merchant" 类型
4. 获取 **Client ID** 和 **Secret Key**
   - Sandbox（测试环境）
   - Live（生产环境）

### 2.3 代码集成

在网站中添加 PayPal 按钮代码：

```html
<!-- 在购物车页面添加 -->
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD"></script>

<div id="paypal-button-container"></div>

<script>
paypal.Buttons({
  createOrder: function(data, actions) {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: '39.99' // 订单金额
        },
        description: 'MingLi Gems - Custom Fortune Bracelet'
      }]
    });
  },
  onApprove: function(data, actions) {
    return actions.order.capture().then(function(details) {
      alert('Payment completed! Thank you, ' + details.payer.name.given_name);
      // 这里添加订单处理逻辑
      window.location.href = '/thank-you.html';
    });
  },
  onError: function(err) {
    console.error('Payment error:', err);
    alert('Payment failed. Please try again.');
  }
}).render('#paypal-button-container');
</script>
```

## 三、Stripe 接入（正式运营推荐）

### 3.1 注册要求

**必须提供：**
- 营业执照（个体户或公司）
- 法人身份证
- 银行账户信息
- 网站 URL（https://fengshui-east.com）

### 3.2 注册流程

1. 访问：https://dashboard.stripe.com/register
2. 选择国家（根据实际情况）：
   - 有美国公司 → 选 United States
   - 有香港公司 → 选 Hong Kong
   - 中国大陆 → 需通过第三方服务商（如 PingPong、连连支付）

3. 填写信息：
   - Business Type: "Individual" 或 "Company"
   - Business Website: `https://fengshui-east.com`
   - Product Description: "Custom Chinese fortune bracelets and jewelry"

4. 提交审核（通常 1-3 个工作日）

### 3.3 获取 API Keys

1. 登录 Stripe Dashboard
2. 进入 Developers → API Keys
3. 获取：
   - Publishable key（前端用）
   - Secret key（后端用，保密！）

### 3.4 代码集成

```html
<!-- 在购物车页面添加 -->
<script src="https://js.stripe.com/v3/"></script>

<form id="payment-form">
  <div id="card-element"><!-- Stripe Card Element --></div>
  <div id="card-errors" role="alert"></div>
  <button type="submit">Pay $39.99</button>
</form>

<script>
const stripe = Stripe('pk_live_YOUR_PUBLISHABLE_KEY');
const elements = stripe.elements();
const card = elements.create('card');
card.mount('#card-element');

// 表单提交处理
const form = document.getElementById('payment-form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const {token, error} = await stripe.createToken(card);
  
  if (error) {
    document.getElementById('card-errors').textContent = error.message;
  } else {
    // 发送 token 到后端处理支付
    stripeTokenHandler(token);
  }
});

function stripeTokenHandler(token) {
  // 这里需要将 token 发送到后端服务器处理
  // 后端使用 Secret Key 完成扣款
  console.log('Token:', token.id);
  // fetch('/charge', { method: 'POST', body: JSON.stringify({token: token.id}) })
}
</script>
```

## 四、简化方案：使用第三方支付平台

如果不想写代码，可以使用这些平台：

| 平台 | 特点 | 费用 |
|------|------|------|
| **Gumroad** | 简单，无需代码 | 10% 手续费 |
| **Paddle** | 支持全球支付 | 5% + $0.50 |
| **Buy Me a Coffee** | 极简 | 5% 手续费 |

### Gumroad 集成示例：

```html
<!-- 最简单的方式 -->
<a href="https://gumroad.com/l/YOUR_PRODUCT_ID" target="_blank">
  <button class="btn-primary">Buy Now - $39.99</button>
</a>
```

## 五、测试与上线

### 5.1 测试流程

1. **PayPal Sandbox 测试**：
   - 使用测试账号支付
   - 确认回调和订单状态

2. **Stripe 测试卡号**：
   - 卡号：`4242 4242 4242 4242`
   - 日期：任意未来日期
   - CVC：任意 3 位数字

### 5.2 上线检查清单

- [ ] PayPal Live 模式已开启
- [ ] Stripe Live Key 已替换测试 Key
- [ ] 支付成功页面已配置
- [ ] 订单邮件通知已设置
- [ ] 退款流程已测试

## 六、注意事项

### ⚠️ 风险提醒

1. **PayPal 个人账户收商业款 = 违规**
   - 月收款 > $1000 建议升级商业版
   - 频繁违规会被冻结 180 天

2. **Stripe 审核严格**
   - 网站必须有明确的退换货政策
   - 产品描述需真实准确
   - 高风险行业（玄学/珠宝）可能需补充资料

3. **税务合规**
   - 境外收入需申报
   - 建议咨询专业会计师

### 💡 建议路径

| 阶段 | 收入 | 支付方式 |
|------|------|---------|
| 验证期 | <$1000/月 | PayPal 个人账户 |
| 起步期 | $1000-5000/月 | PayPal 商业版 |
| 增长期 | >$5000/月 | Stripe + PayPal |

## 七、下一步操作

选择你的方案：

**A. 先用 PayPal 个人版跑通（最快）**
- 注册 PayPal 个人账户
- 生成付款链接/按钮
- 嵌入网站

**B. 直接注册 PayPal 商业版（推荐）**
- 需要个体户/公司资质
- 费率更低，更专业

**C. 使用 Stripe（欧美用户信任度高）**
- 需要个体户/公司资质
- 转化率比 PayPal 高 10-15%

**D. 使用第三方平台（最简单）**
- Gumroad / Paddle
- 手续费高但零代码

---

**你想选哪个方案？我可以帮你完成具体的集成代码。**
