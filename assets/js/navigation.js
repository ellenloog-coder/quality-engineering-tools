const productsBtn = document.getElementById("productsBtn");
const learningBtn = document.getElementById("learningBtn");
const productsMenu = document.getElementById("megaMenu");
const learningMenu = document.getElementById("learningMenu");
const overlay = document.getElementById("overlay");
const navWrappers = Array.from(document.querySelectorAll(".nav-dropdown"));
const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
let closeTimer = null;
let activeWrapper = null;

function cancelClose() {
  clearTimeout(closeTimer);
  closeTimer = null;
}

function menuParts(wrapper) {
  const trigger = wrapper.querySelector(".nav-dropdown-trigger");
  const panel = wrapper.querySelector(".mega-menu");
  return { trigger, panel };
}

function closeMenu(wrapper) {
  if (!wrapper) return;
  const { trigger, panel } = menuParts(wrapper);
  wrapper.classList.remove("active");
  trigger.classList.remove("active");
  trigger.setAttribute("aria-expanded", "false");
  panel.classList.remove("open");
  panel.setAttribute("aria-hidden", "true");
  panel.hidden = true;
  if (activeWrapper === wrapper) activeWrapper = null;
  if (!activeWrapper) overlay.classList.remove("open");
}

function closeMenus() {
  cancelClose();
  navWrappers.forEach(closeMenu);
}

function openMenu(wrapper) {
  if (!wrapper) return;
  cancelClose();
  navWrappers.forEach(item => {
    if (item !== wrapper) closeMenu(item);
  });
  const { trigger, panel } = menuParts(wrapper);
  activeWrapper = wrapper;
  wrapper.classList.add("active");
  trigger.classList.add("active");
  trigger.setAttribute("aria-expanded", "true");
  panel.hidden = false;
  panel.setAttribute("aria-hidden", "false");
  panel.classList.add("open");
  overlay.classList.add("open");
}

function toggleMenu(wrapper) {
  const { panel } = menuParts(wrapper);
  if (panel.classList.contains("open")) closeMenus();
  else openMenu(wrapper);
}

function scheduleClose(wrapper) {
  cancelClose();
  closeTimer = setTimeout(() => {
    closeMenu(wrapper);
  }, 200);
}

function isDesktopHover() {
  return finePointerQuery.matches;
}

navWrappers.forEach(wrapper => {
  const { trigger, panel } = menuParts(wrapper);

  wrapper.addEventListener("mouseenter", () => {
    if (!isDesktopHover()) return;
    cancelClose();
    openMenu(wrapper);
  });

  wrapper.addEventListener("mouseleave", () => {
    if (!isDesktopHover()) return;
    scheduleClose(wrapper);
  });

  wrapper.addEventListener("focusin", () => {
    if (!isDesktopHover()) return;
    cancelClose();
    openMenu(wrapper);
  });

  wrapper.addEventListener("focusout", event => {
    if (!isDesktopHover()) return;
    if (wrapper.contains(event.relatedTarget)) return;
    scheduleClose(wrapper);
  });

  trigger.addEventListener("click", event => {
    event.stopPropagation();
    if (isDesktopHover()) {
      openMenu(wrapper);
    } else {
      toggleMenu(wrapper);
    }
  });

  panel.addEventListener("click", event => {
    event.stopPropagation();
    if (event.target.closest("a")) closeMenus();
  });
});

overlay.addEventListener("click", closeMenus);

document.addEventListener("click", event => {
  if (!event.target.closest(".nav-dropdown")) closeMenus();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeMenus();
});

window.addEventListener("scroll", closeMenus, { passive: true });

finePointerQuery.addEventListener("change", closeMenus);

const aiPanel = document.getElementById("aiAssistantPanel");
const aiFloatingButton = document.getElementById("aiFloatingButton");

function openAiAssistant() {
  closeMenus();
  aiPanel.classList.add("open");
  aiPanel.setAttribute("aria-hidden", "false");
  aiFloatingButton.setAttribute("aria-expanded", "true");
  window.dispatchEvent(new CustomEvent("qualitytools:aiopen"));
  setTimeout(() => document.getElementById("aiInput").focus(), 120);
}

function closeAiAssistant() {
  aiPanel.classList.remove("open");
  aiPanel.setAttribute("aria-hidden", "true");
  aiFloatingButton.setAttribute("aria-expanded", "false");
}

aiFloatingButton.addEventListener("click", () => {
  aiPanel.classList.contains("open") ? closeAiAssistant() : openAiAssistant();
});

document.getElementById("aiCloseButton").addEventListener("click", closeAiAssistant);
document.getElementById("openAiMenu").addEventListener("click", event => {
  event.preventDefault();
  openAiAssistant();
});
document.getElementById("openAiCard").addEventListener("click", openAiAssistant);
