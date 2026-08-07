(() => {
  const oldHeader = document.querySelector('.article-top');
  if (oldHeader && !document.querySelector('.kb-site-header')) {
    const english = document.documentElement.lang.toLowerCase().startsWith('en');
    const current = location.pathname.split('/').pop() || 'index.html';
    const paired = english ? current.replace(/-en(?=\.html$)/, '') : current.replace(/(?=\.html$)/, '-en');
    oldHeader.outerHTML = `<header class="kb-site-header"><div class="kb-site-inner"><a class="kb-brand" href="/"><img src="../assets/brand/blendex-labs-symbol.png" alt=""><span>Blendex Labs</span></a><nav class="kb-main-nav"><a href="/#tools">${english ? 'Workspace' : '工作台'}</a><a href="/knowledge/index.html" aria-current="page">${english ? 'Knowledge Base' : '质识星球'}</a><a href="/community/">${english ? 'Community' : '社区'}</a></nav><div class="kb-header-actions"><button class="kb-header-lang" type="button" onclick="location.href='${paired}'">${english ? '中文' : 'EN'}</button><a href="/">${english ? 'Contact' : '联系我们'}</a><a href="/">${english ? 'Log in' : '登录'}</a><a class="kb-get-started" href="/#tools">${english ? 'Get started' : '开始使用'}</a></div></div></header>`;
  }

  const globalHeaderScript = document.createElement('script');
  globalHeaderScript.src = '/assets/js/global-header.js?v=20260804-2';
  document.head.append(globalHeaderScript);
  const article = document.querySelector('[data-knowledge-article]');
  const tocNav = document.querySelector('[data-article-toc]');
  const english = document.documentElement.lang.toLowerCase().startsWith('en');
  const pageSlug = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '');
  const metaRow = article ? article.querySelector('.article-meta') : null;

  // ---- Reading time: fixed rule (cap at 5 min), manual override via metadata.readingTime ----
  if (metaRow) {
    let minutes = null;
    const mdScript = document.querySelector('#article-metadata') || document.querySelector('script[type="application/json"]');
    if (mdScript) {
      try {
        const md = JSON.parse(mdScript.textContent);
        const raw = md && md.readingTime;
        if (raw) {
          const m = String(raw).match(/\d+(?:\.\d+)?/);
          if (m) minutes = parseFloat(m[0]);
        }
      } catch (err) { /* fall back to visible HTML value */ }
    }
    if (minutes === null) {
      const rtSpan = [...metaRow.querySelectorAll('span')].find(s => /阅读|read/i.test(s.textContent));
      const m = rtSpan ? rtSpan.textContent.match(/\d+(?:\.\d+)?/) : null;
      if (m) minutes = parseFloat(m[0]);
    }
    const applyReadingTime = node => {
      if (!node || minutes === null || !Number.isFinite(minutes)) return;
      const clamped = Math.min(5, Math.max(1, Math.round(minutes)));
      const label = english ? `${clamped} min read` : `${clamped} 分钟阅读`;
      node.textContent = node.textContent
        .replace(/(?:约\s*)?\d+(?:\.\d+)?\s*分钟阅读/g, label)
        .replace(/(?:About\s*)?\d+(?:\.\d+)?\s*min read/gi, label);
    };
    applyReadingTime([...metaRow.querySelectorAll('span')].find(s => /阅读|read/i.test(s.textContent)));
    document.querySelectorAll('.related-reading .related-card span').forEach(applyReadingTime);
  }

  // ---- Interaction: Helpful + Share (lightweight, anonymous, auto-injected) ----
  if (metaRow && metaRow.parentElement && !metaRow.parentElement.querySelector('.article-interactions')) {
    const helpfulLabel = english ? '👍 Helpful' : '👍 有帮助';
    const helpfulDoneLabel = english ? '✓ Helpful' : '✓ 有帮助';
    const shareLabel = english ? 'Share' : '分享';
    const copiedLabel = english ? 'Link copied' : '链接已复制';
    const row = document.createElement('div');
    row.className = 'article-interactions';
    row.setAttribute('aria-label', english ? 'Article actions' : '文章互动');
    const helpfulBtn = document.createElement('button');
    helpfulBtn.type = 'button';
    helpfulBtn.className = 'article-helpful';
    helpfulBtn.setAttribute('aria-pressed', 'false');
    const helpfulSpan = document.createElement('span');
    helpfulSpan.textContent = helpfulLabel;
    helpfulBtn.append(helpfulSpan);
    const shareBtn = document.createElement('button');
    shareBtn.type = 'button';
    shareBtn.className = 'article-share';
    const shareSpan = document.createElement('span');
    shareSpan.setAttribute('aria-live', 'polite');
    shareSpan.textContent = shareLabel;
    shareBtn.append(shareSpan);
    row.append(helpfulBtn, shareBtn);
    metaRow.insertAdjacentElement('afterend', row);

    const helpfulKey = `blendex:helpful:${pageSlug}`;
    const setHelpful = pressed => {
      helpfulBtn.setAttribute('aria-pressed', pressed ? 'true' : 'false');
      helpfulSpan.textContent = pressed ? helpfulDoneLabel : helpfulLabel;
    };
    let helpful = false;
    try { helpful = localStorage.getItem(helpfulKey) === '1'; } catch (err) { /* storage unavailable */ }
    setHelpful(helpful);
    helpfulBtn.addEventListener('click', () => {
      if (helpful) return;
      helpful = true;
      setHelpful(true);
      try { localStorage.setItem(helpfulKey, '1'); } catch (err) { /* storage unavailable */ }
      if (typeof gtag === 'function') gtag('event', 'article_helpful_click', { article: pageSlug });
      else if (window.dataLayer) window.dataLayer.push({ event: 'article_helpful_click', article: pageSlug });
    });

    const copyToClipboard = url => {
      if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(url);
      return new Promise((resolve, reject) => {
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.append(ta);
        ta.select();
        try { document.execCommand('copy') ? resolve() : reject(new Error('Copy failed')); }
        catch (err) { reject(err); }
        ta.remove();
      });
    };
    const isMobile = /Android|iPhone|iPad|iPod|Windows Phone|Mobile/i.test(navigator.userAgent);
    let copyTimer = null;
    shareBtn.addEventListener('click', async () => {
      if (navigator.share && isMobile) {
        try { await navigator.share({ title: document.title, url: location.href }); } catch (err) { /* dismissed */ }
        return;
      }
      try {
        await copyToClipboard(location.href);
        shareSpan.textContent = copiedLabel;
        shareBtn.classList.add('is-copied');
        clearTimeout(copyTimer);
        copyTimer = setTimeout(() => {
          shareSpan.textContent = shareLabel;
          shareBtn.classList.remove('is-copied');
        }, 2000);
      } catch (err) { /* clipboard unavailable */ }
    });
  }

  if (!article || !tocNav) return;
  const categoryPath = '/knowledge/methodology/';
  if ((location.pathname.includes('msa-method-selection') || location.pathname.includes('cpk-high-npi')) && !document.querySelector('.article-tags')) {
    const tags = location.pathname.includes('cpk-high-npi')
      ? (english ? ['Process Capability', 'Cpk', 'Ppk', 'NPI Release', 'Mass Production Stability'] : ['过程能力', 'Cpk', 'Ppk', 'NPI 放行', '量产稳定性'])
      : (english ? ['MSA', 'Gage R&R', 'Kappa', 'Cg/Cgk', 'Measurement System Analysis'] : ['MSA', 'Gage R&R', 'Kappa', 'Cg/Cgk', '测量系统分析']);
    const tagRow = document.createElement('div');
    tagRow.className = 'article-tags';
    tagRow.setAttribute('aria-label', english ? 'Article tags' : '文章标签');
    tags.forEach(tag => { const el = document.createElement('span'); el.textContent = tag; tagRow.append(el); });
    document.querySelector('.article-header')?.append(tagRow);
  }
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
