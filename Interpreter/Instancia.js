import { Struct } from "./struct.js";

export class Instancia {
    constructor(struct) {
        /**
         * @type {Struct}
         */
        this.struct = struct;
        this.propiedades = {};
    }
    
    // Setter, para darle los valores a la variable a la hora de isntanciarla

    setPropiedad(nombre, tipo, valor) {
        this.propiedades[nombre] = { tipo, valor };
    }

    // Getter, para obtener los valores de las variables de la instancia

    getPropiedad(nombre) {
        if (this.propiedades.hasOwnProperty(nombre)) {
            return this.propiedades[nombre];
        }
        return null; // Si la propiedad no existe en la instancia, retornar null
    }

}