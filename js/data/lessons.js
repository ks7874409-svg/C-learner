// C-Forge: Lessons Database (Beginner to Pro)
// Complete structured curriculum with explanations, code examples, diagrams, memory models, and pro tips.

const LESSONS_DATA = [
  {
    id: "m1",
    title: "Module 1: Genesis & Architecture",
    description: "Understand computer architecture, compilation pipeline, and your first C program.",
    badge: "Beginner",
    lessons: [
      {
        id: "m1-l1",
        title: "1.1 The Genesis of C & Why It Still Rules the World",
        readingTime: "8 min",
        content: `
### Why C in the 21st Century?
Created in **1972 by Dennis Ritchie at Bell Labs** to develop the Unix operating system, C remains the **lingua franca of computing**. Almost every modern abstraction rests on C:
- **Operating Systems**: The Linux Kernel, Windows NT Kernel, macOS Darwin, Android kernel are written predominantly in C.
- **Languages**: Python (CPython), Ruby, PHP, and JavaScript engines (V8's runtime components) are built with C/C++.
- **Databases & Browsers**: PostgreSQL, SQLite, MySQL, and core rendering engines.
- **Embedded & Robotics**: Microcontrollers (ARM Cortex, AVR, ESP32), automotive ECUs, avionics, and IoT devices.

### How C Interacts with Hardware
Unlike high-level languages with automatic garbage collection and virtual machines (Java, Python, JS), C gives you direct, unmediated control over:
1. **Physical RAM addresses** via pointers.
2. **CPU registers** and bit-level representations.
3. **Cache efficiency** through contiguous memory layouts.

\`\`\`
+-------------------------------------------------------+
|  Application Layer (Python, JS, Web Apps)             |
+-------------------------------------------------------+
|  System Software / Libraries (C / C++)                |
+-------------------------------------------------------+
|  Operating System Kernel (Linux, Windows in C)        |
+-------------------------------------------------------+
|  Hardware (CPU Registers, Cache, RAM, Bus)            |
+-------------------------------------------------------+
\`\`\`

> **Key Takeaway**: High-level languages hide the machine. **C teaches you how the computer actually thinks.**
        `,
        codeExample: `// The classic genesis program
#include <stdio.h>

int main(void) {
    printf("Hello, Systems World!\\n");
    return 0;
}`,
        proTip: "Never memorize syntax blindly. Always ask: 'What does the CPU and memory do when this line runs?'"
      },
      {
        id: "m1-l2",
        title: "1.2 The 4 Stages of C Compilation",
        readingTime: "12 min",
        content: `
### What happens when you type \`gcc main.c\`?
C is a **compiled language**. Your human-readable text code goes through four distinct transformations before the CPU can execute a single instruction:

\`\`\`
  [ Source Code: main.c ]
            |
            v  1. Preprocessor (cpp) -> Expands #include, #define, strips comments
  [ Translation Unit: main.i ]
            |
            v  2. Compiler (cc1) -> Converts C to CPU Assembly
  [ Assembly Code: main.s ]
            |
            v  3. Assembler (as) -> Converts Assembly to Machine Code
  [ Object File: main.o / main.obj ]
            |
            v  4. Linker (ld) -> Combines object files & C Standard Library (libc)
  [ Executable Binary: a.out / a.exe ]
\`\`\`

### Detailed Breakdown of the 4 Stages:

#### 1. Preprocessing (\`gcc -E main.c -o main.i\`)
- Replaces \`#include <stdio.h>\` by pasting the entire header file text directly into the file.
- Expands macros (\`#define MAX 100\`).
- Strips out all C comments (\`//\` and \`/* */\`).
- Handles conditional compilation (\`#ifdef\`, \`#ifndef\`, \`#endif\`).

#### 2. Compilation (\`gcc -S main.i -o main.s\`)
- Checks syntax and semantics.
- Translates pure C into hardware-specific **Assembly code** (x86-64, ARM, RISC-V).
- Performs compiler optimizations (\`-O2\`, \`-O3\`).

#### 3. Assembly (\`gcc -c main.s -o main.o\`)
- Translates assembly instructions (like \`mov\`, \`push\`, \`call\`) into binary machine opcode (0s and 1s).
- Generates a relocatable object file containing symbol tables.

#### 4. Linking (\`gcc main.o -o myprogram\`)
- Resolves unresolved function references (e.g., where is the implementation of \`printf\`? It lives inside \`libc.so\` / \`msvcrt.dll\`).
- Merges multiple \`.o\` files into one final executable binary ready for the OS loader.
        `,
        codeExample: `// Inspecting compilation steps yourself:
// Step 1: Preprocess only:
//   gcc -E main.c -o main.i
// Step 2: Compile to Assembly:
//   gcc -S main.i -o main.s
// Step 3: Assemble to Machine Object:
//   gcc -c main.s -o main.o
// Step 4: Link to final executable:
//   gcc main.o -o program

#include <stdio.h>
#define PI 3.14159

int main(void) {
    double radius = 5.0;
    double area = PI * radius * radius;
    printf("Area = %.2f\\n", area);
    return 0;
}`,
        proTip: "Use compiler flags '-Wall -Wextra -Werror -pedantic' right from day 1. They catch 90% of beginner bugs before you even run your code!"
      },
      {
        id: "m1-l3",
        title: "1.3 Anatomy of 'Hello World' - Byte by Byte",
        readingTime: "10 min",
        content: `
Let's dissect the canonical C program line by line. Nothing is magic in C!

\`\`\`c
#include <stdio.h>

int main(void) {
    printf("Hello, World!\\n");
    return 0;
}
\`\`\`

### Line 1: \`#include <stdio.h>\`
- \`#\` denotes a **preprocessor directive**.
- \`<stdio.h>\` stands for **Standard Input Output Header**.
- It provides function signatures, such as:
  \`int printf(const char *format, ...);\`
- Without this header, the compiler doesn't know what parameters \`printf\` expects.

### Line 3: \`int main(void)\`
- \`main\` is the mandatory **entry point** of every hosted C program. When the OS launches your program, the C runtime runtime (\`crt0\`) calls \`main\`.
- \`int\`: The function returns an integer **Exit Code** to the Operating System.
- \`void\`: Explicitly declares that \`main\` accepts **no arguments** (unlike \`int main(int argc, char *argv[])\` which takes command-line arguments).

### Line 4: \`printf("Hello, World!\\n");\`
- \`printf\` = **Print Formatted**.
- \`"Hello, World!\\n"\` is a **string literal** stored in the Read-Only Data Segment (\`.rodata\`) of the executable.
- \`\\n\` is the newline escape character. It also flushes the stdout line buffer on most Unix/POSIX systems.

### Line 5: \`return 0;\`
- Sends status code **0** to the operating system shell.
- By convention:
  - \`0\` = **Success / Clean Exit**.
  - Non-zero (\`1\`, \`-1\`, etc.) = **Error code / Abnormal termination**.
- In Bash/Linux: check with \`echo $?\`. In Windows PowerShell: check with \`$LASTEXITCODE\`.
        `,
        codeExample: `#include <stdio.h>

int main(int argc, char *argv[]) {
    printf("Program name: %s\\n", argv[0]);
    printf("Total arguments passed: %d\\n", argc);
    return 0;
}`,
        proTip: "In modern C (C99 and later), omitting 'return 0;' at the end of main() implicitly returns 0, but writing it explicitly is the mark of disciplined engineering."
      }
    ]
  },
  {
    id: "m2",
    title: "Module 2: Data Types, Memory & Bits",
    description: "Master variables, byte sizes, 2's complement, format specifiers, and bitwise operations.",
    badge: "Beginner",
    lessons: [
      {
        id: "m2-l1",
        title: "2.1 Primitive Types, Sizes & The 'sizeof' Operator",
        readingTime: "10 min",
        content: `
### What is a Variable in C?
In C, a variable is not an abstract bucket. A variable is a **labeled contiguous block of bytes in physical memory (RAM)** with an explicit type that tells the CPU how to interpret those bits.

### Standard C Primitive Data Types (on typical 64-bit systems)

| Type | Typical Size | Range / Representation | Format Specifier |
| :--- | :--- | :--- | :--- |
| \`char\` | 1 byte (8 bits) | -128 to 127 (or 0 to 255 if unsigned) | \`%c\` or \`%d\` |
| \`short\` | 2 bytes (16 bits) | -32,768 to 32,767 | \`%hd\` |
| \`int\` | 4 bytes (32 bits) | -2,147,483,648 to 2,147,483,647 | \`%d\` / \`%i\` |
| \`long\` | 4 or 8 bytes | -2^63 to 2^63 - 1 (on Linux x64) | \`%ld\` |
| \`long long\` | 8 bytes (64 bits) | -9,223,372,036,854,775,808 to 9.22e18 | \`%lld\` |
| \`float\` | 4 bytes (IEEE 754) | ~6-7 decimal digits precision | \`%f\` |
| \`double\` | 8 bytes (IEEE 754) | ~15-17 decimal digits precision | \`%lf\` |
| \`size_t\` | 8 bytes (unsigned) | Array indices & memory sizes | \`%zu\` |

### The \`sizeof\` Operator
\`sizeof\` is **not a function**—it is a compile-time operator evaluated by the compiler!

\`\`\`c
printf("Size of int: %zu bytes\\n", sizeof(int));
printf("Size of double: %zu bytes\\n", sizeof(double));
\`\`\`

> **Golden Rule**: Never hardcode type sizes like 4 or 8. Always use \`sizeof(type)\` to make your code portable across architectures (e.g. 32-bit ARM vs 64-bit x86).
        `,
        codeExample: `#include <stdio.h>
#include <stdint.h>

int main(void) {
    printf("char:      %zu byte(s)\\n", sizeof(char));
    printf("short:     %zu byte(s)\\n", sizeof(short));
    printf("int:       %zu byte(s)\\n", sizeof(int));
    printf("long:      %zu byte(s)\\n", sizeof(long));
    printf("long long: %zu byte(s)\\n", sizeof(long long));
    printf("float:     %zu byte(s)\\n", sizeof(float));
    printf("double:    %zu byte(s)\\n", sizeof(double));
    
    // Fixed-width integer types from <stdint.h> (Pro standard)
    int32_t exact32 = 100000;
    int64_t exact64 = 90000000000LL;
    printf("int32_t: %zu bytes, int64_t: %zu bytes\\n", sizeof(exact32), sizeof(exact64));
    return 0;
}`,
        proTip: "For production systems and embedded firmware, prefer <stdint.h> types (int32_t, uint8_t, uint64_t) over generic 'int' or 'long' to guarantee exact bit widths."
      },
      {
        id: "m2-l2",
        title: "2.2 Two's Complement & Integer Overflow",
        readingTime: "12 min",
        content: `
### How Computers Store Negative Numbers: Two's Complement
Computers do not store a minus sign '-' in RAM. They use **Two's Complement representation**.

To find the Two's Complement of an 8-bit number:
1. Write the positive binary number.
2. Invert all bits (0 becomes 1, 1 becomes 0) -> **One's Complement**.
3. Add 1 to the result -> **Two's Complement**.

#### Example: Representing -5 in 8 bits:
- \`+5\` in binary: \`0000 0101\`
- Invert bits:    \`1111 1010\`
- Add 1:          \`1111 1011\` = -5 in Two's Complement!

Notice the **Most Significant Bit (MSB)**:
- \`0\` at MSB = **Positive**
- \`1\` at MSB = **Negative**

### The Danger: Integer Overflow & Undefined Behavior
When a signed integer exceeds its maximum capacity, it wraps around or triggers **Undefined Behavior (UB)** in C!

\`\`\`
For signed 8-bit:
 127 = 0111 1111
+  1 = 1000 0000 = -128 (Overflow!)
\`\`\`

In C, **signed overflow is officially Undefined Behavior**. The compiler is allowed to assume signed overflow never happens, which can cause security vulnerabilities or deleted sanity checks during optimization!
        `,
        codeExample: `#include <stdio.h>
#include <limits.h>

int main(void) {
    int max_int = INT_MAX;
    printf("INT_MAX: %d\\n", max_int);
    
    // Unsigned overflow is well-defined: modulo 2^N
    unsigned int umax = UINT_MAX;
    printf("UINT_MAX: %u\\n", umax);
    printf("UINT_MAX + 1 wraps to: %u\\n", umax + 1);
    
    return 0;
}`,
        proTip: "Unsigned overflow wraps predictably according to modulo 2^N, but signed overflow is Undefined Behavior. Always validate user inputs before arithmetic!"
      },
      {
        id: "m2-l3",
        title: "2.3 Bitwise Operations: The Systems Engineer's Superpower",
        readingTime: "14 min",
        content: `
### The 6 Bitwise Operators in C

| Operator | Name | Effect |
| :--- | :--- | :--- |
| \`&\` | Bitwise AND | 1 only if BOTH bits are 1 |
| \`|\` | Bitwise OR | 1 if AT LEAST ONE bit is 1 |
| \`^\` | Bitwise XOR | 1 if bits are DIFFERENT |
| \`~\` | Bitwise NOT | Flips all bits (0->1, 1->0) |
| \`<<\` | Left Shift | Shifts bits left, multiplies by 2^n |
| \`>>\` | Right Shift | Shifts bits right, divides by 2^n |

### Common Bit Manipulation Hacks (Used in OS & Game Dev):

1. **Check if an integer is Odd or Even**:
   \`(x & 1) == 0\` -> Even, \`1\` -> Odd. (Faster than modulo \`x % 2\`).
2. **Set the n-th bit**:
   \`x = x | (1 << n);\`
3. **Clear the n-th bit**:
   \`x = x & ~(1 << n);\`
4. **Toggle the n-th bit**:
   \`x = x ^ (1 << n);\`
5. **Check if power of 2**:
   \`(x > 0) && ((x & (x - 1)) == 0)\`
6. **Swap two numbers without a temporary variable**:
   \`a ^= b; b ^= a; a ^= b;\`
        `,
        codeExample: `#include <stdio.h>

void print_binary(unsigned char n) {
    for (int i = 7; i >= 0; i--) {
        printf("%d", (n >> i) & 1);
        if (i == 4) printf(" ");
    }
    printf("\\n");
}

int main(void) {
    unsigned char flags = 0; // 0000 0000
    
    // Set bit 2 and bit 5
    flags |= (1 << 2);
    flags |= (1 << 5);
    printf("After setting bit 2 & 5: ");
    print_binary(flags);
    
    // Check if bit 2 is set
    if (flags & (1 << 2)) {
        printf("Bit 2 is active!\\n");
    }
    
    // Clear bit 2
    flags &= ~(1 << 2);
    printf("After clearing bit 2:    ");
    print_binary(flags);
    
    return 0;
}`,
        proTip: "Bitmasks are extensively used in Linux file permissions (e.g. 0755, S_IRUSR), network packet headers, and game engine component flags."
      }
    ]
  },
  {
    id: "m3",
    title: "Module 3: Control Flow & Logic",
    description: "Decision making, switch jump-tables, loop mechanics, and control hazards.",
    badge: "Beginner",
    lessons: [
      {
        id: "m3-l1",
        title: "3.1 Branching: If-Else & The Ternary Operator",
        readingTime: "9 min",
        content: `
### How the CPU Executes Branches
At machine level, \`if-else\` compiles down to **comparison and conditional jump instructions** (e.g., \`cmp\`, \`je\`, \`jne\`, \`jg\`).

Modern CPUs employ **Branch Predictors** to guess whether an \`if\` branch will be taken before evaluating it. An unpredictable branch causes a pipeline stall (flushing 15-20 CPU cycles).

### Syntax & Short-Circuit Evaluation:
C evaluates boolean conditions using **Short-Circuit Evaluation**:
- In \`A && B\`: If \`A\` is false (0), \`B\` is **never evaluated**.
- In \`A || B\`: If \`A\` is true (non-zero), \`B\` is **never evaluated**.

\`\`\`c
// Safety pattern leveraging short-circuit:
if (ptr != NULL && *ptr == 42) {
    // *ptr is safe! If ptr is NULL, the second condition is never touched.
}
\`\`\`

### The Ternary Operator
\`condition ? expression_if_true : expression_if_false\`
Concise for inline variable assignments.
        `,
        codeExample: `#include <stdio.h>

int main(void) {
    int score = 85;
    char grade;
    
    if (score >= 90) {
        grade = 'A';
    } else if (score >= 80) {
        grade = 'B';
    } else if (score >= 70) {
        grade = 'C';
    } else {
        grade = 'F';
    }
    
    // Ternary assignment
    const char *status = (score >= 50) ? "PASSED" : "FAILED";
    printf("Score: %d | Grade: %c | Status: %s\\n", score, grade, status);
    return 0;
}`,
        proTip: "Avoid deeply nested if-else ladders (the 'Pyramid of Doom'). Use guard clauses and early returns to keep logic clean and flat."
      },
      {
        id: "m3-l2",
        title: "3.2 Switch-Case & Compiler Jump Tables",
        readingTime: "10 min",
        content: `
### Why Switch is Often Faster than If-Else
When you have many constant comparisons, the compiler can optimize a \`switch\` into an **O(1) Jump Table** (an array of code address pointers indexed by value). Instead of evaluating conditions sequentially, the CPU jumps directly to the target case!

### The Fallthrough Trap:
Unless you place a \`break;\`, execution will fall through into subsequent cases. While intentional fallthrough is sometimes useful (like Duff's Device), unintentional omission is one of the most famous sources of real-world software bugs!

\`\`\`c
switch(command) {
    case 'w':
    case 'W':
        move_forward(); // Intentional fallthrough for upper/lower case
        break;
    default:
        printf("Unknown command\\n");
        break;
}
\`\`\`
        `,
        codeExample: `#include <stdio.h>

typedef enum {
    STATE_IDLE,
    STATE_RUNNING,
    STATE_PAUSED,
    STATE_STOPPED
} EngineState;

int main(void) {
    EngineState current = STATE_RUNNING;
    
    switch (current) {
        case STATE_IDLE:
            printf("Engine is idling.\\n");
            break;
        case STATE_RUNNING:
            printf("Engine is actively processing tasks.\\n");
            break;
        case STATE_PAUSED:
            printf("Engine paused. Ready to resume.\\n");
            break;
        case STATE_STOPPED:
            printf("Engine halted safely.\\n");
            break;
        default:
            printf("Invalid engine state!\\n");
            break;
    }
    return 0;
}`,
        proTip: "In modern C, use the '[[fallthrough]];' attribute (C23) or a clear comment '/* FALLTHROUGH */' whenever you intentionally omit a break."
      },
      {
        id: "m3-l3",
        title: "3.3 Loops Deep-Dive: While, Do-While & For",
        readingTime: "11 min",
        content: `
### The 3 Loops Compared

1. **\`for\` Loop**: Preferred when the number of iterations or index step is known upfront.
   \`for (init; condition; step) { ... }\`
2. **\`while\` Loop**: Evaluates condition **before** entering the body. Runs 0 or more times.
3. **\`do-while\` Loop**: Evaluates condition **after** the body runs. Guaranteed to execute **at least once**. (Ideal for input validation loops).

### Loop Control: \`break\` vs \`continue\`
- \`break\`: Immediately exits the innermost loop enclosing it.
- \`continue\`: Skips the remainder of the current iteration and jumps directly to the loop condition / step check.

### The Lifecycle of a For-Loop:
\`\`\`
1. Execute [init] (once)
2. Evaluate [condition]
   ├── If false (0) -> Exit loop
   └── If true (!= 0):
       3. Execute loop body
       4. Execute [step]
       5. Jump back to Step 2
\`\`\`
        `,
        codeExample: `#include <stdio.h>

int main(void) {
    // 1. For loop with continue & break
    printf("Even numbers under 10:\\n");
    for (int i = 0; i < 10; i++) {
        if (i % 2 != 0) continue; // Skip odds
        if (i == 8) break;        // Stop early at 8
        printf("%d ", i);
    }
    printf("\\n\\n");

    // 2. Do-while loop simulation for validation
    int user_input = -1;
    int simulated_inputs[] = {-5, 0, 42};
    int idx = 0;
    
    do {
        user_input = simulated_inputs[idx++];
        printf("Checking input: %d\\n", user_input);
    } while (user_input <= 0);
    
    printf("Accepted positive input: %d\\n", user_input);
    return 0;
}`,
        proTip: "Never mutate loop counters inside the loop body unless strictly intended. It makes iteration bounds unpredictable."
      }
    ]
  },
  {
    id: "m4",
    title: "Module 4: Functions & Call Stack",
    description: "Function anatomy, activation records, stack frames, pass-by-value, and recursion.",
    badge: "Intermediate",
    lessons: [
      {
        id: "m4-l1",
        title: "4.1 Functions, Prototypes & Header Files",
        readingTime: "10 min",
        content: `
### Forward Declaration & Function Prototypes
In C, the compiler reads files linearly from top to bottom. If you call a function before defining it, old C compilers would guess the return type is \`int\` (implicit declaration), which leads to subtle runtime crashes.

A **function prototype** tells the compiler:
1. The function's name.
2. The return type.
3. The number and types of its parameters.

\`\`\`c
// Prototype (Declaration)
int calculate_sum(int a, int b);

int main(void) {
    int res = calculate_sum(10, 20); // Compiler knows this is valid!
    return 0;
}

// Definition
int calculate_sum(int a, int b) {
    return a + b;
}
\`\`\`

### Pure Functions vs Side Effects
A function that modifies global state or performs I/O has **side effects**. Writing modular functions with well-defined inputs and outputs makes C code testable and resilient.
        `,
        codeExample: `#include <stdio.h>

// Prototypes
double celsius_to_fahrenheit(double c);
double fahrenheit_to_celsius(double f);

int main(void) {
    double temp_c = 100.0;
    printf("%.1f C = %.1f F\\n", temp_c, celsius_to_fahrenheit(temp_c));
    return 0;
}

double celsius_to_fahrenheit(double c) {
    return (c * 9.0 / 5.0) + 32.0;
}

double fahrenheit_to_celsius(double f) {
    return (f - 32.0) * 5.0 / 9.0;
}`,
        proTip: "Keep function declarations in header (.h) files and implementations in source (.c) files. Never #include a .c file directly!"
      },
      {
        id: "m4-l2",
        title: "4.2 The Call Stack & Activation Records",
        readingTime: "13 min",
        content: `
### What is the Call Stack?
When a function is called, the OS allocates a chunk of memory on the **Call Stack** called a **Stack Frame** (or Activation Record).

### What lives inside a Stack Frame?
1. **Return Address**: Where in machine code the CPU should jump back to after the function returns.
2. **Passed Arguments**: Values passed into parameters.
3. **Local Variables**: Variables declared inside the function.
4. **Saved Registers**: CPU register states preserved for the caller.

\`\`\`
High Memory
+-------------------------------+
| main() Stack Frame            |
| - return addr to OS           |
| - local variable: x = 10      |
+-------------------------------+
| foo() Stack Frame             |  <-- Stack Pointer (SP) moves down
| - return addr to main()       |
| - param: a = 10               |
| - local variable: y = 20      |
+-------------------------------+
Low Memory (Stack grows DOWN on x86/ARM)
\`\`\`

### Pass-by-Value in C:
**Everything in C is passed strictly by value!**
When you pass a variable to a function, the function receives an **independent copy** of the variable's value. Mutating the parameter inside the function has **zero effect** on the caller's variable!
        `,
        codeExample: `#include <stdio.h>

// This fails to swap because C is pass-by-value!
void broken_swap(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
    // a and b die here when the stack frame pops
}

int main(void) {
    int x = 5, y = 10;
    printf("Before broken_swap: x=%d, y=%d\\n", x, y);
    broken_swap(x, y);
    printf("After broken_swap:  x=%d, y=%d (Unchanged!)\\n", x, y);
    return 0;
}`,
        proTip: "To allow a function to modify a caller's variable, you must pass the variable's memory address (a pointer)! We will master this in Module 6."
      },
      {
        id: "m4-l3",
        title: "4.3 Recursion, Call Depth & Stack Overflow",
        readingTime: "12 min",
        content: `
### Recursion Mechanics
A function is recursive when it calls itself directly or indirectly. Every recursive solution requires two components:
1. **Base Case**: The termination condition that returns a concrete value without making another recursive call.
2. **Recursive Step**: Moves toward the base case by reducing problem size.

### The Stack Overflow Hazard
Each recursive call pushes a new stack frame onto the Call Stack. The stack has a limited size (typically 8MB on Linux, 1MB on Windows). If recursion runs too deep without hitting a base case, it overruns the stack boundary, triggering a **Segmentation Fault (SIGSEGV)** or **Stack Overflow** crash!

### Tail-Call Optimization (TCO):
When the recursive call is the very last operation in the function, smart optimizing compilers (\`-O2\`) can reuse the existing stack frame instead of allocating a new one, turning recursion into a loop!
        `,
        codeExample: `#include <stdio.h>

// Standard recursion
long long factorial(int n) {
    if (n <= 1) return 1; // Base case
    return n * factorial(n - 1); // Recursive step
}

// Tail-recursive version (eligible for compiler optimization)
long long factorial_tail(int n, long long accumulator) {
    if (n <= 1) return accumulator;
    return factorial_tail(n - 1, n * accumulator);
}

int main(void) {
    int n = 10;
    printf("Factorial of %d = %lld\\n", n, factorial(n));
    printf("Tail Factorial of %d = %lld\\n", n, factorial_tail(n, 1));
    return 0;
}`,
        proTip: "Whenever dealing with deep recursion in systems software (e.g. tree traversal or graph algorithms), consider an iterative loop with an explicit heap-allocated stack to prevent stack overflow."
      }
    ]
  },
  {
    id: "m5",
    title: "Module 5: Arrays & Strings",
    description: "Contiguous memory layout, multidimensional arrays, null termination, and string manipulation.",
    badge: "Intermediate",
    lessons: [
      {
        id: "m5-l1",
        title: "5.1 Arrays in Memory: Contiguous Blocks & Bounds",
        readingTime: "11 min",
        content: `
### What is an Array in C?
An array is a **contiguous sequence of elements of the same data type** laid out back-to-back in memory.

If \`int arr[5]\` starts at memory address \`0x1000\`, and each \`int\` is 4 bytes:
- \`arr[0]\` is at \`0x1000\`
- \`arr[1]\` is at \`0x1004\`
- \`arr[2]\` is at \`0x1008\`
- \`arr[3]\` is at \`0x100C\`
- \`arr[4]\` is at \`0x1010\`

### Array Subscript Formula:
\`Address(arr[i]) = Base_Address + (i * sizeof(element))\`
Because of this formula, accessing **any** array index is an **O(1) direct offset calculation**!

### C DOES NOT Do Bounds Checking!
C prioritizes raw execution speed over safety. If you declare \`int arr[5]\` and access \`arr[10]\`, C will happily read or overwrite whatever happens to be in memory 40 bytes ahead! This can corrupt adjacent variables or trigger a segmentation fault.
        `,
        codeExample: `#include <stdio.h>

int main(void) {
    int numbers[5] = {10, 20, 30, 40, 50};
    
    // Calculating length of stack array
    size_t length = sizeof(numbers) / sizeof(numbers[0]);
    printf("Array element count: %zu\\n", length);
    
    for (size_t i = 0; i < length; i++) {
        printf("numbers[%zu] = %d (Address: %p)\\n", i, numbers[i], (void*)&numbers[i]);
    }
    return 0;
}`,
        proTip: "The 'sizeof(arr)/sizeof(arr[0])' trick ONLY works on arrays with visible declaration in the current scope. Once passed to a function, arrays decay into a pointer!"
      },
      {
        id: "m5-l2",
        title: "5.2 Strings in C: Null-Terminated Byte Sequences",
        readingTime: "12 min",
        content: `
### C Has No Native String Type!
In C, a string is simply a **character array terminated by a null character: '\\0' (ASCII 0)**.

When you write \`char str[] = "CODE";\` in memory:
\`\`\`
Index:     0     1     2     3     4
Value:   ['C'] ['O'] ['D'] ['E'] ['\\0']
ASCII:     67    79    68    69     0
\`\`\`
Notice: The string \`"CODE"\` has 4 printable characters, but requires **5 bytes of storage**!

### The String Literal vs Array Trap:
\`\`\`c
char str1[] = "Hello"; // Modifiable array on stack! (str1[0] = 'h' is OK)
char *str2 = "Hello";  // Pointer to string literal in Read-Only memory (.rodata)!
str2[0] = 'h';         // CRASH: Segmentation fault (Bus Error)!
\`\`\`
        `,
        codeExample: `#include <stdio.h>
#include <string.h>

// Re-implementing strlen to understand how \\0 works
size_t custom_strlen(const char *s) {
    size_t count = 0;
    while (s[count] != '\\0') {
        count++;
    }
    return count;
}

int main(void) {
    char greeting[] = "Hello Systems";
    printf("Text: %s\\n", greeting);
    printf("Library strlen: %zu\\n", strlen(greeting));
    printf("Custom strlen:  %zu\\n", custom_strlen(greeting));
    printf("Array sizeof:   %zu (includes '\\\\0')\\n", sizeof(greeting));
    return 0;
}`,
        proTip: "Never use the deprecated 'gets()' function—it is impossible to prevent buffer overflows with it. Use 'fgets(buffer, sizeof(buffer), stdin)' instead."
      },
      {
        id: "m5-l3",
        title: "5.3 Multi-Dimensional Arrays & Row-Major Order",
        readingTime: "10 min",
        content: `
### 2D Arrays are 1D Under the Hood
In RAM, physical memory is strictly linear. C stores multi-dimensional arrays in **Row-Major Order** (row by row).

For \`int matrix[2][3]\`:
\`\`\`
Matrix concept:
[ 1, 2, 3 ]
[ 4, 5, 6 ]

Linear Memory Layout:
[1] [2] [3] [4] [5] [6]
\`\`\`

### Cache Locality & Performance:
Because rows are contiguous in memory, traversing row-by-row (\`for i; for j; matrix[i][j]\`) exploits **CPU cache lines**, while column-by-column traversal causes continuous cache misses and can be 10x slower on large matrices!
        `,
        codeExample: `#include <stdio.h>

#define ROWS 3
#define COLS 3

int main(void) {
    int matrix[ROWS][COLS] = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    };

    printf("2D Matrix Print:\\n");
    for (int r = 0; r < ROWS; r++) {
        for (int c = 0; c < COLS; c++) {
            printf("%d ", matrix[r][c]);
        }
        printf("\\n");
    }
    
    // Demonstrate contiguous memory
    int *flat_ptr = (int*)matrix;
    printf("\\nFlattened access via pointer:\\n");
    for (int i = 0; i < ROWS * COLS; i++) {
        printf("%d ", flat_ptr[i]);
    }
    printf("\\n");
    return 0;
}`,
        proTip: "Always iterate multi-dimensional arrays in row-major order: outer loop = row index, inner loop = column index."
      }
    ]
  },
  {
    id: "m6",
    title: "Module 6: Pointers Demystified",
    description: "Memory addresses, dereferencing, pointer arithmetic, void pointers, and function pointers.",
    badge: "Intermediate",
    lessons: [
      {
        id: "m6-l1",
        title: "6.1 What is a Pointer? Memory Addresses & The '&' and '*' Operators",
        readingTime: "14 min",
        content: `
### Demystifying Pointers
Many beginners fear pointers, but the concept is beautifully simple:

> **A pointer is just a variable whose value happens to be the memory address of another variable.**

Think of RAM as a giant street with millions of houses.
- Each house has a **Street Address** (e.g., \`0x7ffe4a2b\`).
- Inside the house is **Data** (e.g., the number \`42\`).
- A pointer is a piece of paper where you wrote down that street address!

### The Two Fundamental Operators:
1. **Address-Of Operator (\`&\`)**: Returns the physical RAM address of a variable.
   \`int *p = &x;\` -> "Store the address of \`x\` in pointer \`p\`".
2. **Dereference Operator (\`*\`)**: Visits the address stored in the pointer and accesses the actual data value stored there.
   \`*p = 99;\` -> "Go to the address inside \`p\` and write \`99\` there."

\`\`\`
Variable x:
+-------------------+
| Address: 0x1000   |
| Value:   42       |
+-------------------+
          ^
          | (points to 0x1000)
Pointer p:
+-------------------+
| Address: 0x2000   |
| Value:   0x1000   |
+-------------------+
\`\`\`
        `,
        codeExample: `#include <stdio.h>

void real_swap(int *a, int *b) {
    int temp = *a; // Read value at address a
    *a = *b;       // Write value at b into address a
    *b = temp;     // Write temp into address b
}

int main(void) {
    int x = 42;
    int *ptr = &x; // ptr holds address of x

    printf("Value of x:              %d\\n", x);
    printf("Address of x (&x):       %p\\n", (void*)&x);
    printf("Value stored in ptr:     %p\\n", (void*)ptr);
    printf("Value dereferenced (*ptr):%d\\n", *ptr);

    // Modify x via ptr
    *ptr = 100;
    printf("New value of x:          %d\\n\\n", x);

    // Real Swap in action!
    int num1 = 10, num2 = 20;
    printf("Before swap: num1=%d, num2=%d\\n", num1, num2);
    real_swap(&num1, &num2);
    printf("After swap:  num1=%d, num2=%d\\n", num1, num2);
    return 0;
}`,
        proTip: "Always initialize pointers! An uninitialized pointer 'int *p;' contains random garbage address. Dereferencing it will cause a catastrophic crash."
      },
      {
        id: "m6-l2",
        title: "6.2 Pointer Arithmetic & Array Decay",
        readingTime: "13 min",
        content: `
### Pointer Arithmetic is Scaled by Type Size!
When you add \`1\` to an ordinary integer, it increments by 1.
When you add \`1\` to a **pointer**, it increments by **\`sizeof(TargetType)\`**!

\`\`\`c
int *p = (int*)0x1000;
p = p + 1; // p is now 0x1004 (since sizeof(int) is 4 bytes)!

double *d = (double*)0x1000;
d = d + 1; // d is now 0x1008 (since sizeof(double) is 8 bytes)!
\`\`\`

### The Equivalence of Arrays and Pointers:
In C, the array name \`arr\` in most expressions automatically **decays into a pointer to its first element**:
\`arr == &arr[0]\`

The array indexing syntax \`arr[i]\` is strictly syntactic sugar for pointer arithmetic:
\`arr[i]  <==>  *(arr + i)\`

And because addition is commutative (\`arr + i == i + arr\`):
\`arr[i]  ==  i[arr]\`  *(Yes, 2[arr] is valid C!)*
        `,
        codeExample: `#include <stdio.h>

int main(void) {
    int arr[] = {100, 200, 300, 400};
    int *ptr = arr; // Decays to &arr[0]

    for (int i = 0; i < 4; i++) {
        printf("Index %d: arr[%d]=%d, *(ptr + %d)=%d, at %p\\n", 
               i, i, arr[i], i, *(ptr + i), (void*)(ptr + i));
    }
    
    // The famous C quirk:
    printf("\\nQuirky C syntax: 2[arr] = %d\\n", 2[arr]);
    return 0;
}`,
        proTip: "Subtracting two pointers of the same type (ptr2 - ptr1) returns the number of elements between them, which is of type ptrdiff_t."
      },
      {
        id: "m6-l3",
        title: "6.3 Double Pointers & Function Pointers",
        readingTime: "15 min",
        content: `
### Pointer to a Pointer (\`**\`)
If a pointer holds the address of a variable, a **double pointer** holds the address of a pointer!

Why do we need double pointers?
- To modify a pointer's target inside a function (e.g. allocating memory in a helper function or updating the \`head\` pointer of a Linked List).
- To manage 2D dynamic arrays (\`char **argv\` or matrices).

### Function Pointers: Dynamic Code Dispatch
In C, functions reside in the Code/Text segment of memory and also have memory addresses! A **function pointer** stores the entry point address of a function, allowing you to pass functions as arguments (callbacks, strategy patterns, event loops).

\`\`\`c
// Syntax: ReturnType (*PointerName)(ParamTypes);
int (*operation)(int, int);
\`\`\`
        `,
        codeExample: `#include <stdio.h>

// Functions to dispatch
int add(int a, int b) { return a + b; }
int multiply(int a, int b) { return a * b; }

// Function that takes another function as a parameter (Callback)
void execute_calc(int (*op)(int, int), int x, int y) {
    printf("Calculation Result: %d\\n", op(x, y));
}

// Double pointer example: allocating memory via function
void update_ptr(int **pp, int *new_target) {
    *pp = new_target;
}

int main(void) {
    // 1. Function pointers
    int (*calc)(int, int) = add;
    printf("5 + 3 = %d\\n", calc(5, 3));
    
    calc = multiply;
    printf("5 * 3 = %d\\n", calc(5, 3));
    
    execute_calc(add, 20, 30);
    execute_calc(multiply, 4, 25);

    // 2. Double pointers
    int val1 = 10, val2 = 99;
    int *ptr = &val1;
    printf("\\nOriginal target: %d\\n", *ptr);
    update_ptr(&ptr, &val2);
    printf("Updated target via double pointer: %d\\n", *ptr);
    return 0;
}`,
        proTip: "Use 'typedef' to make function pointer syntax clean and readable: 'typedef int (*BinaryOp)(int, int);'"
      }
    ]
  },
  {
    id: "m7",
    title: "Module 7: Dynamic Memory Management",
    description: "Master Heap vs Stack, malloc, calloc, realloc, free, and memory leak prevention.",
    badge: "Advanced",
    lessons: [
      {
        id: "m7-l1",
        title: "7.1 Stack vs Heap: Memory Layout of a C Program",
        readingTime: "12 min",
        content: `
### Virtual Memory Layout of a C Process
When the operating system loads a C executable into memory, it assigns it a 64-bit virtual address space divided into distinct segments:

\`\`\`
High Memory (0x7FFFFFFFFFFF)
+------------------------------------------+
|  Kernel Space (Inaccessible to User)     |
+------------------------------------------+
|  Stack (Local vars, grows DOWNWARDS)     |
|       |                                  |
|       v                                  |
|                                          |
|       ^                                  |
|       |                                  |
|  Heap (malloc/free, grows UPWARDS)       |
+------------------------------------------+
|  BSS Segment (Uninitialized globals/static)
+------------------------------------------+
|  Data Segment (Initialized globals/static)|
+------------------------------------------+
|  Text / Code Segment (Machine opcode)     |
+------------------------------------------+
Low Memory (0x000000000000)
\`\`\`

### Stack vs Heap Comparison

| Feature | Stack | Heap |
| :--- | :--- | :--- |
| **Allocation** | Automatic (by compiler) | Manual (by programmer) |
| **Speed** | Blazing fast (single SP register move) | Slower (system allocator search) |
| **Lifetime** | Tied to function scope | Survives until explicitly freed |
| **Size Limit** | Small (typically 1-8 MB) | Large (gigabytes, limited by RAM) |
| **Risk** | Stack overflow | Memory leaks, dangling pointers |
        `,
        codeExample: `#include <stdio.h>
#include <stdlib.h>

int global_initialized = 42;       // Data Segment
int global_uninitialized;          // BSS Segment

int main(void) {
    int stack_var = 10;            // Stack Frame
    int *heap_var = malloc(sizeof(int)); // Heap
    *heap_var = 99;

    printf("Text Segment (main):       %p\\n", (void*)main);
    printf("Data Segment (initialized): %p\\n", (void*)&global_initialized);
    printf("BSS Segment (uninit):      %p\\n", (void*)&global_uninitialized);
    printf("Heap Allocation:           %p\\n", (void*)heap_var);
    printf("Stack Variable:            %p\\n", (void*)&stack_var);

    free(heap_var);
    return 0;
}`,
        proTip: "Observe how stack addresses are vastly higher in numerical value than heap addresses, reflecting their opposing positions in the address space!"
      },
      {
        id: "m7-l2",
        title: "7.2 The 4 Heap Functions: malloc, calloc, realloc, free",
        readingTime: "14 min",
        content: `
### 1. \`malloc(size_t size)\`
- Allocates a contiguous block of \`size\` bytes from the heap.
- Does **NOT initialize memory** (contains whatever dirty garbage bits were left behind).
- Returns \`void*\` pointing to the block, or \`NULL\` if memory is exhausted.

### 2. \`calloc(size_t num, size_t size)\`
- Allocates \`num * size\` bytes and **zero-initializes every single byte to 0**.
- Slightly slower than malloc due to zeroing out memory, but safe against garbage values.

### 3. \`realloc(void *ptr, size_t new_size)\`
- Resizes an existing heap allocation.
- If possible, expands the current block in place. If contiguous space is unavailable, allocates a new block elsewhere, copies the existing contents, frees the old block, and returns the new pointer!

### 4. \`free(void *ptr)\`
- Releases the allocated heap block back to the memory manager.
- Calling \`free\` on \`NULL\` is safe (does nothing).
        `,
        codeExample: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    // 1. Allocate initial array of 3 ints
    int *arr = malloc(3 * sizeof(int));
    if (arr == NULL) {
        fprintf(stderr, "Memory allocation failed!\\n");
        return 1;
    }

    arr[0] = 10; arr[1] = 20; arr[2] = 30;

    // 2. Expand array to 5 ints using realloc
    int *temp = realloc(arr, 5 * sizeof(int));
    if (temp == NULL) {
        free(arr); // Clean up old memory on failure!
        return 1;
    }
    arr = temp; // Reassign to new memory location

    arr[3] = 40;
    arr[4] = 50;

    printf("Dynamic Array Elements:\\n");
    for (int i = 0; i < 5; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");

    // 3. Free memory & avoid dangling pointer
    free(arr);
    arr = NULL; // Safe practice!
    return 0;
}`,
        proTip: "Always assign 'ptr = NULL;' immediately after 'free(ptr);'. This prevents dangling pointer dereferencing and catastrophic double-free bugs!"
      },
      {
        id: "m7-l3",
        title: "7.3 The Deadly Sins of C Memory: Leaks, Dangling Pointers & Double Free",
        readingTime: "13 min",
        content: `
### The 3 Classic Memory Traps:

#### 1. Memory Leak
Allocating memory with \`malloc\` and losing all pointer references to it without calling \`free\`. Over time, the program consumes more and more RAM until the operating system's OOM (Out Of Memory) Killer terminates the process.

#### 2. Dangling Pointer
A pointer that continues to point to a memory location after that memory has already been freed. Dereferencing or writing to a dangling pointer corrupts the allocator's internal metadata or hijackable structures!

#### 3. Double Free
Calling \`free(ptr)\` twice on the exact same address. This corrupts the heap's free-list chunks and is one of the most exploited vulnerabilities in cyber security (Heap Exploitation).

\`\`\`c
// Double free vulnerability:
int *p = malloc(sizeof(int));
free(p);
// ... later ...
free(p); // CRASH! Undefined Behavior / Heap corruption
\`\`\`
        `,
        codeExample: `#include <stdio.h>
#include <stdlib.h>

void simulate_leak(void) {
    int *leak = malloc(1024); // 1KB allocated
    // Function exits without free(leak)! Memory leaked forever!
}

int main(void) {
    printf("Demonstrating safe allocation pattern:\\n");
    
    int *safe = malloc(sizeof(int));
    if (!safe) return 1;
    
    *safe = 42;
    printf("Value: %d\\n", *safe);
    
    free(safe);
    safe = NULL; // Setting to NULL neuters the dangling pointer!
    
    // Calling free on NULL is officially guaranteed safe by C standard:
    free(safe); // Safe! Does nothing.
    return 0;
}`,
        proTip: "Use Valgrind on Linux ('valgrind --leak-check=full ./program') or AddressSanitizer ('gcc -fsanitize=address -g main.c') to catch memory bugs in seconds!"
      }
    ]
  },
  {
    id: "m8",
    title: "Module 8: Structs, Unions & Byte Alignment",
    description: "Custom data types, padding rules, cache alignment, bitfields, and unions.",
    badge: "Advanced",
    lessons: [
      {
        id: "m8-l1",
        title: "8.1 Structs, Typedef & Memory Layout",
        readingTime: "11 min",
        content: `
### Structures: Bundling Heterogeneous Data
A \`struct\` allows you to group variables of different data types into a single cohesive record.

\`\`\`c
struct Player {
    int id;
    char name[32];
    float health;
};
\`\`\`

### Accessing Members:
- Use the **Dot Operator (\`.\`)** when accessing members from a direct struct variable:
  \`player1.health = 100.0f;\`
- Use the **Arrow Operator (\`->\`)** when accessing members through a struct pointer:
  \`ptr->health = 100.0f;\` *(shorthand for \`(*ptr).health\`)*
        `,
        codeExample: `#include <stdio.h>
#include <string.h>

typedef struct {
    int id;
    char username[24];
    double balance;
} Account;

void display_account(const Account *acc) {
    printf("ID: %d | User: %s | Balance: $%.2f\\n", acc->id, acc->username, acc->balance);
}

int main(void) {
    Account acc1 = { .id = 101, .username = "CipherMaster", .balance = 1250.75 };
    display_account(&acc1);

    Account *ptr = &acc1;
    ptr->balance += 500.0;
    printf("After deposit: $%.2f\\n", acc1.balance);
    return 0;
}`,
        proTip: "Pass structs by pointer ('const Account *acc') to functions instead of by value. Passing a large struct by value copies every single byte onto the stack, wasting CPU cycles."
      },
      {
        id: "m8-l2",
        title: "8.2 Structure Padding & Byte Alignment",
        readingTime: "14 min",
        content: `
### The Mystery of the Missing Bytes!
Consider this struct:
\`\`\`c
struct Example {
    char c;   // 1 byte
    int i;    // 4 bytes
    short s;  // 2 bytes
};
\`\`\`
You might expect \`sizeof(struct Example)\` to be \`1 + 4 + 2 = 7 bytes\`.
Run it, and you'll find it is **12 bytes**! Where did the 5 extra bytes come from?

### CPU Memory Alignment:
Modern CPUs read memory in word chunks (4 or 8 bytes at a time).
- A 4-byte \`int\` MUST reside at a memory address divisible by 4.
- An 8-byte \`double\` MUST reside at an address divisible by 8.

The compiler inserts invisible **Padding Bytes** to ensure natural alignment!

\`\`\`
Address: [ 0 ]   [ 1 ] [ 2 ] [ 3 ]   [ 4 ] [ 5 ] [ 6 ] [ 7 ]   [ 8 ] [ 9 ]  [ 10 ] [ 11 ]
Content: [ 'c' ] [  PADDING (3B) ]   [       int 'i'       ]   [ short 's' ] [ PADDING (2B) ]
\`\`\`

### How to Save Memory: Order Members by Size!
Reordering members from largest to smallest eliminates internal padding!
\`\`\`c
struct Optimized {
    int i;    // 4 bytes
    short s;  // 2 bytes
    char c;   // 1 byte
    // 1 byte trailing padding to align whole struct
}; // Total: 8 bytes instead of 12 bytes!
\`\`\`
        `,
        codeExample: `#include <stdio.h>

struct Unoptimized {
    char a;   // 1 byte
    // 3 bytes padding
    int b;    // 4 bytes
    char c;   // 1 byte
    // 3 bytes padding
}; // 12 bytes!

struct Optimized {
    int b;    // 4 bytes
    char a;   // 1 byte
    char c;   // 1 byte
    // 2 bytes padding
}; // 8 bytes!

int main(void) {
    printf("Size of Unoptimized: %zu bytes\\n", sizeof(struct Unoptimized));
    printf("Size of Optimized:   %zu bytes\\n", sizeof(struct Optimized));
    return 0;
}`,
        proTip: "In network protocols and hardware registers where padding is forbidden, use '#pragma pack(push, 1)' to force zero padding."
      },
      {
        id: "m8-l3",
        title: "8.3 Unions & Bitfields for Low-Level Systems",
        readingTime: "12 min",
        content: `
### What is a Union?
Unlike a struct where each member has its own private memory location, **all members of a union share the EXACT same memory address**!
The size of a union is simply the size of its largest member.

### Use Cases for Unions:
1. **Variant Types**: Storing one value at a time out of several types (e.g. JSON values).
2. **Type Punning / Hardware Inspection**: Examining the individual raw bytes of a float or integer.

### Bitfields:
C allows you to specify the exact number of bits a member occupies:
\`\`\`c
struct Register {
    unsigned int is_ready : 1;  // Only 1 bit!
    unsigned int error_code : 3;// 3 bits (0 to 7)
    unsigned int mode : 4;      // 4 bits (0 to 15)
};
\`\`\`
        `,
        codeExample: `#include <stdio.h>

union FloatInspector {
    float f;
    unsigned int raw_bits;
    unsigned char bytes[4];
};

int main(void) {
    union FloatInspector fi;
    fi.f = 3.14159f;

    printf("Float value:    %f\\n", fi.f);
    printf("Hex bit pattern: 0x%08X\\n", fi.raw_bits);
    printf("Individual bytes: ");
    for (int i = 0; i < 4; i++) {
        printf("%02X ", fi.bytes[i]);
    }
    printf("\\n");
    return 0;
}`,
        proTip: "Bitfields are non-portable across architectures because bit endianness is implementation-defined. For network protocols, explicit bitwise operations are safer."
      }
    ]
  },
  {
    id: "m9",
    title: "Module 9: File I/O & Preprocessor Metaprogramming",
    description: "File streams, buffered I/O, binary vs text files, macro traps, and header guards.",
    badge: "Pro",
    lessons: [
      {
        id: "m9-l1",
        title: "9.1 File Handling: Streams, fopen, fread, fwrite",
        readingTime: "13 min",
        content: `
### Files in C are Streams of Bytes
C treats all files as sequential byte streams managed via a \`FILE*\` handle structure defined in \`<stdio.h>\`.

### Opening Modes:
- \`"r"\`: Read text (file must exist).
- \`"w"\`: Write text (creates file or truncates existing file to 0 bytes).
- \`"a"\`: Append text to the end.
- \`"rb"\` / \`"wb"\`: Binary read / write (essential for images, audio, compiled data).

### Text I/O vs Binary I/O:
- Text: \`fprintf\`, \`fscanf\`, \`fgets\`, \`fputs\` (formats data as ASCII characters).
- Binary: \`fread\`, \`fwrite\` (dumps raw in-memory bytes directly to disk block by block).
        `,
        codeExample: `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int id;
    char name[20];
    float score;
} Student;

int main(void) {
    Student s1 = { 101, "Alice", 98.5f };

    // 1. Write binary struct directly to disk
    FILE *fout = fopen("student.bin", "wb");
    if (!fout) {
        perror("Failed to open file for writing");
        return 1;
    }
    fwrite(&s1, sizeof(Student), 1, fout);
    fclose(fout);

    // 2. Read back raw struct
    Student s2;
    FILE *fin = fopen("student.bin", "rb");
    if (!fin) {
        perror("Failed to open file for reading");
        return 1;
    }
    fread(&s2, sizeof(Student), 1, fin);
    fclose(fin);

    printf("Read Student: ID=%d, Name=%s, Score=%.1f\\n", s2.id, s2.name, s2.score);
    return 0;
}`,
        proTip: "Always check 'if (file == NULL)' immediately after 'fopen()'. Attempting to read or write to a NULL FILE* triggers a segmentation fault."
      },
      {
        id: "m9-l2",
        title: "9.2 Preprocessor Metaprogramming: Macros & Traps",
        readingTime: "11 min",
        content: `
### The Preprocessor is Text Replacement!
The preprocessor does not know C syntax, types, or scopes. It performs brute-force textual substitution before compilation begins.

### The Macro Traps:
\`\`\`c
// DANGEROUS MACRO:
#define SQUARE(x) x * x

int result = SQUARE(2 + 3);
// Expands to: 2 + 3 * 2 + 3 = 2 + 6 + 3 = 11! (NOT 25!)
\`\`\`

### The Proper Defensive Macro:
Wrap **every argument and the entire expression in parentheses**:
\`\`\`c
#define SQUARE(x) ((x) * (x))
\`\`\`

### Side-Effect Pitfall:
\`\`\`c
int a = 5;
int res = SQUARE(++a); // Expands to: ((++a) * (++a)) -> Undefined Behavior!
\`\`\`
Prefer modern C \`inline\` functions instead of macros whenever possible.
        `,
        codeExample: `#include <stdio.h>

#define MAX(a, b) (((a) > (b)) ? (a) : (b))

// Stringification operator (#) and Token-pasting (##)
#define PRINT_VAR(var) printf(#var " = %d\\n", var)
#define MAKE_FUNC(name) void func_##name(void) { printf("Inside " #name "\\n"); }

MAKE_FUNC(alpha)

int main(void) {
    int x = 10, y = 25;
    PRINT_VAR(x);
    PRINT_VAR(y);
    printf("Max of x and y: %d\\n", MAX(x, y));
    func_alpha();
    return 0;
}`,
        proTip: "Use Header Guards (#ifndef MY_HEADER_H ... #endif) or '#pragma once' in every single .h file to prevent multiple definition errors."
      }
    ]
  },
  {
    id: "m10",
    title: "Module 10: Advanced C & Pro Systems Engineering",
    description: "Data structures, Valgrind, Undefined Behavior catalog, and Linux kernel programming idioms.",
    badge: "Pro",
    lessons: [
      {
        id: "m10-l1",
        title: "10.1 Data Structures in Pure C: Singly Linked List",
        readingTime: "15 min",
        content: `
### Building Data Structures Without Built-in Libraries
In C++, you have \`std::vector\` and \`std::list\`. In pure C, you write your own data structures from scratch using pointers and heap allocations!

### Anatomy of a Linked List Node:
\`\`\`c
typedef struct Node {
    int data;           // The payload
    struct Node *next;  // Pointer to the next node in RAM
} Node;
\`\`\`

### Linked List vs Dynamic Array:
- Linked List: O(1) insertion at head, no need for contiguous memory, non-cache-friendly (nodes scattered in heap).
- Array: O(1) random access, cache-friendly, but resizing requires copying.
        `,
        codeExample: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node *next;
} Node;

void push_head(Node **head_ref, int new_data) {
    Node *new_node = malloc(sizeof(Node));
    new_node->data = new_data;
    new_node->next = *head_ref;
    *head_ref = new_node;
}

void print_list(const Node *head) {
    const Node *current = head;
    while (current != NULL) {
        printf("%d -> ", current->data);
        current = current->next;
    }
    printf("NULL\\n");
}

void free_list(Node *head) {
    Node *temp;
    while (head != NULL) {
        temp = head;
        head = head->next;
        free(temp);
    }
}

int main(void) {
    Node *head = NULL;
    push_head(&head, 30);
    push_head(&head, 20);
    push_head(&head, 10);

    print_list(head);
    free_list(head);
    return 0;
}`,
        proTip: "Notice how push_head takes a double pointer (Node **head_ref) so it can directly mutate the head variable residing in main's stack frame!"
      },
      {
        id: "m10-l2",
        title: "10.2 The Undefined Behavior (UB) Catalog: What Every Pro Must Know",
        readingTime: "16 min",
        content: `
### What is Undefined Behavior?
According to the ISO C standard, when an operation triggers Undefined Behavior, **the compiler is under zero obligation to produce sensible machine code**. It may crash, print nonsense, or worse: silently optimize away code you wrote!

### The Top 6 UB Traps in C:
1. **Dereferencing NULL or Dangling Pointers**: Instant crash or memory vulnerability.
2. **Out-of-Bounds Array Access**: Reading or corrupting unowned memory.
3. **Signed Integer Overflow**: Compiler assumes it never happens and eliminates safety checks.
4. **Modifying String Literals**: \`char *s = "hi"; s[0] = 'H';\` -> Crash.
5. **Unsequenced Modifications**: \`x = x++ + ++x;\` (The evaluation order is undefined).
6. **Use of Uninitialized Variables**: Reading garbage values from the stack.

### Pro Defense Strategy:
Compile with Sanitizers:
\`\`\`bash
gcc -Wall -Wextra -Wpedantic -fsanitize=address,undefined -g program.c
\`\`\`
AddressSanitizer (ASan) and UndefinedBehaviorSanitizer (UBSan) intercept bugs at runtime with exact line numbers!
        `,
        codeExample: `#include <stdio.h>

// Undefined Behavior Example (DO NOT DO THIS IN PRODUCTION):
int main(void) {
    int arr[3] = {1, 2, 3};
    
    // Valid:
    printf("arr[0] = %d\\n", arr[0]);
    
    // Compiler flag defense:
    printf("Compile with: gcc -Wall -Wextra -fsanitize=address,undefined\\n");
    return 0;
}`,
        proTip: "Never rely on behavior that 'happens to work' on your specific machine. If it's UB in the standard, the next compiler update or -O3 optimization flag will break it."
      },
      {
        id: "m10-l3",
        title: "10.3 The 'volatile' Keyword & Systems Hardware Programming",
        readingTime: "11 min",
        content: `
### What Does \`volatile\` Tell the Compiler?
Normally, an optimizing compiler caches variables in CPU registers and eliminates loops that seem to do nothing:

\`\`\`c
// Without volatile:
int ready = 0;
while (!ready) {
    // Compiler might optimize this into an infinite loop:
    // "ready doesn't change inside the loop, so why re-read it from RAM?"
}
\`\`\`

The \`volatile\` qualifier tells the compiler:
> **"This variable can be changed by hardware outside this thread (Interrupt Service Routine, hardware register, memory-mapped I/O). ALWAYS read its value directly from RAM every single time!"**

### When to use \`volatile\`:
1. Memory-Mapped I/O registers in embedded systems.
2. Global variables modified in an Interrupt Service Routine (ISR) or POSIX Signal Handler.
3. Setjmp / Longjmp local variables.
        `,
        codeExample: `#include <stdio.h>

// Simulated hardware status register
volatile unsigned int HARDWARE_STATUS = 0;

int main(void) {
    printf("Hardware status address: %p\\n", (void*)&HARDWARE_STATUS);
    printf("Volatile guarantees the CPU reads physical RAM without optimizing it away.\\n");
    return 0;
}`,
        proTip: "'volatile' is NOT thread synchronization or an atomic operation! For multithreading in C11, use <stdatomic.h> or pthread mutexes."
      }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LESSONS_DATA };
}
