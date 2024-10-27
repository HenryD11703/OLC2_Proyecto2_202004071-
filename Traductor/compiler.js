import { registers as reg } from "../RISC/constantes.js";
import { floatRegisters as freg } from "../RISC/constantes.js";
import { Generator } from "../RISC/generador.js";
import { BaseVisitor } from "./visitor.js";
import { FrameVisitor } from "./frame.js";
import { ReferenciaVariable } from "./nodos.js";

export class CompilerVisitor extends BaseVisitor {
    constructor() {
        super();
        this.code = new Generator();

        this.insideFunction = false;
        this.functionMetadata = {}
        this.frameDclIndex = 0;

        this.continueLabel = null;
        this.breakLabel = null; 
        this.returnLabel = null;

    }

    /**
     * @type {BaseVisitor['visitStatement']}
     */
    visitStatement(node) {
        node.exp.accept(this);

        // verificar si el statement es un float ya que este va a 
        // hacer un popObject, y pop Object necesita explicitamente el tipo
        // para saber si hacer con el registro de floats o el registro de enteros
        
        const isFloat = this.code.getTopObject().tipo === 'float';
        this.code.popObject(isFloat? freg.FT0 : reg.T0);    
        
    }

    /**
     * @type {BaseVisitor['visitNativo']}
     */
    visitNativo(node) {
        this.code.pushConstant({ tipo: node.tipo, valor: node.valor });
    }

