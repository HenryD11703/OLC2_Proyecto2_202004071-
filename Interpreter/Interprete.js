import { BaseVisitor } from "../Traductor/visitor.js";
import { Entorno } from "./entorno.js";
import nodos, { Expresion, Llamada } from "../Traductor/nodos.js";
import {
  BreakException,
  ContinueException,
  ReturnException,
} from "./sntcTansferencia.js";
import { LlamadaFunc } from "./llamadaFunc.js";
import { embebidas } from "./funcEmbebidas.js";
import { funcionesForaneas } from "./funcForaneas.js";
import { Struct } from "./struct.js";
import { TablaSimbolos } from "./TablaSimbolos.js";
import { Errores } from "./Errores.js";

export class InterpretarVisitor extends BaseVisitor {
  constructor() {
    super();
    this.Simbolos = {};
    this.entornoActual = new Entorno(); //Entorno Padre
    this.consola = ""; // Cadena para imprimir en la consola
    this.tablaSimbolos = new TablaSimbolos();
    this.errores = new Errores();

    Object.entries(embebidas).forEach(([nombre, funcion]) => {
      this.entornoActual.agregarVariable(nombre, funcion);
    });

    this.continuePrevio = null; // para manejar el continue en las funciones
    this.continueForEach = null;
  }
  /**
   * @type {BaseVisitor['visitOperacionBinaria']}
   */
  visitOperacionBinaria(node) {
    const izq = node.izq.accept(this);
    const der = node.der.accept(this);

    // Primero ver si alguno de estos tiene valor null, ya que esto
    // significa que hubo un error al interpretar una de sus variables
    // pero para seguir recorriendo el arbol se retornara como resultado
    // el valor null en la operacion

    if (izq.valor === null || der.valor === null) {
      return { tipo: null, valor: null };
    }

    switch (node.op) {
      case "+":
        // return izq.valor + der.valor;
        // Es necesario cambiar el return por que este retorna
        // un numero y no un objeto con tipo y valor, por lo que es
        // necesario retornar un nativo

        // Es necesario hacer verificaciones de cada operacion y si no cumplen se retorna null
        // Para la suma:
        // int + int retorna un int
        // int + float retorna un float

        // float + float retorna float
        // float + int retorna float

        // string + string retorna string

        // Cualquier otra combinacion sera un error

        if (izq.tipo === "int" && der.tipo === "int") {
          return { tipo: "int", valor: izq.valor + der.valor };
        } else if (izq.tipo === "float" && der.tipo === "float") {
          return { tipo: "float", valor: izq.valor + der.valor };
        } else if (izq.tipo === "int" && der.tipo === "float") {
          return { tipo: "float", valor: izq.valor + der.valor };
        } else if (izq.tipo === "float" && der.tipo === "int") {
          return { tipo: "float", valor: izq.valor + der.valor };
        } else if (izq.tipo === "string" && der.tipo === "string") {
          return { tipo: "string", valor: izq.valor + der.valor };
        } else {
          this.consola += `Error de tipos: no se puede sumar ${izq.tipo} con ${der.tipo}\n`;
          this.errores.agregarError(`Error de tipos: no se puede sumar ${izq.tipo} con ${der.tipo}`, node.location.start.line, node.location.start.column, "Semantico");
          return { tipo: null, valor: null };
        }
      case "-":
        // Para la resta:
        // int - int retorna int
        // int - float retorna float
        // float - float retorna float
        // float - int retorna float
        // cualquier otra combinacion es error y retorna null
        if (izq.tipo === "int" && der.tipo === "int") {
          return { tipo: "int", valor: izq.valor - der.valor };
        } else if (izq.tipo === "float" && der.tipo === "float") {
          return { tipo: "float", valor: izq.valor - der.valor };
        } else if (izq.tipo === "int" && der.tipo === "float") {
          return { tipo: "float", valor: izq.valor - der.valor };
        } else if (izq.tipo === "float" && der.tipo === "int") {
          return { tipo: "float", valor: izq.valor - der.valor };
        } else {
          this.consola += `Error de tipos: no se puede restar ${izq.tipo} con ${der.tipo}\n`;
          this.errores.agregarError(`Error de tipos: no se puede restar ${izq.tipo} con ${der.tipo}`, node.location.start.line, node.location.start.column, "Semantico");
          return { tipo: null, valor: null };
        }
      case "*":
        // Para la multiplicacion se hara lo mismo que en la resta
        if (izq.tipo === "int" && der.tipo === "int") {
          return { tipo: "int", valor: izq.valor * der.valor };
        } else if (izq.tipo === "float" && der.tipo === "float") {
          return { tipo: "float", valor: izq.valor * der.valor };
        } else if (izq.tipo === "int" && der.tipo === "float") {
          return { tipo: "float", valor: izq.valor * der.valor };
        } else if (izq.tipo === "float" && der.tipo === "int") {
          return { tipo: "float", valor: izq.valor * der.valor };
        } else {
          this.consola += `Error de tipos: no se puede multiplicar ${izq.tipo} con ${der.tipo}\n`;
          this.errores.agregarError(`Error de tipos: no se puede multiplicar ${izq.tipo} con ${der.tipo}`, node.location.start.line, node.location.start.column, "Semantico");
          return { tipo: null, valor: null };
        }
      case "/":
        // se debe verificar que no se divida entre 0
        if (der.valor === 0) {
          this.consola += `Error: no se pueden hacer divisiones entre 0\n`;
          this.errores.agregarError(`Error: no se pueden hacer divisiones entre 0`, node.location.start.line, node.location.start.column, "Semantico");
          return { tipo: null, valor: null };
        }
        // se hara lo mismo que en la resta y multiplicacion
        if (izq.tipo === "int" && der.tipo === "int") {
          return { tipo: "int", valor: izq.valor / der.valor };
        } else if (izq.tipo === "float" && der.tipo === "float") {
          return { tipo: "float", valor: izq.valor / der.valor };
        } else if (izq.tipo === "int" && der.tipo === "float") {
          return { tipo: "float", valor: izq.valor / der.valor };
        } else if (izq.tipo === "float" && der.tipo === "int") {
          return { tipo: "float", valor: izq.valor / der.valor };
        } else {
          this.consola += `Error de tipos: no se puede dividir ${izq.tipo} con ${der.tipo}\n`;
          this.errores.agregarError(`Error de tipos: no se puede dividir ${izq.tipo} con ${der.tipo}`, node.location.start.line, node.location.start.column, "Semantico");
          return { tipo: null, valor: null };
        }
      case "||":
        // este operador solo funciona si ambos son booleanos, si es null retornar null
        if (izq.tipo === null || der.tipo === null) {
          return { tipo: null, valor: null };
        }
        if (izq.tipo === "boolean" && der.tipo === "boolean") {
          return {
            tipo: "boolean",
            valor: Boolean(izq.valor) || Boolean(der.valor),
          };
        } else {
          this.consola += `Error de tipos: no se puede hacer la operacion OR entre ${izq.tipo} y ${der.tipo}\n`;
          this.errores.agregarError(`Error de tipos: no se puede hacer la operacion OR entre ${izq.tipo} y ${der.tipo}`, node.location.start.line, node.location.start.column, "Semantico");
          return { tipo: null, valor: null };
        }
      case "&&":
        if (izq.tipo === null || der.tipo === null) {
          return { tipo: null, valor: null };
        }
        if (izq.tipo === "boolean" && der.tipo === "boolean") {
          return {
            tipo: "boolean",
            valor: Boolean(izq.valor) && Boolean(der.valor),
          };
        } else {
          this.consola += `Error de tipos: no se puede hacer la operacion AND entre ${izq.tipo} y ${der.tipo}\n`;
          this.errores.agregarError(`Error de tipos: no se puede hacer la operacion AND entre ${izq.tipo} y ${der.tipo}`, node.location.start.line, node.location.start.column, "Semantico");
          return { tipo: null, valor: null };
        }
      case "==":
        // antes de evaluar ver si alguno de sus nodos es null y retornar null
        if (izq.tipo === null || der.tipo === null) {
          return { tipo: null, valor: null };
        }
        // int == o != int retorna boolean
        // float == o != float retorna boolean
        // int == o!= float retorna boolean
        // float == o != int retorna boolean
        // boolean == o != boolean retorna boolean
        // string == o != string retorna boolean
        // char == o != char retorna boolean
        // cualquier otra combinacion es error y retorna null
        if (izq.tipo === "int" && der.tipo === "int") {
          return { tipo: "boolean", valor: izq.valor === der.valor };
        } else if (izq.tipo === "float" && der.tipo === "float") {
          return { tipo: "boolean", valor: izq.valor === der.valor };
        } else if (izq.tipo === "int" && der.tipo === "float") {
          return { tipo: "boolean", valor: izq.valor === der.valor };
        } else if (izq.tipo === "float" && der.tipo === "int") {
          return { tipo: "boolean", valor: izq.valor === der.valor };
        } else if (izq.tipo === "boolean" && der.tipo === "boolean") {
          return { tipo: "boolean", valor: izq.valor === der.valor };
        } else if (izq.tipo === "string" && der.tipo === "string") {
          return { tipo: "boolean", valor: izq.valor === der.valor };
        } else if (izq.tipo === "char" && der.tipo === "char") {
          return { tipo: "boolean", valor: izq.valor === der.valor };
        } else {
          this.consola += `Error de tipos: no se puede comparar ${izq.tipo} con ${der.tipo}\n`;
          this.errores.agregarError(`Error de tipos: no se puede comparar ${izq.tipo} con ${der.tipo}`, node.location.start.line, node.location.start.column, "Semantico");
          return { tipo: null, valor: null };
        }
      case "!=":
        if (izq.tipo === null || der.tipo === null) {
          return { tipo: null, valor: null };
        }
        // se maneja igual que el ==
        if (izq.tipo === "int" && der.tipo === "int") {
          return { tipo: "boolean", valor: izq.valor !== der.valor };
        } else if (izq.tipo === "float" && der.tipo === "float") {
          return { tipo: "boolean", valor: izq.valor !== der.valor };
        } else if (izq.tipo === "int" && der.tipo === "float") {
          return { tipo: "boolean", valor: izq.valor !== der.valor };
        } else if (izq.tipo === "float" && der.tipo === "int") {
          return { tipo: "boolean", valor: izq.valor !== der.valor };
        } else if (izq.tipo === "boolean" && der.tipo === "boolean") {
          return { tipo: "boolean", valor: izq.valor !== der.valor };
        } else if (izq.tipo === "string" && der.tipo === "string") {
          return { tipo: "boolean", valor: izq.valor !== der.valor };
        } else if (izq.tipo === "char" && der.tipo === "char") {
          return { tipo: "boolean", valor: izq.valor !== der.valor };
        } else {
          this.consola += `Error de tipos: no se puede comparar ${izq.tipo} con ${der.tipo}\n`;
          this.errores.agregarError(`Error de tipos: no se puede comparar ${izq.tipo} con ${der.tipo}`, node.location.start.line, node.location.start.column, "Semantico");
          return { tipo: null, valor: null };
        }
      case ">":
        if (
          (izq.tipo === "int" && der.tipo === "int") ||
          (izq.tipo === "float" && der.tipo === "float") ||
          (izq.tipo === "int" && der.tipo === "float") ||
          (izq.tipo === "float" && der.tipo === "int") ||
          (izq.tipo === "char" && der.tipo === "char")
        ) {
          return { tipo: "boolean", valor: izq.valor > der.valor };
        } else {
          this.consola += `Error de tipos: no se puede comparar ${izq.tipo} con ${der.tipo}\n`;
          this.errores.agregarError(`Error de tipos: no se puede comparar ${izq.tipo} con ${der.tipo}`, node.location.start.line, node.location.start.column, "Semantico");
          return { tipo: null, valor: null };
        }
      case "<":
        if (
          (izq.tipo === "int" && der.tipo === "int") ||
          (izq.tipo === "float" && der.tipo === "float") ||
          (izq.tipo === "int" && der.tipo === "float") ||
          (izq.tipo === "float" && der.tipo === "int") ||
          (izq.tipo === "char" && der.tipo === "char")
        ) {
          return { tipo: "boolean", valor: izq.valor < der.valor };
        } else {
          this.consola += `Error de tipos: no se puede comparar ${izq.tipo} con ${der.tipo}\n`;
          this.errores.agregarError(`Error de tipos: no se puede comparar ${izq.tipo} con ${der.tipo}`, node.location.start.line, node.location.start.column, "Semantico");
          return { tipo: null, valor: null };
        }
      case ">=":
        if (
          (izq.tipo === "int" && der.tipo === "int") ||
          (izq.tipo === "float" && der.tipo === "float") ||
          (izq.tipo === "int" && der.tipo === "float") ||
          (izq.tipo === "float" && der.tipo === "int") ||
          (izq.tipo === "char" && der.tipo === "char")
        ) {
          return { tipo: "boolean", valor: izq.valor >= der.valor };
        } else {
          this.consola += `Error de tipos: no se puede comparar ${izq.tipo} con ${der.tipo}\n`;
          this.errores.agregarError(`Error de tipos: no se puede comparar ${izq.tipo} con ${der.tipo}`, node.location.start.line, node.location.start.column, "Semantico");
          return { tipo: null, valor: null };
        }
      case "<=":
        if (
          (izq.tipo === "int" && der.tipo === "int") ||
          (izq.tipo === "float" && der.tipo === "float") ||
          (izq.tipo === "int" && der.tipo === "float") ||
          (izq.tipo === "float" && der.tipo === "int") ||
          (izq.tipo === "char" && der.tipo === "char")
        ) {
          return { tipo: "boolean", valor: izq.valor <= der.valor };
        } else {
          this.consola += `Error de tipos: no se puede comparar ${izq.tipo} con ${der.tipo}\n`;
          this.errores.agregarError(`Error de tipos: no se puede comparar ${izq.tipo} con ${der.tipo}`, node.location.start.line, node.location.start.column, "Semantico");
          return { tipo: null, valor: null };
        }
      case "%":
        // El modulo solo se puede entre dos int, de cualquier otra manera sera error
        if (izq.tipo === "int" && der.tipo === "int") {
          return { tipo: "int", valor: izq.valor % der.valor };
        } else {
          this.consola += `Error de tipos: no se puede hacer modulo entre ${izq.tipo} y ${der.tipo}\n`;
          this.errores.agregarError(`Error de tipos: no se puede hacer modulo entre ${izq.tipo} y ${der.tipo}`, node.location.start.line, node.location.start.column, "Semantico");
          return { tipo: null, valor: null };
        }
      default:
        this.consola += `Error de tipos: operador ${node.op} no soportado\n`;
        this.errores.agregarError(`Error de tipos: operador ${node.op} no soportado`, node.location.start.line, node.location.start.column, "Semantico");
    }
  }

