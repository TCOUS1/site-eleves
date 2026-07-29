(() => {
  "use strict";

  const root = document.querySelector(".course-matrix");
  if (!root) return;

  const storageKey =
    document.body.dataset.storageKey || "matrice-cours-officielle-v1";

  function getStoredObject() {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || "{}");
      return stored && typeof stored === "object" ? stored : {};
    } catch (_) {
      return {};
    }
  }

  let state = getStoredObject();

  function saveState() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (_) {}
  }

  function updateProgress() {
    const checks = [...root.querySelectorAll(".course-module-check")];
    const count = checks.filter(check => check.checked).length;
    const text = root.querySelector("#course-progress-text");
    const fill = root.querySelector("#course-progress-fill");

    if (text) text.textContent = `${count} / ${checks.length}`;
    if (fill) {
      fill.style.width = checks.length
        ? `${Math.round((count / checks.length) * 100)}%`
        : "0%";
    }
  }

  function restoreSavedFields() {
    root.querySelectorAll("[data-save]").forEach(element => {
      const key = element.dataset.save;
      if (!key || !(key in state)) return;

      if (element.type === "checkbox") {
        element.checked = Boolean(state[key]);
      } else {
        element.value = state[key];
      }
    });

    updateProgress();
  }

  root.addEventListener("input", event => {
    const element = event.target.closest("[data-save]");
    if (!element || !root.contains(element)) return;

    state[element.dataset.save] =
      element.type === "checkbox" ? element.checked : element.value;

    saveState();
    updateProgress();
  });

  root.addEventListener("change", event => {
    const element = event.target.closest("[data-save]");
    if (!element || !root.contains(element)) return;

    state[element.dataset.save] =
      element.type === "checkbox" ? element.checked : element.value;

    saveState();
    updateProgress();
  });

  root.addEventListener("click", event => {
    const answerButton = event.target.closest(".course-answer-button");
    if (answerButton && root.contains(answerButton)) {
      const answer = answerButton.nextElementSibling;
      if (!answer || !answer.classList.contains("course-answer")) return;

      const mustOpen =
        answer.hidden || window.getComputedStyle(answer).display === "none";

      answer.hidden = !mustOpen;
      answer.style.setProperty(
        "display",
        mustOpen ? "block" : "none",
        "important"
      );

      answerButton.setAttribute("aria-expanded", String(mustOpen));
      answerButton.textContent = mustOpen
        ? "Masquer la correction"
        : (answerButton.dataset.closedLabel || "Voir la correction");
    }

    const quizButton = event.target.closest(".course-quiz-check");
    if (quizButton && root.contains(quizButton)) {
      const quiz = quizButton.closest(".course-mini-quiz");
      const feedback = quiz?.querySelector(".course-quiz-feedback");
      const selected = quiz?.querySelector("input[type='radio']:checked");

      if (!quiz || !feedback) return;

      if (!selected) {
        feedback.textContent = "Choisis d’abord une réponse.";
        feedback.className = "course-quiz-feedback bad";
        return;
      }

      const correct = selected.value === quiz.dataset.answer;
      feedback.textContent = correct
        ? "Bonne réponse."
        : "Réponse à revoir. Relis la notion et réessaie.";
      feedback.className =
        `course-quiz-feedback ${correct ? "good" : "bad"}`;
    }

    const flashcard = event.target.closest(".course-flashcard");
    if (flashcard && root.contains(flashcard)) {
      flashcard.classList.toggle("flipped");
      flashcard.setAttribute(
        "aria-pressed",
        String(flashcard.classList.contains("flipped"))
      );
    }
  });

  root.addEventListener("keydown", event => {
    const flashcard = event.target.closest(".course-flashcard");
    if (
      flashcard &&
      root.contains(flashcard) &&
      (event.key === "Enter" || event.key === " ")
    ) {
      event.preventDefault();
      flashcard.click();
    }
  });

  window.toggleCourseTeacher = function toggleCourseTeacher() {
    document.body.classList.toggle("course-teacher");
  };

  function setPrintDialogState(active) {
    document.documentElement.classList.toggle(
      "course-print-dialog-open",
      active
    );
    document.body.classList.toggle("course-print-dialog-open", active);
  }

  window.printCourse = function printCourse() {
    setPrintDialogState(true);
    requestAnimationFrame(() => window.print());
  };

  window.addEventListener("beforeprint", () => {
    setPrintDialogState(true);
  });

  window.addEventListener("afterprint", () => {
    setPrintDialogState(false);
  });

  window.addEventListener("focus", () => {
    if (
      document.documentElement.classList.contains(
        "course-print-dialog-open"
      )
    ) {
      window.setTimeout(() => setPrintDialogState(false), 250);
    }
  });

  restoreSavedFields();
})();
