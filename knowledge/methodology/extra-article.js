(()=>{
  const list=document.querySelector('.list');
  if(!list||document.querySelector('[data-cpk-high-npi]'))return;
  const card=document.createElement('a');
  card.className='article-card';card.dataset.cpkHighNpi='';card.href='/knowledge/cpk-high-npi.html';card.dataset.enHref='/knowledge/cpk-high-npi-en.html';
  card.innerHTML='<div><span class="tag" data-en="Methodology &amp; Standards">方法论与标准解读</span><h2 data-en="Why can a high Cpk process still lose control in mass production?">Cpk 很高，为什么量产后仍会失控？</h2><p data-en="Use within and overall variation to evaluate NPI release evidence.">从组内变异与整体变异看 NPI 放行。</p></div><span class="meta"><span data-en="About 3 min read">约 3 分钟阅读</span><span class="meta-date" data-en="Published 2026-07-31">发布于 2026-07-31</span></span>';
  if(document.documentElement.lang==='en'){
    card.href=card.dataset.enHref;
    card.querySelectorAll('[data-en]').forEach(element=>{element.innerHTML=element.dataset.en});
  }
  list.insertBefore(card,list.firstElementChild);
  const article=document.createElement('a');
  article.className='article-card';
  article.href='/knowledge/same-cpk-different-improvement-paths.html';
  article.dataset.enHref='/knowledge/same-cpk-different-improvement-paths-en.html';
  article.innerHTML='<div><span class="tag" data-en="Methodology Sharing">方法论分享</span><h2 data-en="Why does the same Cpk require completely different improvement plans?">相同的 Cpk，为什么需要完全不同的改善方案？</h2><p data-en="Determine the correct investigation path from process variation, centering and capability assumptions.">从过程波动、中心偏移与能力分析前提，确定正确的调查方向。</p></div><span class="meta"><span data-en="About 7 min read">约 7 分钟阅读</span><span class="meta-date" data-en="Published 2026-08-04">发布于 2026-08-04</span></span>';
  if(document.documentElement.lang==='en'){
    article.href=article.dataset.enHref;
    article.querySelectorAll('[data-en]').forEach(element=>{element.innerHTML=element.dataset.en});
  }
  list.insertBefore(article,list.firstElementChild);
})();
