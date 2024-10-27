import { Entorno } from "./entorno.js";
import { LlamadaFunc } from "./llamadaFunc.js";
import { Funcion } from "../Traductor/nodos.js";
import { ReturnException } from "./sntcTansferencia.js";

export class funcionesForaneas extends LlamadaFunc {
    constructor(nodo, clousure) {
        super();
        /**
         * @type {Funcion}
         */
        this.nodo = nodo;
        /**
         * @type {Entorno}
         */
        this.closure = clousure;
    }

    aridad() {
        return this.nodo.params.length;
    }

    /**
     * @type {LlamadaFunc['invocar']}
     */
    invocar(interpretar,args){
        const entornoNuevo = new Entorno(this.closure);

        // el nodo.params es un array de objetos de tipo
        // tipo e id
        /*

        nodo.params contiene algo asi

        Array [ {…}, {…} ]
​
        0: Object { tipo: "int", id: "a" }
        ​
        1: Object { tipo2: "int", id2: "b" }

        FuncDcl = tipo:( "int[]" / "float[]" / "string[]" / "boolean[]" / "char[]" / "int" / "float" / "string" / "boolean" / "char" / "void") 
        _ id:Identificador _ "(" _ params:Parametros? _ ")" _ bloque:Bloque { return crearNodo('funcion', { tipo, id, params: params || [], bloque }) }

        Parametros = tipo:( "int[]" / "float[]" / "string[]" / "boolean[]" / "char[]" / "int" / "float" / "string" / "boolean" / "char")
         _ id:Identificador params:( _ "," _ tipo2:("int[]" / "float[]" / "string[]" / "boolean[]" / "char[]" / "int" / "float" / "string" / "boolean" / "char") 
         _ id2:Identificador { return { tipo2, id2 } })* { return [{ tipo, id }, ...params] }
        */
               
         this.nodo.params.forEach((param, index) => {
            const id = param.id || param.id2;
            const tipo = param.tipo || param.tipo2;
            entornoNuevo.agregarVariable(id, tipo, args[index].valor );
        });



        const EntornoPrevio = interpretar.entornoActual;
        interpretar.entornoActual = entornoNuevo;

        try {
            this.nodo.bloque.accept(interpretar);
        } catch (error) {
            interpretar.entornoActual = EntornoPrevio;

            if (error instanceof ReturnException) {
                
                if ( error.value.tipo === this.nodo.tipo) {
                    return { tipo: this.nodo.tipo, valor: error.value.valor };
                } else {
                    this.consola += `Error de tipos: la función ${this.nodo.id} retorna ${this.nodo.tipo} pero se esperaba ${error.value.tipo}\n`;
                    return { tipo: null, valor: null };
                }

            } else {
                throw error;
            }
        }

        interpretar.entornoActual = EntornoPrevio;
        return null; // Si no hay return, se retorna null


    }
}