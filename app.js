const PASS_SCORE = 700;
const STORAGE_KEY = "ai103-exam-session-v1";

const state = {
  bank: [],
  session: null,
  currentIndex: 0,
  timerId: null,
};

const els = {
  setupView: document.getElementById("setupView"),
  examView: document.getElementById("examView"),
  resultView: document.getElementById("resultView"),
  modeSelect: document.getElementById("modeSelect"),
  sectionPicker: document.getElementById("sectionPicker"),
  sectionSelect: document.getElementById("sectionSelect"),
  timerSelect: document.getElementById("timerSelect"),
  startBtn: document.getElementById("startBtn"),
  resumeBtn: document.getElementById("resumeBtn"),
  sectionLabel: document.getElementById("sectionLabel"),
  questionCounter: document.getElementById("questionCounter"),
  timerLabel: document.getElementById("timerLabel"),
  answeredLabel: document.getElementById("answeredLabel"),
  flaggedLabel: document.getElementById("flaggedLabel"),
  questionNav: document.getElementById("questionNav"),
  questionType: document.getElementById("questionType"),
  flagBtn: document.getElementById("flagBtn"),
  questionStem: document.getElementById("questionStem"),
  codeBlock: document.getElementById("codeBlock"),
  optionsForm: document.getElementById("optionsForm"),
  prevBtn: document.getElementById("prevBtn"),
  nextBtn: document.getElementById("nextBtn"),
  finishBtn: document.getElementById("finishBtn"),
  resultBanner: document.getElementById("resultBanner"),
  sectionResults: document.getElementById("sectionResults"),
  reviewList: document.getElementById("reviewList"),
  restartBtn: document.getElementById("restartBtn"),
};

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function lettersToIndexes(answer) {
  return answer.split(",").map((part) => part.trim().charCodeAt(0) - 65);
}

function buildExamQuestion(question) {
  const correctIndexes = new Set(lettersToIndexes(question.answer));
  const options = question.options.map((text, index) => ({
    id: `q${question.number}-o${index}`,
    text,
    correct: correctIndexes.has(index),
  }));

  return {
    ...question,
    options: shuffle(options),
    selected: [],
    flagged: false,
  };
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function show(view) {
  [els.setupView, els.examView, els.resultView].forEach((item) => item.classList.add("is-hidden"));
  view.classList.remove("is-hidden");
}

function saveSession() {
  if (state.session) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.session));
  }
}

function loadSavedSession() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function populateSections() {
  const sections = [...new Set(state.bank.map((question) => question.section))];
  els.sectionSelect.innerHTML = sections
    .map((section) => `<option value="${section}">${section}</option>`)
    .join("");
}

function createSession() {
  const mode = els.modeSelect.value;
  const timerMinutes = Number(els.timerSelect.value);
  let pool = [...state.bank];

  if (mode === "section") {
    pool = pool.filter((question) => question.section === els.sectionSelect.value);
  }

  const limit = mode === "quick" ? 50 : pool.length;
  const questions = shuffle(pool).slice(0, limit).map(buildExamQuestion);
  const now = Date.now();

  state.session = {
    mode,
    startedAt: now,
    endsAt: timerMinutes > 0 ? now + timerMinutes * 60 * 1000 : null,
    questions,
    completed: false,
  };
  state.currentIndex = 0;
  saveSession();
}

function answerIsCorrect(question) {
  const selected = new Set(question.selected);
  const correct = new Set(question.options.filter((option) => option.correct).map((option) => option.id));
  if (selected.size !== correct.size) return false;
  return [...correct].every((id) => selected.has(id));
}

function renderNav() {
  els.questionNav.innerHTML = "";
  state.session.questions.forEach((question, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "nav-btn";
    if (index === state.currentIndex) button.classList.add("current");
    if (question.selected.length) button.classList.add("answered");
    if (question.flagged) button.classList.add("flagged");
    button.textContent = String(index + 1);
    button.addEventListener("click", () => {
      state.currentIndex = index;
      renderQuestion();
    });
    els.questionNav.appendChild(button);
  });
}

function updateStatus() {
  const answered = state.session.questions.filter((question) => question.selected.length).length;
  const flagged = state.session.questions.filter((question) => question.flagged).length;
  els.answeredLabel.textContent = `${answered} answered`;
  els.flaggedLabel.textContent = `${flagged} flagged`;
}

function renderQuestion() {
  const question = state.session.questions[state.currentIndex];
  const total = state.session.questions.length;
  const isMulti = question.type.toLowerCase().includes("multiple");
  els.sectionLabel.textContent = question.section;
  els.questionCounter.textContent = `Question ${state.currentIndex + 1} of ${total}`;
  els.questionType.textContent = isMulti ? "Multiple response" : "Single choice";
  els.questionStem.textContent = question.stem;
  els.flagBtn.textContent = question.flagged ? "Unflag" : "Flag";
  els.prevBtn.disabled = state.currentIndex === 0;
  els.nextBtn.disabled = state.currentIndex === total - 1;

  if (question.code) {
    els.codeBlock.classList.remove("is-hidden");
    els.codeBlock.querySelector("code").textContent = question.code;
  } else {
    els.codeBlock.classList.add("is-hidden");
    els.codeBlock.querySelector("code").textContent = "";
  }

  els.optionsForm.innerHTML = "";
  question.options.forEach((option, index) => {
    const label = document.createElement("label");
    label.className = "option";
    const input = document.createElement("input");
    input.type = isMulti ? "checkbox" : "radio";
    input.name = "answer";
    input.value = option.id;
    input.checked = question.selected.includes(option.id);
    input.addEventListener("change", () => {
      if (isMulti) {
        const selected = new Set(question.selected);
        input.checked ? selected.add(option.id) : selected.delete(option.id);
        question.selected = [...selected];
      } else {
        question.selected = [option.id];
      }
      saveSession();
      updateStatus();
      renderNav();
    });

    const text = document.createElement("span");
    text.textContent = `${String.fromCharCode(65 + index)}. ${option.text}`;
    label.append(input, text);
    els.optionsForm.appendChild(label);
  });

  updateStatus();
  renderNav();
}

