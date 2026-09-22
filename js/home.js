(function () {
  if (typeof CAREERS_DATA === "undefined") return;

  document.addEventListener("DOMContentLoaded", function () {
    var counts = {};
    CAREERS_DATA.forEach(function (c) {
      c.streams.forEach(function (s) {
        counts[s] = (counts[s] || 0) + 1;
      });
    });
    document.querySelectorAll("[data-stream-count]").forEach(function (el) {
      var stream = el.getAttribute("data-stream-count");
      var n = counts[stream] || 0;
      el.textContent = n + (n === 1 ? " career" : " careers");
    });
  });
})();