  /**
   * @type {BaseVisitor['visitOperacionUnaria']}
   */
  visitOperacionUnaria(node) {
    const exp = node.exp.accept(this);
    // verificar si la expresion es null
    if (exp.tipo === null) {
      return { tipo: null, valor: null };
    }
    switch (node.op) {
      case "-":
        // return -exp;
        // Se debe verificar si la expresion es un int o un float
        // si es un int se retorna un int
        // si es un float se retorna un float
        // cualquier otra combinacion sera un error
        if (exp.tipo === "int") {
          return { tipo: "int", valor: -exp.valor };
        } else if (exp.tipo === "float") {
          return { tipo: "float", valor: -exp.valor };
        } else {
          this.consola += `Error de tipos: no se puede hacer negativo a ${exp.tipo}\n`;
          this.errores.agregarError(`Error de tipos: no se puede hacer negativo a ${exp.tipo}`, node.location.start.line, node.location.start.column, "Semantico");
          return { tipo: null, valor: null };
        }
      case "!":
        // return !exp;
        // Se debe verificar si la expresion es un boolean
        // si es un boolean se retorna un boolean
        // cualquier otra combinacion sera un error
        if (exp.tipo === "boolean") {
          return { tipo: "boolean", valor: !exp.valor };
        } else {
          this.consola += `Error de tipos: no se puede hacer negacion a ${exp.tipo}\n`;
          this.errores.agregarError(`Error de tipos: no se puede hacer negacion a ${exp.tipo}`, node.location.start.line, node.location.start.column, "Semantico");
          return { tipo: null, valor: null };
        }
      default:
        this.consola += `Error de tipos: operador ${node.op} no soportado\n`;
        this.errores.agregarError(`Error de tipos: operador ${node.op} no soportado`, node.location.start.line, node.location.start.column, "Semantico");
    }
  }

