import { LlamadaFunc } from "./llamadaFunc.js";
import { Expresion } from "../Traductor/nodos.js";
import { Instancia } from "./Instancia.js";

export class Struct extends LlamadaFunc {

    constructor(nombre, propiedades) {
        super();
        /**
         * @type {String}
         */
        this.nombre = nombre;

        /**
         * @type {Object.<String, {tipo: String, valor: Expresion}>}
         */
        this.propiedades = propiedades;
    }

    aridad() {
        
    }

    invocar(interprete, args) {
        // instanciar
        const instancia =  new Instancia(this);

        Object.entries(this.propiedades).forEach(([nombre, propInfo]) => {
            console.log(nombre, propInfo);
            const valorInterpretado = propInfo.valor ? propInfo.valor.accept(interprete) : null;
            instancia.setPropiedad(nombre, propInfo.tipo, valorInterpretado);
        });

        return instancia;
    }

}