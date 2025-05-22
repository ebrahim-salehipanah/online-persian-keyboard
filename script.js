const keyboard = document.getElementById("keyboard");
const output = document.getElementById("output");
const copyBtn = document.getElementById("copyBtn");
const themeToggle = document.getElementById("themeToggle");

let isShift = false;
let isCapsLock = false;

// Persian Keyboard Layout rows
const rows = [
  // Row 1 - number row + symbols
  [
    { normal: "‌~", shift: "±" }, // Persian uses special char here, ~ replaced by zero-width non-joiner + ± for example
    { normal: "۱", shift: "!" },
    { normal: "۲", shift: "@" },
    { normal: "۳", shift: "#" },
    { normal: "۴", shift: "$" },
    { normal: "۵", shift: "%" },
    { normal: "۶", shift: "^" },
    { normal: "۷", shift: "&" },
    { normal: "۸", shift: "*" },
    { normal: "۹", shift: "(" },
    { normal: "۰", shift: ")" },
    { normal: "-", shift: "_" },
    { normal: "=", shift: "+" },
    { normal: "Backspace", type: "backspace", wide: true },
  ],
  // Row 2 - Tab + Persian letters
  [
    { normal: "Tab", type: "tab", wide: true },
    { normal: "ض", shift: "َ" },
    { normal: "ص", shift: "ً" },
    { normal: "ث", shift: "ُ" },
    { normal: "ق", shift: "ٌ" },
    { normal: "ف", shift: "ِ" },
    { normal: "غ", shift: "ٍ" },
    { normal: "ع", shift: "ّ" },
    { normal: "ه", shift: "ْ" },
    { normal: "خ", shift: "ـ" },
    { normal: "ح", shift: "÷" },
    { normal: "ج", shift: "×" },
    { normal: "چ", shift: "؛" },
    { normal: "\\", shift: "|" },
  ],
  // Row 3 - CapsLock + Persian letters
  [
    { normal: "Caps Lock", type: "capslock", wide: true },
    { normal: "ش", shift: "!" },
    { normal: "س", shift: "@" },
    { normal: "ی", shift: "#" },
    { normal: "ب", shift: "$" },
    { normal: "ل", shift: "%" },
    { normal: "ا", shift: "^" },
    { normal: "ت", shift: "&" },
    { normal: "ن", shift: "*" },
    { normal: "م", shift: "(" },
    { normal: "ک", shift: ")" },
    { normal: "گ", shift: "_" },
    { normal: "Enter", type: "enter", wide: true },
  ],
  // Row 4 - Shift + Persian letters
  [
    { normal: "Shift", type: "shift", wide: true },
    { normal: "ظ", shift: "{" },
    { normal: "ط", shift: "}" },
    { normal: "ز", shift: "[" },
    { normal: "ر", shift: "]" },
    { normal: "ذ", shift: ":" },
    { normal: "د", shift: "\"" },
    { normal: "پ", shift: "'" },
    { normal: "و", shift: "<" },
    { normal: ".", shift: ">" },
    { normal: "؟", shift: "؟" },
    { normal: "Shift", type: "shift", wide: true },
  ],
  // Row 5 - Ctrl, Alt, Space, arrows
  [
    { normal: "Ctrl", type: "ctrl" },
    { normal: "Alt", type: "alt" },
    { normal: "Space", type: "space", wide: true },
    { normal: "←", type: "arrow" },
    { normal: "↓", type: "arrow" },
    { normal: "↑", type: "arrow" },
    { normal: "→", type: "arrow" },
  ],
];

// Map English physical keys to Persian normal layout characters
const physicalKeyMap = {
  "`": "‌", // zero-width non-joiner
  "1": "۱",
  "2": "۲",
  "3": "۳",
  "4": "۴",
  "5": "۵",
  "6": "۶",
  "7": "۷",
  "8": "۸",
  "9": "۹",
  "0": "۰",
  "-": "-",
  "=": "=",
  q: "ض",
  w: "ص",
  e: "ث",
  r: "ق",
  t: "ف",
  y: "غ",
  u: "ع",
  i: "ه",
  o: "خ",
  p: "ح",
  "[": "ج",
  "]": "چ",
  "\\": "\\",
  a: "ش",
  s: "س",
  d: "ی",
  f: "ب",
  g: "ل",
  h: "ا",
  j: "ت",
  k: "ن",
  l: "م",
  ";": "ک",
  "'": "گ",
  z: "ظ",
  x: "ط",
  c: "ز",
  v: "ر",
  b: "ذ",
  n: "د",
  m: "پ",
  ",": "و",
  ".": ".",
  "/": "؟",
  " ": " ",
};

// Map English physical keys to Persian shift layout characters
const physicalKeyShiftMap = {
  "`": "±",
  "1": "!",
  "2": "@",
  "3": "#",
  "4": "$",
  "5": "%",
  "6": "^",
  "7": "&",
  "8": "*",
  "9": "(",
  "0": ")",
  "-": "_",
  "=": "+",
  q: "َ",
  w: "ً",
  e: "ُ",
  r: "ٌ",
  t: "ِ",
  y: "ٍ",
  u: "ّ",
  i: "ْ",
  o: "ـ",
  p: "÷",
  "[": "×",
  "]": "؛",
  "\\": "|",
  a: "!",
  s: "@",
  d: "#",
  f: "$",
  g: "%",
  h: "^",
  j: "&",
  k: "*",
  l: "(",
  ";": ")",
  "'": "_",
  z: "{",
  x: "}",
  c: "[",
  v: "]",
  b: ":",
  n: '"',
  m: "'",
  ",": "<",
  ".": ">",
  "/": "؟",
};