  /**
   * @type {BaseVisitor['visitNumero']}
   */
  visitNumero(node) {
    return node.valor;
  }

  /**
   * @type {BaseVisitor['visitCadena']}
   */
  visitCadena(node) {
    return node.valor;
  }

  /**
   * @type {BaseVisitor['visitAgrupacion']}
   */
  visitAgrupacion(node) {
    return node.exp.accept(this);
  }

  /**
   * @type {BaseVisitor['visitDeclaracionVariable']}
   */
  visitDeclaracionVariable(node) {
    const tipo = node.tipo;
    const nombre = node.id;
    const valor = node.valor.accept(this);

    // Verificar que la variable no haya sido asignada previamente

    if (this.entornoActual.verificarVariableExisteEnEntornoActual(nombre)) {
      this.consola += `Error: variable ${nombre} ya declarada\n`;
      this.errores.agregarError(`Error: variable ${nombre} ya declarada`, node.location.start.line, node.location.start.column, "Semantico");
      return;
    }


    // Verificar los tipos de valor y de tipo
    // tipo es la parte de la gramática y valor.tipo sería el tipo verdadero del dato
    // en tipo es int, float, string, boolean, char
    // Conversión implícita de int a float
    if (tipo === "float" && valor.tipo === "int") {
      this.entornoActual.agregarVariable(nombre, tipo, parseFloat(valor.valor));
    } else if (tipo !== valor.tipo) {
      this.consola += `Error de tipos: no se puede asignar ${valor.tipo} a ${tipo}\n`;
      this.errores.agregarError(`Error de tipos: no se puede asignar ${valor.tipo} a ${tipo}`, node.location.start.line, node.location.start.column, "Semantico");
      // Si es un error, se asigna null a la variable para que
      // el árbol se siga recorriendo y cualquier otra operación que involucre
      // a esta variable tenga como resultado null
      this.entornoActual.agregarVariable(nombre, null, null);
    } else {
      this.entornoActual.agregarVariable(nombre, tipo, valor.valor);
    }

    this.tablaSimbolos.agregarSimbolo(node.location.start.line, node.location.start.column, nombre, tipo, valor.valor);

  }


  /**
   * @type {BaseVisitor['visitReferenciaVariable']}
   */
  visitReferenciaVariable(node) {
    const nombre = node.id;
    const nativo = this.entornoActual.obtenerValorVariable(nombre);
    // nativo es un objeto { tipo: string, valor: any }
    if (nativo.valor === null) {
      this.consola += `Error: variable ${nombre} no declarada\n`;
      this.errores.agregarError(`Error: variable ${nombre} no declarada`, node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: null, valor: null };
    }
    return nativo;
  }

  /**
   * @type {BaseVisitor['visitPrint']}
   */
  visitPrint(node) {
    const args = node.args.map((arg) => arg.accept(this));
    // cada arg es un objeto { tipo: string, valor: any }

    const cadena = args
      .map((arg) => {
        if (arg.tipo === "string") {
          return arg.valor;
        }
        // como los arrays pueden tambien imprimirse directamente
        else if (arg.tipo !== null && arg.tipo.includes("[]")) {
          return `[${arg.valor.map((item) => item.valor).join(", ")}]`;
        } else {
          return `${arg.valor}`;
        }
      })
      .join(" ");

    this.consola += cadena + "\n";
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
    const valor = node.valor;
    const tipo = node.tipo;
    return { tipo, valor };
  }

  /**
   * @type {BaseVisitor['visitDeclaracionSimple']}
   */
  visitDeclaracionSimple(node) {
    const tipo = node.tipo;
    const nombre = node.id;
    // Esta forma de declaracion no cuenta con un valor inicial y se le pone null
    // tambien puede tener como tipo el nombre de un struct
    // buscar que exista un struct con ese nombre
    if (this.entornoActual.verificarVariableExisteEnEntornoActual(nombre)) {
      this.consola += `Error: variable ${nombre} ya declarada\n`;
      this.errores.agregarError(`Error: variable ${nombre} ya declarada`, node.location.start.line, node.location.start.column, "Semantico");
      return;
    }

    this.entornoActual.agregarVariable(nombre, tipo, null);

    this.tablaSimbolos.agregarSimbolo(node.location.start.line, node.location.start.column, nombre, tipo, null);
  }

  /**
   * @type {BaseVisitor['visitDeclaracionSinTipo']}
   */
  visitDeclaracionSinTipo(node) {
    // ver si la exp es null y asignar null para seguir recorriendo el arbol
    const nombre = node.id;
    const valor = node.valor.accept(this);

    if (valor.valor === null) {
      this.entornoActual.agregarVariable(nombre, null, null);
    }
    // esto es facil en si por que el valor es decir el nativo ya trae el tipo que queremos
    this.entornoActual.agregarVariable(nombre, valor.tipo, valor.valor);

    if (node.location) {
      this.tablaSimbolos.agregarSimbolo(node.location.start.line, node.location.start.column, nombre, valor.tipo, valor.valor);
    }
  }

