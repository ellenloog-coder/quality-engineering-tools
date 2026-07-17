(() => {
  const installButton = document.getElementById("pwaInstallButton");
  const installHint = document.getElementById("pwaInstallHint");
  const dismissedKey = "blendex-labs-pwa-install-dismissed";
  let deferredPrompt = null;

  const copy = {
    en: {
      install: "Install Blendex Labs",
      ios: "On iPhone or iPad, use Share, then Add to Home Screen to install Blendex Labs."
    },
    zh: {
      install: "安装 Blendex Labs",
      ios: "在 iPhone 或 iPad 上，请使用分享按钮，然后选择“添加到主屏幕”来安装 Blendex Labs。"
    }
  };

  function currentLanguage() {
    return document.documentElement.lang.toLowerCase().startsWith("zh") ? "zh" : "en";
  }

  function isStandalone() {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  }

  function isIosSafari() {
    const platform = navigator.platform || "";
    const ua = navigator.userAgent || "";
    const isiOS = /iphone|ipad|ipod/i.test(ua) || (platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isSafari = /safari/i.test(ua) && !/crios|fxios|edgios/i.test(ua);
    return isiOS && isSafari;
  }

  function syncCopy() {
    const labels = copy[currentLanguage()];
    if (installButton) installButton.textContent = labels.install;
    if (installHint && !installHint.hidden) installHint.textContent = labels.ios;
  }

  function hideInstallUi() {
    if (installButton) installButton.hidden = true;
    if (installHint) installHint.hidden = true;
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js").catch(error => {
        console.error("[BlendexLabsPWA] service worker registration failed", error);
      });
    });
  }

  if (isStandalone()) {
    hideInstallUi();
    return;
  }

  window.addEventListener("beforeinstallprompt", event => {
    if (localStorage.getItem(dismissedKey) === "true") return;
    event.preventDefault();
    deferredPrompt = event;
    syncCopy();
    if (installButton) installButton.hidden = false;
    if (installHint) installHint.hidden = true;
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    localStorage.setItem(dismissedKey, "true");
    hideInstallUi();
  });

  installButton?.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    installButton.hidden = true;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome !== "accepted") {
      localStorage.setItem(dismissedKey, "true");
    }
    deferredPrompt = null;
  });

  window.addEventListener("qualitytools:languagechange", syncCopy);

  if (isIosSafari() && localStorage.getItem(dismissedKey) !== "true") {
    syncCopy();
    if (installHint) installHint.hidden = false;
  }
})();
