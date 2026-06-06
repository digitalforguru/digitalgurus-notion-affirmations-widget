const widget = document.getElementById("widget");
const previewWidget = document.getElementById("previewWidget");

const affirmationText = document.getElementById("affirmationText");
const previewAffirmationText = document.getElementById("previewAffirmationText");

const dateEl = document.getElementById("date");
const previewDateEl = document.getElementById("previewDate");

const themeBtn = document.getElementById("themeBtn");
const themeOptions = document.getElementById("themeOptions");

const appearanceToggle = document.getElementById("appearanceToggle");
const appearanceOptions = document.getElementById("appearanceOptions");

const fontBtn = document.getElementById("fontToggle");
const fontOptions = document.getElementById("fontOptions");

const sizeBtn = document.getElementById("sizeBtn");
const sizeOptions = document.getElementById("sizeOptions");

const copyBtn = document.getElementById("copyLinkBtn");
const copyMessage = document.getElementById("copyMessage");

const params = new URLSearchParams(window.location.search);
const isEmbed = params.get("embed") === "true";

if (isEmbed) {
  document.documentElement.classList.add("embed-mode");
}

/* ---------------- STATE ---------------- */
let state = {
  theme: params.get("theme") || localStorage.getItem("affirmTheme") || "beige",
  font: params.get("font") || localStorage.getItem("affirmFont") || "default",
  size: params.get("size") || localStorage.getItem("affirmSize") || "medium",
  appearance:
    params.get("appearance") ||
    localStorage.getItem("affirmAppearance") ||
    "system",
};

function saveState() {
  localStorage.setItem("affirmTheme", state.theme);
  localStorage.setItem("affirmFont", state.font);
  localStorage.setItem("affirmSize", state.size);
  localStorage.setItem("affirmAppearance", state.appearance);
}

function updateBothWidgets(callback) {
  [widget, previewWidget].forEach((el) => {
    if (el) callback(el);
  });
}

function setBothText(mainEl, previewEl, value) {
  [mainEl, previewEl].forEach((el) => {
    if (el) el.textContent = value;
  });
}

function getSizeDimensions(size) {
  if (size === "small") {
    return { width: 90, height: 90 };
  }

  if (size === "wide") {
    return { width: 200, height: 80 };
  }

  return { width: 145, height: 145 };
}

function applyEmbedDimensions(size) {
  if (!isEmbed) return;

  const { width, height } = getSizeDimensions(size);

  document.documentElement.style.setProperty("--embed-width", `${width}px`);
  document.documentElement.style.setProperty("--embed-height", `${height}px`);
}

/* ---------------- THEME ---------------- */
function setTheme(theme) {
  state.theme = theme || "beige";

  updateBothWidgets((el) => {
    el.classList.remove("beige", "pink", "green", "blue", "black", "white");
    el.classList.add(state.theme);
  });

  if (themeBtn) {
    const colors = {
      pink: "#f4dfeb",
      beige: "#faebdd",
      blue: "#ddebf1",
      green: "#ddedea",
      black: "#17171a",
      white: "#f8f6f3",
    };

    themeBtn.style.backgroundColor = colors[state.theme] || colors.beige;
  }

  saveState();
}

/* ---------------- FONT ---------------- */
function setFont(font) {
  state.font = font || "default";

  updateBothWidgets((el) => {
    el.classList.remove("font-default", "font-serif", "font-mono");
    el.classList.add(`font-${state.font}`);

    if (state.font === "serif") {
      el.style.fontFamily = "Georgia, serif";
    } else if (state.font === "mono") {
      el.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, monospace";
    } else {
      el.style.fontFamily =
        "'Satoshi', ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    }
  });

  saveState();
}

/* ---------------- SIZE ---------------- */
function setSize(size) {
  state.size = size || "medium";

  updateBothWidgets((el) => {
    el.classList.remove("small", "medium", "wide");
    el.classList.add(state.size);
  });

  applyEmbedDimensions(state.size);
  saveState();
}

/* ---------------- APPEARANCE ---------------- */
function setAppearance(appearance) {
  state.appearance = appearance || "system";

  document.body.classList.remove(
    "appearance-light",
    "appearance-dark",
    "appearance-system"
  );

  document.body.classList.add(`appearance-${state.appearance}`);

  saveState();
}

/* ---------------- EMBED LINK ---------------- */
function buildEmbedURL() {
  const base = window.location.origin + window.location.pathname;

  return `${base}?theme=${state.theme}&font=${state.font}&size=${state.size}&appearance=${state.appearance}&embed=true`;
}

/* ---------------- COPY LINK ---------------- */
if (copyBtn) {
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(buildEmbedURL());

    if (!copyMessage) return;

    copyMessage.classList.remove("hidden");
    copyMessage.classList.add("show");

    setTimeout(() => {
      copyMessage.classList.remove("show");
      copyMessage.classList.add("hidden");
    }, 2000);
  });
}

