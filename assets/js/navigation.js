const productsBtn = document.getElementById('productsBtn');
    const learningBtn = document.getElementById('learningBtn');
    const productsMenu = document.getElementById('megaMenu');
    const learningMenu = document.getElementById('learningMenu');
    const overlay = document.getElementById('overlay');

    function closeMenus(){
      productsBtn.classList.remove('active');
      learningBtn.classList.remove('active');
      productsMenu.classList.remove('open');
      learningMenu.classList.remove('open');
      overlay.classList.remove('open');

      productsBtn.setAttribute('aria-expanded', 'false');
      learningBtn.setAttribute('aria-expanded', 'false');
      productsMenu.setAttribute('aria-hidden', 'true');
      learningMenu.setAttribute('aria-hidden', 'true');
    }

    function toggleMenu(type){
      const isProducts = type === 'products';
      const button = isProducts ? productsBtn : learningBtn;
      const menu = isProducts ? productsMenu : learningMenu;
      const wasOpen = menu.classList.contains('open');

      closeMenus();

      if(!wasOpen){
        button.classList.add('active');
        menu.classList.add('open');
        overlay.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
        menu.setAttribute('aria-hidden', 'false');
      }
    }

    productsBtn.addEventListener('click', e => {
      e.stopPropagation();
      toggleMenu('products');
    });

    learningBtn.addEventListener('click', e => {
      e.stopPropagation();
      toggleMenu('learning');
    });

    overlay.addEventListener('click', closeMenus);

    document.addEventListener('keydown', e => {
      if(e.key === 'Escape') closeMenus();
    });

    productsMenu.addEventListener('click', e => e.stopPropagation());
    learningMenu.addEventListener('click', e => e.stopPropagation());

    // Open Products by default for demo purposes on desktop.
    if (window.innerWidth > 760) {
      setTimeout(() => toggleMenu('products'), 350);
    }

    const aiPanel = document.getElementById('aiAssistantPanel');
    const aiFloatingButton = document.getElementById('aiFloatingButton');

    function openAiAssistant(){
      closeMenus();
      aiPanel.classList.add('open');
      aiPanel.setAttribute('aria-hidden','false');
      aiFloatingButton.setAttribute('aria-expanded','true');
      window.dispatchEvent(new CustomEvent('qualitytools:aiopen'));
      setTimeout(() => document.getElementById('aiInput').focus(), 120);
    }

    function closeAiAssistant(){
      aiPanel.classList.remove('open');
      aiPanel.setAttribute('aria-hidden','true');
      aiFloatingButton.setAttribute('aria-expanded','false');
    }

    aiFloatingButton.addEventListener('click', () => {
      aiPanel.classList.contains('open') ? closeAiAssistant() : openAiAssistant();
    });

    document.getElementById('aiCloseButton').addEventListener('click', closeAiAssistant);
    document.getElementById('openAiMenu').addEventListener('click', event => {
      event.preventDefault();
      openAiAssistant();
    });
    document.getElementById('openAiCard').addEventListener('click', openAiAssistant);
