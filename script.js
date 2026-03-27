const UI = {
  pseudo: el("#pseudo"),
  level: el("#level"),
  startBtn: el("#startBtn"),
  restartBtn: el("#restartBtn"),
  hintBtn: el("#hintBtn"),
  status: el("#status"),
  setupMessage: el("#setupMessage"),
  masked: el("#masked"),
  tries: el("#tries"),
  letters: el("#letters"),
  scoreTotal: el("#scoreTotal"),
  scorePartie: el("#scorePartie"),
  streak: el("#streak"),
  accuracy: el("#accuracy"),
  wordLength: el("#wordLength"),
  progressBar: el("#progressBar"),
  playerName: el("#playerName"),
  currentLevel: el("#currentLevel"),
  letter: el("#letter"),
  tryBtn: el("#tryBtn"),
  resetBtn: el("#resetBtn"),
  feedback: el("#feedback"),
  bestPseudo: el("#bestPseudo"),
  bestScore: el("#bestScore"),
  bestScoreHero: el("#bestScoreHero"),
  recentList: el("#recentList"),
  keyboard: el("#keyboard"),
  setupScreen: el("#setupScreen"),
  gameScreen: el("#gameScreen"),
  resultScreen: el("#resultScreen"),
  resultTitle: el("#resultTitle"),
  resultSummary: el("#resultSummary"),
  resultWord: el("#resultWord"),
  resultScore: el("#resultScore"),
  resultTotal: el("#resultTotal"),
};

const CONSTS = {
  maxTentatives: 5,
  recentLimit: 8,
  storageBest: "gtw_best",
  storageRecent: "gtw_recent",
};

const FALLBACK = {
  facile: ["pomme", "banane", "orange", "citron", "fraise", "raisin", "mangue"],
  moyen: ["ordinateur", "clavier", "ecran", "souris", "assembleur", "memoire", "processeur"],
  difficile: ["asynchrone", "cryptographie", "polyglotte", "intergouvernemental", "metamorphose", "concurrence"],
};

const Game = {
  pseudo: "Anonyme",
  level: "moyen",
  tentInit: 0,
  tentLeft: 0,
  word: "",
  masked: "",
  letters: new Set(),
  over: true,
  win: false,
  scoreTotal: 0,
  scorePartie: 0,
  dict: [],
  streak: 0,
  totalGuesses: 0,
  successfulGuesses: 0,
  hintUsed: false,
};

function el(sel) {
  return document.querySelector(sel);
}

function spaced(s) {
  return s.split("").join(" ");
}

function repairText(value) {
  if (!/[ÃÂâ€]/.test(value)) return value;
  try {
    return decodeURIComponent(escape(value));
  } catch {
    return value;
  }
}

function stripDiacritics(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizeWord(word) {
  return stripDiacritics(repairText(word).replace(/\r/g, "").replace(/\n/g, "").trim().toLowerCase());
}

function isAlpha(char) {
  return /^[a-z]$/.test(char);
}

function capitalize(s) {
  return s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : s;
}

function showScreen(name) {
  const screens = [UI.setupScreen, UI.gameScreen, UI.resultScreen];
  for (const screen of screens) {
    screen.classList.remove("screen-active");
    screen.classList.add("screen-hidden");
  }
  name.classList.remove("screen-hidden");
  name.classList.add("screen-active");
}

function loadBest() {
  try {
    return JSON.parse(localStorage.getItem(CONSTS.storageBest)) || { pseudo: "", score: 0 };
  } catch {
    return { pseudo: "", score: 0 };
  }
}

function saveBest(obj) {
  localStorage.setItem(CONSTS.storageBest, JSON.stringify(obj));
}

function loadRecent() {
  try {
    return JSON.parse(localStorage.getItem(CONSTS.storageRecent)) || [];
  } catch {
    return [];
  }
}

function saveRecent(arr) {
  localStorage.setItem(CONSTS.storageRecent, JSON.stringify(arr));
}

function tentativesPourNiveau(level) {
  if (level === "facile") return CONSTS.maxTentatives + 3;
  if (level === "difficile") return Math.max(2, CONSTS.maxTentatives - 1);
  return CONSTS.maxTentatives;
}

function computeScore(tentLeft, tentInit, wordLen, hintUsed) {
  const bonusTentatives = tentLeft * 20;
  const bonusLongueur = wordLen * 4;
  const precisionBonus = Math.max(0, (tentInit - tentLeft) * 2);
  const hintPenalty = hintUsed ? 15 : 0;
  return Math.max(5, bonusTentatives + bonusLongueur + precisionBonus - hintPenalty);
}

function updateStatus(text, cssClass = "") {
  UI.status.textContent = text;
  UI.status.className = `pill ${cssClass}`.trim();
}

async function loadWords(level) {
  const url = `words/${level}.txt`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const txt = await res.text();
    const list = txt
      .split("\n")
      .map(normalizeWord)
      .filter(Boolean)
      .filter((word) => /^[a-z]+$/.test(word));
    if (!list.length) throw new Error("fichier vide");
    return [...new Set(list)];
  } catch (err) {
    UI.setupMessage.textContent = `Impossible de charger "${url}" (${err.message}). Liste integree utilisee.`;
    return FALLBACK[level] || [];
  }
}