function tickTimer() {
  if (!state.session.endsAt) {
    els.timerLabel.textContent = "No timer";
    return;
  }
  const remaining = Math.max(0, Math.floor((state.session.endsAt - Date.now()) / 1000));
  els.timerLabel.textContent = formatTime(remaining);
  if (remaining === 0) {
    finishExam();
  }
}

function startTimer() {
  clearInterval(state.timerId);
  tickTimer();
  state.timerId = setInterval(tickTimer, 1000);
}

function finishExam() {
  clearInterval(state.timerId);
  state.session.completed = true;
  saveSession();
  renderResults();
}

function renderResults() {
  const questions = state.session.questions;
  const correct = questions.filter(answerIsCorrect).length;
  const scaledScore = Math.round((correct / questions.length) * 1000);
  const passed = scaledScore >= PASS_SCORE;

  show(els.resultView);
  els.resultBanner.className = `result-banner ${passed ? "pass" : "fail"}`;
  els.resultBanner.innerHTML = `
    <span>${passed ? "Pass" : "Fail"} simulation</span>
    <strong>${scaledScore} / 1000</strong>
    <p>${correct} correct out of ${questions.length}. Microsoft certification exams require a score of 700 or greater to pass.</p>
  `;

  const bySection = new Map();
  questions.forEach((question) => {
    const item = bySection.get(question.section) || { total: 0, correct: 0 };
    item.total += 1;
    if (answerIsCorrect(question)) item.correct += 1;
    bySection.set(question.section, item);
  });

  els.sectionResults.innerHTML = [...bySection.entries()]
    .map(([section, item]) => {
      const pct = Math.round((item.correct / item.total) * 100);
      return `<div class="breakdown-item"><strong>${section}</strong>${item.correct}/${item.total} correct (${pct}%)</div>`;
    })
    .join("");

  const reviewItems = questions
    .map((question, index) => ({ question, index }))
    .filter(({ question }) => question.flagged || !answerIsCorrect(question))
    .slice(0, 80);

  els.reviewList.innerHTML = reviewItems.length
    ? reviewItems
        .map(({ question, index }) => {
          const correctOptions = question.options.filter((option) => option.correct).map((option) => option.text).join("; ");
          return `
            <div class="review-item">
              <strong>Question ${index + 1}: ${answerIsCorrect(question) ? "Flagged" : "Incorrect"}</strong>
              <p>${question.stem}</p>
              <p><b>Correct answer:</b> ${correctOptions}</p>
              <p><b>Why:</b> ${question.explanation}</p>
            </div>
          `;
        })
        .join("")
    : `<div class="review-item"><strong>No missed or flagged questions.</strong></div>`;
}

function beginExam() {
  show(els.examView);
  renderQuestion();
  startTimer();
}

els.modeSelect.addEventListener("change", () => {
  els.sectionPicker.classList.toggle("is-hidden", els.modeSelect.value !== "section");
  if (els.modeSelect.value === "quick") els.timerSelect.value = "45";
  if (els.modeSelect.value === "full") els.timerSelect.value = "180";
});

els.startBtn.addEventListener("click", () => {
  createSession();
  beginExam();
});

els.resumeBtn.addEventListener("click", () => {
  state.session = loadSavedSession();
  state.currentIndex = 0;
  state.session.completed ? renderResults() : beginExam();
});

els.prevBtn.addEventListener("click", () => {
  state.currentIndex = Math.max(0, state.currentIndex - 1);
  renderQuestion();
});

els.nextBtn.addEventListener("click", () => {
  state.currentIndex = Math.min(state.session.questions.length - 1, state.currentIndex + 1);
  renderQuestion();
});

els.flagBtn.addEventListener("click", () => {
  const question = state.session.questions[state.currentIndex];
  question.flagged = !question.flagged;
  saveSession();
  renderQuestion();
});

els.finishBtn.addEventListener("click", () => {
  const unanswered = state.session.questions.filter((question) => !question.selected.length).length;
  const message = unanswered
    ? `You still have ${unanswered} unanswered question(s). Finish and score now?`
    : "Finish and score this exam?";
  if (window.confirm(message)) finishExam();
});

els.restartBtn.addEventListener("click", () => {
  clearInterval(state.timerId);
  localStorage.removeItem(STORAGE_KEY);
  state.session = null;
  state.currentIndex = 0;
  show(els.setupView);
  els.resumeBtn.classList.add("is-hidden");
});

async function init() {
  const response = await fetch("data/questions.json");
  state.bank = await response.json();
  populateSections();
  if (loadSavedSession()) els.resumeBtn.classList.remove("is-hidden");
}

init().catch((error) => {
  document.body.innerHTML = `<main class="shell"><section class="setup"><h1>Unable to load questions</h1><p>${error.message}</p></section></main>`;
});
