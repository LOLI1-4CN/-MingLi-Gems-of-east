# PayPal 个人支付接入指南

## ✅ 已完成

网站已集成 PayPal 支付按钮，点击购物车图标即可弹出结账窗口。

---

## 📋 你需要做的（按顺序）

### 第一步：注册 PayPal 个人账户

1. 访问：https://www.paypal.com
2. 点击 **"Sign Up"**（注册）
3. 选择 **"Personal Account"**（个人账户）
4. 填写邮箱、设置密码
5. 验证邮箱
6. 绑定银行卡或信用卡（用于收款提现）

---

### 第二步：获取 PayPal Client ID

1. 访问 PayPal 开发者中心：https://developer.paypal.com/
2. 用刚注册的账号登录
3. 点击顶部 **"Apps & Credentials"**
4. 在 **"REST API apps"** 区域点击 **"Create App"**
5. 填写：
   - App Name: `MingLi Gems Store`
   - App Type: 选 **"Merchant"**
6. 点击 **"Create App"**
7. 复制 **Client ID**（一长串字符）

---

### 第三步：替换代码中的 Client ID

1. 打开 `index.html` 文件
2. 找到这行代码：
   ```html
   <script src="https://www.paypal.com/sdk/js?client-id=sb&currency=USD&intent=capture"></script>
   ```
3. 把 `sb` 替换成你的真实 Client ID：
   ```html
   <script src="https://www.paypal.com/sdk/js?client-id=YOUR_REAL_CLIENT_ID&currency=USD&intent=capture"></script>
   ```

---

### 第四步：切换到 Live 模式

PayPal 默认是 Sandbox（测试）模式，需要切换到 Live 才能收真实付款。

1. 在 PayPal 开发者中心
2. 点击右上角切换按钮，从 **"Sandbox"** 切换到 **"Live"**
3. 重新创建一个 Live App（步骤同上）
4. 使用 Live 模式的 Client ID

---

## 🧪 测试支付（SandBox 模式）

在切换到 Live 之前，可以用测试账号测试：

**测试买家账号：**
- 邮箱：`sb-buyer@example.com`
- 密码：`12345678`

**测试流程：**
1. 保持 `client-id=sb`（测试模式）
2. 点击购物车 → PayPal 按钮
3. 用测试买家账号登录支付
4. 支付成功后查看订单状态

---

## ⚠️ 重要提醒

### PayPal 个人账户限制

| 限制项 | 说明 |
|--------|------|
| 月收款限额 | 约 $5000 USD |
| 单次收款限额 | 约 $2500 USD |
| 提现周期 | 3-5 个工作日 |
| 冻结风险 | 收款过多可能触发审核 |

### 避免账号冻结的建议

1. **不要突然收大额款项**
   - 前期单笔控制在 $200 以内
   - 逐渐提高单笔金额

2. **及时发货并上传 tracking**
   - PayPal 可能要求提供发货证明
   - 保留所有订单记录

3. **完善网站信息**
   - 添加退换货政策页面
   - 添加联系方式
   - 添加关于我们页面

4. **月收款超过 $1000 时**
   - 考虑升级 PayPal 商业账户
   - 或注册 Stripe 分散风险

---

## 💰 费率和提现

| 项目 | 费率 |
|------|------|
| 美国境内付款 | 2.9% + $0.30 |
| 国际付款 | 4.4% + 固定费用 |
| 提现到银行卡 | 免费（3-5天） |
| 提现到美元账户 | 免费 |
| 货币转换费 | 约 3-4% |

---

## 🚀 快速上线检查清单

- [ ] PayPal 个人账户注册完成
- [ ] 银行卡/信用卡已绑定
- [ ] 已创建 PayPal App 并获取 Client ID
- [ ] 已替换 index.html 中的 client-id
- [ ] 已测试 Sandbox 支付流程
- [ ] 已切换到 Live 模式
- [ ] 网站已更新到服务器

---

## ❓ 常见问题

**Q: 客户没有 PayPal 账号能付款吗？**
A: 可以！PayPal 支持信用卡/借记卡直接支付，不需要注册 PayPal。

**Q: 收到款项后多久能提现？**
A: 新账号首次收款可能有 21 天冻结期，之后通常是即时到账。

**Q: 可以收人民币吗？**
A: PayPal 个人账户只能收外币（USD/EUR/GBP 等），提现时自动结汇成人民币。

**Q: 被冻结了怎么办？**
A: 按 PayPal 要求提供资料（身份证、发货证明、供应商发票等），通常 7-15 天解冻。

---

## 📞 需要帮助？

PayPal 客服：
- 在线帮助中心：https://www.paypal.com/help
- 电话：400-921-1000（中国大陆）

---

**下一步：注册 PayPal 并替换 Client ID，然后测试支付流程！**