  /**
   * @type {BaseVisitor['visitAsignacion']}
   */
  visitAsignacion(node) {
    const nombre = node.id;
    const exp = node.exp.accept(this);

    //Hacer la verificacion de que el exp.tipo sean del mismo tipo que el de la variable

    // si exp es null asignar ese valor
    if (exp.tipo === null) {
      this.entornoActual.asignarValorVariable(nombre, null);
      return { tipo: null, valor: null };
    }
    if (this.entornoActual.verificarVariableTipo(nombre, exp.tipo)) {
      this.entornoActual.asignarValorVariable(nombre, exp.valor);
      return { tipo: exp.tipo, valor: exp.valor };
    } else {
      // asignar null
      this.consola += `Error de tipos: no se puede asignar ${exp.tipo} a ${nombre}\n`;
      this.errores.agregarError(`Error de tipos: no se puede asignar ${exp.tipo} a ${nombre}`, node.location.start.line, node.location.start.column, "Semantico");
      this.entornoActual.asignarValorVariable(nombre, null);
      return { tipo: null, valor: null };
    }
  }

  /**
   * @type {BaseVisitor['visitBloque']}
   */
  visitBloque(node) {
    const entornoAnterior = this.entornoActual;
    this.entornoActual = new Entorno(entornoAnterior);

    node.dcls.forEach((dcl) => dcl.accept(this));

    this.entornoActual = entornoAnterior;
  }

  /**
   * @type {BaseVisitor['visitIf']}
   */
  visitIf(node) {
    const condicion = node.condicion.accept(this);
    // verificar si la condicion es booleana, sino reportar el error
    if (condicion.tipo !== "boolean") {
      this.consola += `Error de tipos: la condicion debe ser booleana\n`;
      this.errores.agregarError("Error de tipos: la condicion debe ser booleana", node.location.start.line, node.location.start.column, "Semantico");
      return;
    }
    if (condicion.valor) {
      node.bloqueTrue.accept(this);
      return; // Si la sentencia es true ya no se hace nada mas y solo se evalua el bloque
    }
    if (node.bloqueFalse) {
      node.bloqueFalse.accept(this);
    }
  }

  /**
   * @type {BaseVisitor['visitTernary']}
   */
  visitTernary(node) {
    const condicion = node.condicion.accept(this);
    // verificar si la condicion es booleana, sino reportar el error
    if (condicion.tipo !== "boolean") {
      this.consola += `Error de tipos: la condicion de la operacion ternaria debe ser booleana\n`;
      this.errores.agregarError("Error de tipos: la condicion de la operacion ternaria debe ser booleana", node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: null, valor: null };
    }
    if (condicion.valor) {
      // si la expresion es verdadera se interpretara y se retornara el expTrue
      let expTrue = node.expTrue.accept(this);
      return { tipo: expTrue.tipo, valor: expTrue.valor };
    } else {
      // si la expresion es falsa se interpretara y se retornara el expFalse
      let expFalse = node.expFalse.accept(this);
      return { tipo: expFalse.tipo, valor: expFalse.valor };
    }
  }

  /**
   * @type {BaseVisitor['visitWhile']}
   */
  visitWhile(node) {
    const EntornoActual = this.entornoActual;

    try {
      // Mientras la condicion sea verdadera se ejecuta el bloque
      while (node.condicion.accept(this).valor) {
        node.bloque.accept(this);
      }
    } catch (error) {
      this.entornoActual = EntornoActual;

      if (error instanceof BreakException) {
        return;
      } else if (error instanceof ContinueException) {
        return this.visitWhile(node);
      }

      throw error;
    }
  }

  /**
   * @type {BaseVisitor['visitFor']}
   */
  visitFor(node) {
    const AnteriorIncrement = this.continuePrevio;
    this.continuePrevio = node.incremento;
    // La idea aca es basicamente hacer un nodo while traduciendo el for a su estructura
    /*
          Por ejemplo:
          for (var i=0; i<10; i=i+1) print i;
              Se traduce a:
              {
                  var i = 0;
                  while(i<10){
                      print i;
                      i= i + 1;
                  }
              }
          */
    const funcFor = new nodos.Bloque({
      dcls: [
        node.inicial,
        new nodos.While({
          condicion: node.condicion,
          bloque: new nodos.Bloque({
            dcls: [node.bloque, node.incremento],
          }),
        }),
      ],
    });
    funcFor.accept(this);
    this.continuePrevio = AnteriorIncrement;
  }

  /**
   * @type {BaseVisitor['visitBreak']}
   */
  visitBreak(node) {
    throw new BreakException();
  }

  /**
   * @type {BaseVisitor['visitSwitch']}
   */
  visitSwitch(node) {
    const switchValue = node.exp.accept(this);

    if (switchValue.tipo === null) {
      this.consola += `Error: expression en switch no puede ser null\n`;
      this.errores.agregarError("Error: expression en switch no puede ser null", node.location.start.line, node.location.start.column, "Semantico");
      return;
    }

    let matched = false;
    let executeNext = false;

    for (const caseNode of node.cases) {
      if (!matched && !executeNext) {
        const caseValue = caseNode.valor.accept(this);

        if (caseValue.tipo === null) {
          this.consola += `Error: Invalid case expression\n`;
          this.errores.agregarError("Error: Invalid case expression", node.location.start.line, node.location.start.column, "Semantico");
          continue;
        }

        if (switchValue.valor === caseValue.valor) {
          matched = true;
          executeNext = true;
        }
      }

      if (executeNext) {
        for (const stmt of caseNode.stmts) {
          try {
            stmt.accept(this);
          } catch (e) {
            if (e instanceof BreakException) {
              return;
            }
            throw e;
          }
        }
        // If there's no break, continue to the next case
        if (caseNode.stmts.some((stmt) => stmt instanceof nodos.Break)) {
          return;
        }
      }
    }

    // Handle default case if no break was encountered
    if (executeNext && node.def) {
      for (const stmt of node.def.stmts) {
        try {
          stmt.accept(this);
        } catch (e) {
          if (e instanceof BreakException) {
            return;
          }
          throw e;
        }
      }
    }
  }

  /**
   * @type {BaseVisitor['visitContinue']}
   */
  visitContinue(node) {
    if (this.continuePrevio) {
      this.continuePrevio.accept(this);
    }

    throw new ContinueException();
  }

  /**
   * @type {BaseVisitor['visitReturn']}
   */
  visitReturn(node) {
    let valor = null;
    if (node.exp) {
      valor = node.exp.accept(this);
    }
    throw new ReturnException(valor);
  }

  /**
   * @type {BaseVisitor['visitLlamada']}
   */
  // System.out.println(time());

  /*

    System.out.println(typeof(12)); // "int"
    System.out.println(typeof(12.3)); // "float"
    System.out.println(typeof("asdf")); // "string"
    System.out.println(typeof('A')); // "char"
    System.out.println(typeof(true)); // "boolean"
    */

  visitLlamada(node) {
    const funcionObj = node.callee.accept(this);
    const argumentos = node.args.map((arg) => arg.accept(this));

    if (!funcionObj.tipo instanceof LlamadaFunc) {
      this.consola += `Error: '${node.callee}' no es una función\n`;
      this.errores.agregarError(`Error: '${node.callee}' no es una función`, node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: null, valor: null };
    }
    return funcionObj.tipo.invocar(this, argumentos);
  }

