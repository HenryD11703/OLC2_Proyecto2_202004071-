export class Errores {
    listaErrores = [];
    errorCount = 0;

    constructor() {
        this.actual = null;
    }

    agregarError(descripcion, linea, columna, tipo) {
        this.errorCount++;
        this.listaErrores.push({
            numero: this.errorCount,
            descripcion,
            linea,
            columna,
            tipo
        });
    }

    hacerHTML() {
        let html = `
        <style>
            .error-table {
                border-collapse: collapse;
                width: 100%;
                margin-bottom: 1em;
                font-family: Arial, sans-serif;
                color: #f8f8f2;
                background-color: #282a36;
            }
            .error-table th, .error-table td {
                border: 1px solid #44475a;
                padding: 8px;
                text-align: left;
            }
            .error-table th {
                background-color: #44475a;
                color: #ff79c6;
                font-weight: bold;
            }
            .error-table tr:nth-child(even) {
                background-color: #2c2f3d;
            }
            .error-table tr:hover {
                background-color: #3c3f58;
            }
        </style>
        <table class="error-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Descripción</th>
                    <th>Línea</th>
                    <th>Columna</th>
                    <th>Tipo</th>
                </tr>
            </thead>
            <tbody>
        `;
        
        this.listaErrores.forEach((error) => {
            html += `
                <tr>
                    <td>${error.numero}</td>
                    <td>${error.descripcion}</td>
                    <td>${error.linea}</td>
                    <td>${error.columna}</td>
                    <td>${error.tipo}</td>
                </tr>
            `;
        });
        
        html += `
            </tbody>
        </table>
        `;
        
        return html;
    }
}