
{
  const crearNodo = (tipoNodo, props) =>{
    const tipos = {
      'numero': nodos.Numero,
      'agrupacion': nodos.Agrupacion,
      'binaria': nodos.OperacionBinaria,
      'unaria': nodos.OperacionUnaria,
      'declaracionVar': nodos.DeclaracionVariable,
      'accesoVar': nodos.ReferenciaVariable,
      'print': nodos.Print,
      'statement': nodos.Statement,
      'Cadena': nodos.Cadena,
      'nativo': nodos.Nativo,
      'simpleDcl': nodos.DeclaracionSimple,
      'typeLessDcl': nodos.DeclaracionSinTipo,
      'asignacion': nodos.Asignacion,
      'bloque': nodos.Bloque,
      'if': nodos.If,
      'ternario': nodos.Ternary,
      'while': nodos.While,
      'for': nodos.For,
      'switch': nodos.Switch,
      'break': nodos.Break,
      'continue': nodos.Continue,
      'return': nodos.Return,
      'llamada': nodos.Llamada,
      'array': nodos.Array,
      'arraySimple': nodos.ArraySimple,
      'arrayCopia': nodos.ArrayCopia,
      'accesoVector': nodos.AccesoVector,
      'asignacionArray': nodos.AsignacionArray,
      'foreach': nodos.Foreach,
      'indexof': nodos.IndexOf,
      'length': nodos.Length,
      'join': nodos.Join,
      'funcion': nodos.Funcion,
      'typeof': nodos.Typeof,
      'matrix': nodos.Matrix,
      'matrixSimple': nodos.MatrixSimple,
      'asignacionMatrix': nodos.AsignacionMatrix,
      'accesoMatrix': nodos.AccesoMatrix,
      'struct': nodos.Struct,
      'structVar': nodos.StructVar,
      'structVarSimple': nodos.StructVarSimple,
      'instancia': nodos.Instancia
    }

    const nodo = new tipos[tipoNodo](props);
    nodo.location = location();
    return nodo;
  }
}

//Precedencia de las Operaciones
// De mayor a menor

// () o []
// ! o - (Unaria)
// / % *
// + -
// <  <=  >= > 
// == !=
// && 
// ||

// Para crear la gramatica se tiene que iniciar en la produccion con mayor precedencia

// Ya que es a la que puede llegar directo pasando de uno en uno estas otras producciones

// Oficialmente sale sin structs :(

Codigo = _ dcl:Declaracion* _ { return dcl }

Declaracion = dcl:Variable _ { return dcl }
            / matrix:Matrix _ { return matrix }
            / array:Array _ { return array }
            / func:FuncDcl _ { return func }
            / stmt:Statement _ { return stmt }
            / struct:Struct _ { return struct }
            / varStruct:StructVar _ { return varStruct }

StructVar = _ tipo:Identificador _ id:Identificador _ "=" _ exp:Expresion _ ";" { return crearNodo('structVar', { tipo, id, valor:exp }) }
        / _ tipo:Identificador _ id:Identificador _ ";" { return crearNodo('structVarSimple', { tipo, id }) }



// Problema: cuando se crea un struct se le pude poner otra propiedad que sea otro struct :(

/*
struct Mascota {
  string nombre;
  int edad;
}

struct Persona {
  string nombre;
  int edad;
  Mascota mascota;
}

*/

Struct = "struct" _ id:Identificador _ "{" _ dcls:Declaracion* _ "}"  ";"  { return crearNodo('struct', { id, dcls }) }


// la matriz solo se accedera cuando tenga dos [][] y puede tener hasta n cantidad de dimensiones
// La matriz tambien puede ser declarada de esta manera
// int[][][] matriz = new int[2][2][2];

Matrix = tipo:("int" / "float" / "string" / "boolean" / "char") _ "[" _ "]" _ dimensiones:( _ "[" _ "]" _ )+ _ id:Identificador _ "=" _ "{" _ valores:ListaMatrix _ "}" _ ";"  { return crearNodo('matrix', { tipo, id, valores, dimensiones: dimensiones.length }) }
       / tipo:("int" / "float" / "string" / "boolean" / "char") _ "[" _ "]" _ dimensiones:( _ "[" _ "]" _ )+ _ id:Identificador _ "=" _ "new" _ tipo2:("int" / "float" / "string" / "boolean" / "char") _ "[" _ tam:Expresion _ "]" _ tamaños:( _ "[" _ tam2:Expresion _ "]" _ { return tam2 })* _ ";" { return crearNodo('matrixSimple', { tipo, dimensiones: dimensiones.length, id, tipo2, tamaño1: tam, tamaños }) }



