import { registers as reg } from "./constantes.js";
import { Generator } from "./generador.js";

/**
 * 
 * @param {Generator} code 
 */
export const concatStrings = (code) => {
    code.comment("Concatenar dos strings");
    code.push(reg.HP);
    const end1 = code.getLabel();
    const loop1 = code.addLabel();
    
    code.lb(reg.T1, reg.A1);
    code.beq(reg.T1, reg.ZERO, end1);
    code.sb(reg.T1, reg.HP);
    code.addi(reg.HP, reg.HP, 1);
    code.addi(reg.A1, reg.A1, 1);
    code.j(loop1);
    code.addLabel(end1);

    const end2 = code.getLabel();
    const loop2 = code.addLabel();

    code.lb(reg.T1, reg.A1);
    code.beq(reg.T1, reg.ZERO, end2);
    code.sb(reg.T1, reg.HP);
    code.addi(reg.HP, reg.HP, 1);
    code.addi(reg.A1, reg.A1, 1);
    code.j(loop2);
    code.addLabel(end2);

    code.sb(reg.ZERO, reg.HP);
    code.addi(reg.HP, reg.HP, 1);
}


export const builtfuncs = {
    concatStrings
}