  /**
   * @type {BaseVisitor['visitArray']}
   */
  visitArray(node) {
    const nombre = node.id;
    const tipo = node.tipo;
    const valores = node.elementos.map((valor) => valor.accept(this));

    if (valores.some((valor) => valor.tipo !== tipo)) {
      this.consola += `Error de tipos: no todos los elementos del array son de tipo ${tipo}\n`;
      this.errores.agregarError(`Error de tipos: no todos los elementos del array son de tipo ${tipo}`, node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: null, valor: null };
    }
    if (this.entornoActual.verificarVariableExisteEnEntornoActual(nombre)) {
      this.consola += `Error: variable ${nombre} ya declarada\n`;
      this.errores.agregarError(`Error: variable ${nombre} ya declarada`, node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: null, valor: null };
    }
    const arrayTipo = `${tipo}[]`; // Representación del tipo de array
    const arrayValor = valores.map((v) => ({ tipo: v.tipo, valor: v.valor }));

    this.entornoActual.agregarVariable(nombre, arrayTipo, arrayValor);

    this.tablaSimbolos.agregarSimbolo(node.location.start.line, node.location.start.column, nombre, arrayTipo, arrayValor);
  }

  /**
   * @type {BaseVisitor['visitArraySimple']}
   */
  visitArraySimple(node) {
    const nombre = node.id;
    const tipo1 = node.tipo1;
    const tipo2 = node.tipo2;
    const size = node.size;

    if (size.tipo !== "int") {
      this.consola += `Error de tipos: el tamaño del array debe ser un entero\n`;
      this.errores.agregarError(`Error de tipos: el tamaño del array debe ser un entero`, node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: null, valor: null };
    }

    // Primero verificar que tipo 1 sea igual a tipo 2
    if (tipo1 !== tipo2) {
      this.consola += `Error de tipos: el tipo 1 y tipo 2 deben ser iguales\n`;
      this.errores.agregarError("Error de tipos: el tipo 1 y tipo 2 deben ser iguales", node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: null, valor: null };
    }

    if (this.entornoActual.verificarVariableExiste(nombre)) {
      this.consola += `Error: variable ${nombre} ya declarada\n`;
      this.errores.agregarError(`Error: variable ${nombre} ya declarada`, node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: null, valor: null };
    }

    // Asignar los valores por defecto segun el tipo de array y el size
    // int - 0
    // float - 0.0
    // string - ""
    // boolean - false
    // char \u0000 (null)
    // struct - null // Segun esto se puede hacer un array de structs :O

    let valores = [];

    for (let i = 0; i < size.valor; i++) {
      if (tipo1 === "int") {
        valores.push({ tipo: tipo1, valor: 0 });
      } else if (tipo1 === "float") {
        valores.push({ tipo: tipo1, valor: 0.0 });
      } else if (tipo1 === "string") {
        valores.push({ tipo: tipo1, valor: "" });
      } else if (tipo1 === "boolean") {
        valores.push({ tipo: tipo1, valor: false });
      } else if (tipo1 === "char") {
        valores.push({ tipo: tipo1, valor: "\u0000" });
      } else if (tipo1 === "struct") {
        valores.push({ tipo: tipo1, valor: null });
      }
    }
    const arrayTipo = `${tipo1}[]`; // Representación del tipo de array
    const arrayValor = valores;
    this.entornoActual.agregarVariable(nombre, arrayTipo, arrayValor);

    this.tablaSimbolos.agregarSimbolo(node.location.start.line, node.location.start.column, nombre, arrayTipo, arrayValor);
  }

  /**
   * @type {BaseVisitor['visitArrayCopia']}
   */
  visitArrayCopia(node) {
    const nombre = node.id;
    const tipo = node.tipo;
    const otroArray = node.id2;

    // buscar otroArray en la tabla de simbolos y asignarlo a un nuevo valor con el nombre
    // primero verificar si el otroArray existe

    if (!this.entornoActual.verificarVariableExiste(otroArray)) {
      this.consola += `Error: variable '${otroArray}' no declarada\n`;
      this.errores.agregarError(`Error: variable '${otroArray}' no declarada`, node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: null, valor: null };
    }

    // Verificar los tipos de ambos arrays, cuando es array es el mismo tipo pero con [] al final

    let array = this.entornoActual.obtenerValorVariable(otroArray);

    if (
      this.entornoActual.variables[otroArray].tipo.endsWith("[]") &&
      this.entornoActual.variables[otroArray].tipo.slice(0, -2) === tipo
    ) {
      const copiedArray = array.valor.map((item) => ({ ...item }));
      this.entornoActual.agregarVariable(nombre, tipo + "[]", copiedArray);
      this.tablaSimbolos.agregarSimbolo(node.location.start.line, node.location.start.column, nombre, tipo + "[]", copiedArray);
    }

    // Si no se cumple la condicion anterior se reporta un error
    else {
      this.consola += `Error de tipos: los tipos de los arrays deben ser iguales\n`;
      this.errores.agregarError(`Error de tipos: los tipos de los arrays deben ser iguales`, node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: null, valor: null };
    }



  }

  /**
   * @type {BaseVisitor['visitAccesoVector']}
   */
  visitAccesoVector(node) {
    const nombre = node.id;
    const indice = node.index.accept(this);

    // Buscar la variable en la tabla de simbolos y verificar que sea un array
    if (!this.entornoActual.verificarVariableExiste(nombre)) {
      this.consola += `Error: variable '${nombre}' no declarada\n`;
      this.errores.agregarError(`Error: variable '${nombre}' no declarada`, node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: null, valor: null };
    }

    const variable = this.entornoActual.obtenerValorVariable(nombre);

    if (!variable.tipo.endsWith("[]")) {
      this.consola += `Error: '${nombre}' no es un array\n`;
      this.errores.agregarError(`Error: '${nombre}' no es un array`, node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: null, valor: null };
    }

    if (indice.tipo !== "int") {
      this.consola += `Error de tipos: el índice debe ser un entero\n`;
      this.errores.agregarError(`Error de tipos: el índice debe ser un entero`, node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: null, valor: null };
    }

    if (indice.valor < 0 || indice.valor >= variable.valor.length) {
      this.consola += `Error: índice fuera de rango\n`;
      this.errores.agregarError("Error: índice fuera de rango", node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: null, valor: null };
    }

    return variable.valor[indice.valor];
  }

