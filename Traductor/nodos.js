
/**
 * @typedef {Object} Location
 * @property {Object} start
 * @property {number} start.offset
 * @property {number} start.line
 * @property {number} start.column
 * @property {Object} end
 * @property {number} end.offset
 * @property {number} end.line
 * @property {number} end.column
*/
    

/**
 * @typedef {import('./visitor').BaseVisitor} BaseVisitor
 */

export class Expresion  {

    /**
    * @param {Object} options
    * @param {Location|null} options.location Ubicacion del nodo en el codigo fuente
    */
    constructor() {
        
        
        /**
         * Ubicacion del nodo en el codigo fuente
         * @type {Location|null}
        */
        this.location = null;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitExpresion(this);
    }
}
    
export class Nativo extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de dato del nativo
 * @param {any} options.valor Valor del nativo
    */
    constructor({ tipo, valor }) {
        super();
        
        /**
         * Tipo de dato del nativo
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Valor del nativo
         * @type {any}
        */
        this.valor = valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitNativo(this);
    }
}
    
export class OperacionBinaria extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.izq Expresion izquierda de la operacion
 * @param {Expresion} options.der Expresion derecha de la operacion
 * @param {string} options.op Operador de la operacion
    */
    constructor({ izq, der, op }) {
        super();
        
        /**
         * Expresion izquierda de la operacion
         * @type {Expresion}
        */
        this.izq = izq;


        /**
         * Expresion derecha de la operacion
         * @type {Expresion}
        */
        this.der = der;


        /**
         * Operador de la operacion
         * @type {string}
        */
        this.op = op;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitOperacionBinaria(this);
    }
}
    
export class OperacionUnaria extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion de la operacion
 * @param {string} options.op Operador de la operacion
    */
    constructor({ exp, op }) {
        super();
        
        /**
         * Expresion de la operacion
         * @type {Expresion}
        */
        this.exp = exp;


        /**
         * Operador de la operacion
         * @type {string}
        */
        this.op = op;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitOperacionUnaria(this);
    }
}
    
export class Agrupacion extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion agrupada
    */
    constructor({ exp }) {
        super();
        
        /**
         * Expresion agrupada
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitAgrupacion(this);
    }
}
    
export class Numero extends Expresion {

    /**
    * @param {Object} options
    * @param {number} options.valor Valor del numero
    */
    constructor({ valor }) {
        super();
        
        /**
         * Valor del numero
         * @type {number}
        */
        this.valor = valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitNumero(this);
    }
}
    
export class DeclaracionVariable extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de la variable
 * @param {string} options.id Identificador de la variable
 * @param {Expresion} options.valor Valor inicial de la variable
    */
    constructor({ tipo, id, valor }) {
        super();
        
        /**
         * Tipo de la variable
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;


        /**
         * Valor inicial de la variable
         * @type {Expresion}
        */
        this.valor = valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDeclaracionVariable(this);
    }
}
    
export class DeclaracionSimple extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de la variable
 * @param {string} options.id Identificador de la variable
    */
    constructor({ tipo, id }) {
        super();
        
        /**
         * Tipo de la variable
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDeclaracionSimple(this);
    }
}
    
export class DeclaracionSinTipo extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la variable
 * @param {Expresion} options.valor Valor inicial de la variable
    */
    constructor({ id, valor }) {
        super();
        
        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;


        /**
         * Valor inicial de la variable
         * @type {Expresion}
        */
        this.valor = valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDeclaracionSinTipo(this);
    }
}
    
export class ReferenciaVariable extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.id Identificador de la variable
    */
    constructor({ id }) {
        super();
        
        /**
         * Identificador de la variable
         * @type {Expresion}
        */
        this.id = id;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitReferenciaVariable(this);
    }
}
    
export class Print extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion[]} options.args Argumentos a imprimir
    */
    constructor({ args }) {
        super();
        
        /**
         * Argumentos a imprimir
         * @type {Expresion[]}
        */
        this.args = args;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitPrint(this);
    }
}
    
