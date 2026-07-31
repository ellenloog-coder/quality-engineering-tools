# Knowledge Base 内容编写说明

## 当前架构

当前项目使用静态 HTML，不使用 CMS、Markdown 构建器或运行时数据库。每篇文章是 `knowledge/` 下的一个 HTML 文件，共用 `knowledge/article.css` 和 `knowledge/article.js`。这样可以直接托管在现有 GitHub Pages 上，也不会影响 Workspace、工具模块或计算逻辑。

## 新增文章

1. 复制 `knowledge/article-template.html`，改名为小写连字符 slug，例如 `msa-basics.html`。
2. 填写 `<title>`、面包屑、分类、唯一 H1、摘要、阅读时间、更新时间和关联工具。
3. 在 `data-article-body` 中写正文，并使用真实的 `<h2>`、`<h3>` 标签；不要用加粗文字模拟标题。
4. 在 `knowledge/index.html` 或相关阅读卡片中添加文章链接。
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
  "readingTime": "约 8 分钟",
  "updatedAt": "2026-07-31",
  "relatedTool": "Process Capability Analysis Tool",
  "tags": ["过程能力"],
  "quickTakeaways": ["结论一", "结论二"],
  "relatedArticles": ["other-article.html"]
}
```

目前 metadata 主要用于内容维护和未来索引；页面展示字段仍保持显式 HTML，避免引入复杂渲染器。

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
