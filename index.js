export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 1. 获取所有书签接口 (API)
    if (path === '/api/bookmarks' && request.method === 'GET') {
      const { results } = await env.DB.prepare("SELECT * FROM bookmarks ORDER BY id DESC").all();
      return Response.json(results);
    }

    // 2. 添加书签接口 (API)
    if (path === '/api/bookmarks' && request.method === 'POST') {
      try {
        const body = await request.json();
        let { title, url, category } = body;
        if (!title || !url) return new Response('标题和网址不能为空', { status: 400 });

        // 自动补全协议头 (修复 Bug：防范相对路径跳转)
        url = url.trim();
        if (!/^https?:\/\//i.test(url)) {
          url = 'https://' + url;
        }

        await env.DB.prepare(
          "INSERT INTO bookmarks (title, url, category) VALUES (?, ?, ?)"
        ).bind(title, url, category || '默认').run();

        return Response.json({ success: true });
      } catch (e) {
        return new Response(e.message, { status: 500 });
      }
    }

    // 3. 删除书签接口 (API)
    if (path.startsWith('/api/bookmarks/') && request.method === 'DELETE') {
      try {
        const id = path.split('/').pop();
        await env.DB.prepare("DELETE FROM bookmarks WHERE id = ?").bind(id).run();
        return Response.json({ success: true });
      } catch (e) {
        return new Response(e.message, { status: 500 });
      }
    }

    // 4. 前端 UI 页面 (HTML)
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>我的私房书签库</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 min-h-screen text-slate-800 p-4 md:p-8">
  <div class="max-w-4xl mx-auto">
    <!-- 头部与搜索栏 -->
    <header class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">🔖 网址收藏站</h1>
        <p class="text-sm text-slate-500 mt-1">基于 Cloudflare D1 托管</p>
      </div>
      <div class="flex gap-2">
        <input id="searchInput" oninput="filterBookmarks()" type="text" placeholder="搜索书签/分类..." class="border rounded-lg px-3 py-2 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
    </header>

    <!-- 快速添加卡片 -->
    <div class="bg-white p-4 rounded-xl shadow-sm border mb-8">
      <h2 class="text-sm font-semibold text-slate-700 mb-3">➕ 快速添加新网址</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input id="addTitle" type="text" placeholder="网站标题" class="border rounded px-3 py-1.5 text-sm">
        <input id="addUrl" type="text" placeholder="网址 (如: google.com)" class="border rounded px-3 py-1.5 text-sm">
        <input id="addCategory" type="text" placeholder="分类 (默认: 未分类)" class="border rounded px-3 py-1.5 text-sm">
        <button onclick="addBookmark()" class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-1.5 rounded text-sm transition">保存收藏</button>
      </div>
    </div>

    <!-- 书签列表展示区 -->
    <div id="bookmarkList" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="col-span-full text-center py-8 text-slate-400">正在加载书签...</div>
    </div>
  </div>

  <script>
    let allBookmarks = [];

    async function loadBookmarks() {
      const res = await fetch('/api/bookmarks');
      allBookmarks = await res.json();
      render(allBookmarks);
    }

    function render(data) {
      const container = document.getElementById('bookmarkList');
      if (data.length === 0) {
        container.innerHTML = '<div class="col-span-full text-center py-8 text-slate-400">暂无收藏的网址</div>';
        return;
      }
      container.innerHTML = data.map(item => \`
        <div class="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition flex justify-between items-start group">
          <div class="flex-1 min-w-0 pr-3">
            <div class="flex items-center gap-2 mb-1">
              <a href="\${item.url}" target="_blank" rel="noopener noreferrer" class="font-semibold text-blue-600 hover:underline truncate">\${item.title}</a>
              <span class="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded whitespace-nowrap">\${item.category}</span>
            </div>
            <p class="text-xs text-slate-400 truncate">\${item.url}</p>
          </div>
          <button onclick="deleteBookmark(\${item.id})" title="删除" class="text-slate-300 hover:text-red-500 p-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition">
            ✕
          </button>
        </div>
      \`).join('');
    }

    async function addBookmark() {
      const title = document.getElementById('addTitle').value;
      const url = document.getElementById('addUrl').value;
      const category = document.getElementById('addCategory').value;

      if(!title || !url) return alert('标题和网址必须填写');

      await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ title, url, category })
      });

      document.getElementById('addTitle').value = '';
      document.getElementById('addUrl').value = '';
      document.getElementById('addCategory').value = '';
      loadBookmarks();
    }

    async function deleteBookmark(id) {
      if (!confirm('确定要删除这个书签吗？')) return;
      await fetch('/api/bookmarks/' + id, { method: 'DELETE' });
      loadBookmarks();
    }

    function filterBookmarks() {
      const q = document.getElementById('searchInput').value.toLowerCase();
      const filtered = allBookmarks.filter(b => 
        b.title.toLowerCase().includes(q) || 
        b.url.toLowerCase().includes(q) || 
        b.category.toLowerCase().includes(q)
      );
      render(filtered);
    }

    loadBookmarks();
  </script>
</body>
</html>`;

    return new Response(html, {
      headers: { "content-type": "text/html;charset=UTF-8" }
    });
  }
};
