import { registers as reg } from "../RISC/constantes.js";
import { floatRegisters as freg } from "../RISC/constantes.js";
import { Generator } from "../RISC/generador.js";
import { BaseVisitor } from "./visitor.js";

export class CompilerVisitor extends BaseVisitor {
    constructor() {
        super();
        this.code = new Generator();

        this.insideFunction = false;
    }

    /**
     * @type {BaseVisitor['visitStatement']}
     */
    visitStatement(node) {
        node.exp.accept(this);
        this.code.popObject(reg.T0);
    }

    /**
     * @type {BaseVisitor['visitNativo']}
     */
    visitNativo(node) {
        this.code.comment(`Nativo ${node.valor}`);
        this.code.comment(`type ${node.tipo}`);
        // a la hora de hacer el push constant siempre se manejara el objeto con type y valor
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

            this.code.beq(reg.T0, "0", falseLabel); // si es falso ir a la etiqueta falseLabel

            node.der.accept(this); // interpretar la expresion derecha
            this.code.popObject(reg.T0); // obtener el valor de la expresion derecha

            this.code.beq(reg.T0, "0", falseLabel); // si es falso ir a la etiqueta falseLabel

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

            this.code.bne(reg.T0, "0", trueLabel); // si es verdadero ir a la etiqueta trueLabel

            node.der.accept(this); // interpretar la expresion derecha
            this.code.popObject(reg.T0); // obtener el valor de la expresion derecha

            this.code.bne(reg.T0, "0", trueLabel); // si es verdadero ir a la etiqueta trueLabel

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

        // Para las operaciones comparativas
        // se hara lo mismo, comparar valores, tener labels y segun si el registro es 1 o 0 ir hacia estos labels

        // if (node.op === '==') {
        //     node.izq.accept(this);
        //     node.der.accept(this);

        //     this.code.pop(reg.T1);
        //     this.code.pop(reg.T0);

        //     const trueLabel = this.code.getLabel();
        //     const endLabel = this.code.getLabel();

        //     this.code.beq(reg.T0, reg.T1, trueLabel);

        //     this.code.li(reg.T0, "0");
        //     this.code.j(endLabel);

        //     this.code.addLabel(trueLabel);
        //     this.code.li(reg.T0, "1");

        //     this.code.addLabel(endLabel);
        //     this.code.push(reg.T0);
        //     this.code.pushObject({ type: 'boolean', length: 4 });
        //     return;
        // }

        // if (node.op === '!=') {
        //     node.izq.accept(this);
        //     node.der.accept(this);

        //     this.code.pop(reg.T1);
        //     this.code.pop(reg.T0);

        //     const trueLabel = this.code.getLabel();
        //     const endLabel = this.code.getLabel();

        //     this.code.bne(reg.T0, reg.T1, trueLabel);

        //     this.code.li(reg.T0, "0");
        //     this.code.j(endLabel);

        //     this.code.addLabel(trueLabel);
        //     this.code.li(reg.T0, "1");

        //     this.code.addLabel(endLabel);
        //     this.code.push(reg.T0);
        //     this.code.pushObject({ type: 'boolean', length: 4 });
        //     return;
        // }

        // if (node.op === '<') {
        //     node.izq.accept(this);
        //     node.der.accept(this);

        //     this.code.pop(reg.T1);
        //     this.code.pop(reg.T0);

        //     const trueLabel = this.code.getLabel();
        //     const endLabel = this.code.getLabel();

        //     this.code.blt(reg.T0, reg.T1, trueLabel);

        //     this.code.li(reg.T0, "0");
        //     this.code.j(endLabel);

        //     this.code.addLabel(trueLabel);
        //     this.code.li(reg.T0, "1");

        //     this.code.addLabel(endLabel);
        //     this.code.push(reg.T0);
        //     this.code.pushObject({ type: 'boolean', length: 4 });
        //     return;
        // }

        // if (node.op === '>') {
        //     node.izq.accept(this);
        //     node.der.accept(this);

        //     this.code.pop(reg.T1);
        //     this.code.pop(reg.T0);

        //     const trueLabel = this.code.getLabel();
        //     const endLabel = this.code.getLabel();

        //     this.code.bgt(reg.T0, reg.T1, trueLabel);

        //     this.code.li(reg.T0, "0");
        //     this.code.j(endLabel);

        //     this.code.addLabel(trueLabel);
        //     this.code.li(reg.T0, "1");

        //     this.code.addLabel(endLabel);
        //     this.code.push(reg.T0);
        //     this.code.pushObject({ type: 'boolean', length: 4 });
        //     return;
        // }

        // if (node.op === '<=') {
        //     node.izq.accept(this);
        //     node.der.accept(this);

        //     this.code.pop(reg.T1);
        //     this.code.pop(reg.T0);

        //     const trueLabel = this.code.getLabel();
        //     const endLabel = this.code.getLabel();

        //     this.code.ble(reg.T0, reg.T1, trueLabel);

        //     this.code.li(reg.T0, "0");
        //     this.code.j(endLabel);

        //     this.code.addLabel(trueLabel);
        //     this.code.li(reg.T0, "1");

        //     this.code.addLabel(endLabel);
        //     this.code.push(reg.T0);
        //     this.code.pushObject({ type: 'boolean', length: 4 });
        //     return;
        // }

        // if (node.op === '>=') {
        //     node.izq.accept(this);
        //     node.der.accept(this);

        //     this.code.pop(reg.T1);
        //     this.code.pop(reg.T0);

        //     const trueLabel = this.code.getLabel();
        //     const endLabel = this.code.getLabel();

        //     this.code.bge(reg.T0, reg.T1, trueLabel);

        //     this.code.li(reg.T0, "0");
        //     this.code.j(endLabel);

        //     this.code.addLabel(trueLabel);
        //     this.code.li(reg.T0, "1");

        //     this.code.addLabel(endLabel);
        //     this.code.push(reg.T0);
        //     this.code.pushObject({ type: 'boolean', length: 4 });
        // }

        node.izq.accept(this);
        node.der.accept(this);

        const derFloat = this.code.getTopObject().tipo === 'float';
        const der = this.code.popObject(derFloat ? freg.FT0 : reg.T0);
        const izqFloat = this.code.getTopObject().tipo === 'float';
        const izq = this.code.popObject(izqFloat ? freg.FT1 : reg.T1);

        if (izq.tipo === 'string' && der.tipo === 'string') {
            this.code.comment("Concatenar dos strings");
            this.code.add(reg.A0, reg.ZERO, reg.T1);
            this.code.add(reg.A1, reg.ZERO, reg.T0);
            this.code.callBuiltInFunction('concatStrings');
            this.code.pushObject({ tipo: 'string', length: 4 });
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
                    this.code.fdiv(reg.FT0, freg.FT1, freg.FT0);
                    break;
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
            }    
        this.code.pushObject({ tipo: 'int', length: 4 });
    }

