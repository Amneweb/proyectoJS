//Hola mundo directamente en la consola
console.log ("Hola, mundo");
//Hola mundo a través de una variable 'variable' cuyo valor se lo dimos nosotros
let holaMundo = "¡Hola, mundo!";
console.log(holaMundo);
//Pido info a un usuario
let nombreUsuario = prompt("¿Cómo te llamás?");
//con la info del usuario modifico holaMundo
holaMundo = holaMundo + "Gracias, " + nombreUsuario + " por sumarte a este curso";
//muestro holaMundo en la consola nuevamente
console.log(holaMundo);
//muestro holaMundo en un cuadro de diálogo
alert (holaMundo);
//actúo de acuerdo a la info del usuario
let datosUsuario;
let edadUsuario = prompt ("¿Qué edad tenés");
datosUsuario = nombreUsuario + " tiene " + edadUsuario + " años de edad.";
if (edadUsuario < 18) {
 datosUsuario = "ATENCION, " + nombreUsuario + ": Sos menor de edad";
} 
alert (datosUsuario);
const MI_NOMBRE = "JS by Amne";

const PRODUCTO1="bicicleta";
const PRODUCTO2="triciclo";
const PRODUCTO3="monopatín";
//quiero mostrar por consola los 3 valores de las variables
//pero no quiero escribir console.log 3 veces
//entonces uso un for. ¿Cómo hago para que el código entienda
//que lo que yo quiero mostrar es el contenido de las variables 
//cuyo nombre está formado por PRODUCTO y el valor de i?
for (let i=1; i<4; i++) {
console.log("PRODUCTO"+i);
}
//en este caso muestra PRODUCTO1, PRODUCTO2, PRODUCTO3
for (let i=1; i<4; i++) {
    console.log(PRODUCTO+i);
    }
//en este caso da error porque la variable producto no está
//definida
chrome.runtime.sendMessage('ping').then(response => {  })