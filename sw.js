const CACHE_PREFIX = "nsgy-call-";
const CACHE = `${CACHE_PREFIX}2.0-v14`;
const CORE = [
  "./",
  "./index.html",
  "./styles.css",
  "./clinical-fields.css",
  "./communication-preview.css",
  "./reference-cleanup.css",
  "./fixed-scale.css",
  "./utils.js",
  "./data.js",
  "./wizard-data.js",
  "./recommendations-data.js",
  "./communication-data.js",
  "./app.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./calculators/core.js",
  "./calculators/gcs.js",
  "./calculators/gcs_math.js",
  "./calculators/abc2.js",
  "./calculators/abc2_math.js",
  "./calculators/ich.js",
  "./calculators/ich_math.js",
  "./calculators/hunt-hess.js",
  "./calculators/modified-fisher.js",
  "./calculators/tlics.js",
  "./calculators/asia.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)));
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith(CACHE_PREFIX) && k !== CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(
      (cached) =>
        cached ||
        fetch(event.request)
          .then((response) => {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, copy));
            return response;
          })
          .catch(() =>
            event.request.mode === "navigate"
              ? caches.match("./index.html")
              : Response.error(),
          ),
    ),
  );
});
