# ⚡ C-Forge: Zero to Pro C Academy

**C-Forge** is an interactive, modern platform designed to take learners from absolute beginner to pro systems programmer in the C language. It demystifies low-level memory, hardware architecture, pointers, and data structures through visual diagrams, step-by-step execution flowcharts, an interactive RAM sandbox, and hands-on practice problems.

---

## 🌟 Key Features

### 1. 📖 10-Module Comprehensive Curriculum (Beginner to Pro)
- **Module 1**: Genesis & Architecture (Machine model, Preprocessor -> Compiler -> Assembler -> Linker, Hello World dissected)
- **Module 2**: Data Types, Memory & Bits (Byte sizes, Two's complement, bitwise hacks, format specifiers)
- **Module 3**: Control Flow & Logic (Short-circuit evaluation, switch jump-tables, loop mechanics)
- **Module 4**: Functions & Call Stack (Stack frames, activation records, pass-by-value, recursion depth)
- **Module 5**: Arrays & Strings (Contiguous memory, row-major order, null-termination, bounds)
- **Module 6**: Pointers Demystified (Memory addresses, `&` and `*`, pointer arithmetic, `void*`, double pointers `**`, function pointers)
- **Module 7**: Dynamic Memory Management (Stack vs Heap, `malloc`, `calloc`, `realloc`, `free`, memory leaks, dangling pointers, double free)
- **Module 8**: Structs, Unions & Alignment (Structure padding, byte packing `#pragma pack`, unions, bitfields)
- **Module 9**: File I/O & Metaprogramming (File streams, binary I/O, macro pitfalls, header guards)
- **Module 10**: Advanced Systems & Pro C (Pure C Linked Lists, BSTs, Valgrind, AddressSanitizer, Undefined Behavior catalog, `volatile`)

### 2. 🏆 30 Daily Practice Problems (DPPs)
- Divided into 3 Tiers:
  - **Beginner** (Fundamentals): Arithmetic converters, bitwise parity, palindrome checker, prime sieve, Pascal's triangle.
  - **Intermediate** (Core Systems): Pointer slice summation, dynamic string reallocation, struct alignment optimizer, generic QuickSort with comparator callbacks.
  - **Advanced** (Pro & Systems): Singly linked list with tail tracking, generic `void*` stack, binary hex dumper, arena bump allocator, binary search tree.
- Progressive Hint System (Hint 1 & Hint 2).
- In-browser Code Tester with instant test case evaluation.
- Full optimal C solutions with algorithmic breakdowns.

### 3. 🗺️ Interactive Flowcharts & Execution Tracing
- High-fidelity visual flowcharts for:
  - C 4-Stage Compilation Pipeline
  - For-Loop Lifecycle State Machine
  - Pointer Addressing & Dereferencing Flow
  - Dynamic Memory (`malloc` / `free`) Lifecycle
- Step-by-step tracer with **Previous**, **Next**, **Auto-Play**, and synchronized code state inspector.

### 4. 🔬 Memory Lab (RAM & Pointer Sandbox)
- Visual simulation of RAM byte addresses (e.g. `0x7FFE20`, `0x55A010`).
- Direct visualization of Call Stack frames vs Heap memory pool.
- Animated pointer arrows pointing to exact physical memory locations.
- Interactive Traps: Simulate `free()` to inspect a **Dangling Pointer** in real time!
- Interactive scenarios: Swap Problem (Pass-by-value vs reference), Pointer Arithmetic (`p + 1`), Double Pointers (`**pp`).

### 5. 💻 C Code Playground & Online Compiler
- In-browser code editor with pre-loaded presets.
- Dual execution:
  - **Cloud GCC Compiler**: Real GCC compilation via public Piston API.
  - **Client-Side C Simulator**: Offline-ready execution fallback.
- Standard input (`stdin`) support for interactive programs.

### 6. 🧠 Module Quizzes & Brain Teasers
- Tricky C output prediction questions, pointer subtleties, and operator precedence traps.
- Real-time score tracking and detailed explanations.

### 7. 📜 Systems Roadmap & Certificate of Mastery
- Systems Programmer 5-Stage Roadmap (C Apprentice -> C Developer -> Systems Engineer -> Systems Architect -> Kernel Hacker).
- Format Specifiers & Operator Precedence Cheat Sheets.
- The 10 Golden Rules of C Memory Management.
- Dynamic printable **Certificate of C Systems Mastery** personalized with the student's name, earned rank, and XP!

---

## 🚀 Getting Started

### Option 1: Run with Node.js Server
\`\`\`bash
node server.js
\`\`\`
Visit **http://localhost:3000** in your browser.

### Option 2: Open Directly (Static Mode)
Simply double-click `index.html` or open it in any browser (Chrome, Firefox, Edge, Safari). No external dependencies required!