/* ---------------- AFFIRMATION ---------------- */
function loadAffirmation() {
  const today = new Date();

  const dayKey =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();

  const index = dayKey % affirmations.length;
  const affirmation = affirmations[index];

  setBothText(affirmationText, previewAffirmationText, affirmation);

  const formatted = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  setBothText(dateEl, previewDateEl, formatted);
}

/* ---------------- POPUPS ---------------- */
themeBtn?.addEventListener("click", (e) => {
  e.stopPropagation();

  themeOptions?.classList.toggle("hidden");
  sizeOptions?.classList.add("hidden");
  appearanceOptions?.classList.add("hidden");
  fontOptions?.classList.add("hidden");
});

appearanceToggle?.addEventListener("click", (e) => {
  e.stopPropagation();

  appearanceOptions?.classList.toggle("hidden");
  themeOptions?.classList.add("hidden");
  sizeOptions?.classList.add("hidden");
  fontOptions?.classList.add("hidden");
});

fontBtn?.addEventListener("click", (e) => {
  e.stopPropagation();

  fontOptions?.classList.toggle("hidden");
  themeOptions?.classList.add("hidden");
  sizeOptions?.classList.add("hidden");
  appearanceOptions?.classList.add("hidden");
});

sizeBtn?.addEventListener("click", (e) => {
  e.stopPropagation();

  sizeOptions?.classList.toggle("hidden");
  themeOptions?.classList.add("hidden");
  appearanceOptions?.classList.add("hidden");
  fontOptions?.classList.add("hidden");
});

/* ---------------- OPTIONS ---------------- */
document.querySelectorAll(".theme-circle").forEach((circle) => {
  circle.addEventListener("click", () => {
    setTheme(circle.dataset.theme);
    themeOptions?.classList.add("hidden");
  });
});

document.querySelectorAll(".appearance-option").forEach((option) => {
  option.addEventListener("click", () => {
    setAppearance(option.dataset.appearance);
    appearanceOptions?.classList.add("hidden");
  });
});

document.querySelectorAll(".font-option").forEach((option) => {
  option.addEventListener("click", () => {
    setFont(option.dataset.font);
    fontOptions?.classList.add("hidden");
  });
});

document.querySelectorAll(".size-option").forEach((option) => {
  option.addEventListener("click", () => {
    setSize(option.dataset.size);
    sizeOptions?.classList.add("hidden");
  });
});

/* ---------------- OUTSIDE CLICK ---------------- */
document.addEventListener("click", (e) => {
  if (!themeBtn?.contains(e.target) && !themeOptions?.contains(e.target)) {
    themeOptions?.classList.add("hidden");
  }

  if (
    !appearanceToggle?.contains(e.target) &&
    !appearanceOptions?.contains(e.target)
  ) {
    appearanceOptions?.classList.add("hidden");
  }

  if (!fontBtn?.contains(e.target) && !fontOptions?.contains(e.target)) {
    fontOptions?.classList.add("hidden");
  }

  if (!sizeBtn?.contains(e.target) && !sizeOptions?.contains(e.target)) {
    sizeOptions?.classList.add("hidden");
  }
});

/* ---------------- INIT ---------------- */
setTheme(state.theme);
setFont(state.font);
setSize(state.size);
setAppearance(state.appearance);
loadAffirmation();
