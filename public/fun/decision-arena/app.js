(() => {
  "use strict";

  const STORAGE_KEY = "decision-arena-v1";
  const PREFS_KEY = "decision-arena-prefs-v1";
  const SCALE_MIN = -10;
  const SCALE_MAX = 10;
  const HP_RANGE = 50;

  const I18N = {
    zh: {
      documentTitle: "决策竞技场 · Decision Arena",
      logoMark: "任务日志",
      brand: "决策竞技场",
      tagline: "称量利弊 · 选出最优路线",
      reset: "重置",
      resetTitle: "重置全部",
      addOption: "+ 新增选项",
      export: "导出 ▾",
      exportPdf: "导出 PDF",
      exportMd: "导出 Markdown",
      exportJson: "导出 JSON",
      importJson: "导入 JSON",
      legendAria: "分数说明",
      legendNeg: "-10 极差",
      legendZero: "0 中立",
      legendPos: "+10 极优",
      winnerHint: "最高分自动加冕「最佳选择」",
      footer: "决策矩阵 · RPG 模式",
      bestChoice: "最佳选择",
      bestChoiceMark: "← 最佳选择",
      optionNameLabel: "选项名称",
      optionPlaceholder: "输入选项名称…",
      deleteOption: "删除此选项",
      totalPower: "总战力",
      addEvent: "+ 添加事件",
      eventPlaceholder: "影响事件 / 因素…",
      decreaseScore: "降低分数",
      increaseScore: "提高分数",
      eventScore: "事件分数",
      eventScoreValue: "事件分数数值",
      deleteEvent: "删除事件",
      emptyBoard: "点击「新增选项」开始你的决策任务",
      noFactors: "（暂无因素）",
      untitledOption: "未命名选项",
      langToggleTitle: "切换到 English",
      themeToggleTitle: "切换浅色 / 深色主题",
      themeToggle: "主题",
      optionDefault: (n) => `选项 ${n}`,
      confirmKeepOne: "至少保留一个选项？确定清空并重新开始？",
      confirmReset: "确定重置全部选项与事件？此操作不可撤销。",
      importSuccess: "导入成功",
      importError: "无法导入：JSON 格式无效或缺少选项数据。",
      pkStart: "PK 对决",
      pkStartSub: "VERSUS START",
      pkNeedTwo: "至少需要两个选项才能开始对决。",
      undoBattle: "撤销对局",
      undoBattleSub: "回到对比模式",
      victory: "VICTORY",
      ko: "K.O.",
      battling: "对决进行中…",
      vs: "VS",
      championTitle: "👑 最佳决策",
      demo: [
        {
          name: "接受 Offer A",
          events: [
            { name: "薪资更高", scale: 8 },
            { name: "通勤时间长", scale: -4 },
            { name: "团队氛围好", scale: 6 },
          ],
        },
        {
          name: "继续观望",
          events: [
            { name: "保留选择空间", scale: 5 },
            { name: "机会成本", scale: -6 },
            { name: "焦虑感上升", scale: -3 },
          ],
        },
      ],
    },
    en: {
      documentTitle: "Decision Arena · Decision Matrix",
      logoMark: "QUEST LOG",
      brand: "Decision Arena",
      tagline: "Weigh the odds · Pick your path",
      reset: "Reset",
      resetTitle: "Reset everything",
      addOption: "+ Add Option",
      export: "Export ▾",
      exportPdf: "Export PDF",
      exportMd: "Export Markdown",
      exportJson: "Export JSON",
      importJson: "Import JSON",
      legendAria: "Score legend",
      legendNeg: "-10 Worst",
      legendZero: "0 Neutral",
      legendPos: "+10 Best",
      winnerHint: "Highest score earns the Best Choice crown",
      footer: "DECISION MATRIX · RPG MODE",
      bestChoice: "BEST CHOICE",
      bestChoiceMark: "← Best Choice",
      optionNameLabel: "Option name",
      optionPlaceholder: "Enter option name…",
      deleteOption: "Delete this option",
      totalPower: "TOTAL POWER",
      addEvent: "+ Add Event",
      eventPlaceholder: "Impact event / factor…",
      decreaseScore: "Decrease score",
      increaseScore: "Increase score",
      eventScore: "Event score",
      eventScoreValue: "Event score value",
      deleteEvent: "Delete event",
      emptyBoard: 'Tap "Add Option" to start your quest',
      noFactors: "(No factors yet)",
      untitledOption: "Untitled option",
      langToggleTitle: "Switch to 中文",
      themeToggleTitle: "Toggle light / dark theme",
      themeToggle: "Theme",
      optionDefault: (n) => `Option ${n}`,
      confirmKeepOne: "Keep at least one option? Clear and restart?",
      confirmReset: "Reset all options and events? This cannot be undone.",
      importSuccess: "Import successful",
      importError: "Import failed: invalid JSON or missing options.",
      pkStart: "PK Battle",
      pkStartSub: "VERSUS START",
      pkNeedTwo: "Need at least two options to start a battle.",
      undoBattle: "Undo Battle",
      undoBattleSub: "Back to Compare",
      victory: "VICTORY",
      ko: "K.O.",
      battling: "Battling…",
      vs: "VS",
      championTitle: "👑 CHAMPION DECISION",
      demo: [
        {
          name: "Accept Offer A",
          events: [
            { name: "Higher salary", scale: 8 },
            { name: "Longer commute", scale: -4 },
            { name: "Great team vibe", scale: 6 },
          ],
        },
        {
          name: "Keep Looking",
          events: [
            { name: "More flexibility", scale: 5 },
            { name: "Opportunity cost", scale: -6 },
            { name: "Rising anxiety", scale: -3 },
          ],
        },
      ],
    },
  };

  const board = document.getElementById("options-board");
  const optionTemplate = document.getElementById("option-card-template");
  const eventTemplate = document.getElementById("event-row-template");
  const btnAddOption = document.getElementById("btn-add-option");
  const btnReset = document.getElementById("btn-reset");
  const btnExport = document.getElementById("btn-export");
  const exportDropdown = document.getElementById("export-dropdown");
  const importInput = document.getElementById("import-json-input");
  const printRoot = document.getElementById("print-root");
  const btnLang = document.getElementById("btn-lang");
  const btnTheme = document.getElementById("btn-theme");
  const langLabel = document.getElementById("lang-label");
  const themeIcon = btnTheme.querySelector(".theme-icon");
  const root = document.documentElement;
  const btnPk = document.getElementById("btn-pk");
  const btnUndo = document.getElementById("btn-undo");
  const settleBar = document.getElementById("settle-bar");
  const pkStatus = document.getElementById("pk-status");
  const victoryOverlay = document.getElementById("victory-overlay");
  const victoryName = document.getElementById("victory-name");
  const vsFlash = document.getElementById("vs-flash");
  const arenaStage = document.getElementById("arena-stage");

  /** @type {{ id: string, name: string, events: { id: string, name: string, scale: number }[] }[]} */
  let state = [];
  /** @type {"zh" | "en"} */
  let lang = "zh";
  /** @type {"dark" | "light"} */
  let theme = "dark";

  let battle = {
    isBattling: false,
    battleFinished: false,
    discardedIds: new Set(),
    championId: null,
    abort: false,
  };

  function t(key) {
    const pack = I18N[lang];
    return pack[key];
  }

  function uid() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function clampScale(value) {
    const n = Number(value);
    if (Number.isNaN(n)) return 0;
    return Math.max(SCALE_MIN, Math.min(SCALE_MAX, Math.round(n)));
  }

  function optionScore(option) {
    return option.events.reduce((sum, e) => sum + e.scale, 0);
  }

  function editsLocked() {
    return battle.isBattling || battle.battleFinished;
  }

  function buildBattlePlan(options) {
    const remaining = options.map((o) => ({ id: o.id, score: optionScore(o) }));
    const rounds = [];
    while (remaining.length > 1) {
      remaining.sort((a, b) => a.score - b.score || a.id.localeCompare(b.id));
      const loser = remaining[0];
      const winner = remaining[remaining.length - 1];
      rounds.push({ winnerId: winner.id, loserId: loser.id });
      remaining.splice(0, 1);
    }
    return { rounds, championId: remaining[0]?.id ?? null };
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const sfx = (() => {
    let ctx = null;

    function getCtx() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!ctx) ctx = new AC();
      if (ctx.state === "suspended") ctx.resume();
      return ctx;
    }

    function tone(freq, dur, type = "square", vol = 0.08, slide = 0) {
      try {
        const c = getCtx();
        if (!c) return;
        const o = c.createOscillator();
        const g = c.createGain();
        o.type = type;
        o.frequency.setValueAtTime(freq, c.currentTime);
        if (slide) {
          o.frequency.exponentialRampToValueAtTime(
            Math.max(40, freq + slide),
            c.currentTime + dur
          );
        }
        g.gain.setValueAtTime(vol, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
        o.connect(g);
        g.connect(c.destination);
        o.start();
        o.stop(c.currentTime + dur + 0.02);
      } catch {
        /* ignore audio failures */
      }
    }

    return {
      unlock() {
        try {
          getCtx();
        } catch {
          /* ignore */
        }
      },
      click() {
        tone(880, 0.05, "square", 0.04);
      },
      hit() {
        tone(180, 0.08, "square", 0.12);
        tone(90, 0.12, "sawtooth", 0.06);
      },
      knock() {
        tone(120, 0.15, "triangle", 0.1, -60);
      },
      dissolve() {
        tone(400, 0.35, "sine", 0.05, -300);
      },
      ko() {
        tone(150, 0.2, "square", 0.1);
        setTimeout(() => tone(100, 0.35, "sawtooth", 0.08), 80);
      },
      victory() {
        [523, 659, 784, 1046].forEach((f, i) => {
          setTimeout(() => tone(f, 0.2, "square", 0.06), i * 90);
        });
      },
      rewind() {
        tone(600, 0.25, "sine", 0.06, 400);
      },
    };
  })();

  function fireVictoryConfetti() {
    if (typeof confetti !== "function") return;
    const colors = ["#ffd700", "#ff6b6b", "#4ecdc4", "#ffffff"];
    const end = Date.now() + 1600;
    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }

  function fireDustAtCard(cardEl) {
    if (typeof confetti !== "function" || !cardEl) return;
    const r = cardEl.getBoundingClientRect();
    const x = (r.left + r.width / 2) / window.innerWidth;
    const y = (r.top + r.height / 2) / window.innerHeight;
    confetti({
      particleCount: 28,
      spread: 55,
      startVelocity: 18,
      gravity: 1.1,
      ticks: 80,
      origin: { x, y },
      colors: ["#c4b59a", "#8a7a66", "#e8dcc8", "#6b5b4a", "#a09080"],
      scalar: 0.7,
    });
  }

  function shakeStage() {
    if (!arenaStage) return;
    arenaStage.classList.remove("is-shaking");
    void arenaStage.offsetWidth;
    arenaStage.classList.add("is-shaking");
    setTimeout(() => arenaStage.classList.remove("is-shaking"), 450);
  }

  function setBattleUi() {
    const locked = battle.isBattling || battle.battleFinished;
    document.body.classList.toggle("is-battling", battle.isBattling || battle.battleFinished);
    document.body.classList.toggle("is-battle-finished", battle.battleFinished);

    if (btnPk) btnPk.hidden = battle.isBattling || battle.battleFinished;
    if (settleBar) settleBar.hidden = !battle.battleFinished;

    if (pkStatus) {
      if (battle.isBattling) {
        pkStatus.hidden = false;
        pkStatus.textContent = t("battling");
      } else {
        pkStatus.hidden = true;
        pkStatus.textContent = "";
      }
    }

    applyChampionVisuals();
  }

  function applyChampionVisuals() {
    board.querySelectorAll(".option-card").forEach((card) => {
      const banner = card.querySelector(".champion-banner");
      const isChamp =
        battle.battleFinished && card.dataset.optionId === battle.championId;
      card.classList.toggle("is-champion", isChamp);
      if (banner) {
        banner.hidden = !isChamp;
        if (isChamp) banner.textContent = t("championTitle");
      }
    });
  }

  function cardByOptionId(id) {
    return board.querySelector(`.option-card[data-option-id="${id}"]`);
  }

  function clearCardBattleTransforms(el) {
    if (!el) return;
    el.getAnimations?.().forEach((a) => a.cancel());
    el.style.transform = "";
  }

  function applyDiscardedVisuals() {
    battle.discardedIds.forEach((id) => {
      const card = cardByOptionId(id);
      if (!card) return;
      card.classList.add("is-discarded");
      card.classList.remove("is-dissolving", "is-battling-loser", "is-hit");
    });
    if (battle.battleFinished && battle.championId) {
      const champ = cardByOptionId(battle.championId);
      champ?.classList.add("is-battling-winner", "is-champion");
    }
    applyChampionVisuals();
  }

  function runAnim(el, keyframes, options) {
    try {
      const anim = el.animate(keyframes, options);
      return anim.finished.catch(() => {});
    } catch {
      return sleep(options?.duration || 0);
    }
  }

  async function animateClash(winnerEl, loserEl) {
    const wRect = winnerEl.getBoundingClientRect();
    const lRect = loserEl.getBoundingClientRect();
    const wCx = wRect.left + wRect.width / 2;
    const lCx = lRect.left + lRect.width / 2;
    const wDir = Math.sign(lCx - wCx) || 1;
    const lDir = Math.sign(wCx - lCx) || -1;

    await Promise.all([
      runAnim(
        winnerEl,
        [{ transform: "translateX(0)" }, { transform: `translateX(${wDir * 40}px)` }],
        { duration: 280, easing: "ease-out", fill: "forwards" }
      ),
      runAnim(
        loserEl,
        [{ transform: "translateX(0)" }, { transform: `translateX(${lDir * 40}px)` }],
        { duration: 280, easing: "ease-out", fill: "forwards" }
      ),
    ]);

    return { wDir, lDir };
  }

  async function startBattle() {
    if (battle.isBattling) return;
    if (state.length < 2) {
      alert(t("pkNeedTwo"));
      return;
    }

    sfx.unlock();
    sfx.click();
    battle.isBattling = true;
    battle.battleFinished = false;
    battle.discardedIds = new Set();
    battle.championId = null;
    battle.abort = false;
    if (victoryOverlay) victoryOverlay.hidden = true;
    setBattleUi();
    document.body.classList.add("is-battling");

    const plan = buildBattlePlan(state);
    battle.championId = plan.championId;

    for (const round of plan.rounds) {
      if (battle.abort) break;

      const winnerEl = cardByOptionId(round.winnerId);
      const loserEl = cardByOptionId(round.loserId);
      if (!winnerEl || !loserEl) continue;

      if (vsFlash) {
        vsFlash.hidden = false;
        await sleep(480);
        vsFlash.hidden = true;
      }

      board.querySelectorAll(".is-battling-winner").forEach((el) => {
        if (el !== winnerEl) el.classList.remove("is-battling-winner");
      });
      winnerEl.classList.add("is-battling-winner");
      loserEl.classList.add("is-battling-loser");

      const { lDir } = await animateClash(winnerEl, loserEl);

      sfx.hit();
      shakeStage();
      loserEl.classList.add("is-hit");
      await sleep(140);

      sfx.knock();
      await runAnim(
        loserEl,
        [
          { transform: `translateX(${lDir * 40}px)` },
          { transform: `translateX(${lDir * 120}px) rotate(${lDir * 6}deg)` },
        ],
        { duration: 320, easing: "ease-in", fill: "forwards" }
      );

      sfx.dissolve();
      fireDustAtCard(loserEl);
      loserEl.classList.remove("is-hit", "is-battling-loser");
      loserEl.classList.add("is-dissolving");
      await sleep(700);
      loserEl.classList.add("is-discarded");
      loserEl.classList.remove("is-dissolving");
      clearCardBattleTransforms(loserEl);
      battle.discardedIds.add(round.loserId);

      clearCardBattleTransforms(winnerEl);
      // keep is-battling-winner glow on current champion

      await sleep(700);
    }

    battle.battleFinished = true;
    battle.isBattling = false;

    const champ = state.find((o) => o.id === plan.championId);
    const champEl = cardByOptionId(plan.championId);
    champEl?.classList.add("is-battling-winner", "is-champion");

    if (victoryName) victoryName.textContent = champ ? optionLabel(champ) : "";
    if (victoryOverlay) victoryOverlay.hidden = false;
    sfx.ko();
    sfx.victory();
    fireVictoryConfetti();
    setBattleUi();

    await sleep(1800);
    if (battle.battleFinished && victoryOverlay) victoryOverlay.hidden = true;
  }

  async function undoBattle() {
    if (battle.isBattling) return;
    sfx.rewind();
    if (victoryOverlay) victoryOverlay.hidden = true;
    if (settleBar) settleBar.hidden = true;

    document.body.classList.remove("is-battle-finished");

    for (const id of [...battle.discardedIds]) {
      const card = cardByOptionId(id);
      if (!card) continue;
      card.classList.remove("is-discarded", "is-dissolving", "is-hit", "is-battling-loser", "is-champion");
      card.classList.add("is-rewinding");
      const banner = card.querySelector(".champion-banner");
      if (banner) banner.hidden = true;
      setTimeout(() => card.classList.remove("is-rewinding"), 500);
    }

    board.querySelectorAll(".is-battling-winner, .is-champion").forEach((el) => {
      el.classList.remove("is-battling-winner", "is-champion");
      clearCardBattleTransforms(el);
      const banner = el.querySelector(".champion-banner");
      if (banner) banner.hidden = true;
    });

    battle.discardedIds = new Set();
    battle.championId = null;
    battle.battleFinished = false;
    battle.abort = false;

    document.body.classList.remove("is-battling", "is-battle-finished");
    setBattleUi();
  }

  function createDefaultEvent() {
    return { id: uid(), name: "", scale: 0 };
  }

  function createDefaultOption(index = 1) {
    return {
      id: uid(),
      name: t("optionDefault")(index),
      events: [createDefaultEvent()],
    };
  }

  function loadPrefs() {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.lang === "zh" || parsed.lang === "en") lang = parsed.lang;
      if (parsed.theme === "dark" || parsed.theme === "light") theme = parsed.theme;
    } catch {
      /* ignore */
    }
  }

  function savePrefs() {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify({ lang, theme }));
    } catch {
      /* ignore */
    }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return null;
      return parsed.map((opt, i) => ({
        id: opt.id || uid(),
        name: typeof opt.name === "string" ? opt.name : t("optionDefault")(i + 1),
        events: Array.isArray(opt.events)
          ? opt.events.map((ev) => ({
              id: ev.id || uid(),
              name: typeof ev.name === "string" ? ev.name : "",
              scale: clampScale(ev.scale),
            }))
          : [createDefaultEvent()],
      }));
    } catch {
      return null;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }

  function getBestIds() {
    if (state.length === 0) return new Set();
    const scores = state.map(optionScore);
    const max = Math.max(...scores);
    return new Set(state.filter((_, i) => scores[i] === max).map((o) => o.id));
  }

  function toneFor(scale) {
    if (scale > 0) return "pos";
    if (scale < 0) return "neg";
    return "zero";
  }

  function formatScore(n) {
    return n > 0 ? `+${n}` : String(n);
  }

  function updateHpBar(fillEl, trackEl, score) {
    const abs = Math.min(Math.abs(score), HP_RANGE);
    const pct = (abs / HP_RANGE) * 50;

    fillEl.classList.toggle("neg", score < 0);

    if (score >= 0) {
      fillEl.style.left = "50%";
      fillEl.style.width = `${pct}%`;
    } else {
      fillEl.style.left = `${50 - pct}%`;
      fillEl.style.width = `${pct}%`;
    }

    trackEl.setAttribute("aria-valuenow", String(score));
  }

  function applyI18n(rootEl = document) {
    rootEl.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = t(key);
      if (typeof value === "string") el.textContent = value;
    });

    rootEl.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const value = t(key);
      if (typeof value === "string") el.setAttribute("placeholder", value);
    });

    rootEl.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      const value = t(key);
      if (typeof value === "string") el.setAttribute("title", value);
    });

    rootEl.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      const value = t(key);
      if (typeof value === "string") el.setAttribute("aria-label", value);
    });

    board.style.setProperty("--empty-msg", JSON.stringify(t("emptyBoard")));
  }

  function applyChrome() {
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-lang", lang);
    root.setAttribute("lang", lang === "zh" ? "zh-CN" : "en");
    document.title = t("documentTitle");

    langLabel.textContent = lang === "zh" ? "EN" : "中文";
    themeIcon.textContent = theme === "dark" ? "☀" : "☾";

    applyI18n(document);
    // Re-apply i18n inside live cards after static chrome
    applyI18n(board);
  }

  function localizeNode(node) {
    applyI18n(node);
  }

  function growTextarea(el) {
    if (!el) return;
    // Collapse then expand so scrollHeight reflects full wrapped content
    el.style.height = "0px";
    el.style.height = `${el.scrollHeight}px`;
  }

  function growAllEventFields() {
    board.querySelectorAll(".event-name").forEach(growTextarea);
  }

  function scheduleGrowAll() {
    requestAnimationFrame(() => {
      growAllEventFields();
      requestAnimationFrame(growAllEventFields);
    });
  }

  function renderEvent(optionId, event) {
    const node = eventTemplate.content.firstElementChild.cloneNode(true);
    node.dataset.eventId = event.id;
    node.dataset.tone = toneFor(event.scale);
    localizeNode(node);

    const nameInput = node.querySelector(".event-name");
    const slider = node.querySelector(".scale-slider");
    const number = node.querySelector(".scale-number");
    const btnDec = node.querySelector(".scale-btn.dec");
    const btnInc = node.querySelector(".scale-btn.inc");
    const btnDelete = node.querySelector(".delete-event");

    nameInput.value = event.name;
    slider.value = String(event.scale);
    number.value = String(event.scale);

    const applyScale = (raw) => {
      if (editsLocked()) return;
      const scale = clampScale(raw);
      const option = state.find((o) => o.id === optionId);
      const ev = option?.events.find((e) => e.id === event.id);
      if (!ev) return;
      ev.scale = scale;
      slider.value = String(scale);
      number.value = String(scale);
      node.dataset.tone = toneFor(scale);
      saveState();
      refreshScores();
      scheduleGrowAll();
    };

    nameInput.addEventListener("input", () => {
      if (editsLocked()) return;
      const option = state.find((o) => o.id === optionId);
      const ev = option?.events.find((e) => e.id === event.id);
      if (!ev) return;
      ev.name = nameInput.value;
      growTextarea(nameInput);
      saveState();
    });

    // Keep height when focus moves between events
    nameInput.addEventListener("focus", () => growTextarea(nameInput));
    nameInput.addEventListener("blur", () => growTextarea(nameInput));

    slider.addEventListener("input", () => applyScale(slider.value));
    number.addEventListener("change", () => applyScale(number.value));
    number.addEventListener("input", () => {
      if (number.value === "" || number.value === "-" || number.value === "+") return;
      applyScale(number.value);
    });

    btnDec.addEventListener("click", () => applyScale(Number(slider.value) - 1));
    btnInc.addEventListener("click", () => applyScale(Number(slider.value) + 1));

    btnDelete.addEventListener("click", () => {
      if (editsLocked()) return;
      const option = state.find((o) => o.id === optionId);
      if (!option) return;
      option.events = option.events.filter((e) => e.id !== event.id);
      saveState();
      // Remove only this row — keep other textareas' heights
      node.remove();
      refreshScores();
      scheduleGrowAll();
    });

    return node;
  }

  function renderOption(option, isWinner) {
    const node = optionTemplate.content.firstElementChild.cloneNode(true);
    node.dataset.optionId = option.id;
    node.classList.toggle("is-winner", isWinner);
    localizeNode(node);

    const badge = node.querySelector(".rank-badge");
    badge.hidden = !isWinner;

    const nameInput = node.querySelector(".option-name");
    nameInput.value = option.name;

    const eventsList = node.querySelector("[data-events]");
    option.events.forEach((ev) => {
      eventsList.appendChild(renderEvent(option.id, ev));
    });

    nameInput.addEventListener("input", () => {
      if (editsLocked()) return;
      const opt = state.find((o) => o.id === option.id);
      if (!opt) return;
      opt.name = nameInput.value;
      saveState();
    });

    node.querySelector(".delete-option").addEventListener("click", () => {
      if (editsLocked()) return;
      if (state.length <= 1) {
        if (!confirm(t("confirmKeepOne"))) return;
        state = [createDefaultOption(1)];
      } else {
        state = state.filter((o) => o.id !== option.id);
      }
      saveState();
      render();
    });

    node.querySelector(".add-event").addEventListener("click", () => {
      if (editsLocked()) return;
      const opt = state.find((o) => o.id === option.id);
      if (!opt) return;
      const ev = createDefaultEvent();
      opt.events.push(ev);
      saveState();
      // Append only — do not rebuild other event boxes
      eventsList.appendChild(renderEvent(option.id, ev));
      scheduleGrowAll();
      const newField = eventsList.querySelector(
        `[data-event-id="${ev.id}"] .event-name`
      );
      newField?.focus();
    });

    const score = optionScore(option);
    const scoreEl = node.querySelector("[data-score]");
    const fillEl = node.querySelector("[data-hp-fill]");
    const trackEl = node.querySelector(".hp-track");
    scoreEl.textContent = formatScore(score);
    scoreEl.classList.remove("is-pos", "is-neg", "is-zero");
    scoreEl.classList.add(`is-${toneFor(score)}`);
    updateHpBar(fillEl, trackEl, score);

    return node;
  }

  function refreshScores() {
    const winners = getBestIds();
    board.querySelectorAll(".option-card").forEach((card) => {
      const id = card.dataset.optionId;
      const option = state.find((o) => o.id === id);
      if (!option) return;

      const score = optionScore(option);
      const scoreEl = card.querySelector("[data-score]");
      const fillEl = card.querySelector("[data-hp-fill]");
      const trackEl = card.querySelector(".hp-track");
      const badge = card.querySelector(".rank-badge");
      const prev = scoreEl.textContent;
      const next = formatScore(score);

      if (prev !== next) {
        scoreEl.textContent = next;
        scoreEl.classList.remove("bump");
        void scoreEl.offsetWidth;
        scoreEl.classList.add("bump");
      }

      scoreEl.classList.remove("is-pos", "is-neg", "is-zero");
      scoreEl.classList.add(`is-${toneFor(score)}`);
      updateHpBar(fillEl, trackEl, score);

      const win = winners.has(id);
      card.classList.toggle("is-winner", win);
      badge.hidden = !win;
    });
  }

  function render() {
    if (battle.isBattling) return;
    const winners = getBestIds();
    board.replaceChildren();
    state.forEach((option) => {
      board.appendChild(renderOption(option, winners.has(option.id)));
    });
    board.style.setProperty("--empty-msg", JSON.stringify(t("emptyBoard")));
    applyDiscardedVisuals();
    scheduleGrowAll();
  }

  function addOption() {
    if (editsLocked()) return;
    state.push(createDefaultOption(state.length + 1));
    saveState();
    render();
    const last = board.querySelector(".option-card:last-child .option-name");
    last?.focus();
    last?.select();
  }

  function resetAll() {
    if (editsLocked()) return;
    if (!confirm(t("confirmReset"))) return;
    state = [createDefaultOption(1), createDefaultOption(2)];
    saveState();
    render();
  }

  function seedDemo() {
    return I18N[lang].demo.map((opt) => ({
      id: uid(),
      name: opt.name,
      events: opt.events.map((ev) => ({
        id: uid(),
        name: ev.name,
        scale: ev.scale,
      })),
    }));
  }

  function toggleLang() {
    lang = lang === "zh" ? "en" : "zh";
    savePrefs();
    applyChrome();
    if (battle.isBattling) {
      setBattleUi();
      return;
    }
    render();
    setBattleUi();
  }

  function toggleTheme() {
    theme = theme === "dark" ? "light" : "dark";
    savePrefs();
    applyChrome();
  }

  /* ---------- Export / Import ---------- */

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function exportStamp() {
    const d = new Date();
    return `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}-${pad2(d.getHours())}${pad2(d.getMinutes())}`;
  }

  function exportBaseName() {
    return `决策竞技场-${exportStamp()}`;
  }

  function formatDisplayDate(d = new Date()) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  }

  function formatSigned(n) {
    return n > 0 ? `+${n}` : String(n);
  }

  function sortedEvents(option) {
    return [...option.events].sort((a, b) => b.scale - a.scale || a.name.localeCompare(b.name, lang === "zh" ? "zh" : "en"));
  }

  function optionLabel(option) {
    const name = (option.name || "").trim();
    return name || t("untitledOption");
  }

  function downloadBlob(filename, mime, content) {
    const blob = content instanceof Blob ? content : new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function setExportMenuOpen(open) {
    exportDropdown.hidden = !open;
    btnExport.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function toggleExportMenu() {
    setExportMenuOpen(exportDropdown.hidden);
  }

  function buildMarkdown() {
    const winners = getBestIds();
    const dateStr = formatDisplayDate();
    const lines = [`# 决策竞技场 · ${dateStr}`, ""];

    state.forEach((option) => {
      const score = optionScore(option);
      const best = winners.has(option.id) ? ` ${t("bestChoiceMark")}` : "";
      lines.push(`## ${optionLabel(option)}（${t("totalPower")}: ${formatSigned(score)}）${best}`);
      lines.push("");
      const events = sortedEvents(option);
      if (events.length === 0) {
        lines.push(`- ${t("noFactors")}`);
      } else {
        events.forEach((ev) => {
          const text = (ev.name || "").trim() || "—";
          lines.push(`- [${formatSigned(ev.scale)}] ${text}`);
        });
      }
      lines.push("");
    });

    return `${lines.join("\n").trim()}\n`;
  }

  function buildExportPayload() {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      options: state.map((opt) => ({
        id: opt.id,
        name: opt.name,
        events: opt.events.map((ev) => ({
          id: ev.id,
          name: ev.name,
          scale: ev.scale,
        })),
      })),
    };
  }

  function buildPrintSheet() {
    const winners = getBestIds();
    const dateStr = formatDisplayDate();
    const sections = state
      .map((option) => {
        const score = optionScore(option);
        const isBest = winners.has(option.id);
        const scoreClass = toneFor(score) === "neg" ? "is-neg" : "";
        const events = sortedEvents(option);
        const factors =
          events.length === 0
            ? `<p class="print-empty">${escapeHtml(t("noFactors"))}</p>`
            : `<ul class="print-factors">${events
                .map((ev) => {
                  const tone = toneFor(ev.scale);
                  const text = (ev.name || "").trim() || "—";
                  return `<li><span class="print-factor-score is-${tone}">${escapeHtml(formatSigned(ev.scale))}</span><span class="print-factor-text">${escapeHtml(text)}</span></li>`;
                })
                .join("")}</ul>`;

        return `
          <section class="print-option">
            <h2 class="print-option-title">${escapeHtml(optionLabel(option))}${
              isBest ? `<span class="print-best">${escapeHtml(t("bestChoice"))}</span>` : ""
            }</h2>
            <p class="print-score">${escapeHtml(t("totalPower"))}: <strong class="${scoreClass}">${escapeHtml(formatSigned(score))}</strong></p>
            ${factors}
          </section>`;
      })
      .join("");

    printRoot.innerHTML = `
      <header class="print-header">
        <h1>决策竞技场</h1>
        <p class="print-date">${escapeHtml(dateStr)}</p>
      </header>
      ${sections}`;
    printRoot.hidden = false;
    printRoot.setAttribute("aria-hidden", "false");
  }

  function clearPrintSheet() {
    printRoot.innerHTML = "";
    printRoot.hidden = true;
    printRoot.setAttribute("aria-hidden", "true");
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function exportPdf() {
    const prevTitle = document.title;
    document.title = exportBaseName();
    buildPrintSheet();
    const cleanup = () => {
      document.title = prevTitle;
      clearPrintSheet();
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
    // print() 在多数浏览器会阻塞至对话框关闭；再兜底清理一次
    cleanup();
  }

  function exportMarkdown() {
    downloadBlob(`${exportBaseName()}.md`, "text/markdown;charset=utf-8", buildMarkdown());
  }

  function exportJson() {
    const json = `${JSON.stringify(buildExportPayload(), null, 2)}\n`;
    downloadBlob(`${exportBaseName()}.json`, "application/json;charset=utf-8", json);
  }

  function normalizeImportedOptions(raw) {
    let list = null;
    if (Array.isArray(raw)) list = raw;
    else if (raw && Array.isArray(raw.options)) list = raw.options;
    if (!list || list.length === 0) return null;

    return list.map((opt, i) => ({
      id: typeof opt?.id === "string" && opt.id ? opt.id : uid(),
      name: typeof opt?.name === "string" ? opt.name : t("optionDefault")(i + 1),
      events: Array.isArray(opt?.events)
        ? opt.events.map((ev) => ({
            id: typeof ev?.id === "string" && ev.id ? ev.id : uid(),
            name: typeof ev?.name === "string" ? ev.name : "",
            scale: clampScale(ev?.scale),
          }))
        : [createDefaultEvent()],
    }));
  }

  function importJsonFile(file) {
    if (editsLocked()) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || ""));
        const next = normalizeImportedOptions(parsed);
        if (!next) {
          alert(t("importError"));
          return;
        }
        state = next;
        saveState();
        render();
        alert(t("importSuccess"));
      } catch {
        alert(t("importError"));
      }
    };
    reader.onerror = () => alert(t("importError"));
    reader.readAsText(file, "UTF-8");
  }

  function onExportAction(action) {
    if (editsLocked()) return;
    setExportMenuOpen(false);
    if (action === "pdf") exportPdf();
    else if (action === "md") exportMarkdown();
    else if (action === "json") exportJson();
    else if (action === "import") importInput.click();
  }

  // Init
  loadPrefs();
  const loaded = loadState();
  state = loaded && loaded.length > 0 ? loaded : seedDemo();

  btnAddOption.addEventListener("click", addOption);
  btnReset.addEventListener("click", resetAll);
  btnPk?.addEventListener("click", () => {
    startBattle();
  });
  btnUndo?.addEventListener("click", () => {
    undoBattle();
  });
  victoryOverlay?.addEventListener("click", () => {
    if (battle.battleFinished) victoryOverlay.hidden = true;
  });
  btnLang.addEventListener("click", toggleLang);
  btnTheme.addEventListener("click", toggleTheme);
  btnExport.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleExportMenu();
  });
  exportDropdown.addEventListener("click", (e) => {
    const item = e.target.closest("[data-export]");
    if (!item) return;
    onExportAction(item.getAttribute("data-export"));
  });
  importInput.addEventListener("change", () => {
    const file = importInput.files && importInput.files[0];
    importInput.value = "";
    if (file) importJsonFile(file);
  });
  document.addEventListener("click", (e) => {
    if (!exportDropdown.hidden && !e.target.closest(".export-menu")) {
      setExportMenuOpen(false);
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setExportMenuOpen(false);
  });
  window.addEventListener("resize", scheduleGrowAll);

  applyChrome();
  render();
  setBattleUi();
})();
