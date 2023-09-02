let nombre_peli = "";
function selectPeli() {
    const peli = prompt("Por favor ingrese el número de la película elegida");
    switch (peli) {
        case "1":
            nombre_peli = "Indiana Jones y el templo de la perdición";
            break;
        case "2":
            nombre_peli = "Toy Story";
            break;
        default:
            alert("El número que ingresaste no corresponde a ninguna película. Por favor intentalo de nuevo");
    }
    alert("Gracias por elegir " + nombre_peli + "Ahora podés continuar la compra.");
    return nombre_peli;
} 
let sala="";
function selectSala() {
    sala = prompt("Ingresá el número correspondiente a la sala elegida");
    if ((sala<1)||(sala>3)){
        alert("El número no corresponde a ninguna sala, por favor intentalo nuevamente");
    } else {
        mostrarFuncion(sala);
    }
    
}
function precio(sala,fila) {

}
//en este array debería haber unas funciones para una sala y otras para otra sala. Pero por ahora lo dejo así.
const funciones = [
    "Sábado 20/9 - 17:00",
    "Sábado 20/9 - 18:30",
    "Sábado 20/9 - 21:00",
    "Domingo 21/9 - 14:00",
    "Domingo 21/9 - 19:00",
];
function mostrarFuncion(sala){
    let mostrar = "Acá te mostramos las funciones para dicha sala\n";
funciones.forEach((element,index)=> mostrar = mostrar + "\n" + (index+1) + " -> " + element);
alert (mostrar);
}

let cantidad=0;
function comprarEntradas () {
cantidad=parseInt(prompt("¿Cuántas entradas querés comprar?"));

}