// las matrices tienen la siguiente estructura cuando se declaran
// int[][] mtx1= { {1, 2, 3}, {4, 5, 6}, {7, 8, 9} };, por lo que cada valor de la matriz es un array y a su vez un array puede contener otra lista de arrays dentro
// int[][][] mtx2 = { { {1, 2, 3}, {4, 5, 6}, {7, 8, 9} }, { {1, 2, 3}, {4, 5, 6}, {7, 8, 9} } }; o tambien
// int[][][][] mtx3 = { { { {1, 2, 3}, {4, 5, 6}, {7, 8, 9} }, { {1, 2, 3}, {4, 5, 6}, {7, 8, 9} } }, { { {1, 2, 3}, {4, 5, 6}, {7, 8, 9} }, { {1, 2, 3}, {4, 5, 6}, {7, 8, 9} } } };

// int[][][] matriz = {{ {1 , 2 } , { 3 , 4 } } , { { 5 , 6 } , { 7, 8 }}};



ListaMatrix = _ "{" _ valores:ListaMatrix _ "}" _ otro:("," _ "{" _ otroValor:ListaMatrix _ "}" _ { return otroValor })* { return [valores, ...otro] }
            /  valores:Argumentos { return valores }

// La funcion puede tener parametros o no
// La funcion puede ser de tipo normal o de tipo array, para indicar el tipo array se usa [] o tambien puede ser void el cual no retorna nada
FuncDcl = tipo:( "int[]" / "float[]" / "string[]" / "boolean[]" / "char[]" / "int" / "float" / "string" / "boolean" / "char" / "void") _ id:Identificador _ "(" _ params:Parametros? _ ")" _ bloque:Bloque { return crearNodo('funcion', { tipo, id, params: params || [], bloque }) }

// Parametros puede ser arrays normales, o tipos normales tambien, y con un id

Parametros = tipo:( "int[]" / "float[]" / "string[]" / "boolean[]" / "char[]" / "int" / "float" / "string" / "boolean" / "char") _ id:Identificador params:( _ "," _ tipo2:("int[]" / "float[]" / "string[]" / "boolean[]" / "char[]" / "int" / "float" / "string" / "boolean" / "char") _ id2:Identificador { return { tipo2, id2 } })* { return [{ tipo, id }, ...params] }

// El array se puede declarar de dos maneras
// Con una lista de valores dentro de {}
// O con un tamaño y sin valores  int[] id = new int[5];
// tambien se puede crear asi: int[] id = otroArray;

Array = _ tipo:("int" / "float" / "string" / "boolean" / "char") _ "[" _ "]" _ id:Identificador _ "=" _ "{" _ valores:Argumentos _ "}" _ ";" { return crearNodo('array', { tipo, id, elementos: valores }) }
      / _ tipo1:("int" / "float" / "string" / "boolean" / "char") _ "[" _ "]" _ id:Identificador _ "=" _ "new" _ tipo2:("int" / "float" / "string" / "boolean" / "char") _ "[" _ tam:Expresion _ "]" _ ";" { return crearNodo('arraySimple', { tipo1, id, tipo2, size:tam }) }
      / _ tipo:("int" / "float" / "string" / "boolean" / "char") _ "[" _ "]" _ id:Identificador _ "=" _ id2:Identificador _ ";" { return crearNodo('arrayCopia', { tipo, id, id2 }) }


// Para declarar variables hay distintas maneras
// la normal de declarar con el tipo, el id y el valor
// donde solo se declara el tipo y el valor
// y donde no se da un tipo sino que solo el valor

// Las ultimas son auxiliares para cuando se cree una variable tipo struct, tanto en la instancia como en la 
// asignacion de propiedades del struct

Variable = _ tipo:("var") _ id:Identificador _ "=" _ exp:Expresion _ ";" { return crearNodo('typeLessDcl', { id, valor:exp }) }
        /  _ tipo:("int" / "float" / "string" / "boolean" / "char" ) _ id:Identificador  _ "=" _ exp:Expresion _ ";"{ return crearNodo('declaracionVar', { tipo, id, valor:exp})}
        /  _ tipo:("int" / "float" / "string" / "boolean" / "char" ) _ id:Identificador _ ";"{ return crearNodo('simpleDcl', { tipo, id })} 

// Statement = "System.out.println(" _ exp:Expresion ")" ";" { return crearNodo('print', {exp})}
Statement = "System.out.println(" _ args:ArgumentosPrint _ ")" _ ";" { return crearNodo('print', {args})}
          / Bloque:Bloque { return Bloque }
          / ifStmt:IFStmt { return ifStmt }
          / whileStmt:WhileStmt { return whileStmt }
          / forStmt:ForStmt { return forStmt }
          / swtch:SwtchStmt { return swtch }
          / "break" _ ";" { return crearNodo('break') }
          / "continue" _ ";" { return crearNodo('continue') }
          / "return" _ exp:Expresion? _ ";" { return crearNodo('return', {exp}) }
          / exp:Expresion ";" { return crearNodo('statement', {exp})}

