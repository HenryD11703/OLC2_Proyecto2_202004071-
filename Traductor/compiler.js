import { registers as reg } from "../RISC/constantes.js";
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

            this.code.beq(reg.T0, reg.ZERO, falseLabel); // si es falso ir a la etiqueta falseLabel

            node.der.accept(this); // interpretar la expresion derecha
            this.code.popObject(reg.T0); // obtener el valor de la expresion derecha

            this.code.beq(reg.T0, reg.ZERO, falseLabel); // si es falso ir a la etiqueta falseLabel

            this.code.li(reg.T0, 1); // si llega hasta aqui es verdadero
            this.code.push(reg.T0); // push 1 en el stack
            this.code.j(endLabel); // ir a la etiqueta endLabel
            this.code.addLabel(falseLabel); // agregar la etiqueta falseLabel
            this.code.li(reg.T0, 0); // si llega hasta aqui es falso
            this.code.push(reg.T0); // push 0 en el stack
            this.code.addLabel(endLabel); // agregar la etiqueta endLabel
            this.code.pushObject({ tipo: 'boolen', length: 4 }); // push el objeto booleano en el stack
        }

        this.code.comment(`Operacion ${node.op}`);
        node.izq.accept(this);
        node.der.accept(this);
        this.code.pop(reg.T0);
        this.code.pop(reg.T1);
        switch (node.op) {
            case '+':
                this.code.add(reg.T0, reg.T0, reg.T1);
                this.code.push(reg.T0);
                break;
            case '-':
                this.code.sub(reg.T0, reg.T0, reg.T1);
                this.code.push(reg.T0);
                break;
            case '*':
                this.code.mul(reg.T0, reg.T0, reg.T1);
                this.code.push(reg.T0);
                break;
            case '/':
                this.code.div(reg.T0, reg.T0, reg.T1);
                this.code.push(reg.T0);
                break;
        }
    }

    /**
     * @type {BaseVisitor['visitOperacionUnaria']}
     */
    visitOperacionUnaria(node) {
        node.exp.accept(this);
        this.code.pop(reg.T0);
        switch (node.op) {
            case '-':
                this.code.li(reg.T1, 0);
                this.code.sub(reg.T0, reg.T1, reg.T0);
                this.code.push(reg.T0);
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
        node.args.forEach(arg => {
            arg.accept(this);
            this.code.pop(reg.A0);
            this.code.printInt(reg.A0);
        });
    }
}