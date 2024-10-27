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

    /**
     * 
     * @param {Generator} code 
     */
    export const parseInt = (code) => {
        code.add(reg.T1, reg.A0, reg.ZERO)
        code.li(reg.T2, 46) 

        const end = code.getLabel()
        const loop = code.addLabel()

        code.lb(reg.T0, reg.T1)
        code.beq(reg.T0, reg.ZERO, end) // Fin de la cadena
        code.beq(reg.T0, reg.T2, end) // Se encontró el punto
        code.addi(reg.T1, reg.T1, 1)
        code.j(loop)
        code.addLabel(end)

        code.addi(reg.T1, reg.T1, -1) // Retroceder para no incluir el punto o el fin de la cadena
        code.li(reg.T0, "0") // Inicializar el resultado en 0
        code.li(reg.T2, 1) // Inicializar el multiplicador en 1 (UNIDADES)

        const convert = code.getLabel()
        const endConvert = code.getLabel()
        const error = code.getLabel()

        code.li(reg.T4, 9) // el digito máximo que se puede tener
        code.li(reg.T5, 10) // base 10

        code.comment('Convirtiendo la parte entera')
        code.addLabel(convert)
        code.blt(reg.T1, reg.A0, endConvert) // Se terminó de convertir la parte entera
        code.lb(reg.T3, reg.T1)
        code.addi(reg.T3, reg.T3, -48) // Convertir de ascii a entero

        code.blt(reg.T3, reg.ZERO, error) // No es un dígito
        code.blt(reg.T4, reg.T3, error) // Es un dígito mayor a 9; 9 < t3

        code.mul(reg.T3, reg.T3, reg.T5) // t0 = t0 * 10
        code.add(reg.T0, reg.T0, reg.T3) // t0 = t0 + t3
        code.mul(reg.T2, reg.T2, reg.T5) // t2 = t2 * 10
        code.addi(reg.T1, reg.T1, -1)
        code.j(convert)

        const endBuiltin = code.getLabel()

        code.addLabel(endConvert)
        code.push(reg.T0)
        code.j(endBuiltin)

        code.addLabel(error)
        code.li(reg.T0, "0") // valor de retorno, null 
        code.push(reg.T0)
        code.printTexto("Error: no se pudo convertir a entero")

        code.addLabel(endBuiltin)
        
    }

    export const parseFloat = (code) => {
        code.push(reg.A0)
        parseInt(code)
        code.pop(reg.T0) // Parte entera
        code.pop(reg.A0) // Dirección de la cadena
    
        code.comment('Buscando el inicio de la parte decimal')
    
        code.add(reg.T1, reg.A0, reg.ZERO)
        code.lb(reg.T2, reg.T1) // T2 = a un caracter de la cadena
        code.li(reg.T3, 46) // ascii de "."
    
        const initFindLabel = code.getLabel()
        const endFindLabel = code.getLabel()
    
        code.addLabel(initFindLabel)
        code.beq(reg.T2, reg.ZERO, endFindLabel) // Fin de la cadena
        code.beq(reg.T2, reg.T3, endFindLabel) // Se encontró el punto
        code.addi(reg.T1, reg.T1, 1)
        code.lb(reg.T2, reg.T1)
        code.j(initFindLabel)
        code.addLabel(endFindLabel)
    
        code.addi(reg.T1, reg.T1, 1) // Retroceder para no incluir el punto o el fin de la cadena
        code.add(reg.A0, reg.T1, reg.ZERO) // A0 = Dirección de la parte decimal
    
        code.push(reg.T0) // Guardar la parte entera
        code.push(reg.T1) // Guardar la dirección de la parte decimal
        parseInt(code)
        code.pop(reg.T2) // Parte decimal en formato entero
        code.pop(reg.T1) // Dirección de la parte decimal
        code.pop(reg.T0) // Parte entera
    
    
        code.comment('Buscando el final de la cadena')
        code.add(reg.T3, reg.A0, reg.ZERO)
    
        const findEndOfString = code.getLabel()
        const endFindEndOfString = code.getLabel()
    
        code.lb(reg.T4, reg.T3)
        code.addLabel(findEndOfString)
        code.beq(reg.T4, reg.ZERO, endFindEndOfString) // Fin de la cadena
        code.addi(reg.T3, reg.T3, 1)
        code.lb(reg.T4, reg.T3)
        code.j(findEndOfString)
        code.addLabel(endFindEndOfString)
    
        // T0 = Parte entera
        // T1 = Dirección de inicio de la parte decimal
        // T2 = Parte decimal en formato entero
        // T3 = Dirección de fin de la cadena
    
        code.comment('Calculando la parte decimal')
        code.sub(reg.T4, reg.T3, reg.T1) // T4 = Longitud de la parte decimal. Cuantos decimales tiene
        code.li(reg.A0, 1)
        code.li(reg.A1, "0")
        code.li(reg.A2, 10)
    
        const encontrarDivisorInicio = code.getLabel()
        const encontrarDivisorFin = code.getLabel()
    
        code.addLabel(encontrarDivisorInicio)
        code.bge(reg.A1, reg.T4, encontrarDivisorFin) // Ya se encontró el divisor
        code.mul(reg.A0, reg.A0, reg.A2)
        code.addi(reg.A1, reg.A1, 1)
        code.j(encontrarDivisorInicio)
        code.addLabel(encontrarDivisorFin)
    
        code.fcvtsw(freg.FA1, reg.T2) // Convertir la parte decimal a float
        code.fcvtsw(freg.FA2, reg.A0) // Convertir el divisor a float
        code.fdiv(freg.FA1, freg.FA1, freg.FA2) // FA1 = FA1 / FA2
    
        code.fcvtsw(freg.FA0, reg.T0) // Convertir la parte entera a float
    
        code.fadd(freg.FA0, freg.FA0, freg.FA1) // FA0 = FA0 + FA1
    
        code.pushFloat(freg.FA0)
    }


    export const toLowerCase = (code) => {
        code.comment("Convertir string a minúsculas");
        
        // Guardar en el stack la dirección del nuevo string
        code.push(reg.HP);
        
        const end = code.getLabel();
        const loop = code.addLabel();
        
        // Cargar un byte del string original
        code.lb(reg.T1, reg.A0);
        
        // Si es null (0), terminar
        code.beq(reg.T1, reg.ZERO, end);
        
        // Verificar si es una letra mayúscula (ASCII 65-90)
        code.li(reg.T2, 65);  // 'A'
        code.li(reg.T3, 90);  // 'Z'
        
        const noConvert = code.getLabel();
        
        // Si T1 < 65 ('A'), no convertir
        code.blt(reg.T1, reg.T2, noConvert);
        // Si T1 > 90 ('Z'), no convertir
        code.bgt(reg.T1, reg.T3, noConvert);
        
        // Convertir a minúscula sumando 32
        code.addi(reg.T1, reg.T1, 32);
        
        code.addLabel(noConvert);
        // Guardar el byte en el heap
        code.sb(reg.T1, reg.HP);
        
        // Incrementar los punteros
        code.addi(reg.HP, reg.HP, 1);
        code.addi(reg.A0, reg.A0, 1);
        
        // Continuar con el siguiente caracter
        code.j(loop);
        
        code.addLabel(end);
        // Añadir el terminador null
        code.sb(reg.ZERO, reg.HP);
        code.addi(reg.HP, reg.HP, 1);
    }
    

    export const toUpperCase = (code) => {
        code.comment("Convertir string a mayúsculas");
        
        // Guardar en el stack la dirección del nuevo string
        code.push(reg.HP);
        
        const end = code.getLabel();
        const loop = code.addLabel();
        
        // Cargar un byte del string original
        code.lb(reg.T1, reg.A0);
        
        // Si es null (0), terminar
        code.beq(reg.T1, reg.ZERO, end);
        
        // Verificar si es una letra minúscula (ASCII 97-122)
        code.li(reg.T2, 97);  // 'a'
        code.li(reg.T3, 122); // 'z'
        
        const noConvert = code.getLabel();
        
        // Si T1 < 97 ('a'), no convertir
        code.blt(reg.T1, reg.T2, noConvert);
        // Si T1 > 122 ('z'), no convertir
        code.bgt(reg.T1, reg.T3, noConvert);
        
        // Convertir a mayúscula restando 32
        code.addi(reg.T1, reg.T1, -32);
        
        code.addLabel(noConvert);
        // Guardar el byte en el heap
        code.sb(reg.T1, reg.HP);
        
        // Incrementar los punteros
        code.addi(reg.HP, reg.HP, 1);
        code.addi(reg.A0, reg.A0, 1);
        
        // Continuar con el siguiente caracter
        code.j(loop);
        
        code.addLabel(end);
        // Añadir el terminador null
        code.sb(reg.ZERO, reg.HP);
        code.addi(reg.HP, reg.HP, 1);
    }

    export const toString = (code) => {
        code.comment("Convertir número a string");
        
        // Guardar en el stack la dirección donde comenzará el string
        code.push(reg.HP);
        
        // Preparar registros para la conversión
        code.add(reg.T0, reg.A0, reg.ZERO);  // Copiar el número a convertir
        code.li(reg.T1, 10);                 // Base 10 para división
        code.add(reg.T2, reg.HP, reg.ZERO);  // Guardar posición inicial del HP
        
        // Manejar caso especial: si el número es 0
        const specialZero = code.getLabel();
        const normalCase = code.getLabel();
        
        code.bne(reg.T0, reg.ZERO, normalCase);
        code.li(reg.T3, 48);  // ASCII '0'
        code.sb(reg.T3, reg.HP);
        code.addi(reg.HP, reg.HP, 1);
        code.sb(reg.ZERO, reg.HP);
        code.addi(reg.HP, reg.HP, 1);
        code.j(specialZero);
        
        // Proceso normal de conversión
        code.addLabel(normalCase);
        
        // Manejar números negativos
        const notNegative = code.getLabel();
        code.bge(reg.T0, reg.ZERO, notNegative);
        code.li(reg.T3, 45);  // ASCII '-'
        code.sb(reg.T3, reg.HP);
        code.addi(reg.HP, reg.HP, 1);
        code.sub(reg.T0, reg.ZERO, reg.T0);  // Hacer positivo el número
        code.addLabel(notNegative);
        
        // Convertir dígitos
        const convertLoop = code.addLabel();
        
        // División entre 10 para obtener el último dígito
        code.div(reg.T0, reg.T0, reg.T1);    // T0 = T0 / 10
        code.rem(reg.T3, reg.T0, reg.T1);    // T3 = resto (último dígito)
        code.addi(reg.T3, reg.T3, 48);       // Convertir a ASCII
        code.sb(reg.T3, reg.HP);             // Guardar en el heap
        code.addi(reg.HP, reg.HP, 1);
        
        code.bne(reg.T0, reg.ZERO, convertLoop);
        
        // Revertir el string (está al revés)
        code.addi(reg.HP, reg.HP, -1);      // Retroceder uno para no incluir el último incremento
        code.add(reg.T0, reg.T2, reg.ZERO); // T0 = inicio
        code.add(reg.T1, reg.HP, reg.ZERO); // T1 = final
        
        const reverseLoop = code.getLabel();
        const endReverse = code.getLabel();
        
        code.addLabel(reverseLoop);
        code.bge(reg.T0, reg.T1, endReverse);
        
        // Intercambiar bytes
        code.lb(reg.T3, reg.T0);
        code.lb(reg.T4, reg.T1);
        code.sb(reg.T4, reg.T0);
        code.sb(reg.T3, reg.T1);
        
        code.addi(reg.T0, reg.T0, 1);
        code.addi(reg.T1, reg.T1, -1);
        code.j(reverseLoop);
        
        code.addLabel(endReverse);
        
        // Añadir terminador null
        code.addi(reg.HP, reg.HP, 1);
        code.sb(reg.ZERO, reg.HP);
        code.addi(reg.HP, reg.HP, 1);
        
        code.addLabel(specialZero);
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
    parseInt,
    parseFloat,
    toLowerCase,
    toUpperCase,
    toString
}