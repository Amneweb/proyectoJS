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