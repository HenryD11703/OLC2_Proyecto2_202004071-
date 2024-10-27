import { LlamadaFunc } from "./llamadaFunc.js";

class FuncionesNativas extends LlamadaFunc {
    constructor(aridad, funcion){
        super();
        this.aridad = aridad;
        this.invocar = funcion;
    }
}

const timeFunc = new FuncionesNativas(
    () => 0,
    () => ({ tipo: 'string', valor: new Date().toISOString() })
);

const parseIntFunc = new FuncionesNativas(
    () => 1,
    (interpretar, args) => {
        if (args.length !== 1) {
            interpretar.consola += 'Error: parseInt recibe un solo argumento\n';
            return { tipo: null, valor: null };
        }
        const arg = args[0];
        
        /**
        Esta función permite convertir una expresión de tipo string en una expresión de tipo int.
        Si la cadena que recibe como parámetro no se puede convertir a un valor numérico se debe
        desplegar un mensaje de error. Si la string representa valor decimal, debe de redondearse
        por truncamiento.
         */

        if (arg.tipo !== 'string') {
            interpretar.consola += 'Error: parseInt recibe un argumento de tipo string\n';
            return { tipo: null, valor: null };
        }

        const valor = parseInt(arg.valor);

        if (isNaN(valor)) {
            interpretar.consola += 'Error: parseInt recibe un argumento de tipo string que sea un número\n';
            return { tipo: null, valor: null };
        }

        return { tipo: 'int', valor };

    }
);

const parseFloatFunc = new FuncionesNativas(
    () => 1,
    (interpretar, args) => {
        if (args.length !== 1) {
            interpretar.consola += 'Error: parseFloat recibe un solo argumento\n';
            return { tipo: null, valor: null };
        }
        const arg = args[0];
        
        /**
        Esta función permite convertir una expresión de tipo string en una expresión de tipo float.
        Si la cadena que recibe como parámetro no se puede convertir a un valor numerico con punto
        flotante se debe desplegar un mensaje de error.
         */

        if (arg.tipo !== 'string') {
            interpretar.consola += 'Error: parseFloat recibe un argumento de tipo string\n';
            return { tipo: null, valor: null };
        }

        const valor = parseFloat(arg.valor);

        if (isNaN(valor)) {
            interpretar.consola += 'Error: parseFloat recibe un argumento de tipo string que sea un número\n';
            return { tipo: null, valor: null };
        }

        return { tipo: 'float', valor };
    }
);

    /**
    Esta función es la contraparte de las dos anteriores, es decir, toma como parámetro un valor
    numérico y retorna una cadena de tipo String. Además sí recibe un valor boolean lo
    convierte en "true" o "false". Para valores tipo float la cantidad de números después
    del punto decimal queda a discreción del estudiante
    */
const toStringFunc = new FuncionesNativas(
    () => 1,
    (interpretar, args) => {
        if (args.length!== 1) {
            interpretar.consola += 'Error: toString recibe un solo argumento\n';
            return { tipo: null, valor: null };
        }
        const arg = args[0];
        
        if (arg.tipo === 'boolean') {
            return { tipo:'string', valor: arg.valor? 'true' : 'false' };
        }

        if (arg.tipo === 'int' || arg.tipo === 'float') {
            return { tipo:'string', valor: arg.valor.toString() };
        }

        interpretar.consola += 'Error: toString no puede convertir este tipo de dato\n';
        return { tipo: null, valor: null };
    }
)

/**
Esta función es aplicable a cualquier expresión de tipo string y su objetivo es convertir el
texto reconocido en letras minúsculas
 */

const toLowerCaseFunc = new FuncionesNativas(
    () => 1,
    (interpretar, args) => {
        if (args.length!== 1) {
            interpretar.consola += 'Error: toLowerCase recibe un solo argumento\n';
            return { tipo: null, valor: null };
        }
        const arg = args[0];
        
        if (arg.tipo!== 'string') {
            interpretar.consola += 'Error: toLowerCase recibe un argumento de tipo string\n';
            return { tipo: null, valor: null };
        }

        return { tipo:'string', valor: arg.valor.toLowerCase() };
    }
)

// Lo mismo para toUpperCase

const toUpperCaseFunc = new FuncionesNativas(
    () => 1,
    (interpretar, args) => {
        if (args.length!== 1) {
            interpretar.consola += 'Error: toUpperCase recibe un solo argumento\n';
            return { tipo: null, valor: null };
        }
        const arg = args[0];
        
        if (arg.tipo!== 'string') {
            interpretar.consola += 'Error: toUpperCase recibe un argumento de tipo string\n';
            return { tipo: null, valor: null };
        }

        return { tipo:'string', valor: arg.valor.toUpperCase() };
    }
)


/**
 * Funcion typeof
 * sta función retorna el tipo de dato asociado, este funcionará con tipos primitivos como lo son [string, int, float] y tipos compuestos como los structs.
 * Como los structs tambien manejaran el { tipo, valor } 
 */

const typeofFunc = new FuncionesNativas(
    () => 1,
    (interpretar, args) => {
        if (args.length!== 1) {
            interpretar.consola += 'Error: typeof recibe un solo argumento\n';
            return { tipo: null, valor: null };
        }
        const arg = args[0];
        
        return { tipo:'string', valor: arg.tipo };
    }
)

const obtenerLongitudArrayFunc = new FuncionesNativas(
    () => 1,
    (interpretar, args) => {
        if (args.length !== 1) {
            interpretar.consola += 'Error: obtenerLongitudArray recibe un solo argumento\n';
            return { tipo: null, valor: null };
        }
        const arg = args[0];
        
        if (!arg.tipo.endsWith('[]')) {
            interpretar.consola += 'Error: obtenerLongitudArray recibe un argumento de tipo array\n';
            return { tipo: null, valor: null };
        }

        return { tipo: 'int', valor: arg.valor.length };
    }
)


export const embebidas = {
    'time': timeFunc,
    'parseInt': parseIntFunc,
    'parsefloat': parseFloatFunc,
    'toString': toStringFunc,
    'toLowerCase': toLowerCaseFunc,
    'toUpperCase': toUpperCaseFunc,
    'typeof': typeofFunc,
    'obtenerLongitudArray': obtenerLongitudArrayFunc
};