async function startGame() {
  UI.setupMessage.textContent = "Chargement des mots...";
  Game.pseudo = (UI.pseudo.value || "Anonyme").trim() || "Anonyme";
  Game.level = UI.level.value;
  Game.scoreTotal = 0;
  Game.streak = 0;
  Game.scorePartie = 0;
  Game.totalGuesses = 0;
  Game.successfulGuesses = 0;
  Game.dict = await loadWords(Game.level);

  if (!Game.dict.length) {
    UI.setupMessage.textContent = `Aucun mot disponible pour le niveau "${Game.level}".`;
    return;
  }

  UI.setupMessage.textContent = "";
  newRound();
  showScreen(UI.gameScreen);
}

function pickWord() {
  if (!Game.dict.length) return "";
  if (Game.dict.length === 1) return Game.dict[0];
  let nextWord = Game.dict[Math.floor(Math.random() * Game.dict.length)];
  while (nextWord === Game.word) {
    nextWord = Game.dict[Math.floor(Math.random() * Game.dict.length)];
  }
  return nextWord;
}

function newRound() {
  Game.word = pickWord();
  Game.masked = "_".repeat(Game.word.length);
  Game.letters.clear();
  Game.tentInit = tentativesPourNiveau(Game.level);
  Game.tentLeft = Game.tentInit;
  Game.over = false;
  Game.win = false;
  Game.scorePartie = 0;
  Game.hintUsed = false;
  UI.feedback.textContent = "Bonne chance.";
  UI.hintBtn.disabled = false;
  UI.letter.disabled = false;
  UI.tryBtn.disabled = false;
  UI.playerName.textContent = Game.pseudo;
  UI.currentLevel.textContent = capitalize(Game.level);
  updateStatus("En cours");
  render();
  UI.letter.focus();
}

function revealLetter(letter, source = "guess") {
  let hits = 0;
  const arr = Game.masked.split("");

  for (let i = 0; i < Game.word.length; i += 1) {
    if (Game.word[i] === letter && arr[i] === "_") {
      arr[i] = letter;
      hits += 1;
    }
  }

  Game.masked = arr.join("");
  if (source === "guess") {
    Game.totalGuesses += 1;
    if (hits > 0) Game.successfulGuesses += 1;
  }
  return hits;
}

function showResultScreen(victory) {
  UI.resultTitle.textContent = victory ? "Victoire" : "Defaite";
  UI.resultSummary.textContent = victory
    ? `${Game.pseudo}, tu as trouve le mot en gardant ${Game.tentLeft} tentative(s).`
    : `${Game.pseudo}, tu n'as pas trouve le mot cette fois.`;
  UI.resultWord.textContent = Game.word;
  UI.resultScore.textContent = Game.scorePartie;
  UI.resultTotal.textContent = Game.scoreTotal;
  showScreen(UI.resultScreen);
}

function endRound(victory) {
  Game.over = true;
  Game.win = victory;
  Game.streak = victory ? Game.streak + 1 : 0;
  Game.scorePartie = victory ? computeScore(Game.tentLeft, Game.tentInit, Game.word.length, Game.hintUsed) : 0;
  Game.scoreTotal += Game.scorePartie;
  UI.hintBtn.disabled = true;
  UI.letter.disabled = true;
  UI.tryBtn.disabled = true;

  if (victory) {
    updateStatus("Gagne", "win");
    UI.feedback.textContent = `Mot trouve: ${Game.word}. ${Game.scorePartie} points gagnes.`;
  } else {
    updateStatus("Perdu", "lose");
    UI.feedback.textContent = `Le mot etait: ${Game.word}.`;
  }

  persistScore(victory);
  render();
  showResultScreen(victory);
}

function guessLetter(letter = UI.letter.value) {
  if (Game.over) return;

  const input = normalizeWord(letter).slice(0, 1);
  UI.letter.value = "";

  if (!isAlpha(input)) {
    UI.feedback.textContent = "Entre une seule lettre de a a z.";
    return;
  }

  if (Game.letters.has(input)) {
    UI.feedback.textContent = "Lettre deja proposee.";
    return;
  }

  Game.letters.add(input);
  const hits = revealLetter(input);

  if (hits > 0) {
    UI.feedback.textContent = `Bien joue. "${input}" apparait ${hits} fois.`;
    if (Game.masked === Game.word) {
      endRound(true);
      return;
    }
  } else {
    Game.tentLeft -= 1;
    UI.feedback.textContent = `Rate. "${input}" n'est pas dans le mot.`;
    if (Game.tentLeft <= 0) {
      endRound(false);
      return;
    }
  }

  render();
}

