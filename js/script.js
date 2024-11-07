const pantalla = document.querySelector('.pantalla');

let operacionPendiente = '';
let numeroAnterior = '';  
let operadorActual = null; 
let reiniciarPantalla = false; 

function agregar(valor) {
    if (reiniciarPantalla && valor !== 'C' && valor !== '←') {
        pantalla.value = '';
        reiniciarPantalla = false;
    }
    
    if (['+', '-', '*', '/', '√'].includes(valor)) {
        if (operadorActual !== null) {
            calcular();
        }

        if (valor === '√') {
            operadorActual = '√';
            calcular();  // Calculamos directamente la raíz cuadrada
        } else {
            numeroAnterior = pantalla.value;
            operadorActual = valor;
            reiniciarPantalla = true;
        }
    } else if (valor === 'C') {
        limpiar();  // C para limpiar todas las operaciones de la pantalla
    } else if (valor === '←') {
        retroceder();  // ← para borrar el ultimo caracter
    } else {
        pantalla.value += valor;
    }
}

function limpiar() {
    pantalla.value = '';
    operacionPendiente = '';
    numeroAnterior = '';
    operadorActual = null;
}

function calcular() {

    if (operadorActual === null || reiniciarPantalla) return;

    let resultado; 

    if (operadorActual === '√') {
        const numeroRaiz = parseFloat(pantalla.value);
        if (numeroRaiz < 0) {
            pantalla.value = 'Error'; 
// Si el número es negativo, mostramos un error
            setTimeout(limpiar, 1500); 
            return;
        }
        resultado = Math.sqrt(numeroRaiz); // Sirve para calcular la raiz
    } else {
// Si no es raíz cuadrada, realizamos la operación normal entre dos números
        const numero1 = parseFloat(numeroAnterior);
        const numero2 = parseFloat(pantalla.value);

//Muestra error si el valor ingresado no es válido 
        if (isNaN(numero1) || isNaN(numero2)) {
            pantalla.value = 'Error';
            setTimeout(limpiar, 1500);
            return;
        }

//Depende de lo que se ocupe se realiza la operación correspondiente
        switch (operadorActual) {
            case '+':
                resultado = numero1 + numero2;
                break;
            case '-':
                resultado = numero1 - numero2;
                break;
            case '*':
                resultado = numero1 * numero2;
                break;
            case '/':
                if (numero2 === 0) {
                    pantalla.value = 'Error';
                    setTimeout(limpiar, 1500);
                    return;
                }
                resultado = numero1 / numero2;
                break;
            default:
                break;
        }
    }

// Redondeamos el resultado a 8 decimales para evitar problemas de precisión
    resultado = Math.round(resultado * 100000000) / 100000000;

// Mostramos el resultado en la pantalla
    pantalla.value = resultado;

//Mantiene la operacion para usarla en otras 
    operadorActual = null;
    numeroAnterior = pantalla.value;
    reiniciarPantalla = false;
}

// Función para borrar el último carácter ingresado
function retroceder() {
    pantalla.value = pantalla.value.slice(0, -1);  
}

// Manejo de eventos del teclado
document.addEventListener('keydown', (event) => {
    event.preventDefault();
    const key = event.key;

 //Si la tecla es un número o un operador válido, la agregamos a la pantalla
    if (/[0-9\+\-\*\/\.]/.test(key)) {
        agregar(key);
    }
//Tecla es Enter, realizamos el cálculo
    else if (key === 'Enter') {
        calcular();
    }
//Tecla es Escape, limpiamos la pantalla
    else if (key === 'Escape') {
        limpiar();
    }
//Tecla es Backspace, borramos el último carácter
    else if (key === 'Backspace') {
        retroceder();
    }
});