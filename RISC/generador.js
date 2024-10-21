
import { registers as reg } from "./constantes.js";
import { numberToFloatingPoint, stringArray, stringToBytes } from "./utils.js";

class Instruction {
    constructor(instruction, rd, rs1, rs2) {
        this.instruction = instruction; 
        this.rd = rd;
        this.rs1 = rs1;
        this.rs2 = rs2;
    }

    // toString() {
    //     const operandos = []
    //     if (this.rd !== undefined) operandos.push(this.rd)
    //     if (this.rs1 !== undefined) operandos.push(this.rs1)
    //     if (this.rs2 !== undefined) operandos.push(this.rs2)
    //     return `${this.instruccion} ${operandos.join(', ')}`
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
        this.objectStack = []; // stack for the objects
        this.depth = 0; // depth of the stack
        this._builtInFunctions = new Set();
        this._labels = 0;
    }

    getLabel() { // el label es como un bloque que se utiliza para los saltos y funciones
        return `L${this._labels++}`;
    }

    addLabel(label) {
        label = label || this.getLabel();
        this.instructions.push(new Instruction(`${label}:`));
        return label;
    }

    add(rd, rs1, rs2) { // sumar dos registros, que ya esten en el stack
        this.instructions.push(new Instruction('add', rd, rs1, rs2));
    }

    sub(rd, rs1, rs2) { // restar dos registros, que ya esten en el stack
        this.instructions.push(new Instruction('sub', rd, rs1, rs2));
    }

    mul(rd, rs1, rs2) { // multiplicar dos registros, que ya esten en el stack
        this.instructions.push(new Instruction('mul', rd, rs1, rs2));
    }

    div(rd, rs1, rs2) { // dividir dos registros, que ya esten en el stack
        this.instructions.push(new Instruction('div', rd, rs1, rs2));
    }

    rem(rd, rs1, rs2) { // residuo de la division de dos registros, que ya esten en el stack
        this.instructions.push(new Instruction('rem', rd, rs1, rs2));
    }

    fadd(rd, rs1, rs2) { // sumar dos registros, que ya esten en el stack, para floats
        this.instructions.push(new Instruction('fadd.s', rd, rs1, rs2));
    }

    fsub(rd, rs1, rs2) { // restar dos registros, que ya esten en el stack, para floats
        this.instructions.push(new Instruction('fsub.s', rd, rs1, rs2));
    }

    fmul(rd, rs1, rs2) { // multiplicar dos registros, que ya esten en el stack, para floats
        this.instructions.push(new Instruction('fmul.s', rd, rs1, rs2));
    }

    fdiv(rd, rs1, rs2) { // dividir dos registros, que ya esten en el stack, para floats
        this.instructions.push(new Instruction('fdiv.s', rd, rs1, rs2));
    }

    fli(rd, imm) { // cargar una constante en un registro, para floats
        this.instructions.push(new Instruction('fli.s', rd, imm));
    }

    fmv(rd, rs1) { // copiar el valor de un registro en otro, para floats
        this.instructions.push(new Instruction('fmv.s', rd, rs1));
    }

    flw(rd, rs1, imm = 0) { // cargar un valor de la memoria en un registro, para floats
        this.instructions.push(new Instruction('flw', rd, `${imm}(${rs1})`));
    }

    fsw(rs1, rs2, imm = 0) { // guardar un valor de un registro en la memoria, para floats
        this.instructions.push(new Instruction('fsw', rs1, `${imm}(${rs2})`));
    }

    fcvtsw(rd, rs1) { // convertir un entero a float, para floats
        this.instructions.push(new Instruction('fcvt.s.w', rd, rs1));
    }

    printFloat() { // imprimir un float en pantalla
        this.li(reg.A7, 2);
        this.ecall();
    }

    /*
    addi rd, rs1, 0

    hace la operacion

    rd <- rs1 + 0, que seria lo equivalente a rd <- rs1

    y tambien para esta operacion especifica, se puede hacer

    mv rd, rs1 que lo que hace es copiar el valor de rs1 en rd

    Diferencia entre addi y add es el segundo registro, en addi es una constante y en add es otro registro
    */
    addi(rd, rs1, imm) { // sumar un registro con una constante, que ya este en el stack
        this.instructions.push(new Instruction('addi', rd, rs1, imm));
    }

    /*
    store word o sw

    sw rs1, rs2, imm

    Guarda el valor de rs1 en la direccion de memoria que esta en rs2 + imm

    esto se hace para guardar el valor de un registro en la memoria ya que los registros son volatiles
    */
    sw(rs1, rs2, imm = 0) {
        this.instructions.push(new Instruction('sw', rs1, `${imm}(${rs2})`));
    }

    /*
    store byte o sb

    sb rs1, rs2, imm

    Guarda el valor de rs1 en la direccion de memoria que esta en rs2 + imm

    La diferencia con sw es que guarda 8 bits en vez de 32 bits
    */
    sb(rs1, rs2, imm = 0) {
        this.instructions.push(new Instruction('sb', rs1, `${imm}(${rs2})`));
    }

    /*
    load word o lw

    lw rd, rs1, imm

    Carga el valor de la direccion de memoria que esta en rs1 + imm en rd

    esto se hace para cargar un valor de la memoria a un registro y poder utilizarlo
    */
    lw(rd, rs1, imm = 0) {
        this.instructions.push(new Instruction('lw', rd, `${imm}(${rs1})`));
    }

    /*
    load byte o lb
    es lo mismo que lw pero en vez de cargar 32 bits, carga 8 bits
    */
    lb(rd, rs1, imm = 0) {
        this.instructions.push(new Instruction('lb', rd, `${imm}(${rs1})`));
    }

    /*
    branch equal o beq

    beq rs1, rs2, offset

    Se utiliza para hacer saltos condicionales, si rs1 es igual a rs2
    se salta a la instruccion especificada por offset

    esto se hace para hacer ciclos o condicionales

    ejemplo:
        li t0, 5
        li t1, 5
        beq t0, t1, verdadero

    verdadero:
        # otras instrucciones si t0 es igual a t1    

    en otras palabras beq lo que hace es esto

    if(rs1 == rs2) {
        offset();
    }
    */
    beq(rs1, rs2, offset) {
        this.instructions.push(new Instruction('beq', rs1, rs2, offset));
    }

    /*
    lo mismo que beq pero asi:
    if(rs1 != rs2) {
        offset();
    }
    */
    bne(rs1, rs2, offset) {
        this.instructions.push(new Instruction('bne', rs1, rs2, offset));
    }

    /*
    branch less than o blt
    si rs1 es menor que rs2 se salta a la instruccion especificada por offset
    lo mismo que beq pero asi:
    if(rs1 < rs2) {
        offset();
    }
    */
    blt(rs1, rs2, offset) {
        this.instructions.push(new Instruction('blt', rs1, rs2, offset));
    }

    /* 
    branch less than o blt
    si rs1 es menor o igual que rs2 se salta a la instruccion especificada por offset
    lo mismo que beq pero asi:
    if(rs1 <= rs2) {
        offset();
    }
    */  
    bgt(rs1, rs2, offset) {
        this.instructions.push(new Instruction('bgt', rs1, rs2, offset));
    }


    /*
    branch greater than o bgt
    si rs1 es mayor que rs2 se salta a la instruccion especificada por offset
    lo mismo que beq pero asi:
    if(rs1 >= rs2) {
        offset();
    }
    */
    bge(rs1, rs2, offset) {
        this.instructions.push(new Instruction('bge', rs1, rs2, offset));
    }
    /*
    load immediate o li

    li rd, imm

    Carga el valor de la constante imm en rd

    esto se hace para cargar un valor constante en un registro y poder utilizarlo, en si esta es una pseudo instruccion
    y lo que hace el ensamblador es "traducir" esta instruccion a addi rd, zero, imm

    ejemplo: 
    li t0, 5
    se traduce a
    addi t0, zero, 5
    */
    li(rd, imm) {
        this.instructions.push(new Instruction('li', rd, imm));
    }

    /*
        Esta funcion se encarga de guardar un objeto en el stack
        añaadiendo el objeto al stack y aumentando la profundidad
        el -4 es porque se esta guardando un objeto de 32 bits y el stack crece hacia abajo
        y se guarda el espacio desde la punta del stack o sea el stack pointer
    */
    push(rd = reg.T0) {
        this.addi(reg.SP, reg.SP, -4); // Decrement stack pointer, 4 bytes equal to 32 bits
        this.sw(rd, reg.SP);
    }



    /*
        Esta funcion carga un objeto del stack y disminuye la profundidad
        lo suma por que se esta sacando un objeto de 32 bits y el stack crece hacia abajo
    */
    pop(rd = reg.T0) {
        this.lw(rd, reg.SP);
        this.addi(reg.SP, reg.SP, 4); // Increment stack pointer, 4 bytes equal to 32 bits
    }

    /*
    jump and link o jal

    jal rd, offset

    jumps to address offset and saves the return address in register rd

    se utiliza para hacer llamadas a funciones, ya que guarda la direccion de retorno en un registro

    ejemplo:
    
    main:
        jal ra, funcion
        # otras instrucciones
    
    funcion:
        # instrucciones de la funcion

    */
    jal(offset) {
        this.instructions.push(new Instruction('jal', offset));
    }

    /*
    jump o j

    j offset

    jumps to address offset

    se utiliza para hacer saltos a otras partes del codigo, como ciclos o condicionales

    a diferencia de jal, j no guarda la direccion de retorno en un registro
    */
    j(offset) {
        this.instructions.push(new Instruction('j', offset));
    }

    /*
     ret

        regresa a la direccion de retorno guardada en el registro ra

        internamente lo que hace es un jalr ra
    */
    ret() {
        this.instructions.push(new Instruction('ret'));
    }


    /*
        enviroment call o ecall

        ecall

        Se utiliza para hacer llamadas al sistema operativo, como imprimir en pantalla, leer de la entrada estandar, etc

        llama segun el valor de a7, que es el registro que se utiliza para las llamadas al sistema, por lo que distintas 
        syscall tienen distintos valores de a7 segun lo que se carge en el registro y ecall hace la llamada al sistema

        asi como para imprimir enteros se carga 1 en a7 y se pone un ecall

        ejemplo:
        li a0, 5
        li a7, 1
        ecall

        esto imprimiria el numero 5 en pantalla
    */
    ecall() {
        this.instructions.push(new Instruction('ecall'));
    }

    callBuiltInFunction(name) {
    }

    /*
    La funcion printInt se encarga de imprimir un entero en pantalla
    basicamente lo que hace es revisar si el registro que se pasa no es el mismo que el registro a0
    y si no es el mismo lo guarda en el stack, por que quiere decir que lo que se quiere imprimir no es 
    parte del stack todavia, luego carga el valor 1 en a7, que es el registro que se utiliza para las llamadas al sistema
    y luego hace un ecall, que es la llamada al sistema, y luego si el registro que se paso no es el mismo que a0
    lo saca del stack

    estas verificaciones son por dos razones, el syscall de print necesita que el valor a imprimir este en a0
    entonces si el valor que se quiere imprimir no esta en a0, se guarda en el stack y luego se pone en a0
    para tener el mismo efecto que si se hubiera puesto directamente en a0
    */
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

    // Esta hace lo mismo que printInt pero con strings
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

    // El end program es un syscall tambien entonces se carga el valor 10 en a7 y se hace un ecall
    endProgram() { // End of program, call ecall with a7 = 10
        this.li(reg.A7, 10);
        this.ecall();
    }



    comment(text) {
        this.instructions.push(new Instruction(`# ${text}`));
    }

    /*
    pushConstant, esta es una funcion que se encarga de guardar un objeto en el stack
    y guardar el objeto en el stack de objetos, para poder hacer un seguimiento de los objetos
    manejandolos segun su tipo y tomando su valor del stack
    */

    pushFloat(rd = reg.F0) {
        this.addi(reg.SP, reg.SP, -4);
        this.fsw(reg.F0, reg.SP);

    }

    pushConstant(object) {
        let length = 0;

        switch (object.tipo) {
            case 'int':
                this.li(reg.T0, object.valor);
                this.push();
                length = 4;
                break;

            case 'string':
                console.log(object.valor);
                const stringArray = stringToBytes(object.valor);
                this.push(reg.HP); // Save the address of the string
                console.log(stringArray);
                stringArray.forEach(byte => {
                    this.li(reg.T0, `${byte}`);
                    this.comment(`Holaaaaa ${byte}`);
                    this.sb(reg.T0, reg.HP);
                    this.comment(`Holaaaaa ${reg.T0} ${reg.HP}`);
                    this.comment(`ACA DA ERROR`);
                    this.addi(reg.HP, reg.HP, 1);
                });
                length = 4;
                break
            case 'boolean': // si es true se guarda un 1 y si es false se guarda un 0
                console.log(object.valor);
                this.comment(`Pushing boolean with li T0, ${object.valor ? 1 : 0}`);
                let valor = object.valor ? 1 : "0";
                this.li(reg.T0, valor);
                this.push();
                length = 4;
                break;
            case 'float':
                const ieee754 = numberToFloatingPoint(object.valor);
                this.li(reg.T0, ieee754);
                this.push(reg.T0);
                break;
            default:
                break;
        }
        // se guarda el objeto en el stack de objetos
        this.pushObject({ type: object.tipo, length, depth: this.depth });
    }

    // Solo guarda el objecto en el stack para manejar segun su tipo
    // pushObject(object) {
    //     this.objectStack.push({
    //         ...object,
    //         depth: this.depth,
    //     });
    // }
    pushObject(object) {
        this.objectStack.push({
            ...object,
            depth: this.depth,
        });
    }

    // saca el objeto del stack de objetos y segun su tipo saca el valor del stack
    popObject(rd = reg.T0) {
        const object = this.objectStack.pop();

        switch (object.type) {
            case 'int':
                this.pop(rd);
                break;
            case 'string':
                this.pop(rd);
                break;
            case 'boolean':
                this.pop(rd);
                break;
            case 'float':
                this.pop(rd);
                break;
            default:
                break;
        }
    }

    getTopObject() {
        return this.objectStack[this.objectStack.length - 1];
    }

    createScope() {
        this.depth++; // segun la profundidad se crearan los distintos entornos
    }

    finishScope() {
        let byteOffset = 0;

        for (let i = this.objectStack.length - 1; i >= 0; i--) {
            if (this.objectStack[i].depth === this.depth) {
                byteOffset += this.objectStack[i].length;
                this.objectStack.pop();
            } else {
                break;
            }
        }
        this.depth--;
        
        return byteOffset;
    }

    tagObject(id) {
        this.objectStack[this.objectStack.length - 1].id = id
    }

    getObject(id) {
        let byteOffset = 0;
        for (let i = this.objectStack.length - 1; i >= 0; i--) {
            if (this.objectStack[i].id === id) {
                return [byteOffset, this.objectStack[i]];
            }
            byteOffset += this.objectStack[i].length;
        }
        throw new Error(`Object with id ${id} not found`);
    }

    toString() {
        this.endProgram();
        
        Array.from(this._builtInFunctions).forEach(builtInFunction => {
            this.callBuiltInFunction(builtInFunction);
        });

        const instructionsText = this.instructions
            .map(instruction => `    ${instruction.toString()}`)
            .join('\n');

        return `.data\nheap:\n.text\n#Iniciar el HP\n   la ${reg.HP}, heap\n\nmain:\n${instructionsText}\n`;
    }

}