    /**
     * @type {BaseVisitor['visitOperacionBinaria']}
     */
    visitOperacionBinaria(node) {
        this.code.comment(`Operacion ${node.op}`);


        if (node.op === '&&') {
            node.izq.accept(this); // interpretar la expresion izquierda
            this.code.popObject(reg.T0); // obtener el valor de la expresion izquierda

            const falseLabel = this.code.getLabel();
            const endLabel = this.code.getLabel();

            this.code.beq(reg.T0, reg.ZERO, falseLabel); // si es falso ir a la etiqueta falseLabel

            node.der.accept(this); // interpretar la expresion derecha
            this.code.popObject(reg.T0); // obtener el valor de la expresion derecha

            this.code.beq(reg.T0, reg.ZERO, falseLabel); // si es falso ir a la etiqueta falseLabel

            this.code.li(reg.T0, 1); // si llega hasta aqui es verdadero
            this.code.push(reg.T0); // push 1 en el stack
            this.code.j(endLabel); // ir a la etiqueta endLabel
            this.code.addLabel(falseLabel); // agregar la etiqueta falseLabel
            this.code.li(reg.T0, "0"); // si llega hasta aqui es falso
            this.code.push(reg.T0); // push 0 en el stack
            this.code.addLabel(endLabel); // agregar la etiqueta endLabel
            this.code.pushObject({ tipo: 'boolean', length: 4 }); // push el objeto booleano en el stack
            return;
        }

        if (node.op === '||') {
            node.izq.accept(this); // interpretar la expresion izquierda
            this.code.popObject(reg.T0); // obtener el valor de la expresion izquierda

            const trueLabel = this.code.getLabel();
            const endLabel = this.code.getLabel();

            this.code.bne(reg.T0, reg.ZERO, trueLabel); // si es verdadero ir a la etiqueta trueLabel

            node.der.accept(this); // interpretar la expresion derecha
            this.code.popObject(reg.T0); // obtener el valor de la expresion derecha

            this.code.bne(reg.T0, reg.ZERO, trueLabel); // si es verdadero ir a la etiqueta trueLabel

            this.code.li(reg.T0, "0"); // si llega hasta aqui es falso
            this.code.push(reg.T0); // push 0 en el stack
            this.code.j(endLabel); // ir a la etiqueta endLabel
            this.code.addLabel(trueLabel); // agregar la etiqueta trueLabel
            this.code.li(reg.T0, 1); // si llega hasta aqui es verdadero
            this.code.push(reg.T0); // push 1 en el stack
            this.code.addLabel(endLabel); // agregar la etiqueta endLabel
            this.code.pushObject({ tipo: 'boolean', length: 4 }); // push el objeto booleano en el stack
            return;
        }

        node.izq.accept(this);
        node.der.accept(this);

        const derFloat = this.code.getTopObject().tipo === 'float';
        const der = this.code.popObject(derFloat ? freg.FT0 : reg.T0);
        const izqFloat = this.code.getTopObject().tipo === 'float';
        const izq = this.code.popObject(izqFloat ? freg.FT1 : reg.T1);

        if (izq.tipo === 'string' && der.tipo === 'string' && node.op === '+') {
            this.code.comment("Concatenar dos strings");
            this.code.add(reg.A0, reg.ZERO, reg.T1);
            this.code.add(reg.A1, reg.ZERO, reg.T0);
            this.code.callBuiltInFunction('concatStrings');
            this.code.pushObject({ tipo: 'string', length: 4 });
            return;
        }

        // comparativas para dos strings, == y !=

        if (izq.tipo === 'string' && der.tipo === 'string' && (node.op === '==' || node.op === '!=')) {
            this.code.comment(`Comparacion de strings ${node.op}`);
            this.code.add(reg.A0, reg.ZERO, reg.T1);
            this.code.add(reg.A1, reg.ZERO, reg.T0);
            this.code.callBuiltInFunction(node.op === '==' ? 'stringEquals' : 'stringNotEqual');
            this.code.pushObject({ tipo: 'boolean', length: 4 });

            return;
        }

        if (izqFloat || derFloat) {
            if(!izqFloat) this.code.fcvtsw(freg.FT1, reg.T1);
            if(!derFloat) this.code.fcvtsw(freg.FT0, reg.T0);
            switch (node.op) {
                case '+':
                    this.code.fadd(freg.FT0, freg.FT0, freg.FT1);
                    break;
                case '-':
                    this.code.fsub(freg.FT0, freg.FT1, freg.FT0);
                    break;
                case '*':
                    this.code.fmul(freg.FT0, freg.FT1, freg.FT0);
                    break;
                case '/':
                    this.code.fdiv(freg.FT0, freg.FT1, freg.FT0);
                    break;
                case '<=':
                    this.code.callBuiltInFunction('floatLessOrEqual');
                    this.code.pushObject({ tipo: 'boolean', length: 4 });
                    return;
                case '>=':
                    this.code.callBuiltInFunction('floatGreaterOrEqual');
                    this.code.pushObject({ tipo: 'boolean', length: 4 });
                    return;
                case '<':
                    this.code.callBuiltInFunction('floatLess');
                    this.code.pushObject({ tipo: 'boolean', length: 4 });
                    return;
                case '>':
                    this.code.callBuiltInFunction('floatGreater');
                    this.code.pushObject({ tipo: 'boolean', length: 4 });
                    return;
                case '==':
                    this.code.callBuiltInFunction('floatEquals');
                    this.code.pushObject({ tipo: 'boolean', length: 4 });
                    return;
                case '!=':
                    this.code.callBuiltInFunction('floatNotEqual');
                    this.code.pushObject({ tipo: 'boolean', length: 4 });
                    return;
                    
            }
            this.code.pushFloat(freg.FT0);
            this.code.pushObject({ tipo: 'float', length: 4 });
            return;
        }

        switch (node.op) {
            case '+':
                this.code.add(reg.T0, reg.T0, reg.T1);                
                this.code.push(reg.T0);                
                break;            
            case '-':                
                this.code.sub(reg.T0, reg.T1, reg.T0);                
                this.code.push(reg.T0);                
                break;            
            case '*':                
                this.code.mul(reg.T0, reg.T0, reg.T1);                
                this.code.push(reg.T0);                
                break;            
            case '/':                
                this.code.div(reg.T0, reg.T1, reg.T0);                
                this.code.push(reg.T0);                
                break;            
            case '%':                
                this.code.rem(reg.T0, reg.T1, reg.T0);                
                this.code.push(reg.T0);                
                break;  
            case '<=':
                this.code.callBuiltInFunction('lessOrEqual');
                this.code.pushObject({ tipo: 'boolean', length: 4 });
                return;
            case '>=':
                this.code.callBuiltInFunction('greaterOrEqual');
                this.code.pushObject({ tipo: 'boolean', length: 4 });
                return;
            case '<':
                this.code.callBuiltInFunction('less');
                this.code.pushObject({ tipo: 'boolean', length: 4 });
                return;
            case '>':
                this.code.callBuiltInFunction('greater');
                this.code.pushObject({ tipo: 'boolean', length: 4 });
                return;
            case '==':
                this.code.callBuiltInFunction('equals');
                this.code.pushObject({ tipo: 'boolean', length: 4 });
                return;
            case '!=':
                this.code.callBuiltInFunction('notEqual');
                this.code.pushObject({ tipo: 'boolean', length: 4 });
                return;
      
            }    
        this.code.pushObject({ tipo: 'int', length: 4 });
    }

