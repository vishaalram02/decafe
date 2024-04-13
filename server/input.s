.intel_syntax noprefix

.section .data
_str_0:
    .string "%s"
_str_1:
    .string "hello"

.section .text
.global main

OUT_OF_BOUNDS:
    mov rax, 60
    mov rdi, -1
    syscall

main:
# prologue
    push rbp
    mov rbp, rsp
# storing _str_0 into arg #0
    mov rdi, offset _str_0
# storing _str_1 into arg #1
    mov rsi, offset _str_1
# calling printf
    mov rsp, rbp
    sub rsp, 16
    mov rax, 0
    call printf
# epilogue
    mov rax, 0
    leave
    ret