  /**
   * @type {BaseVisitor['visitAsignacionArray']}
   */
  visitAsignacionArray(node) {
    const nombre = node.id;
    const indice = node.index.accept(this);
    const expresion = node.exp.accept(this);

    if (!this.entornoActual.verificarVariableExiste(nombre)) {
      this.consola += `Error: variable '${nombre}' no declarada\n`;
      this.errores.agregarError(`Error: variable '${nombre}' no declarada`, node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: null, valor: null };
    }

    const variable = this.entornoActual.obtenerValorVariable(nombre);

    if (!variable.tipo.endsWith("[]")) {
      this.consola += `Error: '${nombre}' no es un array\n`;
      this.errores.agregarError(`Error: '${nombre}' no es un array`, node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: null, valor: null };
    }

    if (indice.tipo !== "int") {
      this.consola += `Error de tipos: el índice debe ser un entero\n`;
      this.errores.agregarError(`Error de tipos: el índice debe ser un entero`, node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: null, valor: null };
    }

    if (indice.valor < 0 || indice.valor >= variable.valor.length) {
      this.consola += `Error: índice fuera de rango\n`;
      this.errores.agregarError("Error: índice fuera de rango", node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: null, valor: null };
    }

    const tipoArray = variable.tipo.slice(0, -2); // Tipo del array sin los []

    if (expresion.tipo !== tipoArray) {
      // Permitir conversión implícita de int a float
      if (tipoArray === "float" && expresion.tipo === "int") {
        expresion.valor = parseFloat(expresion.valor);
        expresion.tipo = "float";
      } else {
        this.consola += `Error de tipos: no se puede asignar ${expresion.tipo} a un array de ${tipoArray}\n`;
        this.errores.agregarError(`Error de tipos: no se puede asignar ${expresion.tipo} a un array de ${tipoArray}`, node.location.start.line, node.location.start.column, "Semantico");
        return { tipo: null, valor: null };
      }
    }

    variable.valor[indice.valor] = {
      tipo: expresion.tipo,
      valor: expresion.valor,
    };

    return { tipo: expresion.tipo, valor: expresion.valor };
  }

  /**
   * @type {BaseVisitor['visitForeach']}
   */

  visitForeach(node) {
    // La idea aca es basicamente hacer un nodo while traduciendo el for a su estructura
    /*
          Por ejemplo:
          for (var i=0; i<10; i=i+1) print i;
              Se traduce a:
              {
                  var i = 0;
                  while(i<10){
                      print i;
                      i= i + 1;
                  }
              }
          */
    // Pero aplicado a un foreach que en js seria traducirlo a algo asi
    /*
          for ( int numero : arreglo ) {
              Sentencias
          }
              Se traduce a:
              {
                  var indice = 0;
                  while(indice < arreglo.length){
                      var numero = arreglo[indice];
                      Sentencias
                      indice = indice + 1;
                  }
              }
          */

    // crearNodo('foreach', { tipo, id, exp, bloque:stmt }) }

    const arrayExp = node.exp.accept(this);
    if (!arrayExp.tipo.endsWith("[]")) {
      this.consola += `Error: La expresión en el foreach debe ser un array\n`;
      this.errores.agregarError("Error: La expresión en el foreach debe ser un array", node.location.start.line, node.location.start.column, "Semantico");
      return;
    }

    const arrayTipo = arrayExp.tipo.slice(0, -2); // Remove '[]'
    if (arrayTipo !== node.tipo) {
      this.consola += `Error: El tipo del elemento (${node.tipo}) no coincide con el tipo del array (${arrayTipo})\n`;
      this.errores.agregarError(`Error: El tipo del elemento (${node.tipo}) no coincide con el tipo del array (${arrayTipo})`, node.location.start.line, node.location.start.column, "Semantico");
      return;
    }

    const indexVar = "_index_" + node.id;

    const funcForeach = new nodos.Bloque({
      dcls: [
        new nodos.DeclaracionSinTipo({
          id: indexVar,
          valor: new nodos.Nativo({ tipo: "int", valor: 0 }),
        }),
        new nodos.While({
          condicion: new nodos.OperacionBinaria({
            izq: new nodos.ReferenciaVariable({ id: indexVar }),
            op: "<",
            der: new nodos.Llamada({
              callee: new nodos.ReferenciaVariable({
                id: "obtenerLongitudArray",
              }),
              args: [new nodos.ReferenciaVariable({ id: node.exp.id })],
            }),
          }),
          bloque: new nodos.Bloque({
            dcls: [
              new nodos.DeclaracionSinTipo({
                id: node.id,
                valor: new nodos.AccesoVector({
                  id: node.exp.id,
                  index: new nodos.ReferenciaVariable({ id: indexVar }),
                }),
              }),
              node.bloque,
              new nodos.Asignacion({
                id: indexVar,
                exp: new nodos.OperacionBinaria({
                  izq: new nodos.ReferenciaVariable({ id: indexVar }),
                  op: "+",
                  der: new nodos.Nativo({ tipo: "int", valor: 1 }),
                }),
              }),
            ],
          }),
        }),
      ],
    });

    funcForeach.accept(this);
  }

  /**
   * @type {BaseVisitor['visitIndexOf']}
   */
  visitIndexOf(node) {
    const id = node.id;
    const exp = node.exp.accept(this);

    // Buscar la variable en la tabla de simbolos y verificar que sea un array
    // Luego buscar el indice del elemento en el array, si no existe retornar -1

    if (!this.entornoActual.verificarVariableExiste(id)) {
      this.consola += `Error: variable '${id}' no declarada\n`;
      this.errores.agregarError(`Error: variable '${id}' no declarada`, node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: "int", valor: -1 };
    }

    const variable = this.entornoActual.obtenerValorVariable(id);

    if (!variable.tipo.endsWith("[]")) {
      this.consola += `Error: '${id}' no es un array\n`;
      this.errores.agregarError(`Error: '${id}' no es un array`, node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: "int", valor: -1 };
    }

    if (exp.tipo !== variable.tipo.slice(0, -2)) {
      this.consola += `Error de tipos: el tipo de la expresión debe coincidir con el tipo del array\n`;
      this.errores.agregarError(`Error de tipos: el tipo de la expresión debe coincidir con el tipo del array`, node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: "int", valor: -1 };
    }

    // Buscar el indice de la variable en el array

    for (let i = 0; i < variable.valor.length; i++) {
      if (
        variable.valor[i].tipo === exp.tipo &&
        variable.valor[i].valor === exp.valor
      ) {
        return { tipo: "int", valor: i };
      }
    }

    return { tipo: "int", valor: -1 };
  }

  /**
   * @type {BaseVisitor['visitLength']}
   */
  visitLength(node) {
    const id = node.id;

    if (!this.entornoActual.verificarVariableExiste(id)) {
      this.consola += `Error: variable '${id}' no declarada\n`;
      this.errores.agregarError(`Error: variable '${id}' no declarada`, node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: "int", valor: -1 };
    }

    const variable = this.entornoActual.obtenerValorVariable(id);

    if (!variable.tipo.endsWith("[]")) {
      this.consola += `Error: '${id}' no es un array\n`;
      this.errores.agregarError(`Error: '${id}' no es un array`, node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: "int", valor: -1 };
    }

    return { tipo: "int", valor: variable.valor.length };
  }

  /**
   * @type {BaseVisitor['visitJoin']}
   */
  visitJoin(node) {
    const id = node.id;

    if (!this.entornoActual.verificarVariableExiste(id)) {
      this.consola += `Error: variable '${id}' no declarada\n`;
      this.errores.agregarError(`Error: variable '${id}' no declarada`, node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: "string", valor: "" };
    }

    const variable = this.entornoActual.obtenerValorVariable(id);

    if (!variable.tipo.endsWith("[]")) {
      this.consola += `Error: '${id}' no es un array\n`;
      this.errores.agregarError(`Error: '${id}' no es un array`, node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: null, valor: null };
    }

    let resultado = ""; // Construirlo con cada valor separado por comas

    for (let i = 0; i < variable.valor.length; i++) {
      // Para evitar agregarle coma al último elemento
      if (i < variable.valor.length - 1) {
        resultado += variable.valor[i].valor + ", ";
      } else {
        resultado += variable.valor[i].valor;
      }
    }
    return { tipo: "string", valor: resultado };
  }