export class Statement extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion a ejecutar
    */
    constructor({ exp }) {
        super();
        
        /**
         * Expresion a ejecutar
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitStatement(this);
    }
}
    
export class Asignacion extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.id Identificador de la variable
 * @param {Expresion} options.exp Expresion a asignar
    */
    constructor({ id, exp }) {
        super();
        
        /**
         * Identificador de la variable
         * @type {Expresion}
        */
        this.id = id;


        /**
         * Expresion a asignar
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitAsignacion(this);
    }
}
    
export class Bloque extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion[]} options.dcls Declaraciones y expresiones en el bloque
    */
    constructor({ dcls }) {
        super();
        
        /**
         * Declaraciones y expresiones en el bloque
         * @type {Expresion[]}
        */
        this.dcls = dcls;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitBloque(this);
    }
}
    
export class If extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.condicion Expresion que debe ser verdadera para ejecutar el bloque if
 * @param {Expresion} options.bloqueTrue Bloque de codigo a ejecutar si la condicion es verdadera
 * @param {Expresion|null} options.bloqueFalse Bloque de codigo a ejecutar si la condicion es falsa (null si no se especifica)
    */
    constructor({ condicion, bloqueTrue, bloqueFalse }) {
        super();
        
        /**
         * Expresion que debe ser verdadera para ejecutar el bloque if
         * @type {Expresion}
        */
        this.condicion = condicion;


        /**
         * Bloque de codigo a ejecutar si la condicion es verdadera
         * @type {Expresion}
        */
        this.bloqueTrue = bloqueTrue;


        /**
         * Bloque de codigo a ejecutar si la condicion es falsa (null si no se especifica)
         * @type {Expresion|null}
        */
        this.bloqueFalse = bloqueFalse;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitIf(this);
    }
}
    
export class Ternary extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.condicion Expresion que debe ser verdadera para ejecutar el bloque if
 * @param {Expresion} options.expTrue Expresion a retornar si la condicion es verdadera
 * @param {Expresion} options.expFalse Expresion a retornar si la condicion es falsa
    */
    constructor({ condicion, expTrue, expFalse }) {
        super();
        
        /**
         * Expresion que debe ser verdadera para ejecutar el bloque if
         * @type {Expresion}
        */
        this.condicion = condicion;


        /**
         * Expresion a retornar si la condicion es verdadera
         * @type {Expresion}
        */
        this.expTrue = expTrue;


        /**
         * Expresion a retornar si la condicion es falsa
         * @type {Expresion}
        */
        this.expFalse = expFalse;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitTernary(this);
    }
}
    
export class While extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.condicion Expresion que debe ser verdadera para ejecutar el bloque while
 * @param {Expresion} options.bloque Bloque de codigo a ejecutar mientras la condicion sea verdadera
    */
    constructor({ condicion, bloque }) {
        super();
        
        /**
         * Expresion que debe ser verdadera para ejecutar el bloque while
         * @type {Expresion}
        */
        this.condicion = condicion;


        /**
         * Bloque de codigo a ejecutar mientras la condicion sea verdadera
         * @type {Expresion}
        */
        this.bloque = bloque;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitWhile(this);
    }
}
    
export class For extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.inicial Expresion que inicializa el contador
 * @param {Expresion} options.condicion Expresion que debe ser verdadera para ejecutar el bloque for
 * @param {Expresion} options.incremento Expresion que se ejecuta despues de cada iteracion
 * @param {Expresion} options.bloque Bloque de codigo a ejecutar en cada iteracion
    */
    constructor({ inicial, condicion, incremento, bloque }) {
        super();
        
        /**
         * Expresion que inicializa el contador
         * @type {Expresion}
        */
        this.inicial = inicial;


        /**
         * Expresion que debe ser verdadera para ejecutar el bloque for
         * @type {Expresion}
        */
        this.condicion = condicion;


        /**
         * Expresion que se ejecuta despues de cada iteracion
         * @type {Expresion}
        */
        this.incremento = incremento;


        /**
         * Bloque de codigo a ejecutar en cada iteracion
         * @type {Expresion}
        */
        this.bloque = bloque;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitFor(this);
    }
}
    
