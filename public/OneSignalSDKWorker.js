// En desarrollo (ng serve) ngsw-worker.js no existe (solo se genera en build de produccion).
// Si falla el import, se ignora para no tumbar el Service Worker completo.
try {
  importScripts("./ngsw-worker.js");
} catch (e) {
  console.warn("[SW] ngsw-worker.js no disponible (normal en desarrollo):", e);
}
importScripts("/OneSignalSDK.sw.js");
