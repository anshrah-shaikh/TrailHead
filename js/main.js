// Shared behaviour across every Trailhead page.
(function () {
  function markCurrentPage() {
    var here = (location.pathname.split("/").pop() || "index.html");
    document.querySelectorAll(".main-nav a").forEach(function (a) {
      var target = a.getAttribute("href");
      if (target === here || (here === "" && target === "index.html")) {
        a.setAttribute("aria-current", "page");
      }
    });
  }

  function wireNavToggle() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".main-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function setFooterYear() {
    var el = document.getElementById("footer-year");
    if (el) el.textContent = new Date().getFullYear();
  }

  function setCareerCount() {
    if (typeof CAREERS_DATA === "undefined") return;
    document.querySelectorAll("[data-career-count]").forEach(function (el) {
      el.textContent = CAREERS_DATA.length;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    markCurrentPage();
    wireNavToggle();
    setFooterYear();
    setCareerCount();
  });
})();
