export class Entorno {
    constructor(padre = undefined) {
        this.variables = {};
        this.padre = padre;
    }

    asignarValorVariable(id, valor) {
        if (this.variables.hasOwnProperty(id)) {
            this.variables[id].valor = valor;
        } else if (this.padre) {
            this.padre.asignarValorVariable(id, valor);
        } else {
            throw new Error(`Error de referencia: variable ${id} no declarada`);
        }
    }

    agregarVariable(id, tipo, valor) {
        if (this.variables.hasOwnProperty(id)) {
            throw new Error(`Error: variable ${id} ya declarada en este ámbito`);
        }
        this.variables[id] = { tipo, valor };
    }

    obtenerValorVariable(id) {
        if (this.variables.hasOwnProperty(id)) {
            return { tipo: this.variables[id].tipo, valor: this.variables[id].valor };
        } else if (this.padre) {
            return this.padre.obtenerValorVariable(id);
        } else {
            return { tipo: null, valor: null }; // Si la variable no existe y no tiene padre
        }
    }

    verificarVariableExiste(id) {
        return this.variables.hasOwnProperty(id) || (this.padre && this.padre.verificarVariableExiste(id));
    }

    verificarVariableTipo(id, tipo) {
        if (this.variables.hasOwnProperty(id)) {
            return this.variables[id].tipo === tipo;
        } else if (this.padre) {
            return this.padre.verificarVariableTipo(id, tipo);
        }
        return false;
    }

    verificarVariableExisteEnEntornoActual(id) {
        return this.variables.hasOwnProperty(id);
    }

    esEntornoGlobal() {
        return this.padre === undefined;
    }

}