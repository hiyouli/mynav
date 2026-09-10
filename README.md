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

```bash
# 克隆项目
git clone [https://github.com/hiyouli/mynav.git](https://github.com/hiyouli/mynav.git)
cd mynav

# 创建 D1 数据库并初始化数据表
npx wrangler d1 create my-bookmarks
npx wrangler d1 execute my-bookmarks --command="CREATE TABLE IF NOT EXISTS bookmarks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, url TEXT NOT NULL, category TEXT DEFAULT '默认', tags TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);"

# 部署 Worker
npx wrangler deploy
