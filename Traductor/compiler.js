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
    }

    /**
     * @type {BaseVisitor['visitNativo']}
     */
    visitNativo(node) {
        // verificar si es un un numero entero, decimal, booleano, string o caracter
        if (node.tipo === 'int') {
            this.code.li(reg.T0, node.valor);
        } else if (node.tipo === 'float') {
            // hacer lo que se haga para los flotantes
        }

        this.code.push(reg.T0);
    }

    /**
     * @type {BaseVisitor['visitOperacionBinaria']}
     */
    visitOperacionBinaria(node) {
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