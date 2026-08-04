(() => {
  const initialize = () => {
    if (document.querySelector('.site-header .nav-dropdown') || document.querySelector('.blendex-global-header')) return;

    const oldHeader = document.querySelector('.kb-site-header, .site-top, .community-site-header, .article-top');
    if (!oldHeader) return;

  const oldLanguage = oldHeader.querySelector('#languageBtn, .kb-header-lang, .switch, .article-lang');
  const english = document.documentElement.lang.toLowerCase().startsWith('en');
  const path = location.pathname;
  const knowledgeActive = path.startsWith('/knowledge/') || path.startsWith('/help/') || path.startsWith('/statistics/');
  const t = (zh, en) => english ? en : zh;

  const workspaceLinks = [
    ['mint', '◎', '测量系统分析（MSA）', 'Measurement System Analysis (MSA)', '评估 Gage R&R、Kappa 和 Cg/Cgk', 'Run Gage R&R, Kappa and Cg/Cgk assessments', 'https://ellenloog-coder.github.io/measurement-system-analysis-tool/'],
    ['lav', '∿', '过程能力分析', 'Process Capability Analysis', '计算 Cp、Cpk、Pp 和 Ppk 并生成报告', 'Calculate Cp, Cpk, Pp and Ppk and generate reports', 'https://ellenloog-coder.github.io/process-capability-analysis-tool/'],
    ['blue', '△', '实验设计（DOE）', 'Design of Experiments (DOE)', '生成实验计划并寻找最佳参数组合', 'Generate experiment plans and optimize parameters', 'https://ellenloog-coder.github.io/blendex-doe-tool/'],
    ['reliability', '↗', '可靠性分析', 'Reliability Analysis', '完成寿命、MTBF 和加速试验分析', 'Run life, MTBF and accelerated-test analysis', 'https://ellenloog-coder.github.io/reliability-tool/'],
    ['yellow', '8D', '8D 问题解决', '8D Problem Solving', '使用标准框架推进纠正与预防措施', 'Use a standard framework for corrective action', 'https://ellenloog-coder.github.io/guided-8d-investigation-tool/'],
    ['pink', '▥', '抽样方案设计', 'Sampling Plan Design', '设计抽样方案并量化接收风险', 'Design sampling plans and quantify acceptance risk', 'https://ellenloog-coder.github.io/sampling-plan-design-tool/']
  ];

  const toolMarkup = workspaceLinks.map(([tone, icon, zhTitle, enTitle, zhDesc, enDesc, href]) => `
    <a class="blendex-tool-link" href="${href}" target="_blank" rel="noopener noreferrer">
      <span class="blendex-tool-icon ${tone}" aria-hidden="true">${icon}</span>
      <span><span class="blendex-tool-title">${t(zhTitle, enTitle)}</span><span class="blendex-tool-desc">${t(zhDesc, enDesc)}</span></span>
    </a>`).join('');

  oldHeader.outerHTML = `
    <header class="blendex-global-header">
      <div class="blendex-global-inner">
        <a class="blendex-global-brand" href="/"><img src="/assets/brand/blendex-labs-symbol.png" alt=""><span>Blendex Labs</span></a>
        <nav class="blendex-global-nav" aria-label="${t('主导航', 'Main navigation')}">
          <div class="blendex-nav-dropdown">
            <button class="blendex-nav-item blendex-nav-trigger" type="button" aria-expanded="false">
              <span>${t('工作台', 'Workspace')}</span><span class="blendex-nav-chevron" aria-hidden="true">⌄</span>
            </button>
            <section class="blendex-mega-menu" aria-hidden="true" hidden>
              <div class="blendex-mega-grid">
                <div class="blendex-mega-col"><div class="blendex-mega-label">${t('质量工具', 'WORKSPACE')}</div>${toolMarkup}</div>
                <div class="blendex-mega-col">
                  <div class="blendex-mega-label">${t('平台', 'PLATFORM')}</div>
                  <a class="blendex-feature-link" href="/#tools"><span class="blendex-mini-icon">◎</span><span><span class="blendex-feature-title">${t('浏览器工作台', 'Browser-based workspace')}</span><span class="blendex-feature-desc">${t('直接在浏览器中运行', 'Run directly in the browser')}</span></span></a>
                  <a class="blendex-feature-link" href="/help/data-privacy/"><span class="blendex-mini-icon">▱</span><span><span class="blendex-feature-title">${t('数据与隐私', 'Data and privacy')}</span><span class="blendex-feature-desc">${t('了解数据处理与浏览器支持', 'Understand data handling and browser support')}</span></span></a>
                  <a class="blendex-feature-link" href="/statistics/"><span class="blendex-mini-icon">∑</span><span><span class="blendex-feature-title">${t('统计与算法说明', 'Statistics and algorithms')}</span><span class="blendex-feature-desc">${t('查看计算原则与结果解释边界', 'Review calculation principles and interpretation boundaries')}</span></span></a>
                </div>
              </div>
              <div class="blendex-mega-footer"><a class="blendex-footer-action" href="/help/support-feedback/">${t('获取支持', 'Get support')}</a><a class="blendex-footer-action" href="/#tools">${t('打开工具', 'Open tools')} →</a></div>
            </section>
          </div>
          <div class="blendex-nav-dropdown">
            <button class="blendex-nav-item blendex-nav-trigger" type="button" aria-expanded="false"${knowledgeActive ? ' aria-current="page"' : ''}>
              <span class="blendex-nav-label-full">${t('质识星球', 'Knowledge Base')}</span><span class="blendex-nav-label-short">${t('知识', 'Knowledge')}</span><span class="blendex-nav-chevron" aria-hidden="true">⌄</span>
            </button>
            <section class="blendex-mega-menu" aria-hidden="true" hidden>
              <div class="blendex-learning-grid">
                <div class="blendex-learning-col">
                  <div class="blendex-learning-label">${t('知识内容', 'KNOWLEDGE BASE')}</div>
                  <a class="blendex-learning-link" href="/knowledge/methodology/"><span>${t('方法论与标准解读', 'Methodology & Standards')}</span><span class="blendex-learning-arrow">→</span></a>
                  <a class="blendex-learning-link" href="/knowledge/quality-best-practices/"><span>${t('质量最佳实践', 'Quality Best Practices')}</span><span class="blendex-learning-arrow">→</span></a>
                  <a class="blendex-learning-link" href="/knowledge/quality-engineering-intelligence/"><span>${t('质量工程智能化', 'Quality Engineering Intelligence')}</span><span class="blendex-learning-arrow">→</span></a>
                </div>
                <div class="blendex-learning-col">
                  <div class="blendex-learning-label">${t('支持', 'SUPPORT')}</div>
                  <a class="blendex-learning-link" href="/help/"><span>${t('帮助中心', 'Help Center')}</span><span class="blendex-learning-arrow">→</span></a>
                  <a class="blendex-learning-link" href="/statistics/"><span>${t('统计与算法说明', 'Statistics & Algorithm Notes')}</span><span class="blendex-learning-arrow">→</span></a>
                </div>
              </div>
              <div class="blendex-learning-footer"><span>${t('面向质量专业人员的知识资源', 'Knowledge resources for quality professionals')}</span><a href="/knowledge/">${t('探索知识资源', 'Explore knowledge resources')} →</a></div>
            </section>
          </div>
          <a class="blendex-nav-item" href="/community/"${path.startsWith('/community/') ? ' aria-current="page"' : ''}>${t('社区', 'Community')}</a>
        </nav>
        <div class="blendex-global-actions">
          ${oldLanguage ? '<span data-blendex-language-slot></span>' : ''}
          <a class="blendex-contact" href="/">${t('联系我们', 'Contact')}</a><a class="blendex-login" href="/">${t('登录', 'Log in')}</a><a class="blendex-global-start" href="/#tools">${t('开始使用', 'Get started')}</a>
        </div>
      </div>
    </header><div class="blendex-global-overlay"></div>`;

  if (!document.querySelector('link[data-blendex-global-header]')) {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = '/assets/css/global-header.css?v=20260804-2';
    style.dataset.blendexGlobalHeader = '';
    document.head.append(style);
  }

  const languageSlot = document.querySelector('[data-blendex-language-slot]');
  if (languageSlot && oldLanguage) {
    oldLanguage.className = 'blendex-global-lang';
    languageSlot.replaceWith(oldLanguage);
  }

  const dropdowns = [...document.querySelectorAll('.blendex-nav-dropdown')];
  const overlay = document.querySelector('.blendex-global-overlay');
  let closeTimer;
  let activeDropdown;

  const closeDropdown = dropdown => {
    if (!dropdown) return;
    const trigger = dropdown.querySelector('.blendex-nav-trigger');
    const menu = dropdown.querySelector('.blendex-mega-menu');
    trigger.classList.remove('active');
    trigger.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    menu.hidden = true;
    if (activeDropdown === dropdown) activeDropdown = null;
    if (!activeDropdown) overlay.classList.remove('open');
  };
  const closeDropdowns = () => { clearTimeout(closeTimer); dropdowns.forEach(closeDropdown); };
  const openDropdown = dropdown => {
    clearTimeout(closeTimer);
    dropdowns.forEach(item => { if (item !== dropdown) closeDropdown(item); });
    const trigger = dropdown.querySelector('.blendex-nav-trigger');
    const menu = dropdown.querySelector('.blendex-mega-menu');
    activeDropdown = dropdown;
    trigger.classList.add('active');
    trigger.setAttribute('aria-expanded', 'true');
    menu.hidden = false;
    menu.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => menu.classList.add('open'));
    overlay.classList.add('open');
  };
  const scheduleClose = dropdown => { clearTimeout(closeTimer); closeTimer = setTimeout(() => closeDropdown(dropdown), 180); };

  dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.blendex-nav-trigger');
    const menu = dropdown.querySelector('.blendex-mega-menu');
    dropdown.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') openDropdown(dropdown); });
    dropdown.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') scheduleClose(dropdown); });
    menu.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') clearTimeout(closeTimer); });
    menu.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') scheduleClose(dropdown); });
    trigger.addEventListener('click', event => {
      event.stopPropagation();
      if (activeDropdown === dropdown) closeDropdown(dropdown); else openDropdown(dropdown);
    });
  });
  overlay.addEventListener('click', closeDropdowns);
  document.addEventListener('click', event => { if (!event.target.closest('.blendex-nav-dropdown')) closeDropdowns(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeDropdowns(); });
  window.addEventListener('scroll', closeDropdowns, { passive: true });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
