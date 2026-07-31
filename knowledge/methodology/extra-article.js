(()=>{
  const list=document.querySelector('.list');
  if(!list||document.querySelector('[data-cpk-high-npi]'))return;
  const card=document.createElement('a');
  card.className='article-card';card.dataset.cpkHighNpi='';card.href='/knowledge/cpk-high-npi.html';card.dataset.enHref='/knowledge/cpk-high-npi-en.html';
  card.innerHTML='<div><span class="tag" data-en="Methodology &amp; Standards">方法论与标准解读</span><h2 data-en="Why can a high Cpk process still lose control in mass production?">Cpk 很高，为什么量产后仍会失控？</h2><p data-en="Use within and overall variation to evaluate NPI release evidence.">从组内变异与整体变异看 NPI 放行。</p></div><span class="meta" data-en="About 3 min read">约 3 分钟阅读</span>';
  list.insertBefore(card,list.firstElementChild);
})();