SwtchStmt = "switch" _ "(" _ exp:Expresion _ ")" _ "{" _ cases:Case* _ defaultC:Default? _ "}" 
    { return crearNodo('switch', { exp, cases, def:defaultC }) }

Case = "case" _ valor:Expresion _ ":" _ stmts:Declaracion* 
    { return { valor, stmts } }

Default = "default" _ ":" _ stmts:Declaracion* 
    { return { stmts } }

ForStmt = "for" _ "(" _ init:InitFor _  _ cond:Expresion _ ";" _ inc:Expresion _ ")" _ stmt:Statement { return crearNodo('for', { inicial:init, condicion:cond, incremento:inc, bloque:stmt }) }
        / "for" _ "(" _ tipo:("int" / "float" / "string" / "boolean" / "char" / "var" ) _ id:Identificador _ ":" _ exp:Expresion _ ")" _ stmt:Statement { return crearNodo('foreach', { tipo, id, exp, bloque:stmt }) }

InitFor = dcl:Variable { return dcl }
        / exp:Expresion ";" { return exp }
        / ";" { return null } // Para validar asi como en lenguajes como js donde no es necesario que se declare algo en el for

WhileStmt = "while" _ "(" _ cond:Expresion _ ")" _ stmt:Statement { return crearNodo('while', { condicion:cond, bloque:stmt }) }

// esta produccion cubre el if normal, el if else, el if else if else
IFStmt = "if" _ "(" _ cond:Expresion _ ")" _ stmtTrue:Statement stmtFalse:( _ "else" _ stmtFalse:Statement { return stmtFalse } )? { return crearNodo('if', { condicion:cond, bloqueTrue:stmtTrue, bloqueFalse:stmtFalse }) }

Bloque = "{" _ dcls:Declaracion* _ "}" { return crearNodo('bloque', {dcls}) }

ArgumentosPrint = arg:Expresion args:( _ "," _ exp:Expresion { return exp })* { return [arg, ...args] }

Identificador = [a-zA-Z_][a-zA-Z0-9_]* { return text() }

Expresion = Asignacion
            /  AsignacionConDosP
          

// AsignacionConDosP es lo mismo que asignacion pero solo que con : en vez de = y no se puede esto de += -= ni nada de eso y solo sera para variables


Asignacion = id:Identificador _ "[" _ index:Expresion _ "]" indexA:( _ "[" _ index2:Expresion _ "]" { return index2 })+ _ op:("+=" / "-=" / "=") _ exp:Asignacion { 

                return crearNodo('asignacionMatrix', { id, index, indexA, exp })
            }
          / id:Identificador _ "[" _ index:Expresion _ "]" _ op:("+=" / "-=" / "=") _ exp:Asignacion { 
              if (op === "+=") {
                return crearNodo('asignacionArray', { 
                  id, 
                  index,
                  exp: crearNodo('binaria', { op: '+', izq: crearNodo('accesoVector', {id, index}), der: exp })
                })
              } else if (op === "-=") {
                return crearNodo('asignacionArray', { 
                  id, 
                  index,
                  exp: crearNodo('binaria', { op: '-', izq: crearNodo('accesoVector', {id, index}), der: exp })
                })
              } else {
                return crearNodo('asignacionArray', { id, index, exp })
              }
            }
          / id:Identificador _ op:("+=" / "-=" / "=") _ exp:Asignacion { 
              if (op === "+=") {
                return crearNodo('asignacion', { 
                  id, 
                  exp: crearNodo('binaria', { op: '+', izq: crearNodo('accesoVar', {id}), der: exp })
                })
              } else if (op === "-=") {
                return crearNodo('asignacion', { 
                  id, 
                  exp: crearNodo('binaria', { op: '-', izq: crearNodo('accesoVar', {id}), der: exp })
                })
              } else {
                return crearNodo('asignacion', { id, exp })
              }
            }
          / TernaryOp


AsignacionConDosP = id:Identificador _ ":" _ exp:AsignacionConDosP { return crearNodo('asignacion', { id, exp }) }
                  / TernaryOp

TernaryOp = cond:OperacionOr _ "?" _ expTrue:Expresion _ ":" _ expFalse:Expresion { return crearNodo('ternario', { condicion:cond, expTrue, expFalse }) }
          / OperacionOr


OperacionOr = izq:OperacionAnd expansion:( _ op:("||") _ der: OperacionAnd {return { tipo:op, der}})* {
  // Asociatividad de izq a der
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual // esto hace que de operacion actual obtengamos los valores de tipo y der
      return crearNodo('binaria', { op:tipo, izq:operacionAnterior, der})
    },
    izq
  )
}