    /**
     * @type {BaseVisitor['visitOperacionUnaria']}
     */
    visitOperacionUnaria(node) {
        this.code.comment(`Operacion ${node.op}`);
        node.exp.accept(this);

        const isFloat = this.code.getTopObject().tipo === 'float';

        if (isFloat && node.op === '-') {
            this.code.popFloat(freg.FT0);
            this.code.fneg(freg.FT0, freg.FT0);
            this.code.pushFloat(freg.FT0);
            this.code.pushObject({ tipo: 'float', length: 4 });
            return;
        }

        this.code.pop(reg.T0);

        switch (node.op) {
            case '-':
                
                this.code.li(reg.T1, "0");
                this.code.sub(reg.T0, reg.T1, reg.T0);
                this.code.push(reg.T0);
                this.code.pushObject({ tipo: 'int', length: 4 });
                break;
            case '!':
                const trueLabel = this.code.getLabel();
                const endLabel = this.code.getLabel();
                this.code.beq(reg.T0, reg.ZERO, trueLabel);
                this.code.li(reg.T0, "0");
                this.code.j(endLabel);
                this.code.addLabel(trueLabel);
                this.code.li(reg.T0, 1);
                this.code.addLabel(endLabel);
                this.code.push(reg.T0);
                this.code.pushObject({ tipo: 'boolean', length: 4 });
                break;
        }
    }

    /**
     * @type {BaseVisitor['visitAgrupacion']}
     */
    visitAgrupacion(node) {
        return node.exp.accept(this);
    }

    /**
     * @type {BaseVisitor['visitPrint']}
     */
    visitPrint(node) {
        node.args.forEach((arg) => {
            arg.accept(this);
            
            
            const isFloat = this.code.getTopObject().tipo === 'float';
            const object = this.code.popObject(isFloat? freg.FA0 : reg.A0);

            const PrintType = {
                'int': () => this.code.printInt(),
                'string': () => this.code.printString(),
                'float': () => this.code.printFloat(),
                'char': () => this.code.printChar(),
                'boolean': () => this.code.printInt()
            }

            PrintType[object.tipo]();

            

        });
        this.code.printNewLine();
    }

    /**
     * @type {BaseVisitor['visitDeclaracionVariable']}
     */
    visitDeclaracionVariable(node) {
        node.valor.accept(this);
        if(this.insideFunction) {
            const localObject = this.code.getFrameLocal(this.frameDclIndex);
            const valueObject = this.code.popObject(reg.T0);

            this.code.addi(reg.T1, reg.FP, -localObject.offset * 4);
            this.code.sw(reg.T0, reg.T1);

            localObject.tipo = valueObject.tipo;
            this.frameDclIndex++;

            return
        }

        this.code.tagObject(node.id);
    }

    /**
     * @type {BaseVisitor['visitDeclaracionSinTipo']}
     */
    visitDeclaracionSinTipo(node) {
        this.code.comment(`Declaracion de variable sin tipo ${node.id}`);

        node.valor.accept(this);

        if(this.insideFunction) {
            const localObject = this.code.getFrameLocal(this.frameDclIndex);
            const valueObject = this.code.popObject(reg.T0);

            this.code.addi(reg.T1, reg.FP, -localObject.offset * 4);
            this.code.sw(reg.T0, reg.T1);

            localObject.tipo = valueObject.tipo;
            this.frameDclIndex++;

            return
        }

        this.code.tagObject(node.id);


    }

    /**
     * @type {BaseVisitor['visitReferenciaVariable']}
     */
    visitReferenciaVariable(node) {
        const [offset, variableObject] = this.code.getObject(node.id);
        if(this.insideFunction) {
            this.code.addi(reg.T1, reg.FP, -variableObject.offset * 4);
            this.code.lw(reg.T0, reg.T1);
            this.code.push(reg.T0);
            this.code.pushObject({...variableObject, id: undefined});
            return;
        }
        this.code.addi(reg.T0, reg.SP, `${offset}`);
        this.code.lw(reg.T1, reg.T0);
        this.code.push(reg.T1);
        this.code.pushObject({...variableObject, id: undefined});
    }

