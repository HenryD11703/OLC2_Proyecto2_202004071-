import { registers as reg } from "./constantes.js";
import { floatRegisters as freg } from "./constantes.js";
import { Generator } from "./generador.js";

    /**
     * 
     * @param {Generator} code 
     */
    export const concatStrings = (code) => {
        code.comment("Concatenar dos strings");
        // saving on the stack the address of the first string
        code.push(reg.HP);

        code.comment("First string");
        const end1 = code.getLabel();
        const loop1 = code.addLabel();
        
        code.lb(reg.T1, reg.A0);
        code.beq(reg.T1, reg.ZERO, end1);
        code.sb(reg.T1, reg.HP);
        code.addi(reg.HP, reg.HP, 1);
        code.addi(reg.A0, reg.A0, 1);
        code.j(loop1);
        code.addLabel(end1);

        code.comment("Second string");
        const end2 = code.getLabel();
        const loop2 = code.addLabel();

        code.lb(reg.T1, reg.A1);
        code.beq(reg.T1, reg.ZERO, end2);
        code.sb(reg.T1, reg.HP);
        code.addi(reg.HP, reg.HP, 1);
        code.addi(reg.A1, reg.A1, 1);
        code.j(loop2);
        code.addLabel(end2);

        code.comment("Null terminator");
        code.sb(reg.ZERO, reg.HP);
        code.addi(reg.HP, reg.HP, 1);
    }

    /**
     * 
     * @param {Generator} code 
     */
    export const lessOrEqual = (code) => {
        // basicamente solo crea un label a que hara el salto si se cumple la condicion
        // o a otro si no se cumple para ya indicar si es true o false
        const trueLabel = code.getLabel();
        const endLabel = code.getLabel();

        code.bge(reg.T0, reg.T1, trueLabel);
        code.li(reg.T0, "0");
        code.push(reg.T0);
        code.j(endLabel);
        code.addLabel(trueLabel);
        code.li(reg.T0, 1);
        code.push(reg.T0);
        code.addLabel(endLabel);
    }

    /**
     * 
     * @param {Generator} code 
     */

    export const greaterOrEqual = (code) => {
        const trueLabel = code.getLabel();
        const endLabel = code.getLabel();
    
        code.bge(reg.T1, reg.T0, trueLabel);
        code.li(reg.T0, "0");
        code.push(reg.T0);
        code.j(endLabel);
        code.addLabel(trueLabel);
        code.li(reg.T0, 1);
        code.push(reg.T0);
        code.addLabel(endLabel);
    }

    /**
     * 
     * @param {Generator} code 
     */
    export const less = (code) => {
        const trueLabel = code.getLabel();
        const endLabel = code.getLabel();
        
        code.blt(reg.T1, reg.T0, trueLabel);
        code.li(reg.T0, "0");
        code.j(endLabel);
        code.addLabel(trueLabel);
        code.li(reg.T0, 1);
        code.addLabel(endLabel);
        code.push(reg.T0);
    }

    /**
     * 
     * @param {Generator} code 
     */
    export const greater = (code) => {
        const trueLabel = code.getLabel();
        const endLabel = code.getLabel();
        
        code.blt(reg.T0, reg.T1, trueLabel);
        code.li(reg.T0, "0");
        code.j(endLabel);
        code.addLabel(trueLabel);
        code.li(reg.T0, 1);
        code.addLabel(endLabel);
        code.push(reg.T0);
    }

    /**
     * 
     * @param {Generator} code 
     */
    export const equals = (code) => {
        const trueLabel = code.getLabel();
        const endLabel = code.getLabel();
    
        code.beq(reg.T0, reg.T1, trueLabel);
        code.li(reg.T0, "0");
        code.push(reg.T0);
        code.j(endLabel);
        code.addLabel(trueLabel);
        code.li(reg.T0, 1);
        code.push(reg.T0);
        code.addLabel(endLabel);
    }
    
    /**
     * 
     * @param {Generator} code 
     */
    export const notEqual = (code) => {
        const trueLabel = code.getLabel();
        const endLabel = code.getLabel();
    
        code.bne(reg.T0, reg.T1, trueLabel);
        code.li(reg.T0, "0");
        code.push(reg.T0);
        code.j(endLabel);
        code.addLabel(trueLabel);
        code.li(reg.T0, 1);
        code.push(reg.T0);
        code.addLabel(endLabel);
    }

    /**
     * 
     * @param {Generator} code 
     */
    export const floatLessOrEqual = (code) => {
        const endLabel = code.getLabel();
    
        code.fle(reg.T0, freg.FT1, freg.FT0);
        code.push(reg.T0);
        code.addLabel(endLabel);
    }
    /**
     * 
     * @param {Generator} code 
     */
    export const floatGreaterOrEqual = (code) => {
        const trueLabel = code.getLabel();
        const endLabel = code.getLabel();

        code.flt(reg.T0, freg.FT1, freg.FT0);
        code.beq(reg.T0, reg.ZERO, trueLabel);
        code.li(reg.T0, "0");
        code.j(endLabel);
        code.addLabel(trueLabel);
        code.li(reg.T0, 1);
        code.addLabel(endLabel);
        code.push(reg.T0);
    }
    /**
     * 
     * @param {Generator} code 
     */
    export const floatLess = (code) => {
        const trueLabel = code.getLabel();
        const endLabel = code.getLabel();
        
        code.flt(reg.T0, freg.FT1, freg.FT0);
        code.beq(reg.T0, reg.ZERO, endLabel);
        code.li(reg.T0, 1);
        code.j(endLabel);
        code.addLabel(trueLabel);
        code.li(reg.T0, "0");
        code.addLabel(endLabel);
        code.push(reg.T0);
    }
    /**
     * 
     * @param {Generator} code 
     */
    export const floatGreater = (code) => {
        const trueLabel = code.getLabel();
        const endLabel = code.getLabel();
        
        code.flt(reg.T0, freg.FT0, freg.FT1);
        code.beq(reg.T0, reg.ZERO, endLabel);
        code.li(reg.T0, 1);
        code.j(endLabel);
        code.addLabel(trueLabel);
        code.li(reg.T0, "0");
        code.addLabel(endLabel);
        code.push(reg.T0);
    }
    /**
     * 
     * @param {Generator} code 
     */
    export const floatEquals = (code) => {
        const endLabel = code.getLabel();
    
        code.feq(reg.T0, freg.FT0, freg.FT1);
        code.push(reg.T0);
        code.addLabel(endLabel);
    }
    /**
     * 
     * @param {Generator} code 
     */
    export const floatNotEqual = (code) => {
        const endLabel = code.getLabel();
    
        code.feq(reg.T0, freg.FT0, freg.FT1);
        code.xori(reg.T0, reg.T0, 1);  // Invertir el resultado
        code.push(reg.T0);
        code.addLabel(endLabel);
    }

    /**
     * 
     * @param {Generator} code 
     */
    export const stringEquals = (code) => {
        const loopLabel = code.getLabel();
        const trueLabel = code.getLabel();
        const falseLabel = code.getLabel();
        const endLabel = code.getLabel();
    
        code.addLabel(loopLabel);
        
        code.lb(reg.T0, reg.A0);
        code.lb(reg.T1, reg.A1);
        
        // Compare bytes
        code.bne(reg.T0, reg.T1, falseLabel);
        
        // si ambos terminan en null, entonces son iguales
        code.beq(reg.T0, reg.ZERO, trueLabel);
        
        // avanzar al siguiente byte
        code.addi(reg.A0, reg.A0, 1);
        code.addi(reg.A1, reg.A1, 1);
        
   
        code.j(loopLabel);
        
        // Strings are equal
        code.addLabel(trueLabel);
        code.li(reg.T0, 1);
        code.j(endLabel);
        
        // Strings are not equal
        code.addLabel(falseLabel);
        code.li(reg.T0, "0");
        
        code.addLabel(endLabel);
        code.push(reg.T0);
    }

    export const stringNotEqual = (code) => {
        const loopLabel = code.getLabel();
        const trueLabel = code.getLabel();
        const falseLabel = code.getLabel();
        const endLabel = code.getLabel();
    
        code.addLabel(loopLabel);
        
        code.lb(reg.T0, reg.A0);
        code.lb(reg.T1, reg.A1);
        
        // Compare bytes
        code.bne(reg.T0, reg.T1, falseLabel);
        
        // si ambos terminan en null, entonces son iguales
        code.beq(reg.T0, reg.ZERO, trueLabel);
        
        // avanzar al siguiente byte
        code.addi(reg.A0, reg.A0, 1);
        code.addi(reg.A1, reg.A1, 1);
        
   
        code.j(loopLabel);
        
        // Strings are equal
        code.addLabel(trueLabel);
        code.li(reg.T0, "0");
        code.j(endLabel);
        
        // Strings are not equal
        code.addLabel(falseLabel);
        code.li(reg.T0, 1);
        
        code.addLabel(endLabel);
        code.push(reg.T0);
    }





export const builtfuncs = {
    concatStrings,
    lessOrEqual,
    greaterOrEqual,
    less,
    greater,
    equals,
    notEqual,
    floatLessOrEqual,
    floatGreaterOrEqual,
    floatLess,
    floatGreater,
    floatEquals,
    floatNotEqual,
    stringEquals,
    stringNotEqual,
}