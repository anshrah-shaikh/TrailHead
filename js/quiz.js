(function () {
  var QUESTIONS = [
    {
      text: "Which of these sounds like your ideal Saturday?",
      options: [
        { label: "Fixing, building or taking something apart", stream: "Vocational" },
        { label: "Solving a genuinely tricky puzzle or problem", stream: "Science" },
        { label: "Planning a budget for something you want to buy", stream: "Commerce" },
        { label: "Writing, drawing, filming or performing something", stream: "Arts" },
      ],
    },
    {
      text: "In a group project, you're usually the one who…",
      options: [
        { label: "Figures out how things actually work", stream: "Science" },
        { label: "Keeps track of the budget and the deadline", stream: "Commerce" },
        { label: "Comes up with the creative concept", stream: "Arts" },
        { label: "Just wants to get stuck in and build the thing", stream: "Vocational" },
      ],
    },
    {
      text: "Pick a topic you could talk about for an hour without getting bored.",
      options: [
        { label: "How the human body, machines or the universe work", stream: "Science" },
        { label: "Business, the stock market or a startup idea", stream: "Commerce" },
        { label: "A book, film, social issue or design trend", stream: "Arts" },
        { label: "Honestly, all of the above equally", stream: "Any" },
      ],
    },
    {
      text: "A tricky problem lands on your desk. What's your first move?",
      options: [
        { label: "Research it properly before deciding anything", stream: "Science" },
        { label: "Work out the cost and what you'd get back", stream: "Commerce" },
        { label: "Ask how it affects the people involved", stream: "Arts" },
        { label: "Just start fixing it with what's on hand", stream: "Vocational" },
      ],
    },
    {
      text: "Which future sounds the most 'you'?",
      options: [
        { label: "Working in a lab, hospital, or with new tech", stream: "Science" },
        { label: "Running a business or working in finance", stream: "Commerce" },
        { label: "Working in media, design, law or with people", stream: "Arts" },
        { label: "Working with your hands in a skilled trade", stream: "Vocational" },
        { label: "Not sure yet — and that's genuinely fine", stream: "Any" },
      ],
    },
    {
      text: "How do you feel about a long, exam-heavy degree?",
      options: [
        { label: "Bring it on, I like playing the long game", stream: "Science" },
        { label: "Fine, as long as it leads to real skills", stream: "Commerce" },
        { label: "I'd rather start working and learning sooner", stream: "Vocational" },
        { label: "Depends entirely on the subject", stream: "Any" },
      ],
    },
  ];

  var STREAM_INFO = {
    Science: {
      title: "You leaned toward Science",
      copy: "Your answers leaned toward curiosity, evidence, systems and figuring out how things work. Treat that as a direction to explore — not a verdict. Have a look at the careers that can grow from this kind of thinking.",
    },
    Commerce: {
      title: "You leaned toward Commerce",
      copy: "Your answers leaned toward numbers, decisions, organisation and outcomes. That can be a useful clue to explore business, finance and related pathways — without boxing you into them.",
    },
    Arts: {
      title: "You leaned toward Arts & Humanities",
      copy: "Your answers leaned toward words, ideas, people, creativity and interpretation. That is a great starting clue for exploring creative, social, communication and humanities-focused careers.",
    },
    Vocational: {
      title: "You leaned toward hands-on paths",
      copy: "Your answers leaned toward learning by doing, building, fixing and applying skills. That can point you toward vocational and practical careers — and you can still explore plenty of other routes.",
    },
    Any: {
      title: "You kept your options open",
      copy: "Your answers did not strongly point in one direction, which is completely fine. Curiosity across different areas can be a strength — explore broadly before narrowing anything down.",
    },
  };

  var answers = [];
  var current = 0;

  var introEl = document.getElementById("quiz-intro");
  var cardEl = document.getElementById("quiz-card");
  var resultEl = document.getElementById("quiz-result");
  var questionText = document.getElementById("question-text");
  var optionsWrap = document.getElementById("quiz-options");
  var progressFill = document.getElementById("progress-fill");
  var progressLabel = document.getElementById("progress-label");
  var backBtn = document.getElementById("back-btn");

  function renderQuestion() {
    var q = QUESTIONS[current];
    questionText.textContent = q.text;
    progressFill.style.width = ((current) / QUESTIONS.length * 100) + "%";
    progressLabel.textContent = "Question " + (current + 1) + " of " + QUESTIONS.length;
    backBtn.hidden = current === 0;

    optionsWrap.innerHTML = "";
    q.options.forEach(function (opt, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-option";
      btn.textContent = opt.label;
      if (answers[current] === i) btn.classList.add("is-selected");
      btn.addEventListener("click", function () {
        answers[current] = i;
        window.setTimeout(function () {
          if (current < QUESTIONS.length - 1) {
            current++;
            renderQuestion();
          } else {
            showResult();
          }
        }, 180);
        optionsWrap.querySelectorAll(".quiz-option").forEach(function (b) { b.classList.remove("is-selected"); });
        btn.classList.add("is-selected");
      });
      optionsWrap.appendChild(btn);
    });
  }

  backBtn.addEventListener("click", function () {
    if (current > 0) {
      current--;
      renderQuestion();
    }
  });

  function tally() {
    var scores = {};
    answers.forEach(function (ansIndex, qIndex) {
      if (ansIndex === undefined) return;
      var stream = QUESTIONS[qIndex].options[ansIndex].stream;
      scores[stream] = (scores[stream] || 0) + 1;
    });
    var best = "Any", bestScore = -1;
    Object.keys(scores).forEach(function (s) {
      if (scores[s] > bestScore) { bestScore = scores[s]; best = s; }
    });
    return best;
  }

  function showResult() {
    progressFill.style.width = "100%";
    var stream = tally();
    var info = STREAM_INFO[stream];
    document.getElementById("result-stream").textContent = info.title;
    document.getElementById("result-copy").textContent = info.copy;
    document.getElementById("result-cta").href = "careers.html?stream=" + encodeURIComponent(stream);

    cardEl.hidden = true;
    resultEl.hidden = false;
  }

  document.getElementById("start-quiz").addEventListener("click", function () {
    introEl.hidden = true;
    cardEl.hidden = false;
    current = 0;
    answers = [];
    renderQuestion();
  });

  document.getElementById("retake-btn").addEventListener("click", function () {
    resultEl.hidden = true;
    introEl.hidden = false;
  });
})();