function giveHint() {
  if (Game.over || Game.hintUsed) return;

  const hiddenIndexes = [];
  for (let i = 0; i < Game.masked.length; i += 1) {
    if (Game.masked[i] === "_") hiddenIndexes.push(i);
  }

  if (!hiddenIndexes.length) return;

  const index = hiddenIndexes[Math.floor(Math.random() * hiddenIndexes.length)];
  const letter = Game.word[index];

  Game.hintUsed = true;
  Game.letters.add(letter);
  revealLetter(letter, "hint");
  Game.tentLeft = Math.max(1, Game.tentLeft - 1);
  UI.hintBtn.disabled = true;
  UI.feedback.textContent = `Indice utilise: la lettre "${letter}" a ete revelee.`;

  if (Game.masked === Game.word) {
    endRound(true);
    return;
  }

  render();
}

function persistScore(victory) {
  const best = loadBest();
  if (Game.scoreTotal > (best.score || 0)) {
    saveBest({ pseudo: Game.pseudo, score: Game.scoreTotal });
  }

  const recent = loadRecent();
  recent.push({
    pseudo: Game.pseudo,
    score: Game.scoreTotal,
    mot: Game.word,
    niveau: Game.level,
    victoire: victory,
    tentativesUtilisees: Game.tentInit - Game.tentLeft,
    indice: Game.hintUsed,
    ts: Date.now(),
  });
  while (recent.length > CONSTS.recentLimit) recent.shift();
  saveRecent(recent);
  renderMeta();
}

function renderKeyboard() {
  const letters = "abcdefghijklmnopqrstuvwxyz".split("");
  UI.keyboard.innerHTML = "";

  for (const letter of letters) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "key";
    btn.textContent = letter;
    btn.disabled = Game.over || Game.letters.has(letter);

    if (Game.letters.has(letter)) {
      btn.classList.add(Game.word.includes(letter) ? "hit" : "miss");
    }

    btn.addEventListener("click", () => guessLetter(letter));
    UI.keyboard.appendChild(btn);
  }
}

function render() {
  UI.masked.textContent = spaced(Game.masked || "_____");
  UI.tries.textContent = Game.tentLeft || 0;
  UI.letters.textContent = [...Game.letters].sort().join(" ") || "-";
  UI.scoreTotal.textContent = Game.scoreTotal;
  UI.scorePartie.textContent = Game.scorePartie;
  UI.streak.textContent = Game.streak;
  UI.wordLength.textContent = `${Game.word.length || 0} lettres`;

  const discovered = Game.masked ? Game.masked.split("").filter((c) => c !== "_").length : 0;
  const progress = Game.word.length ? Math.round((discovered / Game.word.length) * 100) : 0;
  UI.progressBar.style.width = `${progress}%`;

  const accuracy = Game.totalGuesses ? Math.round((Game.successfulGuesses / Game.totalGuesses) * 100) : 0;
  UI.accuracy.textContent = `${accuracy}%`;

  renderKeyboard();
}

function renderMeta() {
  const best = loadBest();
  UI.bestPseudo.textContent = best.pseudo || "-";
  UI.bestScore.textContent = best.score || 0;
  UI.bestScoreHero.textContent = best.score || 0;

  const list = loadRecent().slice().reverse();
  UI.recentList.innerHTML = "";

  for (const score of list) {
    const li = document.createElement("li");
    li.textContent = `${score.pseudo} - ${score.score} pts - ${score.victoire ? "victoire" : "defaite"} - ${capitalize(score.niveau)} - mot: ${score.mot}${score.indice ? " - indice" : ""}`;
    UI.recentList.appendChild(li);
  }
}

function returnToSetup() {
  UI.letter.value = "";
  UI.setupMessage.textContent = "";
  showScreen(UI.setupScreen);
}

UI.startBtn.addEventListener("click", startGame);
UI.restartBtn.addEventListener("click", returnToSetup);
UI.hintBtn.addEventListener("click", giveHint);
UI.tryBtn.addEventListener("click", () => guessLetter());
UI.letter.addEventListener("input", () => {
  UI.letter.value = normalizeWord(UI.letter.value).slice(0, 1);
});
UI.letter.addEventListener("keydown", (e) => {
  if (e.key === "Enter") guessLetter();
});
document.addEventListener("keydown", (e) => {
  if (e.target === UI.letter) return;
  const key = normalizeWord(e.key).slice(0, 1);
  if (isAlpha(key) && !Game.over && UI.gameScreen.classList.contains("screen-active")) guessLetter(key);
});
UI.resetBtn.addEventListener("click", () => {
  localStorage.removeItem(CONSTS.storageBest);
  localStorage.removeItem(CONSTS.storageRecent);
  renderMeta();
  UI.feedback.textContent = "Scores locaux reinitialises.";
});

render();
renderMeta();
showScreen(UI.setupScreen);
