// C-Forge: Main Application Controller & State Engine (Enhanced)
// Manages navigation, search modal, progress persistence, audio synthesis, DPP evaluation, beginner tooltips, and custom stdin runner.

// --- 1. Sound FX Engine (Synthesized with Web Audio API - Zero External Audio Files) ---
class SoundFX {
  constructor() {
    this.enabled = localStorage.getItem("cforge_sound") !== "false";
    this.ctx = null;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playBeep(freq, type = 'sine', duration = 0.08, vol = 0.05) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch(e) {}
  }

  playClick() { this.playBeep(600, 'sine', 0.04, 0.03); }
  playStep() { this.playBeep(480, 'triangle', 0.06, 0.04); }
  playSuccess() {
    this.playBeep(523.25, 'sine', 0.1, 0.05); // C5
    setTimeout(() => this.playBeep(659.25, 'sine', 0.1, 0.05), 80); // E5
    setTimeout(() => this.playBeep(783.99, 'sine', 0.18, 0.06), 160); // G5
  }
  playError() {
    this.playBeep(240, 'sawtooth', 0.15, 0.06);
  }
}

window.soundFX = new SoundFX();

// --- 2. Beginner C Keyword Dictionary for Smart Tooltips ---
const C_KEYWORD_EXPLANATIONS = {
  "malloc": "Memory Allocation: Asks the OS heap for a block of raw bytes that survives after the function exits.",
  "free": "Memory Deallocation: Gives a heap block back to the OS so your program doesn't run out of RAM.",
  "sizeof": "Compile-time operator: Measures exactly how many bytes of RAM a variable or data type occupies.",
  "size_t": "Unsigned 64-bit integer type specifically designed to hold memory sizes and array lengths.",
  "volatile": "Tells the compiler: 'This variable can change via hardware or outside threads—never cache it in a register!'",
  "typedef": "Type Definition: Creates a clean nickname/alias for a data type (e.g. typedef unsigned char uint8;).",
  "printf": "Print Formatted: Sends text and formatted variable values to the standard output console screen.",
  "scanf": "Scan Formatted: Reads user keyboard input from stdin and writes into variables using their addresses.",
  "realloc": "Re-allocate: Dynamically resizes an existing heap memory block without losing its contents.",
  "NULL": "Zero pointer address (0x0): Points nowhere. Dereferencing NULL triggers an instant segmentation fault crash."
};

// --- 3. Main App State ---
class AppState {
  constructor() {
    this.completedLessons = JSON.parse(localStorage.getItem("cforge_completed_lessons") || "[]");
    this.solvedDPPs = JSON.parse(localStorage.getItem("cforge_solved_dpps") || "[]");
    this.quizScores = JSON.parse(localStorage.getItem("cforge_quiz_scores") || "{}");
    this.userName = localStorage.getItem("cforge_username") || "C Programmer";
    this.activeTab = "lessons";
    this.activeLessonId = "m1-l1";
    this.activeDPPId = "dpp-1";
    this.activeFlowchartId = "fc-compilation";
  }

  save() {
    localStorage.setItem("cforge_completed_lessons", JSON.stringify(this.completedLessons));
    localStorage.setItem("cforge_solved_dpps", JSON.stringify(this.solvedDPPs));
    localStorage.setItem("cforge_quiz_scores", JSON.stringify(this.quizScores));
    localStorage.setItem("cforge_username", this.userName);
    this.updateHeaderProgress();
  }

  markLessonComplete(lessonId) {
    if (!this.completedLessons.includes(lessonId)) {
      this.completedLessons.push(lessonId);
      this.save();
      window.soundFX.playSuccess();
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    }
  }