export class Switch extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion que selecciona la seccion del switch
 * @param {Expresion[]} options.cases Casos del switch
 * @param {Expresion[]|null} options.def Bloque de codigo a ejecutar si no se encuentra ningun caso coincidente
    */
    constructor({ exp, cases, def }) {
        super();
        
        /**
         * Expresion que selecciona la seccion del switch
         * @type {Expresion}
        */
        this.exp = exp;


        /**
         * Casos del switch
         * @type {Expresion[]}
        */
        this.cases = cases;


        /**
         * Bloque de codigo a ejecutar si no se encuentra ningun caso coincidente
         * @type {Expresion[]|null}
        */
        this.def = def;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitSwitch(this);
    }
}
    
export class Break extends Expresion {

    /**
    * @param {Object} options
    * 
    */
    constructor() {
        super();
        
    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitBreak(this);
    }
}
    
export class Continue extends Expresion {

    /**
    * @param {Object} options
    * 
    */
    constructor() {
        super();
        
    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitContinue(this);
    }
}
    
export class Return extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion|null} options.exp Expresion que se retorna
    */
    constructor({ exp }) {
        super();
        
        /**
         * Expresion que se retorna
         * @type {Expresion|null}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitReturn(this);
    }
}
    
export class Llamada extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.callee Expresion que llama a la funcion
 * @param {Expresion[]} options.args Argumentos a pasar a la funcion
    */
    constructor({ callee, args }) {
        super();
        
        /**
         * Expresion que llama a la funcion
         * @type {Expresion}
        */
        this.callee = callee;


        /**
         * Argumentos a pasar a la funcion
         * @type {Expresion[]}
        */
        this.args = args;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitLlamada(this);
    }
}
    
export class Array extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo del array
 * @param {string} options.id Identificador del array
 * @param {Expresion[]} options.elementos Elementos del array
    */
    constructor({ tipo, id, elementos }) {
        super();
        
        /**
         * Tipo del array
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Identificador del array
         * @type {string}
        */
        this.id = id;


        /**
         * Elementos del array
         * @type {Expresion[]}
        */
        this.elementos = elementos;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitArray(this);
    }
}
    
export class ArraySimple extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo1 Tipo del array
 * @param {string} options.id Identificador del array
 * @param {string} options.tipo2 Tipo de los elementos del array
 * @param {number} options.size Tamaño del array
    */
    constructor({ tipo1, id, tipo2, size }) {
        super();
        
        /**
         * Tipo del array
         * @type {string}
        */
        this.tipo1 = tipo1;


        /**
         * Identificador del array
         * @type {string}
        */
        this.id = id;


        /**
         * Tipo de los elementos del array
         * @type {string}
        */
        this.tipo2 = tipo2;


        /**
         * Tamaño del array
         * @type {number}
        */
        this.size = size;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitArraySimple(this);
    }
}
    
export class ArrayCopia extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo del array
 * @param {string} options.id Identificador del array
 * @param {string} options.id2 Identificador del array a copiar
    */
    constructor({ tipo, id, id2 }) {
        super();
        
        /**
         * Tipo del array
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Identificador del array
         * @type {string}
        */
        this.id = id;


        /**
         * Identificador del array a copiar
         * @type {string}
        */
        this.id2 = id2;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitArrayCopia(this);
    }
}
    
export class AccesoVector extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador del array
 * @param {Expresion} options.index Expresion que representa el indice del array
    */
    constructor({ id, index }) {
        super();
        
        /**
         * Identificador del array
         * @type {string}
        */
        this.id = id;


        /**
         * Expresion que representa el indice del array
         * @type {Expresion}
        */
        this.index = index;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitAccesoVector(this);
    }
}
    
export class AsignacionArray extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador del array
 * @param {Expresion} options.index Expresion que representa el indice del array
 * @param {Expresion} options.exp Expresion que representa el valor a asignar
    */
    constructor({ id, index, exp }) {
        super();
        
        /**
         * Identificador del array
         * @type {string}
        */
        this.id = id;


        /**
         * Expresion que representa el indice del array
         * @type {Expresion}
        */
        this.index = index;


        /**
         * Expresion que representa el valor a asignar
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitAsignacionArray(this);
    }
}
    
export class Foreach extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo del elemento del array
 * @param {string} options.id Identificador del elemento del array
 * @param {Expresion} options.exp Expresion que representa el array
 * @param {Expresion} options.bloque Bloque de codigo a ejecutar en cada iteracion
    */
    constructor({ tipo, id, exp, bloque }) {
        super();
        
        /**
         * Tipo del elemento del array
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Identificador del elemento del array
         * @type {string}
        */
        this.id = id;


        /**
         * Expresion que representa el array
         * @type {Expresion}
        */
        this.exp = exp;


        /**
         * Bloque de codigo a ejecutar en cada iteracion
         * @type {Expresion}
        */
        this.bloque = bloque;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitForeach(this);
    }
}
    
