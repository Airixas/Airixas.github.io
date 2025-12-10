document.addEventListener("DOMContentLoaded", () => {
  // ----- SLIDERIAI -----
  const sliders = [
    { slider: "slider1", value: "slider1-value" },
    { slider: "slider2", value: "slider2-value" },
    { slider: "slider3", value: "slider3-value" }
  ];

  sliders.forEach(s => {
    const slider = document.getElementById(s.slider);
    const output = document.getElementById(s.value);

    if (slider && output) {
      output.textContent = slider.value;
      slider.addEventListener("input", () => {
        output.textContent = slider.value;
      });
    }
  });

  // ----- REGEX -----
  const nameRegex  = /^[A-Za-zÀ-ž\s'-]{2,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const form = document.getElementById("contactForm");
  if (!form) return;

  const firstName = document.getElementById("first_name");
  const lastName  = document.getElementById("last_name");
  const email     = document.getElementById("email");
  const phone     = document.getElementById("phone");
  const address   = document.getElementById("address");
  const successMessage = document.getElementById("form-success");
  const submitBtn = form.querySelector('button[type="submit"]');

  // submit iš pradžių neaktyvus
  submitBtn.disabled = true;

  // ----- BLOKAS REZULTATAMS -----
  const resultsContainer = document.createElement("div");
  resultsContainer.id = "form-results";
  resultsContainer.classList.add("mt-4", "p-3", "border", "rounded", "bg-light");
  const formColumn = form.closest(".col-lg-8") || form.parentNode;
  formColumn.appendChild(resultsContainer);

  // ----- PAGALBINĖ FUNKCIJA KLAIDOMS -----
  function setFieldValidity(input, isValid, errorId) {
    if (isValid) {
      input.classList.remove("is-invalid");
      if (errorId) {
        const err = document.getElementById(errorId);
        if (err) err.classList.add("d-none");
      }
    } else {
      input.classList.add("is-invalid");
      if (errorId) {
        const err = document.getElementById(errorId);
        if (err) err.classList.remove("d-none");
      }
    }
  }

  // ----- VALIDACIJOS FUNKCIJOS -----
  function validateFirstName() {
    const val = firstName.value.trim();
    const ok = nameRegex.test(val);
    setFieldValidity(firstName, ok, "error-firstname");
    return ok;
  }

  function validateLastName() {
    const val = lastName.value.trim();
    const ok = nameRegex.test(val);
    setFieldValidity(lastName, ok, "error-lastname");
    return ok;
  }

  function validateEmail() {
    const val = email.value.trim();
    const ok = emailRegex.test(val);
    setFieldValidity(email, ok, "error-email");
    return ok;
  }

  function validateAddress() {
    const val = address.value.trim();
    const ok = val.length > 0;       // adresas kaip tekstas – netuščias
    setFieldValidity(address, ok, null);
    return ok;
  }

  // ----- TEL. NUMERIO FORMATAVIMAS -----
  function formatPhone(value) {
    // paliekam tik skaitmenis
    let digits = value.replace(/\D/g, "");

    // jei vartotojas įrašė 370..., nukerpam pradžią
    if (digits.startsWith("370")) {
      digits = digits.slice(3);
    }

    // ribojam ilgį iki 8 skaitmenų (6xx xxxxx)
    digits = digits.slice(0, 8);

    // formatai tik jei kažkas įvesta
    let formatted = "";
    if (digits.length > 0) {
      const part1 = digits.slice(0, 3);   // 6xx
      const part2 = digits.slice(3);      // xxxxx
      formatted = "+370 " + part1;
      if (part2) formatted += " " + part2;
    }

    return { formatted, digits };
  }

  function validatePhoneRealtime() {
    const { formatted, digits } = formatPhone(phone.value);
    phone.value = formatted;
    // galutinis teisingas numeris, kai turim 8 skaitmenis ir prasideda 6
    const ok = digits.length === 8 && digits[0] === "6";
    setFieldValidity(phone, ok, "error-phone");
    return ok;
  }

  // ----- BENDRAS FORMOS VALIDUMAS -----
  function isFormValid() {
    const v1 = validateFirstName();
    const v2 = validateLastName();
    const v3 = validateEmail();
    const v4 = validateAddress();
    const v5 = validatePhoneRealtime();
    return v1 && v2 && v3 && v4 && v5;
  }

  function updateSubmitState() {
    submitBtn.disabled = !isFormValid();
  }

  // ----- REALAUS LAIKO VALIDACIJA -----
  firstName.addEventListener("input", () => {
    validateFirstName();
    updateSubmitState();
  });

  lastName.addEventListener("input", () => {
    validateLastName();
    updateSubmitState();
  });

  email.addEventListener("input", () => {
    validateEmail();
    updateSubmitState();
  });

  address.addEventListener("input", () => {
    validateAddress();
    updateSubmitState();
  });

  phone.addEventListener("input", () => {
    validatePhoneRealtime();
    updateSubmitState();
  });

  // ----- SĖKMĖS POP-UP -----
  function showPopup(message) {
    let popup = document.querySelector(".custom-success-popup");

    if (!popup) {
      popup = document.createElement("div");
      popup.className = "custom-success-popup";
      popup.style.position = "fixed";
      popup.style.top = "20px";
      popup.style.right = "20px";
      popup.style.padding = "12px 18px";
      popup.style.backgroundColor = "#198754";
      popup.style.color = "#fff";
      popup.style.borderRadius = "6px";
      popup.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
      popup.style.zIndex = "9999";
      popup.style.fontWeight = "500";
      document.body.appendChild(popup);
    }

    popup.textContent = message;
    popup.style.display = "block";
    setTimeout(() => (popup.style.display = "none"), 3000);
  }

  // ----- SUBMIT -----
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!isFormValid()) return;

    const q1 = Number(document.getElementById("slider1").value);
    const q2 = Number(document.getElementById("slider2").value);
    const q3 = Number(document.getElementById("slider3").value);
    const average = ((q1 + q2 + q3) / 3).toFixed(1);

    const data = {
      vardas: firstName.value.trim(),
      pavarde: lastName.value.trim(),
      email: email.value.trim(),
      telefonas: phone.value.trim(),
      adresas: address.value.trim(),
      klausimas1: q1,
      klausimas2: q2,
      klausimas3: q3,
      vidurkis: average
    };

    console.log("Formos duomenys:", data);

    resultsContainer.innerHTML = `
      <p><strong>Vardas:</strong> ${data.vardas}</p>
      <p><strong>Pavardė:</strong> ${data.pavarde}</p>
      <p><strong>El. paštas:</strong> ${data.email}</p>
      <p><strong>Tel. numeris:</strong> ${data.telefonas}</p>
      <p><strong>Adresas:</strong> ${data.adresas}</p>
      <hr>
      <p><strong>${data.vardas} ${data.pavarde}: vidurkis</strong> ${data.vidurkis}</p>
    `;

    if (successMessage) {
      successMessage.textContent = "Duomenys pateikti sėkmingai!";
      successMessage.classList.remove("d-none");
    }
    showPopup("Duomenys pateikti sėkmingai!");

    form.reset();
    sliders.forEach(s => {
      const slider = document.getElementById(s.slider);
      const output = document.getElementById(s.value);
      if (slider && output) {
        slider.value = 5;
        output.textContent = 5;
      }
    });

    // po reset – vėl išjungiam submit
    submitBtn.disabled = true;
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // ================== KONTAKTŲ FORMA ==================

  // ----- SLIDERIAI -----
  const sliders = [
    { slider: "slider1", value: "slider1-value" },
    { slider: "slider2", value: "slider2-value" },
    { slider: "slider3", value: "slider3-value" }
  ];

  sliders.forEach(s => {
    const slider = document.getElementById(s.slider);
    const output = document.getElementById(s.value);

    if (slider && output) {
      output.textContent = slider.value;
      slider.addEventListener("input", () => {
        output.textContent = slider.value;
      });
    }
  });

  // ----- REGEX -----
  const nameRegex  = /^[A-Za-zÀ-ž\s'-]{2,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const form = document.getElementById("contactForm");
  if (form) {
    const firstName = document.getElementById("first_name");
    const lastName  = document.getElementById("last_name");
    const email     = document.getElementById("email");
    const phone     = document.getElementById("phone");
    const address   = document.getElementById("address");
    const successMessage = document.getElementById("form-success");
    const submitBtn = form.querySelector('button[type="submit"]');

    // submit iš pradžių neaktyvus
    submitBtn.disabled = true;

    // ----- BLOKAS REZULTATAMS -----
    const resultsContainer = document.createElement("div");
    resultsContainer.id = "form-results";
    resultsContainer.classList.add("mt-4", "p-3", "border", "rounded", "bg-light");
    const formColumn = form.closest(".col-lg-8") || form.parentNode;
    formColumn.appendChild(resultsContainer);

    // ----- PAGALBINĖ FUNKCIJA KLAIDOMS -----
    function setFieldValidity(input, isValid, errorId) {
      if (isValid) {
        input.classList.remove("is-invalid");
        if (errorId) {
          const err = document.getElementById(errorId);
          if (err) err.classList.add("d-none");
        }
      } else {
        input.classList.add("is-invalid");
        if (errorId) {
          const err = document.getElementById(errorId);
          if (err) err.classList.remove("d-none");
        }
      }
    }

    // ----- VALIDACIJOS FUNKCIJOS -----
    function validateFirstName() {
      const val = firstName.value.trim();
      const ok = nameRegex.test(val);
      setFieldValidity(firstName, ok, "error-firstname");
      return ok;
    }

    function validateLastName() {
      const val = lastName.value.trim();
      const ok = nameRegex.test(val);
      setFieldValidity(lastName, ok, "error-lastname");
      return ok;
    }

    function validateEmail() {
      const val = email.value.trim();
      const ok = emailRegex.test(val);
      setFieldValidity(email, ok, "error-email");
      return ok;
    }

    function validateAddress() {
      const val = address.value.trim();
      const ok = val.length > 0;       // adresas kaip tekstas – netuščias
      setFieldValidity(address, ok, null);
      return ok;
    }

    // ----- TEL. NUMERIO FORMATAVIMAS -----
    function formatPhone(value) {
      // paliekam tik skaitmenis
      let digits = value.replace(/\D/g, "");

      // jei vartotojas įrašė 370..., nukerpam pradžią
      if (digits.startsWith("370")) {
        digits = digits.slice(3);
      }

      // ribojam ilgį iki 8 skaitmenų (6xx xxxxx)
      digits = digits.slice(0, 8);

      let formatted = "";
      if (digits.length > 0) {
        const part1 = digits.slice(0, 3);   // 6xx
        const part2 = digits.slice(3);      // xxxxx
        formatted = "+370 " + part1;
        if (part2) formatted += " " + part2;
      }

      return { formatted, digits };
    }

    function validatePhoneRealtime() {
      const { formatted, digits } = formatPhone(phone.value);
      phone.value = formatted;
      // galutinis teisingas numeris, kai turim 8 skaitmenis ir prasideda 6
      const ok = digits.length === 8 && digits[0] === "6";
      setFieldValidity(phone, ok, "error-phone");
      return ok;
    }

    // ----- BENDRAS FORMOS VALIDUMAS -----
    function isFormValid() {
      const v1 = validateFirstName();
      const v2 = validateLastName();
      const v3 = validateEmail();
      const v4 = validateAddress();
      const v5 = validatePhoneRealtime();
      return v1 && v2 && v3 && v4 && v5;
    }

    function updateSubmitState() {
      submitBtn.disabled = !isFormValid();
    }

    // ----- REALAUS LAIKO VALIDACIJA -----
    firstName.addEventListener("input", () => {
      validateFirstName();
      updateSubmitState();
    });

    lastName.addEventListener("input", () => {
      validateLastName();
      updateSubmitState();
    });

    email.addEventListener("input", () => {
      validateEmail();
      updateSubmitState();
    });

    address.addEventListener("input", () => {
      validateAddress();
      updateSubmitState();
    });

    phone.addEventListener("input", () => {
      validatePhoneRealtime();
      updateSubmitState();
    });

    // ----- SĖKMĖS POP-UP -----
    function showPopup(message) {
      let popup = document.querySelector(".custom-success-popup");

      if (!popup) {
        popup = document.createElement("div");
        popup.className = "custom-success-popup";
        popup.style.position = "fixed";
        popup.style.top = "20px";
        popup.style.right = "20px";
        popup.style.padding = "12px 18px";
        popup.style.backgroundColor = "#198754";
        popup.style.color = "#fff";
        popup.style.borderRadius = "6px";
        popup.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
        popup.style.zIndex = "9999";
        popup.style.fontWeight = "500";
        document.body.appendChild(popup);
      }

      popup.textContent = message;
      popup.style.display = "block";
      setTimeout(() => (popup.style.display = "none"), 3000);
    }

    // ----- SUBMIT -----
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!isFormValid()) return;

      const q1 = Number(document.getElementById("slider1").value);
      const q2 = Number(document.getElementById("slider2").value);
      const q3 = Number(document.getElementById("slider3").value);
      const average = ((q1 + q2 + q3) / 3).toFixed(1);

      const data = {
        vardas: firstName.value.trim(),
        pavarde: lastName.value.trim(),
        email: email.value.trim(),
        telefonas: phone.value.trim(),
        adresas: address.value.trim(),
        klausimas1: q1,
        klausimas2: q2,
        klausimas3: q3,
        vidurkis: average
      };

      console.log("Formos duomenys:", data);

      resultsContainer.innerHTML = `
        <p><strong>Vardas:</strong> ${data.vardas}</p>
        <p><strong>Pavardė:</strong> ${data.pavarde}</p>
        <p><strong>El. paštas:</strong> ${data.email}</p>
        <p><strong>Tel. numeris:</strong> ${data.telefonas}</p>
        <p><strong>Adresas:</strong> ${data.adresas}</p>
        <hr>
        <p><strong>${data.vardas} ${data.pavarde}: vidurkis</strong> ${data.vidurkis}</p>
      `;

      if (successMessage) {
        successMessage.textContent = "Duomenys pateikti sėkmingai!";
        successMessage.classList.remove("d-none");
      }
      showPopup("Duomenys pateikti sėkmingai!");

      form.reset();
      sliders.forEach(s => {
        const slider = document.getElementById(s.slider);
        const output = document.getElementById(s.value);
        if (slider && output) {
          slider.value = 5;
          output.textContent = 5;
        }
      });

      // po reset – vėl išjungiam submit
      submitBtn.disabled = true;
    });
  }

  // ================== MANO ŽAIDIMAS ==================

  const gameBoard = document.getElementById("game-board");
  const difficultySelect = document.getElementById("difficulty");
  const startBtn = document.getElementById("btn-start");
  const resetBtn = document.getElementById("btn-reset");
  const movesSpan = document.getElementById("stat-moves");
  const pairsSpan = document.getElementById("stat-pairs");
  const gameMessage = document.getElementById("game-message");

  if (!gameBoard || !difficultySelect || !startBtn || !resetBtn) {
    return; // jei žaidimo sekcijos nėra – nieko nedarom
  }

  // duomenų rinkinys (mažiausiai 6 unikalūs elementai)
  const baseSymbols = ["⚡", "💡", "🔥", "🔌", "📡", "🔋", "💻", "📱", "🎧", "🔊", "🛠️", "🚀"];

  let deck = [];
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let moves = 0;
  let matchedPairs = 0;
  let totalPairs = 0;

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function createDeck() {
    const difficulty = difficultySelect.value; // easy / hard
    const pairsCount = difficulty === "easy" ? 6 : 12; // 4x3 ir 6x4

    const symbols = baseSymbols.slice(0, pairsCount);
    const cards = [];

    symbols.forEach((sym, index) => {
      // kiekviena pora – du objektai su ta pačia reikšme
      cards.push({ id: index * 2, value: sym });
      cards.push({ id: index * 2 + 1, value: sym });
    });

    shuffle(cards);
    deck = cards;
    totalPairs = pairsCount;
  }

  function resetStats() {
    moves = 0;
    matchedPairs = 0;
    movesSpan.textContent = "0";
    pairsSpan.textContent = "0";
    gameMessage.textContent = "";
  }

  function resetBoardState() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }

  function renderBoard() {
    const difficulty = difficultySelect.value;
    gameBoard.innerHTML = "";

    // CSS grid stulpelių skaičius pagal lygį
    const cols = difficulty === "easy" ? 4 : 6;
    gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    deck.forEach(cardData => {
      const card = document.createElement("button");
      card.className = "game-card";
      card.type = "button";
      card.dataset.value = cardData.value;
      card.dataset.id = cardData.id;

      card.innerHTML = `
        <span class="game-card-inner">
          ${cardData.value}
        </span>
      `;

      card.addEventListener("click", () => onCardClick(card));
      gameBoard.appendChild(card);
    });
  }

  function updateStats() {
    movesSpan.textContent = moves.toString();
    pairsSpan.textContent = matchedPairs.toString();
  }

  function checkWin() {
    if (matchedPairs === totalPairs) {
      gameMessage.textContent = "Laimėjote!";
      gameMessage.classList.add("text-success");
      alert("Laimėjote!"); // aiškus laimėjimo pranešimas
    }
  }

  // 5 užduotis – kortelių sutapimo taisyklės
  function onCardClick(card) {
    if (lockBoard) return;
    if (card.classList.contains("matched")) return;
    if (card === firstCard) return;

    card.classList.add("flipped");

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    moves++;
    updateStats();

    const isMatch = firstCard.dataset.value === secondCard.dataset.value;

    if (isMatch) {
      // paliekam atverstas, jos tampa neaktyvios
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");
      firstCard.setAttribute("disabled", "disabled");
      secondCard.setAttribute("disabled", "disabled");

      matchedPairs++;
      updateStats();
      resetBoardState();
      checkWin();
    } else {
      // nesutampa – po trumpų uždelsimo apverčiam atgal
      lockBoard = true;
      setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetBoardState();
      }, 1000); // ~1 sekundė
    }
  }

  // Start / Atnaujinti logika
  function startGame() {
    resetStats();
    resetBoardState();
    createDeck();
    renderBoard();
  }

  startBtn.addEventListener("click", () => {
    startGame();
  });

  // keičiasi sudėtingumas – perkurti lentą, permaišyti, atnaujinti statistiką
  difficultySelect.addEventListener("change", () => {
    startGame();
  });

  resetBtn.addEventListener("click", () => {
    // Atnaujinti – naujai sumaišytos kortelės, paslėptos, statistika iš naujo
    startGame();
  });

  // jeigu nori, kad žaidimas būtų paruoštas iš karto:
  // startGame();
});

