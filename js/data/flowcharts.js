// C-Forge: Flowcharts & Visual Tracing Database
// Interactive flowcharts with node coordinates, descriptions, and step-by-step trace sequences.

const FLOWCHARTS_DATA = [
  {
    id: "fc-compilation",
    title: "1. The 4 Stages of C Compilation",
    subtitle: "From human-readable C source code to CPU executable binary",
    category: "Architecture",
    nodes: [
      { id: "start", type: "terminal", label: "Source Code (main.c)", desc: "Programmer writes human-readable C code with comments and #include headers." },
      { id: "prep", type: "process", label: "1. Preprocessor (cpp)", desc: "Expands macros, includes header file contents directly, strips out comments. Produces main.i (Translation Unit)." },
      { id: "comp", type: "process", label: "2. Compiler (cc1)", desc: "Parses syntax tree, performs optimization, and translates C into target CPU Assembly code (main.s)." },
      { id: "asmb", type: "process", label: "3. Assembler (as)", desc: "Converts assembly instructions into binary machine opcode (0s and 1s) to produce relocatable object file (main.o)." },
      { id: "link", type: "process", label: "4. Linker (ld)", desc: "Resolves function symbols (e.g. printf in libc.so) and merges multiple object files into final executable binary." },
      { id: "end", type: "terminal", label: "Executable (a.out / a.exe)", desc: "Ready for OS kernel loader (execve) to map into RAM and jump to entry point." }
    ],
    connections: [
      { from: "start", to: "prep", label: "gcc -E" },
      { from: "prep", to: "comp", label: "gcc -S" },
      { from: "comp", to: "asmb", label: "gcc -c" },
      { from: "asmb", to: "link", label: "gcc main.o" },
      { from: "link", to: "end", label: "Ready to run" }
    ],
    steps: [
      {
        stepNumber: 1,
        activeNode: "start",
        title: "Writing Source Code",
        explanation: "You write `main.c` in an editor. It contains `#include <stdio.h>` and functions.",
        codeSnippet: `#include <stdio.h>\n#define MAX 100\n\nint main(void) {\n    printf("Max = %d\\n", MAX);\n    return 0;\n}`,
        status: "File saved on disk: main.c"
      },
      {
        stepNumber: 2,
        activeNode: "prep",
        title: "Stage 1: Preprocessing (cpp)",
        explanation: "The preprocessor reads `#` directives. It replaces `#include <stdio.h>` with ~800 lines of standard header declarations, replaces `MAX` with `100`, and removes comments.",
        codeSnippet: `// main.i (Preprocessed)\nextern int printf (const char *__restrict __format, ...);\n\nint main(void) {\n    printf("Max = %d\\n", 100);\n    return 0;\n}`,
        status: "Command: gcc -E main.c -o main.i"
      },
      {
        stepNumber: 3,
        activeNode: "comp",
        title: "Stage 2: Compilation to Assembly (cc1)",
        explanation: "The compiler converts the preprocessed code into assembly instructions specific to your CPU architecture (x86_64 or ARM64).",
        codeSnippet: `.section .rodata\n.LC0:   .string "Max = %d\\n"\n.text\nmain:\n        pushq   %rbp\n        movq    %rsp, %rbp\n        movl    $100, %esi\n        leaq    .LC0(%rip), %rdi\n        call    printf`,
        status: "Command: gcc -S main.i -o main.s"
      },
      {
        stepNumber: 4,
        activeNode: "asmb",
        title: "Stage 3: Assembly to Machine Code (as)",
        explanation: "The assembler turns CPU assembly mnemonics into raw binary opcode instructions. This produces `main.o`.",
        codeSnippet: `Hex dump of main.o:\n7f 45 4c 46 02 01 01 00 (ELF Header)\n55 48 89 e5 be 64 00 00 (x86 machine opcodes)`,
        status: "Command: gcc -c main.s -o main.o"
      },
      {
        stepNumber: 5,
        activeNode: "link",
        title: "Stage 4: Linking (ld)",
        explanation: "The linker connects your object file with the C standard library (`libc`). It fills in the exact virtual address for external symbols like `printf`.",
        codeSnippet: `Linking main.o + /lib/x86_64-linux-gnu/libc.so.6 -> ./program`,
        status: "Command: gcc main.o -o program"
      },
      {
        stepNumber: 6,
        activeNode: "end",
        title: "Final Binary Ready",
        explanation: "The operating system loader reads the binary format (ELF on Linux, PE on Windows), maps memory pages, and invokes `main()`.",
        codeSnippet: `./program\nOutput: Max = 100`,
        status: "Process exited with status 0"
      }
    ]
  },
  {
    id: "fc-forloop",
    title: "2. The Lifecycle of a For-Loop",
    subtitle: "Step-by-step state machine of loop initialization, condition, body, and increment",
    category: "Control Flow",
    nodes: [
      { id: "init", type: "process", label: "1. Initialization (i = 0)", desc: "Executed exactly once before entering loop." },
      { id: "cond", type: "decision", label: "2. Condition Check (i < 3)", desc: "Evaluates boolean expression. If true -> Body. If false -> Terminate." },
      { id: "body", type: "process", label: "3. Loop Body { printf(...) }", desc: "Executes statements inside the loop block." },
      { id: "step", type: "process", label: "4. Step / Increment (i++)", desc: "Increments or mutates loop index, then jumps back to Condition." },
      { id: "exit", type: "terminal", label: "5. Exit Loop", desc: "Execution resumes after the closing brace." }
    ],
    connections: [
      { from: "init", to: "cond", label: "Once" },
      { from: "cond", to: "body", label: "True (!= 0)" },
      { from: "cond", to: "exit", label: "False (0)" },
      { from: "body", to: "step", label: "Next" },
      { from: "step", to: "cond", label: "Repeat" }
    ],
    steps: [
      {
        stepNumber: 1,
        activeNode: "init",
        title: "Initialization Phase",
        explanation: "Variable `i` is created in the stack frame and initialized to 0. This runs only once.",
        codeSnippet: `for (int i = 0; i < 3; i++) {\n    printf("i = %d\\n", i);\n}`,
        status: "Register state: i = 0"
      },
      {
        stepNumber: 2,
        activeNode: "cond",
        title: "Condition Check: Iteration 1",
        explanation: "Condition `0 < 3` evaluates to TRUE (1). Proceed to loop body.",
        codeSnippet: `Condition: (0 < 3) -> TRUE`,
        status: "i = 0 | Branch taken: True"
      },
      {
        stepNumber: 3,
        activeNode: "body",
        title: "Executing Body: Iteration 1",
        explanation: "printf executes with i = 0.",
        codeSnippet: `Output printed: "i = 0"`,
        status: "Stdout: i = 0"
      },
      {
        stepNumber: 4,
        activeNode: "step",
        title: "Step Increment: Iteration 1",
        explanation: "i++ increments variable `i` from 0 to 1. Jump back to Condition check.",
        codeSnippet: `i++ -> i becomes 1`,
        status: "Register state: i = 1"
      },
      {
        stepNumber: 5,
        activeNode: "cond",
        title: "Condition Check: Iteration 2",
        explanation: "Condition `1 < 3` evaluates to TRUE (1). Proceed to loop body.",
        codeSnippet: `Condition: (1 < 3) -> TRUE`,
        status: "i = 1 | Branch taken: True"
      },
      {
        stepNumber: 6,
        activeNode: "body",
        title: "Executing Body: Iteration 2",
        explanation: "printf executes with i = 1.",
        codeSnippet: `Output printed: "i = 1"`,
        status: "Stdout: i = 1"
      },
      {
        stepNumber: 7,
        activeNode: "step",
        title: "Step Increment: Iteration 2",
        explanation: "i++ increments variable `i` from 1 to 2.",
        codeSnippet: `i++ -> i becomes 2`,
        status: "Register state: i = 2"
      },
      {
        stepNumber: 8,
        activeNode: "cond",
        title: "Condition Check: Iteration 3",
        explanation: "Condition `2 < 3` evaluates to TRUE. Loop body runs.",
        codeSnippet: `Condition: (2 < 3) -> TRUE`,
        status: "i = 2 | Branch taken: True"
      },
      {
        stepNumber: 9,
        activeNode: "body",
        title: "Executing Body: Iteration 3",
        explanation: "printf executes with i = 2.",
        codeSnippet: `Output printed: "i = 2"`,
        status: "Stdout: i = 2"
      },
      {
        stepNumber: 10,
        activeNode: "step",
        title: "Step Increment: Final",
        explanation: "i++ increments `i` from 2 to 3.",
        codeSnippet: `i++ -> i becomes 3`,
        status: "Register state: i = 3"
      },
      {
        stepNumber: 11,
        activeNode: "cond",
        title: "Condition Evaluates to FALSE",
        explanation: "Condition `3 < 3` is FALSE (0). The loop terminates immediately!",
        codeSnippet: `Condition: (3 < 3) -> FALSE (0)`,
        status: "Loop terminated"
      },
      {
        stepNumber: 12,
        activeNode: "exit",
        title: "Loop Exit",
        explanation: "Control jumps out of the loop block. In C99, `i` goes out of scope.",
        codeSnippet: `// Execution resumes after loop`,
        status: "Ready for next instruction"
      }
    ]
  },
  {
    id: "fc-pointer-deref",
    title: "3. Pointer Addressing & Dereferencing Flow",
    subtitle: "Visualizing the link between variable RAM addresses and the * and & operators",
    category: "Pointers & Memory",
    nodes: [
      { id: "var_alloc", type: "process", label: "int x = 42;", desc: "OS allocates 4 bytes on stack at address 0x7FFE10. Value 42 is stored." },
      { id: "addr_op", type: "process", label: "int *p = &x;", desc: "Address-of operator (&) extracts address 0x7FFE10 and stores it in pointer variable p." },
      { id: "deref_read", type: "process", label: "int y = *p;", desc: "Dereference operator (*) inspects address in p (0x7FFE10) and fetches value 42." },
      { id: "deref_write", type: "process", label: "*p = 99;", desc: "Dereference write: traverses to address 0x7FFE10 and mutates original variable x to 99." },
      { id: "verify", type: "terminal", label: "printf(\"x = %d\", x);", desc: "x is now 99 without directly writing x = 99!" }
    ],
    connections: [
      { from: "var_alloc", to: "addr_op", label: "&x produces 0x7FFE10" },
      { from: "addr_op", to: "deref_read", label: "*p reads 42" },
      { from: "deref_read", to: "deref_write", label: "*p = 99 writes" },
      { from: "deref_write", to: "verify", label: "x mutated" }
    ],
    steps: [
      {
        stepNumber: 1,
        activeNode: "var_alloc",
        title: "Step 1: Allocation of Variable 'x'",
        explanation: "Stack pointer moves to make room for `int x`. Suppose RAM address is `0x7FFE10`. Value `42` is written into those 4 bytes.",
        codeSnippet: `int x = 42;`,
        status: "RAM[0x7FFE10] = 42"
      },
      {
        stepNumber: 2,
        activeNode: "addr_op",
        title: "Step 2: Pointer Assignment with '&'",
        explanation: "Pointer `p` is allocated (8 bytes on 64-bit systems). The address of `x` (`0x7FFE10`) is stored inside `p`.",
        codeSnippet: `int *p = &x; // p now holds 0x7FFE10`,
        status: "RAM[0x7FFE18] (pointer p) = 0x7FFE10"
      },
      {
        stepNumber: 3,
        activeNode: "deref_read",
        title: "Step 3: Dereferencing to Read (*p)",
        explanation: "The CPU looks at `p`, sees `0x7FFE10`, jumps to that RAM address, and reads the 4 bytes. Value is 42.",
        codeSnippet: `int y = *p; // y gets 42`,
        status: "y = 42"
      },
      {
        stepNumber: 4,
        activeNode: "deref_write",
        title: "Step 4: Dereferencing to Write (*p = 99)",
        explanation: "The CPU takes value 99 and writes it directly into the memory location pointed to by `p` (`0x7FFE10`). This mutates `x`!",
        codeSnippet: `*p = 99; // Modifies memory at 0x7FFE10`,
        status: "RAM[0x7FFE10] is now 99!"
      },
      {
        stepNumber: 5,
        activeNode: "verify",
        title: "Step 5: Verifying Mutation",
        explanation: "When you read `x`, it is now 99. Pointers allow remote mutation of variables across scopes!",
        codeSnippet: `printf("x = %d\\n", x); // Prints 99`,
        status: "Output: x = 99"
      }
    ]
  },
  {
    id: "fc-heap-lifecycle",
    title: "4. Dynamic Memory (malloc / free) Lifecycle",
    subtitle: "From heap reservation and NULL checks to usage and leak prevention",
    category: "Memory Management",
    nodes: [
      { id: "call_malloc", type: "process", label: "int *p = malloc(sizeof(int));", desc: "Requests heap manager to carve out 4 bytes from heap memory pool." },
      { id: "null_check", type: "decision", label: "if (p == NULL)?", desc: "Crucial defensive check! Did the OS successfully allocate memory?" },
      { id: "oom_fail", type: "terminal", label: "Handle OOM & Exit", desc: "Memory exhausted. Log error and return error code." },
      { id: "use_mem", type: "process", label: "*p = 100; // Use memory", desc: "Safe to read and write to the allocated heap block." },
      { id: "call_free", type: "process", label: "free(p);", desc: "Release block back to heap manager free-list." },
      { id: "nullify", type: "terminal", label: "p = NULL;", desc: "Neuters dangling pointer so accidental dereference triggers immediate known segfault rather than silent corruption." }
    ],
    connections: [
      { from: "call_malloc", to: "null_check", label: "Returns pointer or NULL" },
      { from: "null_check", to: "oom_fail", label: "p == NULL (OOM)" },
      { from: "null_check", to: "use_mem", label: "p != NULL (Success)" },
      { from: "use_mem", to: "call_free", label: "Done with data" },
      { from: "call_free", to: "nullify", label: "Prevent dangling" }
    ],
    steps: [
      {
        stepNumber: 1,
        activeNode: "call_malloc",
        title: "Step 1: Invoking malloc()",
        explanation: "malloc asks the system allocator for a heap chunk. The allocator traverses the free-list (bins) to find an available block.",
        codeSnippet: `int *p = malloc(sizeof(int));`,
        status: "Heap chunk requested: 4 bytes"
      },
      {
        stepNumber: 2,
        activeNode: "null_check",
        title: "Step 2: Mandatory NULL Check",
        explanation: "Always check if allocation succeeded. If RAM is exhausted, malloc returns NULL. Dereferencing NULL causes an instant crash.",
        codeSnippet: `if (p == NULL) {\n    perror("malloc failed");\n    exit(EXIT_FAILURE);\n}`,
        status: "Check: p != NULL (Allocation valid at 0x55A010)"
      },
      {
        stepNumber: 3,
        activeNode: "use_mem",
        title: "Step 3: Utilizing Heap Memory",
        explanation: "Write and read data via pointer dereference.",
        codeSnippet: `*p = 100;\nprintf("Value = %d\\n", *p);`,
        status: "Heap memory holding value 100"
      },
      {
        stepNumber: 4,
        activeNode: "call_free",
        title: "Step 4: Releasing Memory with free()",
        explanation: "Releases the chunk back to the heap pool. Note: `p` STILL contains the address `0x55A010`, creating a **Dangling Pointer**!",
        codeSnippet: `free(p);`,
        status: "Chunk returned to OS. p is now dangling!"
      },
      {
        stepNumber: 5,
        activeNode: "nullify",
        title: "Step 5: Zeroing the Dangling Pointer",
        explanation: "Setting `p = NULL` protects against use-after-free and double-free bugs.",
        codeSnippet: `p = NULL;`,
        status: "p points to NULL (Safe)"
      }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FLOWCHARTS_DATA };
}
