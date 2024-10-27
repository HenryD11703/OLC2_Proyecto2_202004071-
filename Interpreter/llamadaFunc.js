// Clase para definir todo lo que pueda ser llamado|invocable en el interprete
// Aridad es la cantidad de parámetros que puede recibir la función
import { InterpretarVisitor } from "./Interprete.js";

export class LlamadaFunc {
  
    aridad(){
        // verificar la cantidad de parametros y el tipo
        throw new Error('No implementado');
    }

    /**
     * 
     * @param {InterpretarVisitor} interprete 
     * @param {any[]} args 
     */
    invocar(interprete, args){
        throw new Error('No implementado');
    }

}