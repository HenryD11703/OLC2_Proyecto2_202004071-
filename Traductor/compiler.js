import { registers as reg } from "../RISC/constantes.js";
import { floatRegisters as freg } from "../RISC/constantes.js";
import { Generator } from "../RISC/generador.js";
import { BaseVisitor } from "./visitor.js";

export class CompilerVisitor extends BaseVisitor {
    constructor() {
        super();
        this.code = new Generator();
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
        this.code.comment(`Tipo ${node.tipo}`);
        // a la hora de hacer el push constant siempre se manejara el objeto con tipo y valor
        this.code.pushConstant({ tipo: node.tipo, valor: node.valor });
    }

    /**
     * @type {BaseVisitor['visitOperacionBinaria']}
     */
    visitOperacionBinaria(node) {

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
            this.code.pushObject({ tipo: 'boolen', length: 4 }); // push el objeto booleano en el stack
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
            this.code.pushObject({ tipo: 'boolen', length: 4 }); // push el objeto booleano en el stack
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
        //     this.code.pushObject({ tipo: 'boolean', length: 4 });
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
        //     this.code.pushObject({ tipo: 'boolean', length: 4 });
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
        //     this.code.pushObject({ tipo: 'boolean', length: 4 });
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
        //     this.code.pushObject({ tipo: 'boolean', length: 4 });
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
        //     this.code.pushObject({ tipo: 'boolean', length: 4 });
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
        //     this.code.pushObject({ tipo: 'boolean', length: 4 });
        // }

        this.code.comment(`Operacion ${node.op}`);
        node.izq.accept(this);
        node.der.accept(this);

        const derFloat = this.code.getTopObject().tipo === 'float';
        const der = this.code.popObject(derFloat ? reg.FT1 : reg.T0);
        const izqFloat = this.code.getTopObject().tipo === 'float';
        const izq = this.code.popObject(izqFloat ? reg.FT0 : reg.T1);

        if (izq.tipo === 'string' && der.tipo === 'string') {
            this.code.add(reg.A0, reg.ZERO, reg.T1);
            this.code.add(reg.A1, reg.ZERO, reg.T0);
            this.code.callBuiltin('concatString');
            this.code.pushObject({ type: 'string', length: 4 });
            return;
        }

        if (izqFloat || derFloat) {
            if(!izqFloat) this.code.fcvtsw(freg.FT1, reg.T1);
            if(!derFloat) this.code.fcvtsw(freg.FT0, reg.T0);
            switch (node.op) {
                case '+':
                    this.code.fadd(reg.T0, reg.T0, reg.T1);
                    break;
                case '-':
                    this.code.fsub(reg.T0, reg.T1, reg.T0);
                    break;
                case '*':
                    this.code.fmul(reg.T0, reg.T0, reg.T1);
                    break;
                case '/':
                    this.code.fdiv(reg.T0, reg.T1, reg.T0);
                    break;
            }
            this.code.pushFloat(freg.FT0);
            this.code.pushObject({ type: 'float', length: 4 });
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
        this.code.pushObject({ type: 'int', length: 4 });
    }

    /**
     * @type {BaseVisitor['visitOperacionUnaria']}
     */
    visitOperacionUnaria(node) {
        this.code.comment(`Operacion ${node.op}`);
        this.code.comment(`Tipo ${node.tipo}`);



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

        this.code.comment(`Print`);

        node.args.forEach(arg => {
            arg.accept(this);
            this.code.comment(`Print ${arg.tipo}`);
            this.code.pop(reg.A0);
            this.code.printInt(reg.A0);
        });
    }
}