  /**
   * @type {BaseVisitor['visitFuncion']}
   */
  visitFuncion(node) {
    const funcion = new funcionesForaneas(node, this.entornoActual);
    this.entornoActual.agregarVariable(node.id, funcion);

    this.tablaSimbolos.agregarSimbolo(node.location.start.line, node.location.start.column, node.id, "funcion", "Valores de la funcion");
  }

  /**
   * @type {BaseVisitor['visitTypeof']}
   */
  visitTypeof(node) {
    const exp = node.exp.accept(this);
    if (exp.tipo === null) {
      return { tipo: null, valor: null };
    }
    return { tipo: "string", valor: exp.tipo };
  }

  /**
   * @type {BaseVisitor['visitMatrix']}
   */
  visitMatrix(node) {
    const tipo = node.tipo;
    const id = node.id;
    const dimensiones = node.dimensiones + 1; // +1 para incluir la dimensión del vector
    const valores = node.valores;

    // se tiene que hacer el accept(this) dentro de cada elemento del arreglo, para que se pueda obtener el tipo y el valor y asi hacer el arreglo ya interpretado
    // con un for each para interpretar cada elemento de cada arreglo de cada dimension que se tenga

    const interpretarArray = (arr) => {
      return arr.map((elem) => {
        if (Array.isArray(elem)) {
          return interpretarArray(elem);
        } else {
          return elem.accept(this);
        }
      });
    };

    // validar el tipo de cada elemento con el tipo del array
    // luego verificar la cantidad de dimensiones sea apropiada

    

    const valoresInterpretados = interpretarArray(valores);

    this.entornoActual.agregarVariable(
      id,
      `${tipo}${'[]'.repeat(dimensiones)}`,
      valoresInterpretados
    );

    this.tablaSimbolos.agregarSimbolo(node.location.start.line, node.location.start.column, id, `${tipo}${'[]'.repeat(dimensiones)}`, valoresInterpretados);

  }

  /**
   * @type {BaseVisitor['visitMatrixSimple']}
   */
  visitMatrixSimple(node) {
    const tipo = node.tipo;
    const dimensiones = node.dimensiones + 1; // +1 para incluir la dimensión del vector
    const id = node.id;
    const tipo2 = node.tipo2; // el segundo tipo despues de la declaracion, int[][] id = new int[2][2];
    const size1 = node.tamaño1.accept(this);
    const sizes = node.tamaños.map((size) => size.accept(this));

    if (size1.tipo !== "int" || sizes.some((size) => size.tipo !== "int")) {
      this.consola += `Error: Todos los tamaños de la matriz deben ser enteros\n`;
      this.errores.agregarError("Error: Todos los tamaños de la matriz deben ser enteros", node.location.start.line, node.location.start.column, "Semantico");
      return;
    }

    if (tipo !== tipo2) {
      this.consola += `Error: El tipo ${tipo} y ${tipo2} deben ser iguales\n`;
      this.errores.agregarError(`Error: El tipo ${tipo} y ${tipo2} deben ser iguales`, node.location.start.line, node.location.start.column, "Semantico");
      return;
    }

    const crearMatriz = (dims, index = 0) => {
      if (index === dims.length) {
        // Valor por defecto según el tipo
        switch (tipo) {
          case "int":
            return { tipo, valor: 0 };
          case "float":
            return { tipo, valor: 0.0 };
          case "string":
            return { tipo, valor: "" };
          case "boolean":
            return { tipo, valor: false };
          case "char":
            return { tipo, valor: "\u0000" };
          default:
            return { tipo, valor: null };
        }
      }
      return Array(dims[index].valor)
        .fill()
        .map(() => crearMatriz(dims, index + 1));
    };

    const matriz = crearMatriz([size1, ...sizes]);

    this.entornoActual.agregarVariable(
      id,
      `${tipo}${'[]'.repeat(dimensiones)}`,
      matriz
    );

    this.tablaSimbolos.agregarSimbolo(node.location.start.line, node.location.start.column, id, `${tipo}${'[]'.repeat(dimensiones)}`, matriz);

  }

  /**
   * @type {BaseVisitor['visitAsignacionMatrix']}
   */
  visitAsignacionMatrix(node) {
    const id = node.id;
    const index1 = node.index.accept(this);
    const indices = node.indexA.map((index) => index.accept(this));
    const exp = node.exp.accept(this);
  
    if (!this.entornoActual.verificarVariableExiste(id)) {
      this.consola += `Error: variable '${id}' no declarada\n`;
      this.errores.agregarError(`Error: variable '${id}' no declarada`, node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: null, valor: null };
    }
  
    const variable = this.entornoActual.obtenerValorVariable(id);
  
    if (!variable.tipo.endsWith("[]")) {
      this.consola += `Error: '${id}' no es una matriz\n`;
      this.errores.agregarError(`Error: '${id}' no es una matriz`, node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: null, valor: null };
    }
  
    const dimensiones = variable.tipo.split("[]").length - 1;
    if (dimensiones !== indices.length + 1) {
      this.consola += `Error: número incorrecto de índices para la matriz '${id}'\n`;
      this.errores.agregarError(`Error: número incorrecto de índices para la matriz '${id}'`, node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: null, valor: null };
    }
  
    let current = variable.valor;
    const allIndices = [index1, ...indices];
  
    for (let i = 0; i < allIndices.length - 1; i++) {
      if (allIndices[i].tipo !== "int") {
        this.consola += `Error: el índice debe ser un entero\n`;
        this.errores.agregarError("Error: el índice debe ser un entero", node.location.start.line, node.location.start.column, "Semantico");
        return { tipo: null, valor: null };
      }
      if (allIndices[i].valor < 0 || allIndices[i].valor >= current.length) {
        this.consola += `Error: índice fuera de rango\n`;
        this.errores.agregarError("Error: índice fuera de rango", node.location.start.line, node.location.start.column, "Semantico");
        return { tipo: null, valor: null };
      }
      current = current[allIndices[i].valor];
    }
  
    const lastIndex = allIndices[allIndices.length - 1];
    if (lastIndex.tipo !== "int") {
      this.consola += `Error: el índice debe ser un entero\n`;
      this.errores.agregarError("Error: el índice debe ser un entero", node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: null, valor: null };
    }
    if (lastIndex.valor < 0 || lastIndex.valor >= current.length) {
      this.consola += `Error: índice fuera de rango\n`;
      this.errores.agregarError("Error: índice fuera de rango", node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: null, valor: null };
    }
    

  
    current[lastIndex.valor] = { tipo: exp.tipo, valor: exp.valor }; // Se sobreescribe el valor en la posición correspondiente

    this.entornoActual.asignarValorVariable(id, variable.valor);


    return { tipo: exp.tipo, valor: exp.valor }; // se retorna por que la asignacion retorna algo xd 
  }