export class IndexOf extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador del array
 * @param {Expresion} options.exp Expresion que representa el elemento a buscar
    */
    constructor({ id, exp }) {
        super();
        
        /**
         * Identificador del array
         * @type {string}
        */
        this.id = id;


        /**
         * Expresion que representa el elemento a buscar
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitIndexOf(this);
    }
}
    
export class Length extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador del array
    */
    constructor({ id }) {
        super();
        
        /**
         * Identificador del array
         * @type {string}
        */
        this.id = id;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitLength(this);
    }
}
    
export class Join extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador del array
    */
    constructor({ id }) {
        super();
        
        /**
         * Identificador del array
         * @type {string}
        */
        this.id = id;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitJoin(this);
    }
}
    
export class Funcion extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de la funcion
 * @param {string} options.id Identificador de la funcion
 * @param {string[]} options.params Parametros de la funcion
 * @param {Bloque} options.bloque Bloque de codigo de la funcion
    */
    constructor({ tipo, id, params, bloque }) {
        super();
        
        /**
         * Tipo de la funcion
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Identificador de la funcion
         * @type {string}
        */
        this.id = id;


        /**
         * Parametros de la funcion
         * @type {string[]}
        */
        this.params = params;


        /**
         * Bloque de codigo de la funcion
         * @type {Bloque}
        */
        this.bloque = bloque;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitFuncion(this);
    }
}
    
export class Typeof extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion que representa el valor
    */
    constructor({ exp }) {
        super();
        
        /**
         * Expresion que representa el valor
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitTypeof(this);
    }
}
    
export class Matrix extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de la matriz
 * @param {string} options.id Identificador de la matriz
 * @param {Expresion[]} options.valores Valores de la matriz
 * @param {number} options.dimensiones Dimensiones de la matriz
    */
    constructor({ tipo, id, valores, dimensiones }) {
        super();
        
        /**
         * Tipo de la matriz
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Identificador de la matriz
         * @type {string}
        */
        this.id = id;


        /**
         * Valores de la matriz
         * @type {Expresion[]}
        */
        this.valores = valores;


        /**
         * Dimensiones de la matriz
         * @type {number}
        */
        this.dimensiones = dimensiones;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitMatrix(this);
    }
}
    
export class MatrixSimple extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de la matriz
 * @param {number} options.dimensiones Dimensiones de la matriz
 * @param {string} options.id Identificador de la matriz
 * @param {string} options.tipo2 Tipo de los elementos de la matriz
 * @param {number} options.tamaño1 Tamaño de la primera dimension de la matriz
 * @param {number[]} options.tamaños Tamaños de las dimensiones adicionales de la matriz
    */
    constructor({ tipo, dimensiones, id, tipo2, tamaño1, tamaños }) {
        super();
        
        /**
         * Tipo de la matriz
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Dimensiones de la matriz
         * @type {number}
        */
        this.dimensiones = dimensiones;


        /**
         * Identificador de la matriz
         * @type {string}
        */
        this.id = id;


        /**
         * Tipo de los elementos de la matriz
         * @type {string}
        */
        this.tipo2 = tipo2;


        /**
         * Tamaño de la primera dimension de la matriz
         * @type {number}
        */
        this.tamaño1 = tamaño1;


        /**
         * Tamaños de las dimensiones adicionales de la matriz
         * @type {number[]}
        */
        this.tamaños = tamaños;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitMatrixSimple(this);
    }
}
    
