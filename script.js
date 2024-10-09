import { CompilerVisitor } from "./Traductor/compiler.js";
import { parse } from "./Traductor/gramatica.js";




// Definición inicial de las pestañas
const tabs = [
    { name: 'Pestaña 1', content: '\n \n \n \n \n \n \n \n \n \n \n' }
];

const editors = [];

const tabButtons = document.getElementById('tab-buttons');
const tabContents = document.getElementById('tab-contents');
const addTabButton = document.getElementById('add-tab');
const loadFileBtn = document.getElementById('load-file-btn');
const loadFileInput = document.getElementById('load-file-input');
const Interpretar = document.getElementById('Interpretar');
const consoleTextArea = document.getElementById('console-textarea');

const ast = document.getElementById('ast');
const erores = document.getElementById('errores');


const consoleEditor = CodeMirror.fromTextArea(consoleTextArea, {
  lineNumbers: true,
  mode: "javascript",
  theme: "dracula",
  readOnly: true,
  tabSize: 20
});

// Crear botones y contenido para las pestañas iniciales
tabs.forEach((tab, index) => {
    createTab(index);
});



// Función para crear una nueva pestaña
function createTab(index) {
    const tab = tabs[index];

    const button = document.createElement('button');
    button.textContent = tab.name;
    button.className = 'tab-button';
    button.onclick = () => openTab(index);
    tabButtons.appendChild(button);

    const content = document.createElement('div');
    content.className = 'tab-content';
    const textarea = document.createElement('textarea');
    content.appendChild(textarea);
    tabContents.appendChild(content);

    const editor = CodeMirror.fromTextArea(textarea, {
        lineNumbers: true,
        mode: "javascript",
        theme: "dracula"
    });
    editor.getDoc().setValue(tab.content);

    editors.push(editor);
}

// Función para abrir una pestaña
function openTab(tabIndex) {
    const buttons = document.getElementsByClassName('tab-button');
    const contents = document.getElementsByClassName('tab-content');

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
        contents[i].classList.remove('active');
    }

    buttons[tabIndex].classList.add('active');
    contents[tabIndex].classList.add('active');
}

// Evento para agregar una nueva pestaña
addTabButton.onclick = () => {
    const index = tabs.length;
    tabs.push({ name: `Pestaña ${index + 1}`, content: '\n \n \n \n \n \n \n \n \n \n \n' });
    createTab(index);
    openTab(index);
}

// Evento para abrir el cuadro de diálogo de carga de archivos
loadFileBtn.onclick = () => {
    loadFileInput.click();
}

loadFileInput.addEventListener('change', function(event) {
    const activeIndex = Array.from(document.getElementsByClassName('tab-button'))
                             .findIndex(button => button.classList.contains('active'));
    const file = event.target.files[0];
    
    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const fileContent = e.target.result;
            if (activeIndex !== -1) {
                editors[activeIndex].getDoc().setValue(fileContent);
            }
        }

        reader.readAsText(file);
    }
});





// Evento para interpretar el contenido de la pestaña activa
Interpretar.onclick = () => {
    const activeIndex = Array.from(document.getElementsByClassName('tab-button'))
                             .findIndex(button => button.classList.contains('active'));

    if (activeIndex !== -1) {
/*      const activeEditor = editors[activeIndex];
        console.log(activeEditor.getValue());
        consoleEditor.setValue(activeEditor.getValue()); */

        const activeEditor = editors[activeIndex];

        

        
        const codigo = activeEditor.getValue();
        const sentencias = parse(codigo);

        
        
        
        const interprete = new CompilerVisitor();

        console.log({sentencias})
        sentencias.forEach(sentencia => sentencia.accept(interprete))
        
        
        consoleEditor.setValue(interprete.code.toString());      



    } else {
        console.error("No hay una pestaña activa.");
    }

    // Actualmente Solo imprime lo del editor

    // Este codigo mandar al parser 


}


// Abrir la primera pestaña por defecto
openTab(0);