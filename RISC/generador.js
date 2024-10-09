
import { registers as reg } from "./constantes.js";

class Instruction {
    constructor(instruction, rd, rs1, rs2) {
        this.instruction = instruction; 
        this.rd = rd;
        this.rs1 = rs1;
        this.rs2 = rs2;
    }

    toString() {
        const operands = []; 
        if (this.rd) operands.push(this.rd);
        if (this.rs1) operands.push(this.rs1);
        if (this.rs2) operands.push(this.rs2);
        return `${this.instruction} ${operands.join(', ')}`;
    }
}

export class Generator {
    constructor() {
        this.instructions = [];
    }
    add(rd, rs1, rs2) {
        this.instructions.push(new Instruction('add', rd, rs1, rs2));
    }

    sub(rd, rs1, rs2) {
        this.instructions.push(new Instruction('sub', rd, rs1, rs2));
    }

    mul(rd, rs1, rs2) {
        this.instructions.push(new Instruction('mul', rd, rs1, rs2));
    }

    div(rd, rs1, rs2) {
        this.instructions.push(new Instruction('div', rd, rs1, rs2));
    }

    addi(rd, rs1, imm) {
        this.instructions.push(new Instruction('addi', rd, rs1, imm));
    }

    sw(rs1, rs2, imm = 0) {
        this.instructions.push(new Instruction('sw', rs1, `${imm}(${rs2})`));
    }

    lw(rd, rs1, imm = 0) {
        this.instructions.push(new Instruction('lw', rd, `${imm}(${rs1})`));
    }

    li(rd, imm) {
        this.instructions.push(new Instruction('li', rd, imm));
    }

    push(rd = reg.T0) {
        this.addi(reg.SP, reg.SP, -4); // Decrement stack pointer, 4 bytes equal to 32 bits
        this.sw(rd, reg.SP);
    }

    pop(rd = reg.T0) {
        this.lw(rd, reg.SP);
        this.addi(reg.SP, reg.SP, 4); // Increment stack pointer, 4 bytes equal to 32 bits
    }

    ecall() {
        this.instructions.push(new Instruction('ecall'));
    }

    printInt(rd = reg.A0) {
        if (rd !== reg.A0) {
            this.push(reg.A0);
            this.add(reg.A0, rd, reg.ZERO);
        }

        this.li(reg.A7, 1);
        this.ecall();

        if (rd !== reg.A0) {
            this.pop(reg.A0);
        }
    }

    printString(rd = reg.A0) {
        // A7 = 4
        if (rd !== reg.A0) {
            this.push(reg.A0);
            this.add(reg.A0, rd, reg.ZERO);
        }

        this.li(reg.A7, 4);
        this.ecall();

        if (rd !== reg.A0) {
            this.pop(reg.A0);
        }
    }

    endProgram() { // End of program, call ecall with a7 = 10
        this.li(reg.A7, 10);
        this.ecall();
    }

    comment(text) {
        this.instructions.push(new Instruction(`# ${text}`));
    }

    toString() {
        const instructionsText = this.instructions
            .map(instruction => `    ${instruction.toString()}`)
            .join('\n');

        return `.text\n\nmain:\n${instructionsText}\n`;
    }
}