    /**
     * @type {BaseVisitor['visitAsignacion']}
     */
    visitAsignacion(node) {
        node.exp.accept(this);
        const isFloat = this.code.getTopObject().tipo === 'float';

        const regd = isFloat? freg.FT0 : reg.T0;

        const valueObject = this.code.popObject(`${regd}`);
        const [offset, variableObject] = this.code.getObject(node.id);
    
        if(this.insideFunction) {
            this.code.addi(reg.T1, reg.FP, -variableObject.offset * 4);
            this.code.sw(reg.T0, reg.T1);
            return;
        }

        if(isFloat) {
            this.code.addi(reg.T1, reg.SP, `${offset}`);
            this.code.fsw(freg.FT0, reg.T1);
        } else {
            this.code.addi(reg.T1, reg.SP, `${offset}`);
            this.code.sw(reg.T0, reg.T1);
        }

        variableObject.tipo = valueObject.tipo;

        if (isFloat) {
            this.code.pushFloat(freg.FT0);

        } else {
            this.code.push(reg.T0);
        }
        this.code.pushObject(valueObject);
    }

    /**
     * @type {BaseVisitor['visitBloque']}
     */
    visitBloque(node) {
        // crear un escope, evaluar las declaraciones y bloques y terminar el escope

        this.code.createScope();

        node.dcls.forEach((dcl) => dcl.accept(this));

        const bytesToRemove = this.code.finishScope();

        if(bytesToRemove > 0) {
            this.code.addi(reg.SP, reg.SP, bytesToRemove);
        }
    }

    /**
     * @type {BaseVisitor['visitIf']}
     */
    visitIf(node) {
        this.code.comment('If statement');
        
        node.condicion.accept(this); // Evaluar la condición, esta se guarda en T0, para usar t0 y evaluar si esta es true o false
        this.code.popObject(reg.T0); // obtener el valor de la condicion

        const containsElse = !!node.bloqueFalse; // no se por que la doble negación es necesaria :( pero asi esta :)

        if (containsElse) {
            const labelFalse = this.code.getLabel();
            const endLabel = this.code.getLabel();

            this.code.beq(reg.T0, reg.ZERO, labelFalse); // si la condicion es true, saltar al labelFalse

            node.bloqueTrue.accept(this); // evaluar el bloque true
            this.code.j(endLabel); // saltar al labelEnd

            this.code.addLabel(labelFalse); // label para el bloque false
            node.bloqueFalse.accept(this); // evaluar el bloque false
            this.code.addLabel(endLabel); // label para el fin del if
        } else {
            const endLabel = this.code.getLabel();
            this.code.beq(reg.T0, reg.ZERO, endLabel); // si la condicion es true, saltar al labelEnd
            node.bloqueTrue.accept(this); // evaluar el bloque true
            this.code.addLabel(endLabel); // label para el fin del if
        }
        this.code.comment('End of if statement');
    }

    /**
     * @type {BaseVisitor['visitWhile']}
     */
    visitWhile(node) {
        /*
        startWhile:
            cond
        if !cond goto endWhile
            stmt
            goto startWhile
        endWhile:
        */

        const startWhile = this.code.getLabel();
        const previousContLabel = this.continueLabel;
        this.continueLabel = startWhile;

        const endWhile = this.code.getLabel();
        const previousBreakLabel = this.breakLabel;
        this.breakLabel = endWhile;

        this.code.addLabel(startWhile);
        node.condicion.accept(this); // Evaluar la condición, esta se guarda en T0, para usar t0 y evaluar si esta es true o false

        this.code.popObject(reg.T0); // obtener el valor de la condicion
        this.code.beq(reg.T0, reg.ZERO, endWhile); // si la condicion es true, saltar al labelEnd

        node.bloque.accept(this); // evaluar el bloque

        this.code.j(startWhile); // saltar al labelStart
        
        this.code.addLabel(endWhile); // label para el fin del while

        this.continueLabel = previousContLabel;
        this.breakLabel = previousBreakLabel;
    }


