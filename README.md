# 🔖 mynav (Cloudflare D1 驱动的极简网址收藏站)

一个完全托管在 **Cloudflare Workers** + **Cloudflare D1** 数据库上的轻量级网址导航/书签管理站。零成本部署，极速加载，完全运行在 Cloudflare 的免费额度内。

![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=flat-square&logo=cloudflare&logoColor=white)
![Cloudflare D1](https://img.shields.io/badge/Cloudflare-D1_Database-F38020?style=flat-square&logo=cloudflare&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

---

## ✨ 项目特性

* 🪙 **100% 免费**：无需购买服务器，利用 Cloudflare 免费额度即可轻松承载个人日常使用（每天支持 10 万次 API 请求与 500 万次数据库读取）。
* 🚀 **极致响应**：基于 Cloudflare 边缘计算（Workers），全球节点加密与加速，毫秒级响应。
* 🛠️ **自动补全协议**：输入 `example.com` 时自动识别并补全 `https://` 协议头，防止跳转错误。
* 🔍 **实时搜索与分类**：支持按网址标题、URL 及分类名称进行前端实时关键词过滤。
* 📱 **响应式界面**：基于 Tailwind CSS 打造的现代化极简 UI，完美适配 Mobile / Desktop 端。
* 🗑️ **便捷管理**：提供直观的后台添加与卡片快捷删除功能。

---

## 🚀 快速部署

### 方案一：一键自动化部署 (推荐开发者)

如果你安装了 Cloudflare CLI 工具 `wrangler`，可以直接在本地部署：

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/hiyouli/mynav)


# 克隆项目
git clone [https://github.com/hiyouli/mynav.git](https://github.com/hiyouli/mynav.git)
cd mynav

# 创建 D1 数据库并初始化数据表
npx wrangler d1 create my-bookmarks
npx wrangler d1 execute my-bookmarks --command="CREATE TABLE IF NOT EXISTS bookmarks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, url TEXT NOT NULL, category TEXT DEFAULT '默认', tags TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);"

# 部署 Worker
npx wrangler deploy

### 方案二：控制台手动部署 (适合零基础新手，仅需浏览器)
整个部署过程仅需 3 分钟，全部在 Cloudflare Web 控制台中完成。

# 1. 创建 D1 数据库
登录 Cloudflare 控制台。

在左侧菜单中选择 Storage & Databases (存储和数据库) -> D1。

点击 Create database (创建数据库)，命名为 my-bookmarks，然后点击 Create。

# 2. 初始化数据库表结构
在刚刚创建好的 my-bookmarks 数据库详情页中，切换到 Console 标签页。
粘贴以下 SQL 语句并点击 Execute 运行，以创建书签数据表：

```bash
CREATE TABLE IF NOT EXISTS bookmarks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT DEFAULT '默认',
  tags TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```bash
# 3. 创建 Cloudflare Worker
在 Cloudflare 左侧菜单点击 Workers & Pages。
点击 Create application -> 选择 Workers -> 点击 Create Worker。
为 Worker 起一个名字（如 my-nav），点击 Deploy 保存。

# 4. 绑定 D1 数据库到 Worker
进入你刚刚创建的 my-nav Worker 管理页面。
点击顶部的 Settings (设置) -> 在列表中选择 Bindings (绑定)。
点击 Add binding (添加绑定) 按钮，选择 D1 database。
配置如下信息：

Variable name (变量名称)：填入 DB (注：必须大写)
D1 database (选择数据库)：选择在第一步中创建的 my-bookmarks 数据库。
点击 Save and deploy (保存并部署)。

# 5. 部署代码
回到 Worker 管理页面，点击右上角或主页面的 Edit code (编辑代码)。
将编辑器中的默认代码全部清空，然后把仓库中的 index.js 完整代码粘贴进去。
点击右上角的 Save and Deploy (保存并部署)。

🌐 绑定自定义域名 (Optional)
如果你在 Cloudflare 上托管了自己的域名（例如 yourdomain.com），可以将其绑定到这个导航站：
打开 Cloudflare 控制台，进入你的 Workers & Pages -> 点击创建的 my-nav Worker。
切换到 Settings (设置) 标签页。
选择 Domains & Routes (域名与路由)。
点击 Add (添加) -> 选择 Custom Domain (自定义域名)。
输入你想要使用的子域名（例如 nav.yourdomain.com），点击 Add custom domain。
Cloudflare 会自动为你配置 DNS 解析和 SSL 证书，等待 1-2 分钟即可通过自定义域名访问。

📄 开源协议
本项目基于 MIT License 协议开源，欢迎 Fork 和 Star！
