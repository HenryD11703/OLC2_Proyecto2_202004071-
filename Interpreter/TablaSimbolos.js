export class TablaSimbolos {
    // Linea, columna, Identificador, Tipo, Valor
    listaSimbolos = [];
    constructor() {
        this.actual = null;
    }
    agregarSimbolo(linea, columna, identificador, tipo, valor) {
        this.listaSimbolos.push({ linea, columna, identificador, tipo, valor });
    }

    hacerHTML() {
        let html = `
        <style>
            .symbol-table {
                border-collapse: collapse;
                width: 100%;
                margin-bottom: 1em;
                font-family: Arial, sans-serif;
                color: #f8f8f2;
                background-color: #282a36;
            }
            .symbol-table th, .symbol-table td {
                border: 1px solid #44475a;
                padding: 8px;
                text-align: left;
            }
            .symbol-table th {
                background-color: #44475a;
                color: #ff79c6;
                font-weight: bold;
            }
            .symbol-table tr:nth-child(even) {
                background-color: #2c2f3d;
            }
            .symbol-table tr:hover {
                background-color: #3c3f58;
            }
        </style>
        <table class="symbol-table">
            <thead>
                <tr>
                    <th>Línea</th>
                    <th>Columna</th>
                    <th>Identificador</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                </tr>
            </thead>
            <tbody>
        `;
        
        this.listaSimbolos.forEach((simbolo) => {
            let valorStr = this.stringifyValue(simbolo.valor);
            html += `
                <tr>
                    <td>${simbolo.linea}</td>
                    <td>${simbolo.columna}</td>
                    <td>${simbolo.identificador}</td>
                    <td>${simbolo.tipo}</td>
                    <td>${valorStr}</td>
                </tr>
            `;
        });
        
        html += `
            </tbody>
        </table>
        `;
        
        return html;
    }
    stringifyValue(value) {
        if (Array.isArray(value)) {
            return '[' + value.map(v => this.stringifyValue(v)).join(', ') + ']';
        } else if (typeof value === 'object' && value !== null) {
            if ('tipo' in value && 'valor' in value) {
                return this.stringifyValue(value.valor);
            }
            return JSON.stringify(value);
        } else {
            return String(value);
        }
    }
}