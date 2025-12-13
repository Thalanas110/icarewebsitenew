/*
============================================================
  HEAP BUFFER OVERFLOW – EDUCATIONAL DEMO (PURE C)
  Platform: Windows / MSVC
  Build: Debug (/RTC1 recommended)
============================================================

  ⚠️ DO NOT USE THIS CODE IN PRODUCTION ⚠️

  This program intentionally corrupts heap memory to
  demonstrate:
    - How heap buffers are laid out
    - Why unchecked writes are dangerous
    - Why crashes often occur far from the bug
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>

/* ============================================================
   CONSTANTS
============================================================ */

#define SMALL_BUF_SIZE 16
#define MEDIUM_BUF_SIZE 32
#define LARGE_BUF_SIZE 64

#define OVERFLOW_WRITE_SIZE 128

/* ============================================================
   STRUCTURES (to make heap layout interesting)
============================================================ */

typedef struct HeapBlock {
    char name[16];
    int id;
    char *data;
} HeapBlock;

/* ============================================================
   FUNCTION DECLARATIONS
============================================================ */

void banner(void);
void explain(void);

char *allocate_buffer(size_t size, const char *tag);
void fill_buffer_safe(char *buf, size_t size, char value);
void overflow_buffer(char *buf);

HeapBlock *create_block(const char *name, int id, size_t data_size);
void destroy_block(HeapBlock *block);

void print_memory_hex(const unsigned char *ptr, size_t len);

void phase_one(void);
void phase_two(void);
void phase_three(void);

/* ============================================================
   UTILITY FUNCTIONS
============================================================ */

void banner(void) {
    printf("=============================================\n");
    printf("  HEAP BUFFER OVERFLOW DEMO (PURE C)\n");
    printf("=============================================\n\n");
}

void explain(void) {
    printf("[INFO] This program intentionally corrupts heap memory.\n");
    printf("[INFO] Run in DEBUG mode to see heap diagnostics.\n");
    printf("[INFO] Crashes may occur during free().\n\n");
}

/* ============================================================
   HEAP ALLOCATION HELPERS
============================================================ */

char *allocate_buffer(size_t size, const char *tag) {
    char *buf = (char *)malloc(size);

    if (!buf) {
        printf("[ERROR] malloc failed for %s\n", tag);
        exit(1);
    }

    printf("[ALLOC] %s → %zu bytes at %p\n", tag, size, (void *)buf);
    return buf;
}

void fill_buffer_safe(char *buf, size_t size, char value) {
    size_t i;
    for (i = 0; i < size; i++) {
        buf[i] = value;
    }
}

void overflow_buffer(char *buf) {
    size_t i;

    printf("[OVERFLOW] Writing %d bytes into smaller heap buffer...\n",
           OVERFLOW_WRITE_SIZE);

    for (i = 0; i < OVERFLOW_WRITE_SIZE; i++) {
        buf[i] = 'X';  // INTENTIONAL OVERFLOW
    }
}

/* ============================================================
   HEAP BLOCK MANAGEMENT
============================================================ */

HeapBlock *create_block(const char *name, int id, size_t data_size) {
    HeapBlock *block = (HeapBlock *)malloc(sizeof(HeapBlock));

    if (!block) {
        printf("[ERROR] malloc failed for HeapBlock\n");
        exit(1);
    }

    strncpy(block->name, name, sizeof(block->name) - 1);
    block->name[sizeof(block->name) - 1] = '\0';

    block->id = id;
    block->data = allocate_buffer(data_size, "HeapBlock.data");

    fill_buffer_safe(block->data, data_size, 'A');

    printf("[CREATE] Block '%s' (id=%d) at %p\n",
           block->name, block->id, (void *)block);

    return block;
}

void destroy_block(HeapBlock *block) {
    if (!block) return;

    printf("[FREE] Block '%s'\n", block->name);

    free(block->data);
    free(block);
}

/* ============================================================
   MEMORY INSPECTION
============================================================ */

void print_memory_hex(const unsigned char *ptr, size_t len) {
    size_t i;

    for (i = 0; i < len; i++) {
        if (i % 16 == 0)
            printf("\n%p: ", (void *)(ptr + i));

        printf("%02X ", ptr[i]);
    }
    printf("\n");
}

/* ============================================================
   PHASES
============================================================ */

void phase_one(void) {
    printf("\n========== PHASE 1: NORMAL HEAP ==========\n");

    char *buf = allocate_buffer(SMALL_BUF_SIZE, "SmallBuffer");
    fill_buffer_safe(buf, SMALL_BUF_SIZE, 'S');

    printf("[INFO] Buffer content before free:\n");
    print_memory_hex((unsigned char *)buf, SMALL_BUF_SIZE);

    free(buf);
}

void phase_two(void) {
    printf("\n========== PHASE 2: HEAP OVERFLOW ==========\n");

    char *victim = allocate_buffer(SMALL_BUF_SIZE, "VictimBuffer");
    char *neighbor = allocate_buffer(MEDIUM_BUF_SIZE, "NeighborBuffer");

    fill_buffer_safe(victim, SMALL_BUF_SIZE, 'V');
    fill_buffer_safe(neighbor, MEDIUM_BUF_SIZE, 'N');

    printf("[INFO] Neighbor BEFORE overflow:\n");
    print_memory_hex((unsigned char *)neighbor, MEDIUM_BUF_SIZE);

    overflow_buffer(victim);

    printf("[INFO] Neighbor AFTER overflow:\n");
    print_memory_hex((unsigned char *)neighbor, MEDIUM_BUF_SIZE);

    free(victim);
    free(neighbor);
}

void phase_three(void) {
    printf("\n========== PHASE 3: STRUCT CORRUPTION ==========\n");

    HeapBlock *a = create_block("Alpha", 1, SMALL_BUF_SIZE);
    HeapBlock *b = create_block("Bravo", 2, SMALL_BUF_SIZE);

    printf("[INFO] Overflowing Alpha.data to corrupt Bravo...\n");
    overflow_buffer(a->data);

    printf("[INFO] Attempting to free corrupted structures...\n");

    destroy_block(a);
    destroy_block(b);
}

/* ============================================================
   MAIN
============================================================ */

int main(void) {
    banner();
    explain();

    phase_one();
    phase_two();
    phase_three();

    printf("\n[END] Program completed (if heap survived).\n");
    return 0;
}