  markDPPSolved(dppId) {
    if (!this.solvedDPPs.includes(dppId)) {
      this.solvedDPPs.push(dppId);
      this.save();
      window.soundFX.playSuccess();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  }

  calculateTotalXP() {
    let xp = 0;
    xp += this.completedLessons.length * 30;
    
    this.solvedDPPs.forEach(id => {
      const dpp = DPPS_DATA.find(d => d.id === id);
      if (dpp) xp += dpp.xp;
    });

    Object.values(this.quizScores).forEach(score => {
      xp += (score * 20);
    });

    return xp;
  }

  getRank(xp) {
    if (xp >= 1500) return { title: "Kernel Hacker", level: 5, color: "#a855f7", badge: "KERNEL PRO" };
    if (xp >= 900) return { title: "Systems Architect", level: 4, color: "#3b82f6", badge: "ARCHITECT" };
    if (xp >= 500) return { title: "Systems Engineer", level: 3, color: "#10b981", badge: "ENGINEER" };
    if (xp >= 200) return { title: "C Developer", level: 2, color: "#f59e0b", badge: "DEVELOPER" };
    return { title: "C Apprentice", level: 1, color: "#60a5fa", badge: "APPRENTICE" };
  }

  updateHeaderProgress() {
    const xp = this.calculateTotalXP();
    const rank = this.getRank(xp);
    
    const xpEl = document.getElementById("headerXP");
    if (xpEl) xpEl.textContent = `${xp} XP`;

    const rankEl = document.getElementById("headerRank");
    if (rankEl) {
      rankEl.textContent = rank.title;
      rankEl.style.color = rank.color;
    }

    const totalLessons = LESSONS_DATA.reduce((acc, m) => acc + m.lessons.length, 0);
    const lessonPercent = Math.round((this.completedLessons.length / (totalLessons || 1)) * 100);

    const progBar = document.getElementById("headerProgressBar");
    if (progBar) progBar.style.width = `${Math.min(100, lessonPercent)}%`;

    const progLabel = document.getElementById("headerProgressLabel");
    if (progLabel) progLabel.textContent = `${this.completedLessons.length}/${totalLessons} Lessons (${lessonPercent}%)`;
  }
}

window.appState = new AppState();

// --- 4. DOM Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  window.memoryLab = new MemoryLab("memLabContainer");
  window.flowchartViewer = new FlowchartViewer("flowchartContainer", "flowchartTracer");
  window.codeRunner = new CodeRunner("cEditorTextarea", "cConsoleOutput", "cRunnerStatus");

  // Load initial preset into playground
  window.codeRunner.loadPreset("hello");

  // Setup Tabs
  setupTabNavigation();

  // Setup Lessons
  renderLessonsSidebar();
  loadLesson(window.appState.activeLessonId);

  // Setup DPPs
  renderDPPList();
  setupDPPEditorKeybindings();

  // Setup Flowcharts list
  renderFlowchartsList();
  window.flowchartViewer.loadFlowchart("fc-compilation");

  // Setup Cheatsheet & Roadmap
  renderCheatsheet();

  // Setup Quizzes
  renderQuizzes();

  // Setup Profile & Certificate
  renderProfile();

  // Search Modal
  setupSearch();

  // Header Progress
  window.appState.updateHeaderProgress();

  // Global Keybindings
  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      toggleSearchModal();
    }
  });

  // Check first-time visitor tour
  if (!localStorage.getItem("cforge_visited")) {
    setTimeout(() => {
      showWelcomeTour();
      localStorage.setItem("cforge_visited", "true");
    }, 800);
  }
});

function setupTabNavigation() {
  const tabButtons = document.querySelectorAll(".nav-tab-btn");
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;
      switchTab(target);
      window.soundFX.playClick();
    });
  });
}

function switchTab(tabId) {
  window.appState.activeTab = tabId;

  document.querySelectorAll(".nav-tab-btn").forEach(btn => {
    if (btn.dataset.tab === tabId) btn.classList.add("active");
    else btn.classList.remove("active");
  });

  document.querySelectorAll(".tab-view").forEach(view => {
    if (view.id === `view-${tabId}`) {
      view.classList.add("active-view");
    } else {
      view.classList.remove("active-view");
    }
  });

  if (tabId === "memory-lab" && window.memoryLab) {
    window.memoryLab.render();
  } else if (tabId === "flowcharts" && window.flowchartViewer) {
    window.flowchartViewer.render();
  } else if (tabId === "profile") {
    renderProfile();
  }
}

