// C-Forge: Daily Practice Problems (DPP) Database
// 30 Comprehensive problems spanning Beginner, Intermediate, and Pro levels with hints, test cases, and solutions.

const DPPS_DATA = [
  // --- TIER 1: BEGINNER (BEGINNER) ---
  {
    id: "dpp-1",
    day: 1,
    title: "Celsius to Fahrenheit Precision Converter",
    tier: "Beginner",
    category: "Basics & Arithmetic",
    xp: 50,
    description: "Write a program that takes a temperature in Celsius as input and converts it to Fahrenheit using the formula `F = (C * 9.0 / 5.0) + 32.0`. Output the result formatted to exactly 2 decimal places.",
    constraints: "-273.15 <= Celsius <= 10000.0",
    sampleInput: "100.0",
    sampleOutput: "212.00",
    testCases: [
      { input: "0.0", expected: "32.00" },
      { input: "100.0", expected: "212.00" },
      { input: "-40.0", expected: "-40.00" },
      { input: "37.5", expected: "99.50" }
    ],
    hint1: "Remember to use `9.0 / 5.0` instead of integer division `9 / 5` which truncates to 1!",
    hint2: "Use `printf(\"%.2f\\n\", fahrenheit);` to format output to 2 decimal places.",
    starterCode: `#include <stdio.h>

int main(void) {
    double celsius;
    if (scanf("%lf", &celsius) == 1) {
        // TODO: Calculate fahrenheit and print with %.2f
    }
    return 0;
}`,
    solution: `#include <stdio.h>

int main(void) {
    double celsius;
    if (scanf("%lf", &celsius) == 1) {
        double fahrenheit = (celsius * 9.0 / 5.0) + 32.0;
        printf("%.2f\\n", fahrenheit);
    }
    return 0;
}`,
    explanation: "Using floating-point literal 9.0 ensures floating-point arithmetic rather than integer truncation. %.2f formats the result to exactly two digits after the decimal point."
  },
  {
    id: "dpp-2",
    day: 2,
    title: "Fast Parity & Even/Odd Checker",
    tier: "Beginner",
    category: "Basics & Logic",
    xp: 50,
    description: "Read an integer `N` and determine if it is Even or Odd using the bitwise AND operator `&` rather than modulo `%`.",
    constraints: "-10^9 <= N <= 10^9",
    sampleInput: "7",
    sampleOutput: "ODD",
    testCases: [
      { input: "7", expected: "ODD" },
      { input: "12", expected: "EVEN" },
      { input: "0", expected: "EVEN" },
      { input: "-15", expected: "ODD" }
    ],
    hint1: "The lowest bit (least significant bit) of any even number is 0, and for odd numbers is 1.",
    hint2: "In C, `(N & 1) != 0` evaluates to true for odd numbers.",
    starterCode: `#include <stdio.h>

int main(void) {
    int n;
    if (scanf("%d", &n) == 1) {
        // TODO: Check bitwise parity and print EVEN or ODD
    }
    return 0;
}`,
    solution: `#include <stdio.h>

int main(void) {
    int n;
    if (scanf("%d", &n) == 1) {
        if ((n & 1) != 0) {
            printf("ODD\\n");
        } else {
            printf("EVEN\\n");
        }
    }
    return 0;
}`,
    explanation: "Bitwise AND with 1 tests the 0th bit of the number directly. This runs in 1 clock cycle without requiring CPU hardware division."
  },
  {
    id: "dpp-3",
    day: 3,
    title: "Leap Year Decision Tree",
    tier: "Beginner",
    category: "Control Flow",
    xp: 60,
    description: "Determine whether a given year `Y` is a Leap Year according to Gregorian calendar rules: A year is a leap year if divisible by 4, except end-of-century years which must also be divisible by 400.",
    constraints: "1 <= Y <= 9999",
    sampleInput: "2024",
    sampleOutput: "LEAP YEAR",
    testCases: [
      { input: "2024", expected: "LEAP YEAR" },
      { input: "1900", expected: "NOT LEAP YEAR" },
      { input: "2000", expected: "LEAP YEAR" },
      { input: "2023", expected: "NOT LEAP YEAR" }
    ],
    hint1: "Condition is: `(year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)`",
    hint2: "Notice operator precedence: `&&` binds tighter than `||`.",
    starterCode: `#include <stdio.h>

int main(void) {
    int year;
    if (scanf("%d", &year) == 1) {
        // TODO: Determine leap year
    }
    return 0;
}`,
    solution: `#include <stdio.h>

int main(void) {
    int year;
    if (scanf("%d", &year) == 1) {
        if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
            printf("LEAP YEAR\\n");
        } else {
            printf("NOT LEAP YEAR\\n");
        }
    }
    return 0;
}`,
    explanation: "Century years like 1900 fail the condition because 1900 % 100 == 0, whereas 2000 satisfies 2000 % 400 == 0."
  },
  {
    id: "dpp-4",
    day: 4,
    title: "Reverse Digits & Palindrome Checker",
    tier: "Beginner",
    category: "Loops & Math",
    xp: 65,
    description: "Given a positive integer `N`, reverse its digits and output whether the original number is a Palindrome (`PALINDROME` or `NOT PALINDROME`).",
    constraints: "1 <= N <= 2 * 10^9",
    sampleInput: "12321",
    sampleOutput: "PALINDROME",
    testCases: [
      { input: "12321", expected: "PALINDROME" },
      { input: "12345", expected: "NOT PALINDROME" },
      { input: "7", expected: "PALINDROME" },
      { input: "1001", expected: "PALINDROME" }
    ],
    hint1: "Extract the last digit using `N % 10` and append to reversed: `rev = rev * 10 + digit`.",
    hint2: "Use `long long` for the reversed number to prevent integer overflow.",
    starterCode: `#include <stdio.h>

int main(void) {
    long long n;
    if (scanf("%lld", &n) == 1) {
        // TODO: Reverse digits and compare
    }
    return 0;
}`,
    solution: `#include <stdio.h>

int main(void) {
    long long n;
    if (scanf("%lld", &n) == 1) {
        long long original = n;
        long long reversed = 0;
        
        while (n > 0) {
            reversed = reversed * 10 + (n % 10);
            n /= 10;
        }
        
        if (original == reversed) {
            printf("PALINDROME\\n");
        } else {
            printf("NOT PALINDROME\\n");
        }
    }
    return 0;
}`,
    explanation: "Reversing digits takes O(log10(N)) time. Comparing the reversed number with the original identifies palindromes."
  },
  {
    id: "dpp-5",
    day: 5,
    title: "Prime Number Verifier (Optimized sqrt(N))",
    tier: "Beginner",
    category: "Loops & Math",
    xp: 70,
    description: "Check if an integer `N` is prime in `O(sqrt(N))` time complexity. Print `PRIME` or `COMPOSITE` (or `NEITHER` if N <= 1).",
    constraints: "1 <= N <= 2 * 10^9",
    sampleInput: "29",
    sampleOutput: "PRIME",
    testCases: [
      { input: "29", expected: "PRIME" },
      { input: "1", expected: "NEITHER" },
      { input: "4", expected: "COMPOSITE" },
      { input: "997", expected: "PRIME" }
    ],
    hint1: "Any composite number N must have at least one factor <= sqrt(N). Loop condition can be `i * i <= N`.",
    hint2: "Handle special edge cases: N <= 1 (NEITHER), N == 2 or 3 (PRIME), even numbers (COMPOSITE).",
    starterCode: `#include <stdio.h>

int main(void) {
    long long n;
    if (scanf("%lld", &n) == 1) {
        // TODO: Implement O(sqrt(N)) primality test
    }
    return 0;
}`,
    solution: `#include <stdio.h>

int main(void) {
    long long n;
    if (scanf("%lld", &n) == 1) {
        if (n <= 1) {
            printf("NEITHER\\n");
            return 0;
        }
        if (n <= 3) {
            printf("PRIME\\n");
            return 0;
        }
        if (n % 2 == 0 || n % 3 == 0) {
            printf("COMPOSITE\\n");
            return 0;
        }
        
        int is_prime = 1;
        for (long long i = 5; i * i <= n; i += 6) {
            if (n % i == 0 || n % (i + 2) == 0) {
                is_prime = 0;
                break;
            }
        }
        
        if (is_prime) printf("PRIME\\n");
        else printf("COMPOSITE\\n");
    }
    return 0;
}`,
    explanation: "Testing up to sqrt(N) with the 6k ± 1 optimization skips unnecessary checks and provides maximum efficiency."
  },
  {
    id: "dpp-6",
    day: 6,
    title: "Array Min, Max and Mean in a Single Pass",
    tier: "Beginner",
    category: "Arrays",
    xp: 60,
    description: "Read an integer `N` followed by `N` integers. Find the minimum, maximum, and average (formatted to 2 decimal places) in a single linear pass `O(N)`.",
    constraints: "1 <= N <= 1000",
    sampleInput: "5 10 2 85 40 1",
    sampleOutput: "MIN: 1 | MAX: 85 | AVG: 27.60",
    testCases: [
      { input: "5 10 2 85 40 1", expected: "MIN: 1 | MAX: 85 | AVG: 27.60" },
      { input: "3 -10 -5 -20", expected: "MIN: -20 | MAX: -5 | AVG: -11.67" },
      { input: "1 42", expected: "MIN: 42 | MAX: 42 | AVG: 42.00" }
    ],
    hint1: "Initialize min and max with the first element of the array or INT_MAX / INT_MIN.",
    hint2: "Accumulate total sum as a `double` to prevent precision loss during average calculation.",
    starterCode: `#include <stdio.h>

int main(void) {
    int n;
    if (scanf("%d", &n) == 1 && n > 0) {
        // TODO: Read N elements and compute min, max, avg
    }
    return 0;
}`,
    solution: `#include <stdio.h>

int main(void) {
    int n;
    if (scanf("%d", &n) == 1 && n > 0) {
        int val;
        scanf("%d", &val);
        int min = val, max = val;
        double sum = val;
        
        for (int i = 1; i < n; i++) {
            scanf("%d", &val);
            if (val < min) min = val;
            if (val > max) max = val;
            sum += val;
        }
        printf("MIN: %d | MAX: %d | AVG: %.2f\\n", min, max, sum / n);
    }
    return 0;
}`,
    explanation: "Single pass O(N) traversal keeps memory usage O(1) without requiring storage of all elements in RAM."
  },
  {
    id: "dpp-7",
    day: 7,
    title: "In-Place String Reversal",
    tier: "Beginner",
    category: "Strings & Pointers",
    xp: 75,
    description: "Reverse a string in-place without allocating a second auxiliary buffer, using the two-pointer approach.",
    constraints: "String length <= 256 characters",
    sampleInput: "systems",
    sampleOutput: "smetsys",
    testCases: [
      { input: "systems", expected: "smetsys" },
      { input: "CForge", expected: "egroFC" },
      { input: "racecar", expected: "racecar" }
    ],
    hint1: "Use two pointers: `left = 0` and `right = strlen(str) - 1`.",
    hint2: "Swap `str[left]` and `str[right]`, then increment `left` and decrement `right` until they cross.",
    starterCode: `#include <stdio.h>
#include <string.h>

int main(void) {
    char str[256];
    if (scanf("%255s", str) == 1) {
        // TODO: Reverse string in-place
    }
    return 0;
}`,
    solution: `#include <stdio.h>
#include <string.h>

int main(void) {
    char str[256];
    if (scanf("%255s", str) == 1) {
        int left = 0;
        int right = (int)strlen(str) - 1;
        while (left < right) {
            char temp = str[left];
            str[left] = str[right];
            str[right] = temp;
            left++;
            right--;
        }
        printf("%s\\n", str);
    }
    return 0;
}`,
    explanation: "In-place reversal operates with O(N/2) swaps and O(1) extra space."
  },
  {
    id: "dpp-8",
    day: 8,
    title: "Check Power of Two via Bit Manipulation",
    tier: "Beginner",
    category: "Bitwise",
    xp: 70,
    description: "Given an integer `N`, determine if it is a positive power of 2 using a single bitwise expression in `O(1)` time.",
    constraints: "-2^31 <= N <= 2^31 - 1",
    sampleInput: "64",
    sampleOutput: "YES",
    testCases: [
      { input: "64", expected: "YES" },
      { input: "60", expected: "NO" },
      { input: "1", expected: "YES" },
      { input: "0", expected: "NO" },
      { input: "-16", expected: "NO" }
    ],
    hint1: "Powers of two in binary have exactly one '1' bit (e.g. 8 is 1000). What does (8 - 1) look like? (0111).",
    hint2: "Bitwise AND of `x & (x - 1)` clears the lowest set bit. If the result is 0 and x > 0, x is a power of 2!",
    starterCode: `#include <stdio.h>

int main(void) {
    long long n;
    if (scanf("%lld", &n) == 1) {
        // TODO: Check power of 2 using bitwise formula
    }
    return 0;
}`,
    solution: `#include <stdio.h>

int main(void) {
    long long n;
    if (scanf("%lld", &n) == 1) {
        if (n > 0 && ((n & (n - 1)) == 0)) {
            printf("YES\\n");
        } else {
            printf("NO\\n");
        }
    }
    return 0;
}`,
    explanation: "Subtracting 1 flips all bits after the least significant set bit. If N is a power of 2, it has only one set bit, so N & (N - 1) yields 0."
  },
  {
    id: "dpp-9",
    day: 9,
    title: "Count Vowels and Consonants in Stream",
    tier: "Beginner",
    category: "Strings & Characters",
    xp: 60,
    description: "Read a line of text and count the number of vowels and consonants (ignoring spaces, digits, and punctuation).",
    constraints: "Input line up to 1024 characters.",
    sampleInput: "Hello World 2026",
    sampleOutput: "VOWELS: 3 | CONSONANTS: 7",
    testCases: [
      { input: "Hello World 2026", expected: "VOWELS: 3 | CONSONANTS: 7" },
      { input: "C Programming", expected: "VOWELS: 3 | CONSONANTS: 9" },
      { input: "AEIOU", expected: "VOWELS: 5 | CONSONANTS: 0" }
    ],
    hint1: "Use `tolower(ch)` from `<ctype.h>` to simplify letter checking.",
    hint2: "Check `isalpha(ch)` to distinguish letters from digits and symbols.",
    starterCode: `#include <stdio.h>
#include <ctype.h>

int main(void) {
    char line[1024];
    if (fgets(line, sizeof(line), stdin)) {
        // TODO: Count vowels and consonants
    }
    return 0;
}`,
    solution: `#include <stdio.h>
#include <ctype.h>

int main(void) {
    char line[1024];
    if (fgets(line, sizeof(line), stdin)) {
        int vowels = 0, consonants = 0;
        for (int i = 0; line[i] != '\\0'; i++) {
            char c = tolower((unsigned char)line[i]);
            if (c >= 'a' && c <= 'z') {
                if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
                    vowels++;
                } else {
                    consonants++;
                }
            }
        }
        printf("VOWELS: %d | CONSONANTS: %d\\n", vowels, consonants);
    }
    return 0;
}`,
    explanation: "Normalizing characters with tolower avoids duplicating upper/lower case branches."
  },
  {
    id: "dpp-10",
    day: 10,
    title: "Pascal's Triangle Generator",
    tier: "Beginner",
    category: "Arrays & Logic",
    xp: 75,
    description: "Given row count `N`, generate the first `N` rows of Pascal's Triangle. Each number is the sum of the two numbers directly above it.",
    constraints: "1 <= N <= 15",
    sampleInput: "4",
    sampleOutput: "1\n1 1\n1 2 1\n1 3 3 1",
    testCases: [
      { input: "4", expected: "1\n1 1\n1 2 1\n1 3 3 1" },
      { input: "1", expected: "1" },
      { input: "3", expected: "1\n1 1\n1 2 1" }
    ],
    hint1: "The ends of each row are always 1: `triangle[r][0] = 1` and `triangle[r][r] = 1`.",
    hint2: "For inner elements: `triangle[r][c] = triangle[r-1][c-1] + triangle[r-1][c]`.",
    starterCode: `#include <stdio.h>

int main(void) {
    int n;
    if (scanf("%d", &n) == 1) {
        // TODO: Generate and print Pascal's Triangle
    }
    return 0;
}`,
    solution: `#include <stdio.h>

int main(void) {
    int n;
    if (scanf("%d", &n) == 1) {
        int tri[16][16] = {0};
        for (int r = 0; r < n; r++) {
            tri[r][0] = 1;
            tri[r][r] = 1;
            for (int c = 1; c < r; c++) {
                tri[r][c] = tri[r-1][c-1] + tri[r-1][c];
            }
            for (int c = 0; c <= r; c++) {
                printf("%d%s", tri[r][c], (c == r) ? "" : " ");
            }
            printf("\\n");
        }
    }
    return 0;
}`,
    explanation: "Dynamic programming state transition fills the table row by row."
  },

  // --- TIER 2: INTERMEDIATE (INTERMEDIATE) ---
  {
    id: "dpp-11",
    day: 11,
    title: "Pointer Arithmetic & Array Slice Sum",
    tier: "Intermediate",
    category: "Pointers & Memory",
    xp: 90,
    description: "Write a function `long long range_sum(const int *start, const int *end)` that calculates the sum of all elements between two pointer addresses (inclusive) strictly using pointer increments.",
    constraints: "Array size <= 10000",
    sampleInput: "5\n10 20 30 40 50\n1 3",
    sampleOutput: "SUM: 90",
    testCases: [
      { input: "5\n10 20 30 40 50\n1 3", expected: "SUM: 90" },
      { input: "4\n5 5 5 5\n0 3", expected: "SUM: 20" },
      { input: "3\n100 200 300\n2 2", expected: "SUM: 300" }
    ],
    hint1: "Loop while `start <= end`, dereference `*start`, and increment pointer: `start++`.",
    hint2: "Do not use bracket indexing `arr[i]` inside the range function.",
    starterCode: `#include <stdio.h>

long long range_sum(const int *start, const int *end) {
    // TODO: Calculate sum using pointer arithmetic
}

int main(void) {
    // Read input, call range_sum, and print SUM: <result>
    return 0;
}`,
    solution: `#include <stdio.h>

long long range_sum(const int *start, const int *end) {
    long long sum = 0;
    while (start <= end) {
        sum += *start;
        start++;
    }
    return sum;
}

int main(void) {
    int n;
    if (scanf("%d", &n) == 1 && n > 0) {
        int arr[1000];
        for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
        int l, r;
        if (scanf("%d %d", &l, &r) == 2) {
            printf("SUM: %lld\\n", range_sum(&arr[l], &arr[r]));
        }
    }
    return 0;
}`,
    explanation: "Demonstrates that pointer addresses can be compared with '<=' and dereferenced sequentially."
  },
  {
    id: "dpp-12",
    day: 12,
    title: "Dynamic String Concatenation & Reallocation",
    tier: "Intermediate",
    category: "Dynamic Memory",
    xp: 100,
    description: "Implement a dynamic string appender `char* append_str(char *dest, const char *src)` that safely expands `dest` using `realloc` and appends `src` without buffer overflows.",
    constraints: "Source strings up to 500 characters",
    sampleInput: "Hello _World_ from_CForge",
    sampleOutput: "RESULT: Hello_World_from_CForge | LEN: 24",
    testCases: [
      { input: "Hello _World_ from_CForge", expected: "RESULT: Hello_World_from_CForge | LEN: 24" }
    ],
    hint1: "New length will be `strlen(dest) + strlen(src) + 1` (for '\\0').",
    hint2: "Always assign realloc return to a temporary pointer to prevent memory leaks if realloc fails.",
    starterCode: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char* append_str(char *dest, const char *src) {
    // TODO: Use realloc to expand dest and append src
}

int main(void) {
    return 0;
}`,
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char* append_str(char *dest, const char *src) {
    size_t old_len = (dest == NULL) ? 0 : strlen(dest);
    size_t add_len = strlen(src);
    size_t new_len = old_len + add_len;
    
    char *new_buf = realloc(dest, new_len + 1);
    if (!new_buf) {
        free(dest);
        return NULL;
    }
    
    strcpy(new_buf + old_len, src);
    return new_buf;
}

int main(void) {
    char *s = NULL;
    s = append_str(s, "Hello");
    s = append_str(s, "_World_");
    s = append_str(s, "from_CForge");
    
    if (s) {
        printf("RESULT: %s | LEN: %zu\\n", s, strlen(s));
        free(s);
    }
    return 0;
}`,
    explanation: "Proper dynamic memory growth handling ensures defensive reallocation without memory leaks."
  },
  {
    id: "dpp-13",
    day: 13,
    title: "Struct Alignment & Byte Packing Inspector",
    tier: "Intermediate",
    category: "Structs & Memory",
    xp: 95,
    description: "Investigate how struct member ordering affects padding. Read struct fields and demonstrate memory optimization by printing sizes before and after optimal reordering.",
    constraints: "Standard 64-bit alignment rules",
    sampleInput: "INSPECT",
    sampleOutput: "UNPACKED: 16 BYTES | OPTIMIZED: 12 BYTES | SAVED: 4 BYTES",
    testCases: [
      { input: "INSPECT", expected: "UNPACKED: 16 BYTES | OPTIMIZED: 12 BYTES | SAVED: 4 BYTES" }
    ],
    hint1: "A struct containing `char a`, `int b`, `char c`, `int d` requires 16 bytes due to padding.",
    hint2: "Reordering members as `int b`, `int d`, `char a`, `char c` packs it down to 12 bytes.",
    starterCode: `#include <stdio.h>

struct Unpacked {
    char a;
    int b;
    char c;
    int d;
};

struct Optimized {
    // TODO: Reorder members to minimize padding
};

int main(void) {
    return 0;
}`,
    solution: `#include <stdio.h>

struct Unpacked {
    char a;
    int b;
    char c;
    int d;
};

struct Optimized {
    int b;
    int d;
    char a;
    char c;
};

int main(void) {
    size_t u = sizeof(struct Unpacked);
    size_t o = sizeof(struct Optimized);
    printf("UNPACKED: %zu BYTES | OPTIMIZED: %zu BYTES | SAVED: %zu BYTES\\n", u, o, u - o);
    return 0;
}`,
    explanation: "Grouping 4-byte integers together and 1-byte chars together satisfies CPU alignment while minimizing internal hole padding."
  },
  {
    id: "dpp-14",
    day: 14,
    title: "Generic Array QuickSort with Function Pointers",
    tier: "Intermediate",
    category: "Function Pointers",
    xp: 110,
    description: "Utilize C standard library `qsort` with custom comparator function pointers to sort an array of integers first in ascending order, then in descending order.",
    constraints: "Array length <= 1000",
    sampleInput: "5\n42 12 88 3 19",
    sampleOutput: "ASC: 3 12 19 42 88\nDESC: 88 42 19 12 3",
    testCases: [
      { input: "5\n42 12 88 3 19", expected: "ASC: 3 12 19 42 88\nDESC: 88 42 19 12 3" }
    ],
    hint1: "The comparator prototype for qsort is `int cmp(const void *a, const void *b)`.",
    hint2: "Cast `const void *` to `const int *` and subtract or compare: `*(const int*)a - *(const int*)b`.",
    starterCode: `#include <stdio.h>
#include <stdlib.h>

int cmp_asc(const void *a, const void *b) {
    // TODO
}

int cmp_desc(const void *a, const void *b) {
    // TODO
}

int main(void) {
    return 0;
}`,
    solution: `#include <stdio.h>
#include <stdlib.h>

int cmp_asc(const void *a, const void *b) {
    int arg1 = *(const int*)a;
    int arg2 = *(const int*)b;
    if (arg1 < arg2) return -1;
    if (arg1 > arg2) return 1;
    return 0;
}

int cmp_desc(const void *a, const void *b) {
    return cmp_asc(b, a);
}

int main(void) {
    int n;
    if (scanf("%d", &n) == 1 && n > 0) {
        int arr[100];
        for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
        
        qsort(arr, n, sizeof(int), cmp_asc);
        printf("ASC: ");
        for (int i = 0; i < n; i++) printf("%d%s", arr[i], (i == n - 1) ? "" : " ");
        printf("\\n");
        
        qsort(arr, n, sizeof(int), cmp_desc);
        printf("DESC: ");
        for (int i = 0; i < n; i++) printf("%d%s", arr[i], (i == n - 1) ? "" : " ");
        printf("\\n");
    }
    return 0;
}`,
    explanation: "Void pointers allow qsort to operate generically over any data type. The callback function pointer dictates ordering."
  },
  {
    id: "dpp-15",
    day: 15,
    title: "Bitwise Hash & XOR Duplicate Finder",
    tier: "Intermediate",
    category: "Bitwise",
    xp: 95,
    description: "In an array where every integer appears exactly twice except for ONE unique integer that appears only once, find the unique integer in `O(N)` time and `O(1)` memory.",
    constraints: "Array length up to 10^5, N is odd.",
    sampleInput: "7\n9 3 5 3 9 7 5",
    sampleOutput: "UNIQUE: 7",
    testCases: [
      { input: "7\n9 3 5 3 9 7 5", expected: "UNIQUE: 7" },
      { input: "5\n1 2 2 1 42", expected: "UNIQUE: 42" },
      { input: "1\n100", expected: "UNIQUE: 100" }
    ],
    hint1: "Remember the properties of XOR: `x ^ x = 0` and `x ^ 0 = x`.",
    hint2: "XORing all elements together cancels out all duplicate pairs, leaving only the unique number!",
    starterCode: `#include <stdio.h>

int main(void) {
    int n;
    if (scanf("%d", &n) == 1) {
        // TODO: Find unique element using XOR
    }
    return 0;
}`,
    solution: `#include <stdio.h>

int main(void) {
    int n;
    if (scanf("%d", &n) == 1) {
        int unique = 0;
        for (int i = 0; i < n; i++) {
            int val;
            scanf("%d", &val);
            unique ^= val;
        }
        printf("UNIQUE: %d\\n", unique);
    }
    return 0;
}`,
    explanation: "XOR is associative and commutative. All pairs x ^ x annihilate to 0, leaving 0 ^ unique = unique."
  },

  // --- TIER 3: ADVANCED (PRO / SYSTEMS / DATA STRUCTURES) ---
  {
    id: "dpp-21",
    day: 21,
    title: "Singly Linked List with Tail Insertion & Free",
    tier: "Advanced",
    category: "Data Structures",
    xp: 150,
    description: "Implement a singly linked list with `append_node(Node **head, int data)` in O(1) by tracking tail pointer, followed by a memory-safe `free_list(Node *head)` that prevents memory leaks.",
    constraints: "Up to 1000 nodes",
    sampleInput: "4\n10 20 30 40",
    sampleOutput: "LIST: 10 -> 20 -> 30 -> 40 -> NULL | FREED 4 NODES",
    testCases: [
      { input: "4\n10 20 30 40", expected: "LIST: 10 -> 20 -> 30 -> 40 -> NULL | FREED 4 NODES" }
    ],
    hint1: "Define `typedef struct Node { int data; struct Node *next; } Node;`",
    hint2: "When freeing, store `next` pointer in a temporary variable before calling `free(current)`.",
    starterCode: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node *next;
} Node;

// TODO: Implement append, display, and free
int main(void) {
    return 0;
}`,
    solution: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node *next;
} Node;

void append(Node **head, Node **tail, int val) {
    Node *n = malloc(sizeof(Node));
    n->data = val;
    n->next = NULL;
    if (*head == NULL) {
        *head = n;
        *tail = n;
    } else {
        (*tail)->next = n;
        *tail = n;
    }
}

int free_list(Node *head) {
    int count = 0;
    while (head != NULL) {
        Node *temp = head->next;
        free(head);
        head = temp;
        count++;
    }
    return count;
}

int main(void) {
    int n;
    if (scanf("%d", &n) == 1 && n > 0) {
        Node *head = NULL, *tail = NULL;
        for (int i = 0; i < n; i++) {
            int v;
            scanf("%d", &v);
            append(&head, &tail, v);
        }
        
        printf("LIST: ");
        for (Node *curr = head; curr != NULL; curr = curr->next) {
            printf("%d -> ", curr->data);
        }
        printf("NULL");
        
        int freed = free_list(head);
        printf(" | FREED %d NODES\\n", freed);
    }
    return 0;
}`,
    explanation: "Tracking both head and tail allows O(1) appends. Proper temporary pointer caching avoids reading from freed memory."
  },
  {
    id: "dpp-22",
    day: 22,
    title: "Generic Void Pointer Stack (LIFO Engine)",
    tier: "Advanced",
    category: "Data Structures & Memory",
    xp: 160,
    description: "Design a generic Stack that can push and pop arbitrary data types using `void*` and dynamic capacity doubling.",
    constraints: "Stack capacity expands dynamically",
    sampleInput: "PUSH 10 PUSH 20 PUSH 30 POP POP",
    sampleOutput: "POPPED: 30 | POPPED: 20 | REMAINING: 1",
    testCases: [
      { input: "PUSH 10 PUSH 20 PUSH 30 POP POP", expected: "POPPED: 30 | POPPED: 20 | REMAINING: 1" }
    ],
    hint1: "Store `void **items` in the struct, with `size_t capacity` and `size_t top`.",
    hint2: "When `top == capacity`, double capacity with `realloc`.",
    starterCode: `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    void **data;
    size_t capacity;
    size_t top;
} GenericStack;

int main(void) {
    return 0;
}`,
    solution: `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    void **items;
    size_t capacity;
    size_t top;
} Stack;

Stack* create_stack(size_t init_cap) {
    Stack *s = malloc(sizeof(Stack));
    s->capacity = init_cap ? init_cap : 4;
    s->top = 0;
    s->items = malloc(s->capacity * sizeof(void*));
    return s;
}

void push(Stack *s, void *item) {
    if (s->top >= s->capacity) {
        s->capacity *= 2;
        s->items = realloc(s->items, s->capacity * sizeof(void*));
    }
    s->items[s->top++] = item;
}

void* pop(Stack *s) {
    if (s->top == 0) return NULL;
    return s->items[--s->top];
}

int main(void) {
    Stack *st = create_stack(2);
    int a = 10, b = 20, c = 30;
    push(st, &a);
    push(st, &b);
    push(st, &c);
    
    int *p1 = (int*)pop(st);
    int *p2 = (int*)pop(st);
    printf("POPPED: %d | POPPED: %d | REMAINING: %zu\\n", *p1, *p2, st->top);
    
    free(st->items);
    free(st);
    return 0;
}`,
    explanation: "Void double pointer arrays allow storing pointers to any primitive or struct, matching the polymorphism pattern used in the Linux kernel."
  },
  {
    id: "dpp-23",
    day: 23,
    title: "Hex Memory Dumper (HexDump Utility)",
    tier: "Advanced",
    category: "Systems & Memory",
    xp: 155,
    description: "Write a systems hex-dump function `void hexdump(const void *addr, size_t len)` that prints memory addresses, raw hexadecimal byte values, and ASCII printable representation.",
    constraints: "Memory buffer up to 128 bytes",
    sampleInput: "DUMP_STRING",
    sampleOutput: "0x0000: 43 2D 46 6F 72 67 65 21  |C-Forge!|",
    testCases: [
      { input: "DUMP_STRING", expected: "0x0000: 43 2D 46 6F 72 67 65 21  |C-Forge!|" }
    ],
    hint1: "Cast the input pointer to `const unsigned char *` to inspect raw individual bytes.",
    hint2: "Check `isprint(byte)` to output characters, or `.` for non-printable bytes.",
    starterCode: `#include <stdio.h>
#include <ctype.h>

void hexdump(const void *addr, size_t len) {
    // TODO: Implement hex dump
}

int main(void) {
    return 0;
}`,
    solution: `#include <stdio.h>
#include <ctype.h>

void hexdump(const void *addr, size_t len) {
    const unsigned char *p = (const unsigned char*)addr;
    printf("0x0000: ");
    for (size_t i = 0; i < len; i++) {
        printf("%02X ", p[i]);
    }
    printf(" |");
    for (size_t i = 0; i < len; i++) {
        printf("%c", isprint(p[i]) ? p[i] : '.');
    }
    printf("|\\n");
}

int main(void) {
    const char msg[] = "C-Forge!";
    hexdump(msg, sizeof(msg) - 1);
    return 0;
}`,
    explanation: "Inspects raw RAM byte representations directly, identical to standard diagnostic tools like xxd or gdb x/bx."
  },
  {
    id: "dpp-24",
    day: 24,
    title: "Custom Memory Allocator Arena (Bump Allocator)",
    tier: "Advanced",
    category: "Systems & Memory",
    xp: 180,
    description: "Implement a blazing fast Arena (Region-based Bump Allocator) in C. Pre-allocate 1KB buffer, allocate sub-blocks aligned to 8-byte boundaries, and free all memory instantaneously in O(1).",
    constraints: "Arena size: 1024 bytes",
    sampleInput: "ARENA_TEST",
    sampleOutput: "ALLOC 32B | ALLOC 64B | ARENA USED: 96B | ARENA RESET O(1)",
    testCases: [
      { input: "ARENA_TEST", expected: "ALLOC 32B | ALLOC 64B | ARENA USED: 96B | ARENA RESET O(1)" }
    ],
    hint1: "Arena struct holds `char *buffer`, `size_t capacity`, `size_t offset`.",
    hint2: "Bump allocation simply advances `offset += size`.",
    starterCode: `#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

typedef struct {
    char *buffer;
    size_t capacity;
    size_t offset;
} Arena;

// TODO: arena_init, arena_alloc, arena_reset
int main(void) {
    return 0;
}`,
    solution: `#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

typedef struct {
    char *buffer;
    size_t capacity;
    size_t offset;
} Arena;

Arena arena_create(size_t cap) {
    Arena a;
    a.buffer = malloc(cap);
    a.capacity = cap;
    a.offset = 0;
    return a;
}

void* arena_alloc(Arena *a, size_t size) {
    // 8-byte alignment
    size_t aligned_size = (size + 7) & ~7;
    if (a->offset + aligned_size > a->capacity) return NULL;
    void *ptr = &a->buffer[a->offset];
    a->offset += aligned_size;
    return ptr;
}

void arena_reset(Arena *a) {
    a->offset = 0; // O(1) instantaneous free!
}

int main(void) {
    Arena a = arena_create(1024);
    void *p1 = arena_alloc(&a, 32);
    void *p2 = arena_alloc(&a, 64);
    if (p1 && p2) {
        printf("ALLOC 32B | ALLOC 64B | ARENA USED: %zuB | ARENA RESET O(1)\\n", a.offset);
        arena_reset(&a);
    }
    free(a.buffer);
    return 0;
}`,
    explanation: "Arena allocators eliminate heap fragmentation and per-object free overhead, used heavily in game engines and compilers."
  },
  {
    id: "dpp-25",
    day: 25,
    title: "Binary Search Tree (Insert & Inorder Traversal)",
    tier: "Advanced",
    category: "Data Structures",
    xp: 170,
    description: "Construct a Binary Search Tree (BST) in C. Insert nodes recursively and print the keys in sorted order using in-order traversal (Left, Root, Right).",
    constraints: "Keys up to 1000",
    sampleInput: "5\n50 30 70 20 40",
    sampleOutput: "BST INORDER: 20 30 40 50 70",
    testCases: [
      { input: "5\n50 30 70 20 40", expected: "BST INORDER: 20 30 40 50 70" }
    ],
    hint1: "A BST node has `int key`, `struct BSTNode *left`, `struct BSTNode *right`.",
    hint2: "Inorder: `traverse(root->left); printf(\"%d \", root->key); traverse(root->right);`",
    starterCode: `#include <stdio.h>
#include <stdlib.h>

typedef struct BSTNode {
    int key;
    struct BSTNode *left, *right;
} BSTNode;

int main(void) {
    return 0;
}`,
    solution: `#include <stdio.h>
#include <stdlib.h>

typedef struct BSTNode {
    int key;
    struct BSTNode *left, *right;
} BSTNode;

BSTNode* insert(BSTNode *node, int key) {
    if (node == NULL) {
        BSTNode *n = malloc(sizeof(BSTNode));
        n->key = key;
        n->left = n->right = NULL;
        return n;
    }
    if (key < node->key) node->left = insert(node->left, key);
    else if (key > node->key) node->right = insert(node->right, key);
    return node;
}

void inorder(BSTNode *root) {
    if (root != NULL) {
        inorder(root->left);
        printf("%d ", root->key);
        inorder(root->right);
    }
}

void free_tree(BSTNode *root) {
    if (root != NULL) {
        free_tree(root->left);
        free_tree(root->right);
        free(root);
    }
}

int main(void) {
    int n;
    if (scanf("%d", &n) == 1 && n > 0) {
        BSTNode *root = NULL;
        for (int i = 0; i < n; i++) {
            int k;
            scanf("%d", &k);
            root = insert(root, k);
        }
        printf("BST INORDER: ");
        inorder(root);
        printf("\\n");
        free_tree(root);
    }
    return 0;
}`,
    explanation: "In-order traversal of a valid BST naturally produces strictly increasing sorted values in O(N) time."
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DPPS_DATA };
}