    /**
     * @type {BaseVisitor['visitOperacionUnaria']}
     */
    visitOperacionUnaria(node) {
        this.code.comment(`Operacion ${node.op}`);
        this.code.comment(`type ${node.tipo}`);



        node.exp.accept(this);
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
                this.code.beq(reg.T0, "0", trueLabel);
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
            console.log(isFloat);
            const object = this.code.popObject(isFloat? freg.FA0 : reg.A0);

            const PrintType = {
                'int': () => this.code.printInt(),
                'string': () => this.code.printString(),
                'float': () => this.code.printFloat(),
                'char': () => this.code.printChar(),
            }

            PrintType[object.tipo]();

            this.code.printNewLine();

        });
    }

    /**
     * @type {BaseVisitor['visitDeclaracionVariable']}
     */
    visitDeclaracionVariable(node) {
        this.code.comment(`Declaracion de variable ${node.id}`);
        node.valor.accept(this);

        if(this.insideFunction) {
            // hacer funcionamiento cuando ya esten las funciones
        }

        this.code.tagObject(node.id);
        this.code.popObject(reg.T0);
    }

    /**
     * @type {BaseVisitor['visitDeclaracionSinTipo']}
     */
    visitDeclaracionSinTipo(node) {
        this.code.comment(`Declaracion de variable sin tipo ${node.id}`);

        node.valor.accept(this);

        if(this.insideFunction) {
            // hacer funcionamiento cuando ya esten las funciones
        }

        this.code.tagObject(node.id);
        this.code.popObject(reg.T0);

        
    }

    /**
     * @type {BaseVisitor['visitReferenciaVariable']}
     */
    visitReferenciaVariable(node) {
        this.code.comment(`Referencia a variable ${node.id}`);
        const [offset, variableObject] = this.code.getObject(node.id);

        if(this.insideFunction) {
            // hacer funcionamiento cuando ya esten las funciones
        }

        this.code.addi(reg.T0, reg.SP, `${offset}`);
        this.code.lw(reg.T1, reg.T0);
        this.code.push(reg.T1);
        this.code.pushObject({...variableObject, id: undefined});

    }
}