  /**
   * @type {BaseVisitor['visitAccesoMatrix']}
   */
  visitAccesoMatrix(node) {
    const id = node.id;
    const index1 = node.index.accept(this);
    const indices = node.indices.map((index) => index.accept(this));
  
    if (!this.entornoActual.verificarVariableExiste(id)) {
      this.consola += `Error: variable '${id}' no declarada\n`;
      this.errores.agregarError(`Error: variable '${id}' no declarada`, node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: null, valor: null };
    }
  
    const variable = this.entornoActual.obtenerValorVariable(id);
  
    if (!variable.tipo.endsWith("[]")) {
      this.consola += `Error: '${id}' no es una matriz\n`;
      this.errores.agregarError(`Error: '${id}' no es una matriz`, node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: null, valor: null };
    }
  
    const dimensiones = variable.tipo.split("[]").length - 1;
    if (dimensiones !== indices.length + 1) {
      this.consola += `Error: número incorrecto de índices para la matriz '${id}'\n`;
      this.errores.agregarError(`Error: número incorrecto de índices para la matriz '${id}'`, node.location.start.line, node.location.start.column, "Semantico");
      return { tipo: null, valor: null };
    }
  
    let current = variable.valor;
    const allIndices = [index1, ...indices];
  
    for (let i = 0; i < allIndices.length; i++) {
      if (allIndices[i].tipo !== "int") {
        this.consola += `Error: el índice debe ser un entero\n`;
        this.errores.agregarError(`Error: el índice debe ser un entero`, node.location.start.line, node.location.start.column, "Semantico");
        return { tipo: null, valor: null };
      }
      if (allIndices[i].valor < 0 || allIndices[i].valor >= current.length) {
        this.consola += `Error: índice fuera de rango\n`;
        this.errores.agregarError(`Error: índice fuera de rango`, node.location.start.line, node.location.start.column, "Semantico");
        return { tipo: null, valor: null };
      }
      current = current[allIndices[i].valor];
    }
  
    return current; // This will be the element at the given position
  }

  /**
   * @type {BaseVisitor['visitStruct']}
   */
  visitStruct(node) {
    const id = node.id;
    const declaraciones = node.dcls;
   
/*
● Los structs solo pueden ser declarados en el ámbito global
● Los structs deben tener al menos un atributo.
● No se podrán agregar más atributos a un struct una vez ha sido definido.
*/

    const propiedades = {};

    declaraciones.forEach((declaracion) => {
      if (declaracion.valor !== undefined) {
        propiedades[declaracion.id] = { tipo: declaracion.tipo, valor: declaracion.valor };
      } else {
        propiedades[declaracion.id] = { tipo: declaracion.tipo, valor: null };
      }
    });

    // declaraciones es un objeto con un par de id y tipo
    console.log(propiedades);

    if (!this.entornoActual.esEntornoGlobal()) {
      this.consola += `Error: Los structs solo pueden ser declarados en el ámbito global\n`;
      this.errores.agregarError(`Error: Los structs solo pueden ser declarados en el ámbito global`, node.location.start.line, node.location.start.column, "Semantico");
      return;
    }

    if (declaraciones.length === 0) {
      this.consola += `Error: Los structs deben tener al menos un atributo\n`;
      this.errores.agregarError(`Error: Los structs deben tener al menos un atributo`, node.location.start.line, node.location.start.column, "Semantico");
      return;
    }

    if (this.entornoActual.verificarVariableExiste(id)) {
      this.consola += `Error: El struct '${id}' ya ha sido definido\n`;
      this.errores.agregarError(`Error: El struct '${id}' ya ha sido definido`, node.location.start.line, node.location.start.column, "Semantico");
      return;
    }

    const struct = new Struct(id, propiedades);

    let nombreTipo = `Struct: ${id}`;

    this.entornoActual.agregarVariable(id, nombreTipo, struct);

    this.tablaSimbolos.agregarSimbolo(node.location.start.line, node.location.start.column, id, nombreTipo, propiedades);

  }



  /**
   * @type {BaseVisitor['visitStructVar']}
   */
  visitStructVar(node) {
    const tipo = node.tipo; // Tipo de la variable, tiene que existir un struct de este tipo sino es error
    const id = node.id; // Nombre de la variable
    const valor = node.valor.accept(this); // Valor de la variable
    // Verificar que la variable no haya sido asignada previamente
    if (this.entornoActual.verificarVariableExisteEnEntornoActual(id)) {
      this.consola += `Error: variable ${id} ya declarada\n`;
      return;
    }
    // Verificar si existe un struct con ese nombre en la tabla de simbolos
    if (!this.entornoActual.verificarVariableExiste(tipo)) {
      this.consola += `Error: struct ${tipo} no declarado\n`;
      return;
    }
    // valor seria como el retorno de la instancia del struct osea un objeto con el tipo y valor pero donde valor es 
    // el struct en si

    this.entornoActual.agregarVariable(id, tipo, valor);

    this.tablaSimbolos.agregarSimbolo(node.location.start.line, node.location.start.column, id, tipo, valor);


  }

  visitStructVarSimple(node) {
    const tipo = node.tipo; // Tipo de la variable, tiene que existir un struct de este tipo sino es error
    const id = node.id; // Nombre de la variable
    //Como esta forma de asignacion no tiene nada se le asigna null y ya
    if (this.entornoActual.verificarVariableExisteEnEntornoActual(id)) {
      this.consola += `Error: variable ${id} ya declarada\n`;
      return;
    }
    // Verificar si existe un struct con ese nombre en la tabla de simbolos
    if (!this.entornoActual.verificarVariableExiste(tipo)) {
      this.consola += `Error: struct ${tipo} no declarado\n`;
      return;
    }
    this.entornoActual.agregarVariable(id, tipo, null);

    this.tablaSimbolos.agregarSimbolo(node.location.start.line, node.location.start.column, id, tipo, null);
  }


  /**
   * @type {BaseVisitor['visitInstancia']}
   */
  visitInstancia(node) {
    const id = node.id;
    const argumentos = node.args.map((arg) => arg.accept(this));

    const struct = this.entornoActual.obtenerValorVariable(id);
    // Aca basicamente se tratara de retornar la dupla de siempre de tipo y valor
    const instancia = struct.valor.invocar(this, argumentos);
    console.log(instancia);
    return { tipo: id, valor: instancia };
  }

  /**
   * @type {BaseVisitor['visitGet']}
   */
  visitGet(node) {
    const instancia = node.Objetivo.accept(this);

    return instancia.valor.getPropiedad(node.Propiedad);
  }

    /**
   * @type {BaseVisitor['visitSet']}
   */
    visitSet(node) {
      const instancia = node.Objetivo.accept(this);
      const valor = node.Valor.accept(this);
    
      if (instancia.valor && instancia.valor.propiedades) {
        const propiedad = instancia.valor.propiedades[node.Propiedad];
        if (propiedad) {
          if (propiedad.tipo === valor.tipo) {
            instancia.valor.setPropiedad(node.Propiedad, propiedad.tipo, valor.valor);
            return valor;
          } else {
            this.consola += `Error: Tipo incompatible al asignar a '${node.Propiedad}'\n`;
            return { tipo: null, valor: null };
          }
        } else {
          this.consola += `Error: La propiedad '${node.Propiedad}' no existe en el struct\n`;
          return { tipo: null, valor: null };
        }
      } else {
        this.consola += `Error: El objetivo no es una instancia de struct válida\n`;
        return { tipo: null, valor: null };
      }
    }



}
