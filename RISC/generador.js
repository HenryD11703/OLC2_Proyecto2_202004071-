
import { registers as reg } from "./constantes.js";
import { stringArray } from "./utils.js";

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
        this.stack = []; // stack for the objects
        this.depth = 0; // depth of the stack
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

    rem(rd, rs1, rs2) {
        this.instructions.push(new Instruction('rem', rd, rs1, rs2));
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

    pushConstant(value) {
        let length = 0;

        switch (value.type) {
            case 'int':
                this.li(reg.T0, value.value);
                this.push();
                length = 4;
                break;

            case 'string':
                const stringArray = stringArray(value.value);
                this.comment(`Pushing string "${value.value}"`);
                this.addi(reg.T0, reg.T6, 4); // T0 = T6 + 4
                this.push(reg.T0); // Push the address of the string
                this.comment(`String address`);
                stringArray.forEach(block => {
                    this.li(reg.T0, block);
                    this.addi(reg.T6, reg.T6, 4); // T6 = T6 + 4
                    this.sw(reg.T0, reg.T6); // Store the block of the string
                });

                length = 4;
                break

            default:
                break;
        }
        this.pushObject({ type: value.type, length });
    }

    toString() {
        const instructionsText = this.instructions
            .map(instruction => `    ${instruction.toString()}`)
            .join('\n');

        return `.text\n\nmain:\n${instructionsText}\n`;
    }
}