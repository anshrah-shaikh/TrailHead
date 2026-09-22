(function () {
  if (typeof CAREERS_DATA === "undefined") return;

  var STREAM_LABELS = {
    Any: "Open to any stream",
    Science: "Science",
    Commerce: "Commerce",
    Arts: "Arts & Humanities",
    Vocational: "Vocational",
  };
  var STREAM_CLASS = {
    Any: "tag-any",
    Science: "tag-science",
    Commerce: "tag-commerce",
    Arts: "tag-arts",
    Vocational: "tag-vocational",
  };
  var PAGE_SIZE = 30;

  var state = {
    query: "",
    stream: "All",
    visible: PAGE_SIZE,
  };

  var grid = document.getElementById("careers-grid");
  var emptyState = document.getElementById("empty-state");
  var resultCount = document.getElementById("result-count");
  var loadMoreBtn = document.getElementById("load-more");
  var searchInput = document.getElementById("search-input");
  var chips = document.querySelectorAll(".chip");

  function tagHTML(stream) {
    return '<span class="tag ' + STREAM_CLASS[stream] + '">' + STREAM_LABELS[stream] + "</span>";
  }

  function matches(career) {
    var q = state.query.trim().toLowerCase();
    var queryOk = !q || career.name.toLowerCase().indexOf(q) !== -1 ||
      career.description.toLowerCase().indexOf(q) !== -1;
    var streamOk = state.stream === "All" || career.streams.indexOf(state.stream) !== -1;
    return queryOk && streamOk;
  }

  function cardHTML(career) {
    var tags = career.streams.map(tagHTML).join("");
    return (
      '<button type="button" class="career-card" data-slug="' + career.slug + '">' +
        '<div class="career-card-tags">' + tags + "</div>" +
        "<h3>" + career.name + "</h3>" +
        "<p>" + career.description + "</p>" +
        '<span class="view-trail">View the trail &rarr;</span>' +
      "</button>"
    );
  }

  function render() {
    var results = CAREERS_DATA.filter(matches);

    resultCount.textContent = results.length + (results.length === 1 ? " career found" : " careers found");

    if (results.length === 0) {
      grid.innerHTML = "";
      emptyState.hidden = false;
      loadMoreBtn.hidden = true;
      return;
    }
    emptyState.hidden = true;

    var slice = results.slice(0, state.visible);
    grid.innerHTML = slice.map(cardHTML).join("");
    loadMoreBtn.hidden = results.length <= state.visible;
  }

  var searchTimer;
  searchInput.addEventListener("input", function () {
    clearTimeout(searchTimer);
    var val = searchInput.value;
    searchTimer = setTimeout(function () {
      state.query = val;
      state.visible = PAGE_SIZE;
      render();
    }, 120);
  });

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.remove("is-active"); });
      chip.classList.add("is-active");
      state.stream = chip.getAttribute("data-filter");
      state.visible = PAGE_SIZE;
      render();
    });
  });

  document.getElementById("clear-filters").addEventListener("click", function () {
    state.query = "";
    state.stream = "All";
    state.visible = PAGE_SIZE;
    searchInput.value = "";
    chips.forEach(function (c) { c.classList.remove("is-active"); });
    document.querySelector('.chip[data-filter="All"]').classList.add("is-active");
    render();
  });

  loadMoreBtn.addEventListener("click", function () {
    state.visible += PAGE_SIZE;
    render();
  });

  grid.addEventListener("click", function (e) {
    var card = e.target.closest(".career-card");
    if (!card) return;
    openModal(card.getAttribute("data-slug"));
  });

  /* ---------------- modal ---------------- */
  var backdrop = document.getElementById("modal-backdrop");
  var modalTitle = document.getElementById("modal-title");
  var modalDesc = document.getElementById("modal-description");
  var modalTags = document.getElementById("modal-tags");
  var modalSteps = document.getElementById("modal-steps");
  var lastFocused;

  function openModal(slug) {
    var career = CAREERS_DATA.find(function (c) { return c.slug === slug; });
    if (!career) return;
    modalTitle.textContent = career.name;
    modalDesc.textContent = career.description;
    modalTags.innerHTML = career.streams.map(tagHTML).join("");
    modalSteps.innerHTML = career.steps.map(function (step, i) {
      return '<li data-step="' + (i + 1) + '">' + step + "</li>";
    }).join("") || "<li data-step=\"1\">Details for this pathway are coming soon.</li>";

    lastFocused = document.activeElement;
    backdrop.hidden = false;
    document.body.classList.add("modal-open");
    document.getElementById("modal-close").focus();

    var url = new URL(location.href);
    url.searchParams.set("open", slug);
    history.replaceState(null, "", url);
  }

  function closeModal() {
    backdrop.hidden = true;
    document.body.classList.remove("modal-open");
    var url = new URL(location.href);
    url.searchParams.delete("open");
    history.replaceState(null, "", url);
    if (lastFocused) lastFocused.focus();
  }

  document.getElementById("modal-close").addEventListener("click", closeModal);
  backdrop.addEventListener("click", function (e) {
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !backdrop.hidden) closeModal();
  });

  /* ---------------- init from URL ---------------- */
  function initFromURL() {
    var params = new URLSearchParams(location.search);
    var stream = params.get("stream");
    if (stream && STREAM_LABELS[stream]) {
      state.stream = stream;
      chips.forEach(function (c) {
        c.classList.toggle("is-active", c.getAttribute("data-filter") === stream);
      });
    }
    render();
    var open = params.get("open");
    if (open) openModal(open);
  }

  initFromURL();
})();
