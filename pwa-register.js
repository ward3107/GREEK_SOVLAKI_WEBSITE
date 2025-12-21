(function () {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/sw.js", { scope: "/" })
      .then(function (reg) { console.log("[PWA] SW registered:", reg.scope); })
      .catch(function (err) { console.warn("[PWA] SW registration failed:", err); });
  });
})();