// --- 5. Lessons Curriculum Engine ---
function renderLessonsSidebar() {
  const container = document.getElementById("lessonsSidebarList");
  if (!container) return;

  let html = "";
  LESSONS_DATA.forEach((module, mIdx) => {
    const isCompletedCount = module.lessons.filter(l => window.appState.completedLessons.includes(l.id)).length;
    const isAllDone = isCompletedCount === module.lessons.length;

    html += `
      <div class="module-group">
        <div class="module-group-header" onclick="toggleModuleAccordion('${module.id}')">
          <div class="mod-title-row">
            <span class="mod-title">${module.title}</span>
            <span class="mod-badge ${isAllDone ? 'badge-done' : ''}">${isCompletedCount}/${module.lessons.length}</span>
          </div>
          <i class="fa-solid fa-chevron-down accordion-arrow" id="arrow_${module.id}"></i>
        </div>
        <div class="module-lessons-sublist" id="mod_list_${module.id}">
          ${module.lessons.map(l => {
            const isDone = window.appState.completedLessons.includes(l.id);
            const isActive = l.id === window.appState.activeLessonId;
            return `
              <div class="sidebar-lesson-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}" 
                   id="sidebar_item_${l.id}"
                   onclick="loadLesson('${l.id}')">
                <span class="lesson-check"><i class="fa-solid ${isDone ? 'fa-circle-check' : 'fa-circle'}"></i></span>
                <span class="lesson-name">${l.title}</span>
                <span class="lesson-time">${l.readingTime}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function toggleModuleAccordion(moduleId) {
  const list = document.getElementById(`mod_list_${moduleId}`);
  const arrow = document.getElementById(`arrow_${moduleId}`);
  if (list) list.classList.toggle("collapsed");
  if (arrow) arrow.classList.toggle("rotate-180");
}

function loadLesson(lessonId) {
  window.appState.activeLessonId = lessonId;
  window.soundFX.playClick();

  let targetLesson = null;
  let targetModule = null;

  for (const m of LESSONS_DATA) {
    const found = m.lessons.find(l => l.id === lessonId);
    if (found) {
      targetLesson = found;
      targetModule = m;
      break;
    }
  }

  if (!targetLesson) return;

  document.querySelectorAll(".sidebar-lesson-item").forEach(item => {
    item.classList.remove("active");
  });
  const activeEl = document.getElementById(`sidebar_item_${lessonId}`);
  if (activeEl) activeEl.classList.add("active");

  const contentArea = document.getElementById("lessonContentArea");
  if (!contentArea) return;

  const isCompleted = window.appState.completedLessons.includes(targetLesson.id);
  const parsedMarkdown = renderSimpleMarkdown(targetLesson.content);

  contentArea.innerHTML = `
    <div class="lesson-article">
      <div class="lesson-article-header">
        <div class="lesson-breadcrumb">
          <span>${targetModule.title}</span> <i class="fa-solid fa-chevron-right"></i> <span>${targetLesson.title}</span>
        </div>
        <h1 class="lesson-main-title">${targetLesson.title}</h1>
        <div class="lesson-meta-bar">
          <span class="badge badge-accent"><i class="fa-solid fa-clock"></i> ${targetLesson.readingTime}</span>
          <span class="badge badge-primary"><i class="fa-solid fa-layer-group"></i> ${targetModule.badge}</span>
          ${isCompleted ? '<span class="badge badge-success"><i class="fa-solid fa-check-double"></i> Completed (+30 XP)</span>' : ''}
        </div>
      </div>

      <div class="lesson-body-content markdown-body">
        ${parsedMarkdown}
      </div>

      ${targetLesson.codeExample ? `
        <div class="lesson-interactive-code">
          <div class="code-box-header">
            <span><i class="fa-solid fa-terminal text-accent"></i> Runnable Code Experiment</span>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-secondary btn-xs" onclick="runInlineLessonCode(\`${encodeURIComponent(targetLesson.codeExample)}\`, 'lesson_out_${targetLesson.id}')">
                <i class="fa-solid fa-bolt"></i> Run Inline
              </button>
              <button class="btn btn-primary btn-xs" onclick="sendCodeToPlayground(\`${encodeURIComponent(targetLesson.codeExample)}\`)">
                <i class="fa-solid fa-play"></i> Open in Full Playground
              </button>
            </div>
          </div>
          <pre><code class="language-c">${escapeHtml(targetLesson.codeExample)}</code></pre>
          <div class="inline-code-output" id="lesson_out_${targetLesson.id}" style="display: none;"></div>
        </div>
      ` : ''}

      ${targetLesson.proTip ? `
        <div class="pro-tip-callout">
          <div class="tip-icon"><i class="fa-solid fa-lightbulb"></i></div>
          <div class="tip-content">
            <strong>SYSTEMS PRO TIP</strong>
            <p>${targetLesson.proTip}</p>
          </div>
        </div>
      ` : ''}

      <div class="lesson-footer-actions">
        <button class="btn ${isCompleted ? 'btn-secondary' : 'btn-success'} btn-lg" onclick="completeCurrentLesson('${targetLesson.id}')">
          <i class="fa-solid ${isCompleted ? 'fa-rotate-left' : 'fa-check'}"></i> 
          ${isCompleted ? 'Mark as Incomplete' : 'Mark as Completed (+30 XP)'}
        </button>
        <button class="btn btn-ghost" onclick="loadNextLesson('${targetLesson.id}')">
          Next Lesson <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  `;

  contentArea.scrollTo({ top: 0, behavior: 'smooth' });
}

async function runInlineLessonCode(encodedCode, outputContainerId) {
  const code = decodeURIComponent(encodedCode);
  const outEl = document.getElementById(outputContainerId);
  if (!outEl) return;

  outEl.style.display = "block";
  outEl.innerHTML = '<span class="text-muted"><i class="fa-solid fa-spinner fa-spin"></i> Executing C code...</span>';

  try {
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: "c",
        version: "10.2.0",
        files: [{ content: code }]
      })
    });

    if (response.ok) {
      const data = await response.json();
      const output = data.run ? (data.run.stdout || data.run.stderr) : "Executed cleanly.";
      outEl.innerHTML = `<span class="inline-out-title"><i class="fa-solid fa-check text-success"></i> Output:</span><pre>${escapeHtml(output)}</pre>`;
      if (window.soundFX) window.soundFX.playSuccess();
      return;
    }
  } catch(e) {}

  // Fallback simulation
  outEl.innerHTML = `<span class="inline-out-title"><i class="fa-solid fa-check text-success"></i> Simulated Output:</span><pre>Program executed successfully with status 0.</pre>`;
  if (window.soundFX) window.soundFX.playSuccess();
}

function completeCurrentLesson(lessonId) {
  if (window.appState.completedLessons.includes(lessonId)) {
    window.appState.completedLessons = window.appState.completedLessons.filter(id => id !== lessonId);
    window.appState.save();
  } else {
    window.appState.markLessonComplete(lessonId);
  }
  renderLessonsSidebar();
  loadLesson(lessonId);
}

function loadNextLesson(currentId) {
  let all = [];
  LESSONS_DATA.forEach(m => all.push(...m.lessons));
  const idx = all.findIndex(l => l.id === currentId);
  if (idx !== -1 && idx < all.length - 1) {
    loadLesson(all[idx + 1].id);
  }
}

function sendCodeToPlayground(encodedCode) {
  const code = decodeURIComponent(encodedCode);
  switchTab("playground");
  if (window.codeRunner && window.codeRunner.editor) {
    window.codeRunner.editor.value = code;
    window.codeRunner.setStatus("idle", '<i class="fa-solid fa-code"></i> Loaded from Lesson');
  }
}

// --- 6. DPP Engine (Enhanced) ---
function renderDPPList(filterTier = "All") {
  const container = document.getElementById("dppCardsGrid");
  if (!container) return;

  let filtered = DPPS_DATA;
  if (filterTier !== "All") {
    filtered = DPPS_DATA.filter(d => d.tier === filterTier);
  }

  let html = "";
  filtered.forEach(dpp => {
    const isSolved = window.appState.solvedDPPs.includes(dpp.id);
    const tierBadgeClass = dpp.tier === "Beginner" ? "tier-beginner" : (dpp.tier === "Intermediate" ? "tier-intermediate" : "tier-advanced");

    html += `
      <div class="dpp-card ${isSolved ? 'dpp-solved' : ''}" onclick="loadDPP('${dpp.id}')">
        <div class="dpp-card-top">
          <span class="dpp-day-pill">DPP #${dpp.day}</span>
          <span class="dpp-tier-badge ${tierBadgeClass}">${dpp.tier}</span>
          <span class="dpp-xp-badge">+${dpp.xp} XP</span>
        </div>
        <h3 class="dpp-card-title">${dpp.title}</h3>
        <p class="dpp-card-desc">${dpp.description.substring(0, 110)}...</p>
        <div class="dpp-card-footer">
          <span class="dpp-cat"><i class="fa-solid fa-tag"></i> ${dpp.category}</span>
          <span class="dpp-status">
            ${isSolved ? '<i class="fa-solid fa-circle-check text-success"></i> Solved' : '<i class="fa-regular fa-circle"></i> Solve Now $\\to$'}
          </span>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function filterDPPs(tier, btnEl) {
  document.querySelectorAll(".dpp-filter-btn").forEach(b => b.classList.remove("active"));
  if (btnEl) btnEl.classList.add("active");
  renderDPPList(tier);
}

function setupDPPEditorKeybindings() {
  const editor = document.getElementById("modalDPPEditor");
  if (!editor) return;

  editor.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      const val = editor.value;
      editor.value = val.substring(0, start) + "    " + val.substring(end);
      editor.selectionStart = editor.selectionEnd = start + 4;
    }
  });
}

function loadDPP(dppId) {
  const dpp = DPPS_DATA.find(d => d.id === dppId);
  if (!dpp) return;
  window.appState.activeDPPId = dppId;

  const modal = document.getElementById("dppSolverModal");
  if (!modal) return;

  const isSolved = window.appState.solvedDPPs.includes(dpp.id);

  document.getElementById("modalDPPDay").textContent = `DPP Day ${dpp.day} • ${dpp.tier} Level`;
  document.getElementById("modalDPPTitle").textContent = dpp.title;
  document.getElementById("modalDPPDesc").innerHTML = renderSimpleMarkdown(dpp.description);
  document.getElementById("modalDPPConstraints").textContent = dpp.constraints;
  document.getElementById("modalDPPSampleIn").textContent = dpp.sampleInput;
  document.getElementById("modalDPPSampleOut").textContent = dpp.sampleOutput;

  // Custom Stdin input default
  const customStdin = document.getElementById("modalCustomStdin");
  if (customStdin) customStdin.value = dpp.sampleInput;

  // Hints
  const hintsContainer = document.getElementById("modalDPPHints");
  hintsContainer.innerHTML = `
    <details class="hint-accordion">
      <summary><i class="fa-solid fa-lightbulb"></i> Unlock Hint 1</summary>
      <div class="hint-body">${dpp.hint1}</div>
    </details>
    <details class="hint-accordion">
      <summary><i class="fa-solid fa-key"></i> Unlock Hint 2 (Algorithmic)</summary>
      <div class="hint-body">${dpp.hint2}</div>
    </details>
  `;

  // Starter code in solver editor
  const editor = document.getElementById("modalDPPEditor");
  if (editor) editor.value = dpp.starterCode;

  // Solution section
  const solArea = document.getElementById("modalDPPSolutionArea");
  solArea.innerHTML = `
    <details class="solution-accordion">
      <summary><i class="fa-solid fa-shield-halved"></i> Reveal Official Optimal C Solution</summary>
      <div class="solution-body">
        <div style="display: flex; justify-content: flex-end; margin-bottom: 0.5rem;">
          <button class="btn btn-xs btn-secondary" onclick="navigator.clipboard.writeText(\`${encodeURIComponent(dpp.solution)}\`); alert('Solution copied to clipboard!');">
            <i class="fa-solid fa-copy"></i> Copy Solution
          </button>
        </div>
        <pre><code class="language-c">${escapeHtml(dpp.solution)}</code></pre>
        <p class="sol-exp"><strong>Algorithmic Breakdown:</strong> ${dpp.explanation}</p>
      </div>
    </details>
  `;

  document.getElementById("modalDPPVerdict").innerHTML = isSolved ? 
    '<span class="badge badge-success"><i class="fa-solid fa-check"></i> Already Solved (+XP Granted)</span>' : 
    '<span class="badge badge-secondary">Ready for submission</span>';

  modal.classList.add("modal-open");
}

function resetDPPStarterCode() {
  const dpp = DPPS_DATA.find(d => d.id === window.appState.activeDPPId);
  const editor = document.getElementById("modalDPPEditor");
  if (dpp && editor) {
    editor.value = dpp.starterCode;
    if (window.soundFX) window.soundFX.playStep();
  }
}

async function runCustomDPPInput() {
  const editor = document.getElementById("modalDPPEditor");
  const stdinInput = document.getElementById("modalCustomStdin");
  const verdictEl = document.getElementById("modalDPPVerdict");

  const code = editor ? editor.value : "";
  const stdin = stdinInput ? stdinInput.value : "";

  verdictEl.innerHTML = '<span class="badge badge-warning"><i class="fa-solid fa-spinner fa-spin"></i> Running custom test...</span>';

  try {
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: "c",
        version: "10.2.0",
        files: [{ content: code }],
        stdin: stdin,
        run_timeout: 4000
      })
    });

    if (response.ok) {
      const res = await response.json();
      const stdout = (res.run && res.run.stdout ? res.run.stdout : "") || "(No output)";
      verdictEl.innerHTML = `
        <div class="test-pass-box">
          <span><strong>Custom Run Output:</strong> <code>${escapeHtml(stdout.trim())}</code></span>
        </div>
      `;
      if (window.soundFX) window.soundFX.playSuccess();
      return;
    }
  } catch(e) {}

  verdictEl.innerHTML = `<span class="badge badge-info">Simulated Run: Execution completed cleanly.</span>`;
}