function createKeyElement(keyObj) {
  const key = document.createElement("div");
  key.classList.add("key");

  if (keyObj.wide) key.classList.add("wide");
  if (keyObj.type === "space") key.classList.add("space");
  if (keyObj.type === "tab") key.classList.add("tab");
  if (keyObj.type === "capslock") key.classList.add("capslock");
  if (keyObj.type === "enter") key.classList.add("enter");
  if (keyObj.type === "shift") key.classList.add("shift");
  if (keyObj.type === "ctrl") key.classList.add("ctrl");
  if (keyObj.type === "alt") key.classList.add("alt");
  if (keyObj.type === "arrow") key.classList.add("arrow");

  // Show shifted or normal char depending on state, but special keys keep label
  if (keyObj.type && ["shift", "ctrl", "alt", "tab", "capslock", "enter", "backspace", "space", "arrow"].includes(keyObj.type)) {
    key.textContent = keyObj.normal;
  } else {
    if (isShift) {
      key.textContent = keyObj.shift || keyObj.normal;
    } else {
      key.textContent = keyObj.normal;
    }
  }

  key.addEventListener("click", () => handleKeyClick(keyObj));
  return key;
}

function renderKeyboard() {
  keyboard.innerHTML = "";
  rows.forEach((row) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("keyboard-row");
    row.forEach((keyObj) => {
      const keyElement = createKeyElement(keyObj);
      rowDiv.appendChild(keyElement);
    });
    keyboard.appendChild(rowDiv);
  });
  updateSpecialKeysUI();
}

function updateSpecialKeysUI() {
  // Highlight Shift and Caps Lock keys if active
  document.querySelectorAll(".key.shift").forEach((el) => {
    if (isShift) el.classList.add("active");
    else el.classList.remove("active");
  });

  document.querySelectorAll(".key.capslock").forEach((el) => {
    if (isCapsLock) el.classList.add("active");
    else el.classList.remove("active");
  });
}

function handleKeyClick(keyObj) {
  output.focus();
  switch (keyObj.type) {
    case "backspace":
      // Remove last char
      output.value = output.value.slice(0, -1);
      break;
    case "tab":
      output.value += "\t";
      break;
    case "capslock":
      isCapsLock = !isCapsLock;
      updateSpecialKeysUI();
      break;
    case "enter":
      output.value += "\n";
      break;
    case "shift":
      isShift = !isShift;
      renderKeyboard();
      break;
    case "space":
      output.value += " ";
      break;
    case "ctrl":
    case "alt":
    case "arrow":
      // For arrows and ctrl/alt do nothing or add cursor move if you want later
      break;
    default:
      let char = isShift ? keyObj.shift || keyObj.normal : keyObj.normal;
      if (isCapsLock) {
        // Persian does not have uppercase but if you want: toggle to uppercase letters here (skip)
      }
      output.value += char;
      if (isShift) {
        // Shift usually only applies to next char
        isShift = false;
        renderKeyboard();
      }
  }
}

// Physical keyboard input handling
window.addEventListener("keydown", (e) => {

  if (e.ctrlKey) {
    const key = e.key.toLowerCase();

    if (['a', 'c', 'x', 'v'].includes(key)) {
      return; // let browser handle it
    }
  }
  if (e.repeat) return; // avoid repeat key bug

  // Special keys handling
  if (e.key === "Backspace") {
    e.preventDefault();
    output.value = output.value.slice(0, -1);
    return;
  }
  if (e.key === "Enter") {
    e.preventDefault();
    output.value += "\n";
    return;
  }
  if (e.key === "Tab") {
    e.preventDefault();
    output.value += "\t";
    return;
  }
  if (e.key === "Shift") {
    isShift = true;
    renderKeyboard();
    return;
  }
  if (e.key === "CapsLock") {
    isCapsLock = !isCapsLock;
    updateSpecialKeysUI();
    return;
  }

  // Letters and symbols
  const key = e.key.toLowerCase();

  // Prevent default to avoid double input
  if (physicalKeyMap[key] !== undefined) {
    e.preventDefault();

    let char;
    if (isShift) {
      char = physicalKeyShiftMap[key] || physicalKeyMap[key];
    } else {
      char = physicalKeyMap[key];
    }
    output.value += char;

    if (isShift) {
      isShift = false;
      renderKeyboard();
    }
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "Shift") {
    isShift = false;
    renderKeyboard();
  }
});

// Copy to clipboard button
copyBtn.addEventListener("click", () => {
  output.select();
  document.execCommand("copy");
  copyBtn.textContent = "کپی شد!";
  setTimeout(() => (copyBtn.textContent = "📋 کپی"), 1500);
});

// Apply saved theme on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.checked = true;
  } else {
    document.body.classList.remove("dark");
    themeToggle.checked = false;
  }
});

// Listen for toggle changes
themeToggle.addEventListener("change", () => {
  if (themeToggle.checked) {
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
});


renderKeyboard();