// ====== ŽAIDIMAS: atminties kortelių žaidimas ======
document.addEventListener("DOMContentLoaded", () => {
  const boardEl = document.getElementById("game-board");
  if (!boardEl) return; // jei nėra sekcijos – nieko nedarom

  const diffSelect = document.getElementById("game-difficulty");
  const startBtn   = document.getElementById("game-start");
  const resetBtn   = document.getElementById("game-reset");
  const msgEl      = document.getElementById("game-message");

  const movesEl   = document.getElementById("stat-moves");
  const matchesEl = document.getElementById("stat-matches");
  const totalEl   = document.getElementById("stat-total");
  const timeEl    = document.getElementById("stat-time");

  const bestEasyEl = document.getElementById("best-easy");
  const bestHardEl = document.getElementById("best-hard");

  // Kortelių duomenys – bent 6 unikalūs simboliai
  const CARD_VALUES = ["🍎","🍌","🍇","🍉","🥝","🍓","🍒","🍍"];

  // Sudėtingumo nustatymai
  const CONFIG = {
    easy: { pairs: 6, columns: 4 }, // 4 x 3
    hard: { pairs: 8, columns: 4 }  // 4 x 4
  };

  let currentDifficulty = diffSelect ? diffSelect.value : "easy";

  let boardLocked = false;
  let openedCards = [];
  let moves = 0;
  let matches = 0;

  // Laikmatis
  let timerInterval = null;
  let elapsedSeconds = 0;
  let gameStarted = false;

  // localStorage raktas
  const BEST_KEY = "memoryBestResults";

  function formatTime(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  function startTimer() {
    stopTimer();
    elapsedSeconds = 0;
    if (timeEl) timeEl.textContent = "00:00";
    timerInterval = setInterval(() => {
      elapsedSeconds++;
      if (timeEl) timeEl.textContent = formatTime(elapsedSeconds);
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  // ----- localStorage: geriausi rezultatai -----
  function loadBestResults() {
    let best = { easy: null, hard: null };
    const raw = localStorage.getItem(BEST_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (typeof parsed === "object" && parsed) {
          best = { ...best, ...parsed };
        }
      } catch (e) {
        console.warn("Cannot parse best results from localStorage", e);
      }
    }
    if (bestEasyEl) bestEasyEl.textContent = best.easy ?? "-";
    if (bestHardEl) bestHardEl.textContent = best.hard ?? "-";
    return best;
  }

  let bestResults = loadBestResults();

  function saveBestResults() {
    localStorage.setItem(BEST_KEY, JSON.stringify(bestResults));
  }

  // ----- Statistika + lenta -----
  function resetStats() {
    moves = 0;
    matches = 0;
    openedCards = [];
    boardLocked = false;
    gameStarted = false;
    stopTimer();
    elapsedSeconds = 0;

    if (movesEl) movesEl.textContent = "0";
    if (matchesEl) matchesEl.textContent = "0";
    if (totalEl) totalEl.textContent = CONFIG[currentDifficulty].pairs;
    if (timeEl) timeEl.textContent = "00:00";
    if (msgEl) msgEl.textContent = "";
  }

  function getShuffledDeck() {
    const neededPairs = CONFIG[currentDifficulty].pairs;
    const values = CARD_VALUES.slice(0, neededPairs); // tiek porų, kiek reikia
    const deck = [...values, ...values]; // dvi kortelės kiekvienai reikšmei

    // Fisher–Yates maišymas
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  function renderBoard() {
    boardEl.innerHTML = "";
    boardEl.classList.remove("easy", "hard");
    boardEl.classList.add(currentDifficulty);

    const deck = getShuffledDeck();
    deck.forEach((val, index) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "game-card";
      card.dataset.value = val;
      card.dataset.index = String(index);
      card.textContent = "?";                 // paslėpta kortelė
      card.addEventListener("click", onCardClick);
      boardEl.appendChild(card);
    });
  }

  // paruošia lentą (be laikmačio starto)
  function prepareBoard() {
    resetStats();
    renderBoard();
  }

  function revealCard(card) {
    card.classList.add("revealed");
    card.textContent = card.dataset.value;
  }

  function hideCard(card) {
    card.classList.remove("revealed");
    card.textContent = "?";
  }

  function handleWin() {
    stopTimer();
    if (msgEl) msgEl.textContent = "Laimėjote!";

    // atnaujinam geriausią rezultatą pagal ėjimų skaičių
    const currentBest = bestResults[currentDifficulty];
    if (currentBest == null || moves < currentBest) {
      bestResults[currentDifficulty] = moves;
      saveBestResults();
      bestResults = loadBestResults();
    }
  }

  // Kortelės paspaudimas
  function onCardClick(e) {
    const card = e.currentTarget;
    if (!gameStarted) return; // žaidimas nepradėtas – ignoruojam
    if (boardLocked) return;
    if (card.classList.contains("revealed") || card.classList.contains("disabled")) return;

    revealCard(card);
    openedCards.push(card);

    if (openedCards.length === 2) {
      boardLocked = true;
      moves++;
      if (movesEl) movesEl.textContent = String(moves);

      const [c1, c2] = openedCards;

      if (c1.dataset.value === c2.dataset.value) {
        // pora sutapo
        matches++;
        if (matchesEl) matchesEl.textContent = String(matches);
        c1.classList.add("disabled");
        c2.classList.add("disabled");
        openedCards = [];
        boardLocked = false;

        if (matches === CONFIG[currentDifficulty].pairs) {
          handleWin();
        }
      } else {
        // nesutapo – apverčiam atgal
        setTimeout(() => {
          hideCard(c1);
          hideCard(c2);
          openedCards = [];
          boardLocked = false;
        }, 800);
      }
    }
  }

  // ----- Įvykiai -----
  if (diffSelect) {
    diffSelect.addEventListener("change", () => {
      currentDifficulty = diffSelect.value;
      prepareBoard(); // kai keičiasi lygis – viskas reset
    });
  }

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      prepareBoard();    // nauja lenta
      gameStarted = true;
      startTimer();      // laikmatis startuoja TIK nuo Start mygtuko
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      prepareBoard();    // restart – be laikmačio starto
    });
  }

  // Pirmas kartas: sugeneruojam lentą, laikmatis dar nestartuoja
  prepareBoard();
});

