# fengshui-east.com 部署指南

## 🚀 推荐方案：Cloudflare Pages（免费 + 国内快）

**优势**：
- ✅ 全球CDN（国内访问速度快）
- ✅ SSL证书自动配置
- ✅ 免费无限带宽
- ✅ GitHub自动部署

---

## 📋 部署步骤

### 第一步：上传代码到 GitHub（10分钟）

1. **注册 GitHub 账号**
   - 访问 https://github.com
   - 用邮箱注册

2. **创建新仓库**
   - 点击右上角 "+" → "New repository"
   - Repository name: `fengshui-east`
   - 选择 "Public"
   - 点击 "Create repository"

3. **上传代码**
   在仓库页面点击 "uploading an existing file"
   将 `index.html` 拖入上传
   点击 "Commit changes"

---

### 第二步：部署到 Cloudflare Pages（10分钟）

1. **注册 Cloudflare**
   - 访问 https://dash.cloudflare.com/sign-up
   - 用邮箱注册（可与GitHub不同）

2. **进入 Pages**
   - 登录后点击左侧菜单 "Pages"
   - 点击 "Create a project"

3. **连接 GitHub**
   - 点击 "Connect to Git"
   - 授权 Cloudflare 访问你的 GitHub
   - 选择 `fengshui-east` 仓库
   - 点击 "Begin setup"

4. **配置构建设置**
   - Project name: `fengshui-east`
   - Production branch: `main`
   - Framework preset: **None**
   - Build command: （留空）
   - Build output directory: `/` （根目录）
   - 点击 "Save and Deploy"

5. **等待部署完成**
   - 约1-2分钟后，Cloudflare 会给你一个临时域名：
     `fengshui-east.pages.dev`
   - 点击链接测试网站是否正常

---

### 第三步：绑定你的域名（5分钟）

1. **添加自定义域名**
   - 在 Cloudflare Pages 项目页面
   - 点击 "Custom domains" 标签
   - 点击 "Set up a custom domain"
   - 输入：`fengshui-east.com`
   - 点击 "Continue"

2. **配置 DNS 解析**
   Cloudflare 会提示两种添加方式：

   **方式A：使用 Cloudflare DNS（推荐）**
   - 将域名 NS 服务器改为 Cloudflare 的：
     - `lara.ns.cloudflare.com`
     - `greg.ns.cloudflare.com`
   - 在你的域名注册商后台修改 NS 记录
   - 等待 5-30 分钟生效

   **方式B：添加 CNAME 记录**
   - 在域名注册商后台添加记录：
     - 类型：CNAME
     - 名称：`@` 或 `www`
     - 目标：`fengshui-east.pages.dev`
   - 等待 5-30 分钟生效

3. **验证绑定**
   - Cloudflare 会自动检查 DNS 配置
   - 成功后显示 "Active"
   - 访问 https://fengshui-east.com 测试

---

## ✅ 部署完成检查清单

- [ ] GitHub 仓库已创建并上传 index.html
- [ ] Cloudflare Pages 项目已创建
- [ ] 网站在 .pages.dev 域名可访问
- [ ] fengshui-east.com 已绑定
- [ ] HTTPS 证书已自动配置（小锁图标）
- [ ] 网站在电脑和手机都能正常访问

---

## 🔄 后续更新代码

每次修改网站后：
1. 在 GitHub 仓库上传新的 index.html
2. Cloudflare 会自动重新部署（约1分钟）
3. 刷新网站即可看到更新

---

## 🆘 常见问题

**Q: 域名解析后打不开？**
A: DNS 生效需要 5-30 分钟，耐心等待。清除浏览器缓存再试。

**Q: 提示 "DNS_PROBE_FINISHED_NXDOMAIN"？**
A: DNS 还没生效，或者 CNAME 配置错误。检查域名后台设置。

**Q: HTTPS 证书没生效？**
A: Cloudflare 会自动申请，通常10分钟内完成。耐心等待。

**Q: 想换其他部署方式？**
- **Vercel**: https://vercel.com（同样免费，GitHub一键部署）
- **Netlify**: https://netlify.com（拖拽上传，最简单）
- **GitHub Pages**: https://pages.github.com（纯静态，无CDN）

---

## 📞 需要协助？

如果在某一步卡住，告诉我：
1. 你卡在哪个步骤
2. 报错信息是什么
3. 截图或描述具体问题

我可以远程指导或帮你排查。