    /**
     * @type {BaseVisitor['visitFor']}
     */
    visitFor(node) {
        const startFor = this.code.getLabel();
        
        const endFor = this.code.getLabel();
        const previousBreakLabel = this.breakLabel;
        this.breakLabel = endFor;

        const incrementLabel = this.code.getLabel();
        const previousContLabel = this.continueLabel;
        this.continueLabel = incrementLabel;

        // se crea el scope para el for, ya que es el principal que contiene
        // la inicialización, la condición y el incremento, que es antes del bloque
        // que ya tiene cada sentencia
        this.code.createScope();

        node.inicial.accept(this); // evaluar la inicialización

        this.code.addLabel(startFor);
        node.condicion.accept(this); // evaluar la condición, esta se guarda en T0, para usar t0 y evaluar si esta es true o false
        this.code.popObject(reg.T0); // obtener el valor del incremento
        this.code.beq(reg.T0, reg.ZERO, endFor); // si la condicion es true, saltar al labelEnd

        node.bloque.accept(this); // evaluar el bloque

        this.code.addLabel(incrementLabel);
        node.incremento.accept(this); // evaluar el incremento
        this.code.popObject(reg.T0); // obtener el valor del incremento
        this.code.j(startFor); // saltar al labelStart

        this.code.addLabel(endFor); // label para el fin del for

        const bytesToRemove = this.code.finishScope();

        if(bytesToRemove > 0) {
            this.code.addi(reg.SP, reg.SP, bytesToRemove);
        }

        this.continueLabel = previousContLabel;
        this.breakLabel = previousBreakLabel;
    }
    
    
    visitSwitch(node) {
        this.code.comment('Switch statement');
        
        // Evaluar la expresión del switch y guardarla
        node.exp.accept(this);
        const isFloat = this.code.getTopObject().tipo === 'float';
        const expReg = isFloat ? freg.FT2 : reg.T2; // Usamos T2/FT2 para guardar el valor del switch
        this.code.popObject(expReg);
        
        const endSwitch = this.code.getLabel(); // Etiqueta para el final del switch
        const previousBreakLabel = this.breakLabel;
        this.breakLabel = endSwitch;
        
        // Array para almacenar las etiquetas de los cases
        const caseLabels = node.cases.map(() => this.code.getLabel());
        const defaultLabel = this.code.getLabel();
        
        // Generar los saltos condicionales para cada case
        node.cases.forEach((caseNode, index) => {
            // Evaluar el valor del case
            caseNode.valor.accept(this);
            const caseFloat = this.code.getTopObject().tipo === 'float';
            const caseReg = caseFloat ? freg.FT0 : reg.T0;
            this.code.popObject(caseReg);
            
            if (isFloat || caseFloat) {
                // Para floats, usamos la función de comparación
                if (!isFloat) this.code.fcvtsw(freg.FT2, reg.T2);
                if (!caseFloat) this.code.fcvtsw(freg.FT0, reg.T0);
                this.code.feq(freg.FT0, freg.FT2);
                this.code.bne(reg.A0, reg.ZERO, caseLabels[index]);
            } else {
                // Para enteros, comparación directa
                this.code.beq(reg.T2, reg.T0, caseLabels[index]);
            }
        });
        
        // Si ningún case coincide, saltar al default si existe
        if (node.defaultC) {
            this.code.j(defaultLabel);
        } else {
            this.code.j(endSwitch);
        }
        
        // Generar el código para cada case
        node.cases.forEach((caseNode, index) => {
            this.code.addLabel(caseLabels[index]);
            caseNode.stmts.forEach(stmt => stmt.accept(this));
            
            // Si no es el último case y no hay más cases después,
            // y no terminó en break, continuar con el siguiente case
            if (index < node.cases.length - 1) {
                const nextCase = node.cases[index + 1];
                if (nextCase) {
                    // Verificar si el último statement no es un break
                    const lastStmt = caseNode.stmts[caseNode.stmts.length - 1];
                    if (!lastStmt || lastStmt.constructor.name !== 'Break') {
                        this.code.j(caseLabels[index + 1]);
                    }
                }
            }
        });
        
        // Generar el código para el default si existe
        if (node.defaultC) {
            this.code.addLabel(defaultLabel);
            node.defaultC.forEach(stmt => stmt.accept(this));
        }
        
        this.code.addLabel(endSwitch);
        this.breakLabel = previousBreakLabel;
        
        this.code.comment('End of switch statement');
    }


    visitBreak(node) {
        this.code.j(this.breakLabel);
    }

    visitContinue(node) {
        this.code.j(this.continueLabel);
    }

    visitReturn(node) {
        if(node.exp) {
            // suponer que el return con valor es solo dentro de una función
            node.exp.accept(this);
            this.code.popObject(reg.A0);

            const frameSize = this.functionMetadata[this.insideFunction].frameSize;
            const returnOffset = frameSize - 1;
            this.code.addi(reg.T0, reg.FP, -returnOffset * 4);
            this.code.sw(reg.A0, reg.T0);
        }

        this.code.j(this.returnLabel);
    }

