// C-Forge: Interactive C Code Runner & Online Compiler (Enhanced)
// Real GCC Online via Piston API + Instant Client-Side Simulator + Tab Indentation + Ctrl+Enter Run + Download .c.

const C_CODE_PRESETS = {
  hello: {
    title: "1. Hello Systems World",
    code: `// C-Forge: Genesis Program
#include <stdio.h>

int main(void) {
    printf("======================================\\n");
    printf("  Hello, C-Forge Systems Programmer!  \\n");
    printf("======================================\\n");
    printf("Byte sizes on this system:\\n");
    printf("  char:   %zu byte\\n", sizeof(char));
    printf("  int:    %zu bytes\\n", sizeof(int));
    printf("  double: %zu bytes\\n", sizeof(double));
    printf("  void*:  %zu bytes (Pointer)\\n", sizeof(void*));
    return 0;
}`
  },
  pointer_swap: {
    title: "2. Pointer Swapper & Memory Hex Dump",
    code: `#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main(void) {
    int x = 42, y = 99;
    printf("Before Swap:\\n");
    printf("  x = %d (Address: %p)\\n", x, (void*)&x);
    printf("  y = %d (Address: %p)\\n", y, (void*)&y);

    swap(&x, &y);

    printf("\\nAfter Swap:\\n");
    printf("  x = %d (New value!)\\n", x);
    printf("  y = %d (New value!)\\n", y);
    return 0;
}`
  },
  dynamic_array: {
    title: "3. Dynamic Memory (malloc & realloc)",
    code: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    // Allocate 3 integers on Heap
    int *arr = malloc(3 * sizeof(int));
    if (!arr) return 1;

    arr[0] = 10; arr[1] = 20; arr[2] = 30;
    printf("Initial Heap Allocation (3 elements):\\n");
    for (int i = 0; i < 3; i++) printf("  arr[%d] = %d\\n", i, arr[i]);

    // Expand array dynamically to 5 elements
    int *expanded = realloc(arr, 5 * sizeof(int));
    if (!expanded) { free(arr); return 1; }
    arr = expanded;

    arr[3] = 40; arr[4] = 50;
    printf("\\nAfter realloc (5 elements):\\n");
    for (int i = 0; i < 5; i++) printf("  arr[%d] = %d\\n", i, arr[i]);

    // Clean up heap memory
    free(arr);
    arr = NULL;
    printf("\\nMemory safely released with free(). arr set to NULL.\\n");
    return 0;
}`
  },
  linked_list: {
    title: "4. Singly Linked List Data Structure",
    code: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node *next;
} Node;

void push_front(Node **head, int val) {
    Node *n = malloc(sizeof(Node));
    n->data = val;
    n->next = *head;
    *head = n;
}

void print_list(const Node *head) {
    printf("Linked List: ");
    while (head != NULL) {
        printf("[%d] -> ", head->data);
        head = head->next;
    }
    printf("NULL\\n");
}

void free_all(Node *head) {
    while (head != NULL) {
        Node *temp = head->next;
        free(head);
        head = temp;
    }
}

int main(void) {
    Node *head = NULL;
    push_front(&head, 300);
    push_front(&head, 200);
    push_front(&head, 100);

    print_list(head);
    free_all(head);
    printf("List memory fully deallocated.\\n");
    return 0;
}`
  },
  bitwise: {
    title: "5. Bitwise Hacks & Power of 2",
    code: `#include <stdio.h>

void show_bits(unsigned int n) {
    for (int i = 15; i >= 0; i--) {
        printf("%d", (n >> i) & 1);
        if (i % 4 == 0) printf(" ");
    }
    printf("\\n");
}

int main(void) {
    unsigned int x = 16;
    printf("Binary representation of %u:\\n  ", x);
    show_bits(x);

    // Power of 2 test: (x > 0) && ((x & (x - 1)) == 0)
    int is_pow2 = (x > 0) && ((x & (x - 1)) == 0);
    printf("Is %u a power of 2? %s\\n", x, is_pow2 ? "YES" : "NO");

    // Fast Multiply and Divide via shifts:
    printf("16 << 2 (Multiply by 4): %u\\n", x << 2);
    printf("16 >> 2 (Divide by 4):   %u\\n", x >> 2);
    return 0;
}`
  }
};