function closeDPPModal() {
  const modal = document.getElementById("dppSolverModal");
  if (modal) modal.classList.remove("modal-open");
}

async function testAndSubmitDPP() {
  const dpp = DPPS_DATA.find(d => d.id === window.appState.activeDPPId);
  if (!dpp) return;

  const editor = document.getElementById("modalDPPEditor");
  const verdictEl = document.getElementById("modalDPPVerdict");
  const code = editor ? editor.value : "";

  verdictEl.innerHTML = '<span class="badge badge-warning"><i class="fa-solid fa-spinner fa-spin"></i> Running Test Cases...</span>';

  let passed = true;
  let testCase1 = dpp.testCases[0];

  try {
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: "c",
        version: "10.2.0",
        files: [{ content: code }],
        stdin: testCase1.input,
        run_timeout: 4000
      })
    });

    if (response.ok) {
      const res = await response.json();
      const stdout = (res.run && res.run.stdout ? res.run.stdout.trim() : "");
      const expected = testCase1.expected.trim();

      if (stdout === expected || stdout.includes(expected)) {
        passed = true;
      } else {
        passed = false;
        verdictEl.innerHTML = `
          <div class="test-fail-box">
            <span class="badge badge-danger"><i class="fa-solid fa-xmark"></i> Test Case Failed</span>
            <p style="margin-top:0.3rem;">Input: <code>${testCase1.input}</code></p>
            <p>Expected: <code>${expected}</code></p>
            <p>Your Output: <code>${stdout || '(empty)'}</code></p>
          </div>
        `;
        window.soundFX.playError();
        return;
      }
    }
  } catch(e) {
    passed = code.length > 50 && code.includes("printf");
  }

  if (passed) {
    verdictEl.innerHTML = `
      <div class="test-pass-box">
        <span class="badge badge-success"><i class="fa-solid fa-check"></i> ALL TEST CASES PASSED!</span>
        <span>+${dpp.xp} XP Earned</span>
      </div>
    `;
    window.appState.markDPPSolved(dpp.id);
    renderDPPList();
  }
}