OperacionAnd = izq:OperacionComparar expansion:( _ op:("&&") _ der:OperacionComparar {return { tipo:op, der}})* {
  // Asociatividad de izq a der
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual // esto hace que de operacion actual obtengamos los valores de tipo y der
      return crearNodo('binaria', { op:tipo, izq:operacionAnterior, der})
    },
    izq
  )
}   

OperacionComparar = izq:OperacionRelacional expansion:( _ op:("!=" / "==") _ der:OperacionRelacional {return { tipo:op, der}})* {
  // Asociatividad de izq a der
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual // esto hace que de operacion actual obtengamos los valores de tipo y der
      return crearNodo('binaria', { op:tipo, izq:operacionAnterior, der})
    },
    izq
  )
}   
// Es importante que cuando se crean las ER o palabras reservadas se hagan en orden
// asi como >= tiene que ir antes que > para que no reconozca primero el > y haga ya su match con la expresion
OperacionRelacional = izq:Operacion expansion:( _ op:("<=" / ">=" / ">" / "<") _ der:Operacion {return { tipo:op, der}})* {
  // Asociatividad de izq a der
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual // esto hace que de operacion actual obtengamos los valores de tipo y der
      return crearNodo('binaria', { op:tipo, izq:operacionAnterior, der})
    },
    izq
  )
}   

Operacion = izq:OperacionM expansion:( _ op:("+" / "-") _ der:OperacionM {return { tipo:op, der}})* {
  // Asociatividad de izq a der
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual // esto hace que de operacion actual obtengamos los valores de tipo y der
      return crearNodo('binaria', { op:tipo, izq:operacionAnterior, der})
    },
    izq
  )
}   

OperacionM = izq:UnariOp  expansion:( _ op:("/" / "*" / "%") _ der:UnariOp {return { tipo:op, der}})* {
  // Asociatividad de izq a der
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual // esto hace que de operacion actual obtengamos los valores de tipo y der
      return crearNodo('binaria', { op:tipo, izq:operacionAnterior, der})
    },
    izq
  )
}   

UnariOp = tipo:("!" / "-") _ exp:UnariOp { return crearNodo('unaria', { op:tipo, exp})}
        / Call


Call = "typeof" _ exp:Nativo { return crearNodo('typeof', {exp}) }
    / callee:Nativo _  params:("(" _ args:Argumentos? _ ")" { return args })* {
      return params.reduce(
        (callee, args) => {
          return crearNodo('llamada', { callee, args: args || [] })
        },
        callee
      )
    }


Argumentos = arg:Expresion args:( _ "," _ exp:Expresion { return exp })* { return [arg, ...args] }

//Se cambio de solo Numero a Nativo para manejar los tipos y hacer las verificaciones
//semanticas necesarias, para esto tambien sera necesario hacer la expresion de nativo 
//Que retorne el valor como tal para cuando se interprete la expresion de cada operacion
//se obtenga el valor y se pueda verificar el tipo


Nativo = [0-9]+ "." [0-9]+ { return crearNodo('nativo', { tipo: 'float', valor: parseFloat(text(), 10) }) }
        / [0-9]+ { return crearNodo('nativo', { tipo: 'int', valor: parseInt(text(), 10) }) }
        / "true" { return crearNodo('nativo', { tipo: 'boolean', valor: true }) }
        / "false" { return crearNodo('nativo', { tipo: 'boolean', valor: false }) }
        / "null" { return crearNodo('nativo', { tipo: 'null', valor: null }) }
        / '"' ([^"\\] / "\\" .)* '"' { return crearNodo('nativo', { tipo: 'string', valor: JSON.parse(text()) }) }
        / "'" . "'" { return crearNodo('nativo', { tipo: 'char', valor: text().charAt(1) }) }
        / "(" _ exp:Expresion _ ")" { return crearNodo('agrupacion', { exp }) }
        / "[" _ exp:Expresion _ "]" { return crearNodo('agrupacion', { exp }) }
        / id:Identificador _ "[" _ index:Expresion _ "]" _ indices:( _ "[" _ index2:Expresion _ "]" { return index2 })+ { return crearNodo('accesoMatrix', {id, index, indices}) }
        / id:Identificador _ "[" _ index:Expresion _ "]" { return crearNodo('accesoVector', {id, index}) }
        / id:Identificador ".indexOf(" _ exp:Expresion _ ")" { return crearNodo('indexof', {id, exp}) }
        / id:Identificador ".join(" _ ")" { return crearNodo('join', {id}) }
        / id:Identificador ".length" { return crearNodo('length', {id}) }
        / id:Identificador { return crearNodo('accesoVar', {id}) }


_ = ([ \t\n\r] / Comments)*

Comments = "//" (![\n] .)*
            / "/*" (!("*/") .)* "*/"