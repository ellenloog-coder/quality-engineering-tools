# Knowledge Base 内容编写说明

## 当前架构

当前项目使用静态 HTML，不使用 CMS、Markdown 构建器或运行时数据库。文章按分类列表组织：例如 `knowledge/methodology/index.html` 是方法论文章列表，文章文件使用唯一 slug 并共用 `knowledge/article.css` 和 `knowledge/article.js`。这样可以直接托管在现有 GitHub Pages 上，也不会影响 Workspace、工具模块或计算逻辑。

## 新增文章

1. 复制 `knowledge/article-template.html`，改名为小写连字符 slug，例如 `msa-basics.html`，放到对应分类目录。
2. 填写 `<title>`、面包屑、分类、唯一 H1、摘要、阅读时间、更新时间和关联工具。
3. 在 `data-article-body` 中写正文，并使用真实的 `<h2>`、`<h3>` 标签；不要用加粗文字模拟标题。
4. 在对应分类的 `index.html` 文章列表中添加卡片，并为英文文章填写 `data-en-href`。
5. 本地打开文章页面检查桌面和手机布局后，再提交推送。

示例文章：`knowledge/cp-cpk-pp-ppk.html`。

## metadata

可在页面中保留一个 `application/json` metadata 块，字段保持简单：

```json
{
  "title": "文章标题",
  "slug": "article-slug",
  "category": "方法论与标准解读",
  "summary": "文章摘要",
  "readingTime": "约 3 分钟",
  "updatedAt": "2026-07-31",
  "relatedTool": "Process Capability Analysis Tool",
  "tags": ["过程能力"],
  "quickTakeaways": ["结论一", "结论二"],
  "relatedArticles": ["other-article.html"]
}
```

目前 metadata 主要用于内容维护和未来索引；页面展示字段仍保持显式 HTML，避免引入复杂渲染器。

**阅读时间**：Insight 类型文章统一控制在 3–5 分钟阅读。`readingTime` 字段是人工控制的唯一入口，页面展示由 `article.js` 按固定规则自动处理：优先读取 metadata 中的 `readingTime`，否则解析页面现有阅读时间文本，并统一限制在 5 分钟以内（上限 5、下限 1），显示为「5 分钟阅读」或「5 min read」。不要自行标注「15 分钟阅读」之类的超长阅读时间，也不要依赖 AI 估算。

## 文章互动（Helpful / Share）

所有文章页会自动注入轻量互动区，位于 metadata 与 Tags 之间，无需在 HTML 中手工添加：

- **Helpful**：匿名反馈，点击后「👍 Helpful」变为「✓ Helpful」，不显示数量、不要求登录、不建立评论；状态按文章保存在浏览器 localStorage。
- **Share**：移动端支持 `navigator.share` 时调用系统分享，否则复制当前文章 URL 到剪贴板，并显示 2 秒「Link copied / 链接已复制」反馈。
- **Analytics**：点击 Helpful 时发送 `article_helpful_click` 事件（gtag 或 dataLayer），事件携带 `article` 字段（当前页 slug）。

这些组件由 `knowledge/article.js` 统一注入、`knowledge/article.css` 统一样式，新增文章自动继承，不要复制互动代码到单篇文章中。

> **脚本版本参数**：文章页统一用 `<script src="article.js?v=YYYYMMDD-N"></script>`（statistics/ 和 community/ 下为 `../knowledge/article.js?v=...`）加载互动脚本，版本号遵循全站资源惯例（如 `?v=20260807-1`）。不要使用无版本号的 `article.js` 引用：Service Worker 对 JS 走 stale-while-revalidate，无版本号会导致线上更新后浏览器仍命中旧缓存、新组件不出现。

## 正文、表格和公式

- H1 只能有一个；章节使用 H2，子章节使用 H3。
- 直接写 `<table>`，`article.js` 会自动补上 `.table-wrap` 响应式滚动容器。四列或长中文表格会在手机端只在表格内部横向滚动。
- 公式使用 MathML 放入 `.formula` 容器；同时保留一行文本说明作为兼容回退。示例见 Cp/Cpk 文章。
- 三种提示框：`.callout.core`（核心结论）、`.callout.caution`（工程注意）、`.callout.misconception`（常见误区）。

```html
<div class="callout core"><h3>核心结论</h3><p>结论内容。</p></div>
<div class="callout caution"><h3>工程注意</h3><p>注意内容。</p></div>
<div class="callout misconception"><h3>常见误区</h3><p>误区内容。</p></div>
```

## 快速结论、关联工具和相关阅读

- 快速结论放在正文前的 `.quick-takeaways`，使用 `<ul>`。
- 关联工具放在 `.related-tools`，链接必须使用项目中已确认的真实工具路径。
- 相关阅读放在 `.related-reading`，建议 2–3 项，每项包含分类、标题、说明和阅读时间。
- 新增英文文章时，复制相同结构建立英文 HTML；不要改变 CSS class 或目录脚本。

## 目录和预览

`article.js` 会自动读取文章中的 H2/H3，生成目录、锚点和当前章节高亮。桌面端目录 sticky；900px 以下变成可折叠的“本文目录”。表格也会自动包装。

本地预览可直接打开：

```text
knowledge/cp-cpk-pp-ppk.html
```

发布前检查 1440×900、1280×800 和 390×844：确认 H1 换行、正文宽度、目录、表格内部滚动、公式、提示框和工具按钮。提交前运行：

```bash
node --check knowledge/article.js
git diff --check
```