class CodeRunner {
  constructor(editorId, outputId, statusId) {
    this.editor = document.getElementById(editorId);
    this.output = document.getElementById(outputId);
    this.status = document.getElementById(statusId);
    this.stdinInput = document.getElementById("stdinInput");
    this.fontSize = 14;

    this.setupEditorKeybindings();
  }

  setupEditorKeybindings() {
    if (!this.editor) return;

    this.editor.addEventListener("keydown", (e) => {
      // Ctrl+Enter or Cmd+Enter to Run
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        this.runCode();
        return;
      }

      // Tab key indent
      if (e.key === "Tab") {
        e.preventDefault();
        const start = this.editor.selectionStart;
        const end = this.editor.selectionEnd;
        const val = this.editor.value;

        // Insert 4 spaces
        this.editor.value = val.substring(0, start) + "    " + val.substring(end);
        this.editor.selectionStart = this.editor.selectionEnd = start + 4;
      }
    });

    // Update lines and character counter
    this.editor.addEventListener("input", () => {
      this.updateStats();
    });
  }

  updateStats() {
    if (!this.editor) return;
    const lines = this.editor.value.split("\n").length;
    const chars = this.editor.value.length;
    const statsEl = document.getElementById("editorStats");
    if (statsEl) {
      statsEl.textContent = `Lines: ${lines} | Chars: ${chars}`;
    }
  }

  adjustFontSize(delta) {
    this.fontSize = Math.max(11, Math.min(22, this.fontSize + delta));
    if (this.editor) this.editor.style.fontSize = `${this.fontSize}px`;
    if (this.output) this.output.style.fontSize = `${this.fontSize}px`;
  }

  downloadCode() {
    if (!this.editor) return;
    const blob = new Blob([this.editor.value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cforge_program.c";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (window.soundFX) window.soundFX.playSuccess();
  }

  loadPreset(key) {
    const preset = C_CODE_PRESETS[key];
    if (preset && this.editor) {
      this.editor.value = preset.code;
      this.updateStats();
      if (this.output) {
        this.output.textContent = `// Loaded: ${preset.title}\n// Press [Ctrl + Enter] or click [Run Code] to compile and execute.`;
      }
      if (this.status) {
        this.status.innerHTML = `<span class="badge badge-info">Preset: ${preset.title}</span>`;
      }
    }
  }

  async runCode() {
    if (!this.editor || !this.output) return;
    const code = this.editor.value;
    const stdin = this.stdinInput ? this.stdinInput.value : "";

    this.setStatus("compiling", '<i class="fa-solid fa-spinner fa-spin"></i> Compiling with GCC...');
    this.output.textContent = "Compiling and executing program...\n";

    const startTime = performance.now();

    // First attempt: Piston Public API (Real GCC 10/12/14)
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
        const result = await response.json();
        const duration = Math.round(performance.now() - startTime);

        if (result.run) {
          const stdout = result.run.stdout || "";
          const stderr = result.run.stderr || "";
          const exitCode = result.run.code;

          let display = "";
          if (stdout) display += stdout;
          if (stderr) display += "\n[Compiler / Runtime Output]:\n" + stderr;
          if (!stdout && !stderr) display = "(Program executed cleanly with no stdout output)";

          this.output.textContent = display;

          if (exitCode === 0) {
            this.setStatus("success", `<i class="fa-solid fa-check"></i> Executed in ${duration}ms (GCC 10.2 | Exit: 0)`);
            if (window.soundFX && window.soundFX.playSuccess) window.soundFX.playSuccess();
          } else {
            this.setStatus("error", `<i class="fa-solid fa-triangle-exclamation"></i> Exit Code: ${exitCode} (${duration}ms)`);
            if (window.soundFX && window.soundFX.playError) window.soundFX.playError();
          }
          return;
        }
      }
    } catch (err) {
      console.warn("External compiler API unreachable, falling back to client simulator.", err);
    }

    // Fallback: Client-Side C Simulation Engine
    this.runClientSimulator(code, stdin);
  }

  runClientSimulator(code, stdin) {
    const startTime = performance.now();
    let logs = [];

    try {
      logs.push("⚙️ Running via C-Forge In-Browser C Simulator");
      logs.push("--------------------------------------------------");

      const printfRegex = /printf\s*\(\s*"([^"\\]*(?:\\.[^"\\]*)*)"\s*(?:,\s*([^)]+))?\s*\)\s*;/g;
      let match;
      let printCount = 0;

      const vars = {};
      const intVarRegex = /int\s+([a-zA-Z_]\w*)\s*=\s*([^;]+);/g;
      let vMatch;
      while ((vMatch = intVarRegex.exec(code)) !== null) {
        try {
          vars[vMatch[1]] = eval(vMatch[2]);
        } catch(e) {}
      }

      while ((match = printfRegex.exec(code)) !== null) {
        printCount++;
        let formatStr = match[1];
        let args = match[2] ? match[2].split(',').map(s => s.trim()) : [];

        formatStr = formatStr.replace(/\\n/g, "\n").replace(/\\t/g, "\t");

        args.forEach(arg => {
          let val = arg;
          if (arg.includes("sizeof")) {
            if (arg.includes("char")) val = 1;
            else if (arg.includes("int")) val = 4;
            else if (arg.includes("double") || arg.includes("long long") || arg.includes("*")) val = 8;
            else val = 4;
          } else if (arg.startsWith("&") || arg.startsWith("(void*)&")) {
            val = "0x7FFE" + Math.floor(1000 + Math.random()*8000).toString(16).toUpperCase();
          } else if (vars[arg] !== undefined) {
            val = vars[arg];
          }

          if (formatStr.includes("%zu")) formatStr = formatStr.replace("%zu", val);
          else if (formatStr.includes("%d")) formatStr = formatStr.replace("%d", val);
          else if (formatStr.includes("%u")) formatStr = formatStr.replace("%u", val);
          else if (formatStr.includes("%p")) formatStr = formatStr.replace("%p", val);
          else if (formatStr.includes("%s")) formatStr = formatStr.replace("%s", val);
          else if (formatStr.includes("%.2f")) formatStr = formatStr.replace("%.2f", Number(val).toFixed(2));
          else if (formatStr.includes("%f")) formatStr = formatStr.replace("%f", Number(val).toFixed(6));
        });

        logs.push(formatStr);
      }

      if (printCount === 0) {
        logs.push("Code analyzed. Program returned 0.");
      }

      logs.push("--------------------------------------------------");
      logs.push("Process exited with code 0");

      const duration = Math.round(performance.now() - startTime);
      this.output.textContent = logs.join('\n');
      this.setStatus("success", `<i class="fa-solid fa-check"></i> Simulated in ${duration}ms (In-Browser C Engine)`);
      if (window.soundFX && window.soundFX.playSuccess) window.soundFX.playSuccess();

    } catch (simError) {
      this.output.textContent = "Simulation Error:\n" + simError.message;
      this.setStatus("error", `<i class="fa-solid fa-circle-xmark"></i> Simulation Error`);
    }
  }

  setStatus(type, html) {
    if (!this.status) return;
    this.status.className = "runner-status-pill status-" + type;
    this.status.innerHTML = html;
  }

  clearConsole() {
    if (this.output) this.output.textContent = "// Terminal output cleared.";
    this.setStatus("idle", '<i class="fa-solid fa-terminal"></i> Ready');
  }

  copyCode() {
    if (!this.editor) return;
    navigator.clipboard.writeText(this.editor.value);
    const btn = document.getElementById("btnCopyCode");
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
      setTimeout(() => { btn.innerHTML = orig; }, 2000);
    }
  }
}

window.CodeRunner = CodeRunner;
