(() => {
  const article = document.querySelector('[data-knowledge-article]');
  const tocNav = document.querySelector('[data-article-toc]');
  if (!article || !tocNav) return;
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