export class AsignacionMatrix extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador del array
 * @param {Expresion} options.index Expresion que representa el primer indice del array
 * @param {number[]} options.indexA Indices adicionales del array
 * @param {Expresion} options.exp Expresion que representa el valor a asignar
    */
    constructor({ id, index, indexA, exp }) {
        super();
        
        /**
         * Identificador del array
         * @type {string}
        */
        this.id = id;


        /**
         * Expresion que representa el primer indice del array
         * @type {Expresion}
        */
        this.index = index;


        /**
         * Indices adicionales del array
         * @type {number[]}
        */
        this.indexA = indexA;


        /**
         * Expresion que representa el valor a asignar
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitAsignacionMatrix(this);
    }
}
    
export class AccesoMatrix extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador del array
 * @param {Expresion} options.index Expresion que representa el primer indice del array
 * @param {number[]} options.indices Indices adicionales del array
    */
    constructor({ id, index, indices }) {
        super();
        
        /**
         * Identificador del array
         * @type {string}
        */
        this.id = id;


        /**
         * Expresion que representa el primer indice del array
         * @type {Expresion}
        */
        this.index = index;


        /**
         * Indices adicionales del array
         * @type {number[]}
        */
        this.indices = indices;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitAccesoMatrix(this);
    }
}
    
export class Struct extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador del struct
 * @param {Expresion[]} options.dcls Declaraciones de variables del struct
    */
    constructor({ id, dcls }) {
        super();
        
        /**
         * Identificador del struct
         * @type {string}
        */
        this.id = id;


        /**
         * Declaraciones de variables del struct
         * @type {Expresion[]}
        */
        this.dcls = dcls;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitStruct(this);
    }
}
    
export class StructVar extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de la variable
 * @param {string} options.id Identificador de la variable
 * @param {Expresion} options.valor Valor inicial de la variable
    */
    constructor({ tipo, id, valor }) {
        super();
        
        /**
         * Tipo de la variable
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;


        /**
         * Valor inicial de la variable
         * @type {Expresion}
        */
        this.valor = valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitStructVar(this);
    }
}
    
export class StructVarSimple extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de la variable
 * @param {string} options.id Identificador de la variable
    */
    constructor({ tipo, id }) {
        super();
        
        /**
         * Tipo de la variable
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitStructVarSimple(this);
    }
}
    
export class Instancia extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la clase
 * @param {Expresion[]} options.args Argumentos de la instancia
    */
    constructor({ id, args }) {
        super();
        
        /**
         * Identificador de la clase
         * @type {string}
        */
        this.id = id;


        /**
         * Argumentos de la instancia
         * @type {Expresion[]}
        */
        this.args = args;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitInstancia(this);
    }
}
    
export class Get extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.Objetivo Expresion que representa el objetivo del get
 * @param {string} options.Propiedad Nombre de la propiedad del get
    */
    constructor({ Objetivo, Propiedad }) {
        super();
        
        /**
         * Expresion que representa el objetivo del get
         * @type {Expresion}
        */
        this.Objetivo = Objetivo;


        /**
         * Nombre de la propiedad del get
         * @type {string}
        */
        this.Propiedad = Propiedad;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitGet(this);
    }
}
    
export class Set extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.Objetivo Expresion que representa el objetivo del set
 * @param {string} options.Propiedad Nombre de la propiedad del set
 * @param {Expresion} options.Valor Valor a establecer en la propiedad
    */
    constructor({ Objetivo, Propiedad, Valor }) {
        super();
        
        /**
         * Expresion que representa el objetivo del set
         * @type {Expresion}
        */
        this.Objetivo = Objetivo;


        /**
         * Nombre de la propiedad del set
         * @type {string}
        */
        this.Propiedad = Propiedad;


        /**
         * Valor a establecer en la propiedad
         * @type {Expresion}
        */
        this.Valor = Valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitSet(this);
    }
}
    
export default { Expresion, Nativo, OperacionBinaria, OperacionUnaria, Agrupacion, Numero, DeclaracionVariable, DeclaracionSimple, DeclaracionSinTipo, ReferenciaVariable, Print, Statement, Asignacion, Bloque, If, Ternary, While, For, Switch, Break, Continue, Return, Llamada, Array, ArraySimple, ArrayCopia, AccesoVector, AsignacionArray, Foreach, IndexOf, Length, Join, Funcion, Typeof, Matrix, MatrixSimple, AsignacionMatrix, AccesoMatrix, Struct, StructVar, StructVarSimple, Instancia, Get, Set }