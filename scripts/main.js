function ejecutar() {
// **** **** **** DECLARACIONES **** **** **** //

// //////// VARIABLES /////////  //
let asientos = new Array();
const salas = new Array();
let pelis = new Array();
const precioBase = 3000; //valor de precio indicado desde el back end
let funciones = new Array();

// //////// OBJETOS ///////////  //
//*********** Salas */
class Sala {
    constructor(nombre, filas, columnas) {
        this.nombre = nombre;
        this.filas = filas;
        this.columnas = columnas;
        this.capacidad = filas * columnas;
    }
}

salas[0] = new Sala("Premium", 15, 10);
salas[1] = new Sala("Clásica", 25, 10);
salas[2] = new Sala("Infantil", 25, 15);

//*********** Películas */
class Pelicula {
    constructor(id, nombre, anio, actor, genero, edad, director, resumen, duracion, rating) {
        this.id = id;
        this.nombre = nombre;
        this.anio = anio;
        this.actor = actor;
        this.genero = genero;
        this.edad = edad;
        this.director = director;
        this.resumen = resumen;
        this.duracion = duracion;
        this.rating = rating;
    }
}

pelis = [
    new Pelicula("2309101900_IND", "Indiana Jones y el templo de la perdición", 1984, "Harrison Ford", "Aventuras", "ATP", "Steven Spielberg", "En 1935, Indiana Jones llega a la India, todavía parte del Imperio británico, y se le pide que encuentre una piedra mística. Entonces se topa con un culto secreto que comete esclavitud y sacrificios humanos en las catacumbas de un palacio.", "1h 58m", 7.5),
    new Pelicula("2309101901_TOY", "Toy Story", 1995, "Tom Hank", "Animación", "ATP", "John Lasseter", "Un vaquero de juguete se encuentra celoso y amenazado cuando un nuevo juguete, un guardián espacial, se convierte en el favorito del niño al que pertenecen.", "1h 21m", 8.3),
    new Pelicula("2309101904_VOL", "Volver al futuro", 1985, "Michael J Fox", "Ciencia ficción, aventuras", "ATP", "Robert Zemeckis", "Marty McFly, un estudiante de secundaria de 17 años, es enviado accidentalmente treinta años al pasado en un DeLorean que viaja en el tiempo, inventado por su gran amigo, el excéntrico científico Doc Brown.", "1h 56m", 8.5),
    new Pelicula("2309052000_TIT", "Titanic", 1997, "Leonardo Di Caprio, Kate Winslett", "Romance, Drama", "PG-13", "James Cameron", "Una aristócrata de diecisiete años se enamora de un amable pero pobre artista a bordo del lujoso y desafortunado R.M.S. Titanic.", "3h 14m", 7.9),
    new Pelicula("2309040102_AFR", "Africa mía", 1985, "Robert Redford, Maryl Streep", "Romance, Drama, Biografía", "GP-13", "Sydney Pollack", "En la Kenia colonial del siglo XX, una baronesa danesa, propietaria de una plantación, mantiene una apasionada relación amorosa con un cazador de espíritu libre.", "2h 41m", 7.1)
]

//*********** Funciones (día y hora en la que se proyecta un película) */
class Funcion {
    constructor(pelicula, sala, dia, hora) {
        this.id = "f_" + dia + hora + "_" + sala;
        this.pelicula = pelicula;
        this.sala = sala;
        this.dia = dia;
        this.hora = hora;
        this.asientosFuncion = inicializarAsientos(sala);
        this.precio=calcularPrecio(sala,dia);
    }
}

funciones = [
    new Funcion("2309101900_IND", 1, "2023-09-24", 1900),
    new Funcion("2309101900_IND", 1, "2023-09-24", 2200),
    new Funcion("2309052000_TIT", 0, "2023-09-28", 1315),
    new Funcion("2309101900_IND", 1, "2023-09-25", 1900),
    new Funcion("2309101900_IND", 1, "2023-09-25", 2200),
    new Funcion("2309101900_IND", 1, "2023-09-26", 2200),
    new Funcion("2309101900_IND", 1, "2023-09-27", 1500),
    new Funcion("2309101900_IND", 1, "2023-09-27", 1800),
    new Funcion("2309052000_TIT", 0, "2023-09-28", 1615),
    new Funcion("2309052000_TIT", 0, "2023-10-05", 1315),
    new Funcion("2309052000_TIT", 0, "2023-10-06", 1315),
    new Funcion("2309101904_VOL", 0, "2023-09-21", 1315),
    new Funcion("2309101904_VOL", 0, "2023-09-21", 1620),
    new Funcion("2309101904_VOL", 0, "2023-09-21", 1830)
];

// //////// FUNCTIONS ///////////  //

function calcularPrecio(sala, dia) {
    let precio;
    switch (sala) {
        case 0:
            precio = precioBase * 1.2;
            break;
        case 1:
            precio = precioBase;
            break;
        case 2:
            precio = precioBase * 0.8;
    }
    const diaFormateado = new Date(dia);
    const diaDeSemana = diaFormateado.getDay();
    switch (diaDeSemana) {
        case 6: //sábado
            precio = precio * 1.1;
            break;
        case 3: //miercoles
            precio = precio * 0.5;
            break;
        default:
            precio = precio;
    }
    return precio;
}

//para los asientos armo una matriz de filas y columnas, donde cada asiento ocupado 
//tiene el valor 1 y el libre el valor 0

//La función que sigue genera un vector de asientos vacíos para una función dada. Cuando un usuario elige asientos, el vector de asientos se modifica y queda guardado así modificado. 


function inicializarAsientos(sala) {
    const filasSala = salas[sala].filas;
    const columnasSala = salas[sala].columnas;
    asientos = new Array(filasSala);
    for (let fila = 0; fila < filasSala; fila++) {
        asientos[fila] = new Array(columnasSala);
        for (let columna = 0; columna < columnasSala; columna++) {
            asientos[fila][columna] = 0;
            // para que muestre [0 fila columna] escribir => `[0 ,${fila}, ${columna}]`; 
        }
    }
    return asientos;
}

function mostrarOcupacion(asientosOcupacion) { //esta funcion se va a usar para después mostrar los asientos en pantalla
    let ocupacion = "";
    for (let i = 0; i < asientosOcupacion.length; i++) {
        ocupacion = ocupacion+"Fila " + (i + 1).toString() + " => [  "+asientosOcupacion[i].join(" ] [ ")+" ]\n";
        
        //console.log(ocupacion + asientosOcupacion[i].join(" "));
        //ocupacion = "";
    }
    return ocupacion;
}

function asientosContiguos(entradas, asientosParticular) {
    let filasConAsientosContiguos = new Array();
    let contador = 0;
    for (let i = 0; i < asientosParticular.length; i++) {
        for (let j = 0; j < asientosParticular[i].length; j++) {
            if (asientosParticular[i][j] === 0) {
                contador++;
                if (contador >= entradas) {
                    filasConAsientosContiguos.push(i + 1);
                    contador = 0;
                    break;
                }
            } else {
                contador = 0;
            }
        }
        contador = 0;
    }
    return alertaFilas= "las filas con " + entradas + " o más asientos libres contiguos son: " + filasConAsientosContiguos.join();
}

function errorHandler(iterador, listaX, item) {
    let mensajeError = 0;
    let devolucion=new Array();
    for (let i = 1; i < 3; i++) {
        seleccionarX = prompt("Lo sentimos, ingresaste el número incorrecto. Volvé a intentarlo o ingresá NO.\nTe quedan " + (3 - i) + " intentos.\n" + listaX + "¿qué " + item + " querés ver?\nIngresá el número correspondiente.");
        if ((parseInt(seleccionarX) >= 1) && (parseInt(seleccionarX) < iterador)) {
            break;
        
        } else {
            if ((seleccionarX.trim().toUpperCase() === "NO")) {
                alert("¡Qué pena que te quieras ir!! ¡Nos vemos la próxima!");
                mensajeError = 1;
                break;
            } else if (i===2){  alert("Lo sentimos, ya lo intentaste demasiadas veces"); 
                    mensajeError=1;
                break; }
        }
    } 

    devolucion=[seleccionarX,mensajeError];
    return devolucion;
}

// **** **** **** FIN DECLARACIONES **** **** **** /////////////////////

// *************     Empieza la interacción con el usuario   **********************//
let iterador = 1;
let listaPelis = "";
for (const peli of pelis) {
    listaPelis = listaPelis + iterador.toString() + "=> " + peli.nombre + "\n";
    iterador++;
}

let seleccionarPeli = prompt(listaPelis + "¿qué película querés ver?\nIngresá el número correspondiente.");

    if ((parseInt(seleccionarPeli) >= (iterador)) || (parseInt(seleccionarPeli) < 1) || (seleccionarPeli == null) || (seleccionarPeli == "")) {
        devolucion=errorHandler(iterador, listaPelis, "película");
        seleccionarPeli = devolucion[0];
        mensajeError = devolucion[1];
        if (mensajeError === 1) { return; }
    }
peliSeleccionada = pelis[parseInt(seleccionarPeli) - 1].id;


// filtro usando la sintaxis común de las funciones (con llaves y return): 
//let funcionesPeliSeleccionada = funciones.filter(function(filtro) {return filtro.pelicula == peliSeleccionada;});
//con funcion flecha:
let funcionesPeliSeleccionada = funciones.filter((peliculaId) => peliculaId.pelicula == peliSeleccionada);

//mostramos las funciones
iterador = 1;
let listaFunciones = "";
for (const elemento of funcionesPeliSeleccionada) {
    listaFunciones = listaFunciones + iterador.toString() + "=> Día " + elemento.dia + " Hora " + elemento.hora + "\n"
    iterador++;
}
let seleccionarFuncion = prompt("Esta es la lista de funciones para la película elegida \n" + listaFunciones + "¿Cuál elegís?");
if((parseInt(seleccionarFuncion) > (iterador))||(parseInt(seleccionarFuncion) < 1)||(seleccionarFuncion==null)||(seleccionarFuncion=="")) {
devolucion=errorHandler(iterador, listaFunciones, "función");
        seleccionarFuncion = devolucion[0];
        mensajeError = devolucion[1];
        if (mensajeError === 1) { return; }
}


let funcionSeleccionada = funcionesPeliSeleccionada[parseInt(seleccionarFuncion) - 1].id;
let entradas = parseInt(prompt("¿Cuántas entradas querés comprar?"));
//buscamos la funcion, asignamos asientos ocupados
//obtenemos los asientos y mostramos los asientos
for (const funcion of funciones) {
    if (funcion.id === funcionSeleccionada) {
        filasFuncion = salas[funcion.sala].filas;
        columnasFuncion = salas[funcion.sala].columnas;
        //generamos ocupacion aleatoria con random para simular reservas anteriores
        //los asientos con 0 están libres
        for (let x = 0; x < filasFuncion; x++) {
            for (let y = 0; y < columnasFuncion; y++) {
                funcion.asientosFuncion[x][y] = Math.round(Math.random());
            }
        }

        asientosParticular = funcion.asientosFuncion;
        peliculaFuncion = funcion.pelicula;
        diaFuncion = funcion.dia;
        horaFuncion = funcion.hora;
        salaFuncion = funcion.sala;
        precioFuncion = funcion.precio;
        for (const peli of pelis) {
            if (peli.id == funcion.pelicula) {
                peliculaFuncion = peli.nombre;
                break;
            }
        }

        alert("Esta es la disponibilidad de asientos para la pelicula " + peliculaFuncion + " proyectada en la sala " + salas[salaFuncion].nombre + " el día " + diaFuncion + " a las " + horaFuncion+"\n Tené en cuenta que el 0 indica asiento vacío y el 1 asiento ocupado."+"\n"+mostrarOcupacion(asientosParticular));
        break;
    }
}

//chequeando disponibilidad de asientos contiguos

let counter = new Array;
let totalAsientosLibres = 0;
for (let x = 0; x < asientosParticular.length; x++) {
    counter[x] = 0;
    for (let y = 0; y < asientosParticular[x].length; y++) {
        if (asientosParticular[x][y] === 0) { counter[x]++; totalAsientosLibres++; };
    }
}
if (totalAsientosLibres >= entradas) {

    let filasConAsientosLibres = new Array();
    for (let x = 0; x < counter.length; x++) {
        if (counter[x] >= entradas) {
            filasConAsientosLibres.push(x + 1);
        }
    }
    elegirFilas=prompt("El total de asientos libres en la sala es: " + totalAsientosLibres+"\n"+asientosContiguos(entradas, asientosParticular)+"\n ¿Qué fila elegís?");
} else {
    alert("Esta función no tiene la cantidad de asientos libres solicitada \n"+"El total de asientos libres en la sala es: " + totalAsientosLibres);
}
alert("el precio de las entradas para esa función es " + precioFuncion + " \n Compraste " + entradas + " por lo que tu total a pagar es: \n" + "$" + (entradas * precioFuncion));
alert("Resumen de tu compra:\n"+"Película => " + peliculaFuncion + "\n Proyectada en la sala => " + salas[salaFuncion].nombre + "\n Día => " + diaFuncion + "\n Hora => " + horaFuncion+"\n Fila => "+elegirFilas+"\n Cantidad de entradas => "+entradas+"\n TOTAL A PAGAR => "+"$" + (entradas * precioFuncion));



}