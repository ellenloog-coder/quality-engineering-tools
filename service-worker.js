const CACHE_NAME = "blendex-labs-shell-v7";
const INDEX_URL = new URL("./index.html", self.location.href).href;
const OFFLINE_URL = new URL("./offline.html", self.location.href).href;
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./offline.html",
  "./manifest.webmanifest?v=20260731-2",
  "./assets/css/styles.css?v=20260718-2",
  "./assets/js/navigation.js?v=20260716-6",
  "./assets/js/ai-assistant.js?v=20260730-1",
  "./assets/js/i18n.js?v=20260730-3",
  "./assets/js/pwa.js?v=20260717-1",
  "./assets/brand/blendex-labs-symbol.png",
  "./assets/icons/favicon-32.png?v=20260731-2",
  "./assets/icons/apple-touch-icon.png?v=20260731-2",
  "./assets/icons/icon-192.png?v=20260731-2",
  "./assets/icons/icon-512.png?v=20260731-2",
  "./assets/icons/maskable-192.png?v=20260731-2",
  "./assets/icons/maskable-512.png?v=20260731-2"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

function isHtmlRequest(request) {
  return request.mode === "navigate" || request.headers.get("accept")?.includes("text/html");
}

function isStaticAsset(request, url) {
  if (request.destination && ["style", "script", "image", "manifest", "font"].includes(request.destination)) {
    return true;
  }
  return /\.(css|js|png|svg|webp|jpg|jpeg|ico|json|webmanifest)$/i.test(url.pathname);
}

function shouldNeverCache(request, url) {
  if (request.method !== "GET") return true;
  if (url.hostname.includes("quality-tools-ai-assistant")) return true;
  if (url.hostname.includes("google-analytics") || url.hostname.includes("googletagmanager")) return true;
  return url.origin !== self.location.origin;
}

async function networkFirstHtml(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    const url = new URL(request.url);
    const isShellPage = (url.pathname === "/" || url.pathname.endsWith("/index.html")) && !url.search;
    if (isShellPage && response.ok && response.type === "basic") {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    const url = new URL(request.url);
    if (url.pathname === "/" || url.pathname.endsWith("/index.html")) {
      return (await cache.match(INDEX_URL)) || (await cache.match(OFFLINE_URL));
    }
    return cache.match(OFFLINE_URL);
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request)
    .then(response => {
      if (response.ok && response.type === "basic") {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);
  return cached || fetchPromise;
}

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);

  if (shouldNeverCache(request, url)) {
    event.respondWith(fetch(request));
    return;
  }

  if (isHtmlRequest(request)) {
    event.respondWith(networkFirstHtml(request));
    return;
  }

  if (isStaticAsset(request, url)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  event.respondWith(fetch(request));
});