    /**
     * @type {BaseVisitor['visitFuncion']}
     */
    visitFuncion(node) {
        const baseSize = 2;
        const paramSize = node.params.length;
        const frameVisitor = new FrameVisitor(baseSize + paramSize);
        node.bloque.accept(frameVisitor);
        const localFrame = frameVisitor.frame;
        const localSize = localFrame.length;

        const returnSize = 1;

        const totalSize = baseSize + paramSize + localSize + returnSize;
        
        this.functionMetadata[node.id] = {
            frameSize : totalSize,
            returnType : node.tipo
        }

        const instruccionesMain = this.code.instructions;
        const insideFunctionInstructions = []
        this.code.instructions = insideFunctionInstructions;

       

        node.params.forEach((param, index) => {
            const paramId = param.id || param.id2;
            const paramTipo = param.tipo || param.tipo2;

            this.code.pushObject({
                id: paramId,
                tipo: paramTipo,
                length: 4,
                offset: baseSize + index
            })
        });

        localFrame.forEach(variableLocal => {
            this.code.pushObject({
                ...variableLocal,
                length: 4,
                type: 'local',
            })
        });

        this.insideFunction = node.id;
        this.frameDclIndex = 0;
        this.returnLabel = this.code.getLabel();

        this.code.addLabel(node.id);

        node.bloque.accept(this);

        this.code.addLabel(this.returnLabel);
        
        this.code.add(reg.T0, reg.ZERO, reg.FP);
        this.code.lw(reg.RA, reg.T0);
        this.code.jalr(reg.ZERO, reg.RA, "0");
            

        // limpiar metadatos de la función

        for (let i = 0; i < paramSize + localSize; i++) {
            this.code.objectStack.pop();
        }

        this.code.instructions = instruccionesMain;

        insideFunctionInstructions.forEach(instruction => {
            this.code.instruccionesFuncion.push(instruction);
        });

        this.insideFunction = false;
    }

    /**
     * @type {BaseVisitor['visitLlamada']}
     */
    visitLlamada(node) {
        if(!(node.callee instanceof ReferenciaVariable)) return;

        const functionName = node.callee.id;
        

        const embebidas = {
            parseInt: () => {
                node.args[0].accept(this);
                this.code.popObject(reg.A0);
                this.code.callBuiltInFunction("parseInt");
                this.code.pushObject({ tipo: 'int', length: 4 });
            },
            parsefloat: () => {
                node.args[0].accept(this);
                this.code.popObject(reg.A0);
                this.code.callBuiltInFunction("parseFloat");
                this.code.pushObject({ tipo: 'float', length: 4 });
            },
            toLowerCase: () => {
                node.args[0].accept(this);
                this.code.popObject(reg.A0);
                this.code.callBuiltInFunction("toLowerCase");
                this.code.pushObject({ tipo: 'string', length: 4 });
            },
            toUpperCase: () => {
                node.args[0].accept(this);
                this.code.popObject(reg.A0);
                this.code.callBuiltInFunction("toUpperCase");
                this.code.pushObject({ tipo: 'string', length: 4 });
            },
            toString: () => {
                node.args[0].accept(this);
                this.code.popObject(reg.A0);
                this.code.callBuiltInFunction("toString");
                this.code.pushObject({ tipo: 'string', length: 4 });
            }
        }

        if(embebidas[functionName]) {
            embebidas[functionName]();
            return;
        } // si no es embebida es una función foranea o no existe xd

        const returnLabel = this.code.getLabel();

        this.code.addi(reg.SP, reg.SP, -4 * 2);
        node.args.forEach((arg) => {
            arg.accept(this);
        });

        this.code.addi(reg.SP, reg.SP, 4 * (node.args.length + 2));

        // guardar el frame pointer en t1
        this.code.addi(reg.T1, reg.SP, -4);

        // guardar el return address en t0
        this.code.la(reg.T0, returnLabel);
        this.code.push(reg.T0);

        // guardar el frame pointer en el stack
        this.code.push(reg.FP);
        this.code.addi(reg.FP, reg.T1, "0");

        const frameSize = this.functionMetadata[functionName].frameSize;
        this.code.addi(reg.SP, reg.SP, -(frameSize - 2) * 4);

        this.code.j(functionName);
        this.code.addLabel(returnLabel);

        const returnSize = frameSize - 1;
        this.code.addi(reg.T0, reg.FP, -returnSize * 4);
        this.code.lw(reg.A0, reg.T0);

        this.code.addi(reg.T0, reg.FP, -4);
        this.code.lw(reg.FP, reg.T0);

        this.code.addi(reg.SP, reg.SP, frameSize * 4);

        this.code.push(reg.A0);
        this.code.pushObject({ tipo: this.functionMetadata[functionName].returnType, length: 4 });
    }


}
