(() => {
  const oldHeader = document.querySelector('.article-top');
  if (oldHeader && !document.querySelector('.kb-site-header')) {
    const english = document.documentElement.lang.toLowerCase().startsWith('en');
    const current = location.pathname.split('/').pop() || 'index.html';
    const paired = english ? current.replace(/-en(?=\.html$)/, '') : current.replace(/(?=\.html$)/, '-en');
    oldHeader.outerHTML = `<header class="kb-site-header"><div class="kb-site-inner"><a class="kb-brand" href="/"><img src="../assets/brand/blendex-labs-symbol.png" alt=""><span>Blendex Labs</span></a><nav class="kb-main-nav"><a href="/#tools">${english ? 'Workspace' : '工作台'}</a><a href="/knowledge/index.html" aria-current="page">${english ? 'Knowledge Base' : '质识星球'}</a><a href="/community/">${english ? 'Community' : '社区'}</a></nav><div class="kb-header-actions"><button class="kb-header-lang" type="button" onclick="location.href='${paired}'">${english ? '中文' : 'EN'}</button><a href="/">${english ? 'Contact' : '联系我们'}</a><a href="/">${english ? 'Log in' : '登录'}</a><a class="kb-get-started" href="/#tools">${english ? 'Get started' : '开始使用'}</a></div></div></header>`;
  }
  const article = document.querySelector('[data-knowledge-article]');
  const tocNav = document.querySelector('[data-article-toc]');
  if (!article || !tocNav) return;
  const categoryPath = '/knowledge/methodology/';
  const english = document.documentElement.lang.toLowerCase().startsWith('en');
  document.querySelectorAll('.article-nav a[href="/knowledge/"], .article-footer a[href="/knowledge/"]').forEach(link => {
    link.href = categoryPath;
    const footerLink = Boolean(link.closest('.article-footer'));
    link.textContent = english ? (footerLink ? '← Back to methodology articles' : 'Methodology articles') : (footerLink ? '← 返回方法论文章列表' : '方法论文章列表');
  });
  const headings = [...article.querySelectorAll('h2, h3')];
  const slugify = text => text.toLowerCase().trim().replace(/[^\w\u4e00-\u9fff -]/g, '').replace(/[\s]+/g, '-');
  headings.forEach((heading, index) => {
    if (!heading.id) heading.id = `${slugify(heading.textContent) || 'section'}-${index + 1}`;
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    if (heading.tagName === 'H3') link.className = 'toc-h3';
    tocNav.append(link);
  });
  article.querySelectorAll('table').forEach(table => {
    if (table.parentElement.classList.contains('table-wrap')) return;
    const wrap = document.createElement('div');
    wrap.className = 'table-wrap';
    table.replaceWith(wrap);
    wrap.append(table);
  });
  const links = [...tocNav.querySelectorAll('a')];
  const observer = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach(entry => {
      links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-18% 0px -68% 0px', threshold: 0 });
  headings.forEach(heading => observer.observe(heading));
  links.forEach(link => link.addEventListener('click', () => {
    const details = tocNav.closest('details');
    if (details && window.matchMedia('(max-width: 900px)').matches) details.open = false;
  }));
})();