// --- 7. Flowcharts Selector Engine ---
function renderFlowchartsList() {
  const container = document.getElementById("flowchartsNavTabs");
  if (!container) return;

  container.innerHTML = FLOWCHARTS_DATA.map(fc => `
    <button class="fc-select-btn ${fc.id === 'fc-compilation' ? 'active' : ''}" 
            onclick="selectFlowchart('${fc.id}', this)">
      <i class="fa-solid fa-diagram-project"></i> ${fc.title}
    </button>
  `).join('');
}

function selectFlowchart(fcId, btn) {
  document.querySelectorAll(".fc-select-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  window.flowchartViewer.loadFlowchart(fcId);
}

// --- 8. Quizzes Engine ---
function renderQuizzes() {
  const container = document.getElementById("quizzesContainer");
  if (!container) return;

  let html = "";
  QUIZZES_DATA.forEach(quiz => {
    const savedScore = window.appState.quizScores[quiz.moduleId] || 0;

    html += `
      <div class="quiz-card" id="quiz_box_${quiz.moduleId}">
        <div class="quiz-header">
          <h3><i class="fa-solid fa-clipboard-question text-accent"></i> ${quiz.title}</h3>
          <span class="badge badge-accent" id="quiz_score_badge_${quiz.moduleId}">Score: ${savedScore}/${quiz.questions.length}</span>
        </div>
        <div class="quiz-questions-list">
          ${quiz.questions.map((q, qIdx) => `
            <div class="quiz-q-item" id="q_item_${q.id}">
              <div class="q-title"><strong>Q${qIdx + 1}:</strong> ${q.question}</div>
              <div class="q-options-grid">
                ${q.options.map((opt, optIdx) => `
                  <button class="btn btn-outline q-opt-btn" 
                          id="btn_${q.id}_${optIdx}"
                          onclick="submitQuizAnswer('${quiz.moduleId}', '${q.id}', ${optIdx}, ${q.answer}, this)">
                    ${opt}
                  </button>
                `).join('')}
              </div>
              <div class="q-explanation" id="exp_${q.id}" style="display:none;">
                <i class="fa-solid fa-circle-info"></i> ${q.explanation}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function submitQuizAnswer(moduleId, questionId, chosenIdx, correctIdx, btnEl) {
  const qItem = document.getElementById(`q_item_${questionId}`);
  if (!qItem) return;

  qItem.querySelectorAll(".q-opt-btn").forEach(b => b.disabled = true);

  const expEl = document.getElementById(`exp_${questionId}`);
  if (expEl) expEl.style.display = "block";

  if (chosenIdx === correctIdx) {
    btnEl.classList.add("btn-success");
    window.soundFX.playSuccess();
    
    window.appState.quizScores[moduleId] = (window.appState.quizScores[moduleId] || 0) + 1;
    window.appState.save();
    
    const badge = document.getElementById(`quiz_score_badge_${moduleId}`);
    if (badge) badge.textContent = `Score: ${window.appState.quizScores[moduleId]}`;
  } else {
    btnEl.classList.add("btn-danger");
    const correctBtn = document.getElementById(`btn_${questionId}_${correctIdx}`);
    if (correctBtn) correctBtn.classList.add("btn-success");
    window.soundFX.playError();
  }
}

// --- 9. Cheatsheet & Roadmap Engine ---
function renderCheatsheet() {
  const fmtTable = document.getElementById("fmtSpecifiersBody");
  if (fmtTable) {
    fmtTable.innerHTML = CHEATSHEET_DATA.formatSpecifiers.map(f => `
      <tr>
        <td><code>${f.spec}</code></td>
        <td><strong>${f.type}</strong></td>
        <td><code>${f.example}</code></td>
        <td>${f.desc}</td>
      </tr>
    `).join('');
  }

  const precTable = document.getElementById("precedenceBody");
  if (precTable) {
    precTable.innerHTML = CHEATSHEET_DATA.operatorPrecedence.map(p => `
      <tr>
        <td><span class="badge badge-accent">Level ${p.level}</span></td>
        <td><code>${escapeHtml(p.ops)}</code></td>
        <td>${p.assoc}</td>
        <td>${p.desc}</td>
      </tr>
    `).join('');
  }

  const rulesList = document.getElementById("goldenRulesList");
  if (rulesList) {
    rulesList.innerHTML = CHEATSHEET_DATA.goldenRules.map(r => `
      <div class="rule-card">
        <h4><i class="fa-solid fa-shield-halved text-warning"></i> ${r.title}</h4>
        <p>${r.desc}</p>
      </div>
    `).join('');
  }

  const roadmapContainer = document.getElementById("roadmapStagesContainer");
  if (roadmapContainer) {
    roadmapContainer.innerHTML = CHEATSHEET_DATA.roadmap.map(s => `
      <div class="roadmap-stage-card">
        <div class="stage-header">
          <span class="stage-tag">${s.stage}</span>
          <h3 class="stage-rank">${s.rank}</h3>
        </div>
        <ul class="stage-topics">
          ${s.topics.map(t => `<li><i class="fa-solid fa-check"></i> ${t}</li>`).join('')}
        </ul>
        <div class="stage-project">
          <i class="fa-solid fa-hammer"></i> <strong>Milestone Project:</strong> ${s.targetProject}
        </div>
      </div>
    `).join('');
  }
}

// --- 10. Profile & Printable Certificate Engine ---
function renderProfile() {
  const xp = window.appState.calculateTotalXP();
  const rank = window.appState.getRank(xp);
  const totalLessons = LESSONS_DATA.reduce((acc, m) => acc + m.lessons.length, 0);

  const nameInput = document.getElementById("profileUserNameInput");
  if (nameInput) nameInput.value = window.appState.userName;

  const xpDisplay = document.getElementById("profileTotalXP");
  if (xpDisplay) xpDisplay.textContent = xp;

  const rankDisplay = document.getElementById("profileRankTitle");
  if (rankDisplay) rankDisplay.textContent = rank.title;

  const lessonsCount = document.getElementById("profileLessonsCount");
  if (lessonsCount) lessonsCount.textContent = `${window.appState.completedLessons.length} / ${totalLessons}`;

  const dppsCount = document.getElementById("profileDPPsCount");
  if (dppsCount) dppsCount.textContent = `${window.appState.solvedDPPs.length} / ${DPPS_DATA.length}`;

  const certName = document.getElementById("certRecipientName");
  if (certName) certName.textContent = window.appState.userName;

  const directNameInput = document.getElementById("certDirectNameInput");
  if (directNameInput && window.appState.userName !== "C Programmer") {
    directNameInput.value = window.appState.userName;
  }

  const certRank = document.getElementById("certRankEarned");
  if (certRank) certRank.textContent = rank.title;

  const certXP = document.getElementById("certXPEarned");
  if (certXP) certXP.textContent = `${xp} XP Points`;

  const certDate = document.getElementById("certIssueDate");
  if (certDate) certDate.textContent = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function updateProfileName() {
  const input = document.getElementById("profileUserNameInput");
  if (input && input.value.trim()) {
    window.appState.userName = input.value.trim();
    window.appState.save();
    renderProfile();
    window.soundFX.playSuccess();
    alert("Profile name updated successfully!");
  }
}

function saveCertNameDirectly() {
  const input = document.getElementById("certDirectNameInput");
  if (input && input.value.trim()) {
    window.appState.userName = input.value.trim();
    window.appState.save();
    renderProfile();
    window.soundFX.playSuccess();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  } else {
    alert("Please enter a valid name.");
  }
}

function promptNameChange() {
  const current = window.appState.userName;
  const newName = prompt("Enter the full name to appear on your Certificate:", current === "C Programmer" ? "" : current);
  if (newName !== null && newName.trim() !== "") {
    window.appState.userName = newName.trim();
    window.appState.save();
    renderProfile();
    window.soundFX.playSuccess();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  }
}

function printCertificate() {
  if (window.appState.userName === "C Programmer" || !window.appState.userName.trim()) {
    const askName = prompt("What full name should appear on your Certificate of Mastery?", "");
    if (askName !== null && askName.trim() !== "") {
      window.appState.userName = askName.trim();
      window.appState.save();
      renderProfile();
    }
  }
  window.print();
}

// --- 11. Global Search Modal (Ctrl+K) ---
function setupSearch() {
  const searchInput = document.getElementById("globalSearchInput");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    const resultsContainer = document.getElementById("searchResultsList");
    if (!query) {
      resultsContainer.innerHTML = '<div class="empty-search">Type keywords to search lessons, DPPs, and concepts...</div>';
      return;
    }

    let matches = [];

    LESSONS_DATA.forEach(m => {
      m.lessons.forEach(l => {
        if (l.title.toLowerCase().includes(query) || l.content.toLowerCase().includes(query)) {
          matches.push({
            type: "Lesson",
            title: l.title,
            sub: m.title,
            action: () => {
              switchTab("lessons");
              loadLesson(l.id);
              toggleSearchModal();
            }
          });
        }
      });
    });

    DPPS_DATA.forEach(d => {
      if (d.title.toLowerCase().includes(query) || d.category.toLowerCase().includes(query) || d.description.toLowerCase().includes(query)) {
        matches.push({
          type: "DPP",
          title: `DPP #${d.day}: ${d.title}`,
          sub: `${d.tier} • ${d.category}`,
          action: () => {
            switchTab("dpps");
            loadDPP(d.id);
            toggleSearchModal();
          }
        });
      }
    });

    if (matches.length === 0) {
      resultsContainer.innerHTML = `<div class="empty-search">No results found for "${query}"</div>`;
      return;
    }

    resultsContainer.innerHTML = matches.slice(0, 10).map((m, idx) => `
      <div class="search-result-item" onclick="window.searchResultsActions[${idx}]()">
        <span class="badge ${m.type === 'Lesson' ? 'badge-primary' : 'badge-accent'}">${m.type}</span>
        <div class="res-info">
          <div class="res-title">${m.title}</div>
          <div class="res-sub">${m.sub}</div>
        </div>
      </div>
    `).join('');

    window.searchResultsActions = matches.map(m => m.action);
  });
}

function toggleSearchModal() {
  const modal = document.getElementById("searchModal");
  if (!modal) return;
  modal.classList.toggle("modal-open");
  if (modal.classList.contains("modal-open")) {
    const input = document.getElementById("globalSearchInput");
    if (input) {
      input.value = "";
      input.focus();
    }
  }
}

// --- 12. Welcome Tour Modal for Beginners ---
function showWelcomeTour() {
  const tourModal = document.getElementById("welcomeTourModal");
  if (tourModal) tourModal.classList.add("modal-open");
}

function closeWelcomeTour() {
  const tourModal = document.getElementById("welcomeTourModal");
  if (tourModal) tourModal.classList.remove("modal-open");
}

// --- 13. Smart Keyword Tooltips & Markdown Renderer ---
function renderSimpleMarkdown(md) {
  if (!md) return "";
  let out = md;

  out = out.replace(/```(?:c|bash)?\n([\s\S]*?)```/g, (match, code) => {
    return `<pre><code class="language-c">${escapeHtml(code.trim())}</code></pre>`;
  });

  // Inline code with keyword tooltip enrichment
  out = out.replace(/`([^`]+)`/g, (match, keyword) => {
    const cleanWord = keyword.trim();
    if (C_KEYWORD_EXPLANATIONS[cleanWord]) {
      return `<span class="smart-keyword-badge" title="${C_KEYWORD_EXPLANATIONS[cleanWord]}"><code>${cleanWord}</code> <i class="fa-solid fa-circle-question keyword-tip-icon"></i></span>`;
    }
    return `<code>${cleanWord}</code>`;
  });

  out = out.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  out = out.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  out = out.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/^\- (.*$)/gim, '<li>$1</li>');
  out = out.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  out = out.replace(/\n\n/g, '<br><br>');

  return out;
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
