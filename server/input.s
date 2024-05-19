.intel_syntax noprefix

.section .data
_str_0:
    .string "%d "

.section .text
.global main

OUT_OF_BOUNDS:
    mov rax, 60
    mov rdi, -1
    syscall

fibonacci:
# prologue
    push rbp
    mov rbp, rsp
# storing arg #0 onto stack
    mov [rbp - 16], rdi
# loading arg into _n_0_1
    mov rax, [rbp - 16]
    mov [rbp - 8], rax
# loading _n_0_1 into __temp_1
    mov rax, [rbp - 8]
    mov [rbp - 24], rax
# loading 1 into __temp_2
    mov rax, 1
    mov [rbp - 32], rax
# __temp_3 = __temp_1 <= __temp_2
    mov rax, [rbp - 24]
    cmp rax, [rbp - 32]
    setle al
    movzb rax, al
    mov [rbp - 40], rax
# loading __temp_3 into __temp_0
    mov rax, [rbp - 40]
    mov [rbp - 48], rax
# jumping to Label _BASIC_BLOCK_0 if __temp_0 == 1
    mov rax, [rbp - 48]
    cmp rax, 1
    je _BASIC_BLOCK_0
# jumping to Label _BASIC_BLOCK_1
    jmp _BASIC_BLOCK_1
_BASIC_BLOCK_0:
# loading _n_0_1 into __temp_5
    mov rax, [rbp - 8]
    mov [rbp - 72], rax
# loading __temp_5 into __temp_4
    mov rax, [rbp - 72]
    mov [rbp - 80], rax
# returning __temp_4
    mov rax, [rbp - 80]
    leave
    ret
# jumping to Label _BASIC_BLOCK_1
    jmp _BASIC_BLOCK_1
_BASIC_BLOCK_1:
# loading _n_0_1 into __temp_8
    mov rax, [rbp - 8]
    mov [rbp - 88], rax
# loading 1 into __temp_9
    mov rax, 1
    mov [rbp - 96], rax
# __temp_10 = __temp_8 - __temp_9
    mov rax, [rbp - 88]
    sub rax, [rbp - 96]
    mov [rbp - 104], rax
# loading __temp_10 into __temp_7
    mov rax, [rbp - 104]
    mov [rbp - 112], rax
# preparing call to fibonacci
# storing __temp_7 into arg #0
    mov rdi, [rbp - 112]
# calling fibonacci
    mov rsp, rbp
    sub rsp, 128
    mov rax, 0
    call fibonacci
# loading result into __temp_11
    mov [rbp - 120], rax
# loading _n_0_1 into __temp_13
    mov rax, [rbp - 8]
    mov [rbp - 128], rax
# loading 2 into __temp_14
    mov rax, 2
    mov [rbp - 136], rax
# __temp_15 = __temp_13 - __temp_14
    mov rax, [rbp - 128]
    sub rax, [rbp - 136]
    mov [rbp - 144], rax
# loading __temp_15 into __temp_12
    mov rax, [rbp - 144]
    mov [rbp - 152], rax
# preparing call to fibonacci
# storing __temp_12 into arg #0
    mov rdi, [rbp - 152]
# calling fibonacci
    mov rsp, rbp
    sub rsp, 160
    mov rax, 0
    call fibonacci
# loading result into __temp_16
    mov [rbp - 160], rax
# __temp_17 = __temp_11 + __temp_16
    mov rax, [rbp - 120]
    add rax, [rbp - 160]
    mov [rbp - 168], rax
# loading __temp_17 into __temp_6
    mov rax, [rbp - 168]
    mov [rbp - 176], rax
# returning __temp_6
    mov rax, [rbp - 176]
    leave
    ret
# jumping to Label _fibonacci_end
    jmp _fibonacci_end
# epilogue
_fibonacci_end:
    mov rax, 60
    mov rdi, -2
    syscall

main:
# prologue
    push rbp
    mov rbp, rsp
# loading 0 into _i_0_1
    mov rax, 0
    mov [rbp - 8], rax
# loading 0 into __temp_19
    mov rax, 0
    mov [rbp - 16], rax
# loading __temp_19 into __temp_18
    mov rax, [rbp - 16]
    mov [rbp - 24], rax
# loading __temp_18 into _i_0_2
    mov rax, [rbp - 24]
    mov [rbp - 32], rax
# loading _i_0_2 into _i_0_3
    mov rax, [rbp - 32]
    mov [rbp - 40], rax
# jumping to Label _BASIC_BLOCK_8
    jmp _BASIC_BLOCK_8
_BASIC_BLOCK_8:
# loading _i_0_3 into __temp_21
    mov rax, [rbp - 40]
    mov [rbp - 56], rax
# loading 10 into __temp_22
    mov rax, 10
    mov [rbp - 64], rax
# __temp_23 = __temp_21 < __temp_22
    mov rax, [rbp - 56]
    cmp rax, [rbp - 64]
    setl al
    movzb rax, al
    mov [rbp - 72], rax
# loading __temp_23 into __temp_20
    mov rax, [rbp - 72]
    mov [rbp - 80], rax
# jumping to Label _BASIC_BLOCK_10 if __temp_20 == 1
    mov rax, [rbp - 80]
    cmp rax, 1
    je _BASIC_BLOCK_10
# jumping to Label _BASIC_BLOCK_11
    jmp _BASIC_BLOCK_11
_BASIC_BLOCK_10:
# loading _i_0_3 into __temp_26
    mov rax, [rbp - 40]
    mov [rbp - 104], rax
# loading __temp_26 into __temp_25
    mov rax, [rbp - 104]
    mov [rbp - 112], rax
# preparing call to fibonacci
# storing __temp_25 into arg #0
    mov rdi, [rbp - 112]
# calling fibonacci
    mov rsp, rbp
    sub rsp, 128
    mov rax, 0
    call fibonacci
# loading result into __temp_27
    mov [rbp - 120], rax
# loading __temp_27 into __temp_24
    mov rax, [rbp - 120]
    mov [rbp - 128], rax
# preparing call to printf
# storing _str_0 into arg #0
    mov rdi, offset _str_0
# storing __temp_24 into arg #1
    mov rsi, [rbp - 128]
# calling printf
    mov rsp, rbp
    sub rsp, 144
    mov rax, 0
    call printf
# _i_0_4 = _i_0_3 + 1
    mov rax, [rbp - 40]
    add rax, 1
    mov [rbp - 144], rax
# loading _i_0_4 into _i_0_3
    mov rax, [rbp - 144]
    mov [rbp - 40], rax
# jumping to Label _BASIC_BLOCK_8
    jmp _BASIC_BLOCK_8
_BASIC_BLOCK_11:
# jumping to Label _main_end
    jmp _main_end
# epilogue
_main_end:
    mov rax, 0
    leave
    ret

