import { BaseVisitor } from "./visitor.js";

export class FrameVisitor extends BaseVisitor {

    constructor(baseOffset) {
        super();
        this.frame = [];
        this.baseOffset = baseOffset;
        this.localSize = 0;
    }

    visitExpresion(node) {}
    visitNativo(node) {}
    visitOperacionBinaria(node) {}
    visitOperacionUnaria(node) {}
    visitAgrupacion(node) {}
    visitNumero(node) {}
    visitDeclaracionVariable(node) {
        this.frame.push({
            id: node.id,
            offset: this.baseOffset + this.localSize,
        });
        this.localSize+= 1;
    }
    visitDeclaracionSimple(node) {
        this.frame.push({
            id: node.id,
            offset: this.baseOffset + this.localSize,
        });
        this.localSize++;
    }
    visitDeclaracionSinTipo(node) {
        this.frame.push({
            id: node.id,
            offset: this.baseOffset + this.localSize,
        });
        this.localSize++;
    }
    visitReferenciaVariable(node) {}
    visitPrint(node) {}
    visitStatement(node) {}
    visitAsignacion(node) {}

    /**
     * @type {BaseVisitor['visitBloque']}
     */
    visitBloque(node) {
        node.dcls.forEach(dcl => dcl.accept(this));
    }
    /**
     * @type {BaseVisitor['visitIf']}
     */
    visitIf(node) {
       node.bloqueTrue.accept(this);
       if (node.bloqueFalse) node.bloqueFalse.accept(this);
    }

    visitTernary(node) {}

    /**
     * @type {BaseVisitor['visitWhile']}
     */
    visitWhile(node) {
        node.bloque.accept(this);
    }
    /**
     * @type {BaseVisitor['visitFor']}
     */
    visitFor(node) {
        node.bloque.accept(this);    
    }
    visitSwitch(node) {
        // por cada case, hay que aceptar aca, pero
        // no lo voy a hacer :(
    }
    visitBreak(node) {}
    visitContinue(node) {}
    visitReturn(node) {}
    visitLlamada(node) {}
    visitArray(node) {}
    visitArraySimple(node) {}
    visitArrayCopia(node) {}
    visitAccesoVector(node) {}
    visitAsignacionArray(node) {}
    visitForeach(node) {}
    visitIndexOf(node) {}
    visitLength(node) {}
    visitJoin(node) {}
    visitFuncion(node) {}
    visitTypeof(node) {}
    visitMatrix(node) {}
    visitMatrixSimple(node) {}
    visitAccesoMatrix(node) {}
    visitStruct(node) {}
    visitStructVar(node) {}
    visitStructVarSimple(node) {}
    visitInstancia(node) {}
    visitGet(node) {}
    visitSet(node) {}
}