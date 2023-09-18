// function ejecutar() {
//     const funciones = [
//         ["Sábado 20/9 - 17:00",
//             "Sábado 20/9 - 18:30",
//             "Sábado 20/9 - 21:00",
//             "Domingo 21/9 - 14:00",
//             "Domingo 21/9 - 19:00"],
//         ["Sábado 20/9 - 16:00",
//             "Sábado 20/9 - 18:00",
//             "Sábado 20/9 - 19:50",
//             "Domingo 21/9 - 16:00",
//             "Domingo 21/9 - 19:00"],
//     ];
//     function mostrarFuncion(sala) {
//         let mostrar = "Acá te mostramos las funciones para dicha sala\n";
//         funciones[sala - 1].forEach((element, index) => mostrar = mostrar + "\n" + (index + 1) + " -> " + element);
//         return mostrar;
//     }
//     let precio = 0;
//     function precioEntrada(sala, fila) {
//         switch (sala) {
//             case 1:
//                 if (fila <= 8) {
//                     precio = 2900;
//                 } else {
//                     precio = 3500;
//                 }
//                 break;
//             case 2:
//                 if (fila <= 8) {
//                     precio = 2200;
//                 } else {
//                     precio = 2800;
//                 }
//                 break;
//         }
//         return precio;
//     }
//     function alertaVacio(variable) {
//         alert("No ingresaste ningún valor de " + variable + ". Por favor volvá al inicio y cargá los datos nuevamente.")
//     }
//     const peli = new Array();
//     peli[0] = "Titanic";
//     peli[1] = "Indiana Jones y el templo de la perdición";
//     peli[2] = "Toy Story";
//     peli[3] = "Volver al futuro";
//     peli[4] = "Africa mía";

//     let listarNombres = "Estas son las películas en cartelera\n";
//     for (let i = 0; i < 5; i++) {
//         listarNombres = listarNombres + (i + 1) + "->" + peli[i] + "\n";
//     }
//     const peli_index = parseInt(prompt(listarNombres + "Por favor ingrese el número de la película elegida"));
//     if (peli_index) {
//         if ((peli_index < 1) || (peli_index > 5)) {
//             alert("El número que ingresaste no corresponde a ninguna película. Por favor intentalo de nuevo");
//             return;
//         } else {
//             alert("Elegiste '" + peli[peli_index - 1] + "'. Hacé click en OK para continuar la compra.");

//         }
//     } else {
//         alertaVacio("película");
//         return;
//     }
//     let sala = "";
//     const lista_precios = "SALAS Y PRECIOS\n1-> ****  Sala Premium ****\nFilas 1 a 8: $2900\nFilas 9 a 20: $3500\n2-> **** Sala Clásica ****\nFilas 1 a 8: $2200\nFilas 9 a 20: $2800\n";
//     sala = parseInt(prompt(lista_precios + "Ingresá el número correspondiente a la sala elegida"));
//     if (sala) {
//         if ((sala < 1) || (sala > 2)) {
//             alert("El número no corresponde a ninguna sala, por favor intentalo nuevamente");
//             return;
//         } else {
//             mostrar = mostrarFuncion(sala);
//             funcionElegida = prompt(mostrar + "\n¿Qué función elegís?");
//         }
//     } else {
//         alertaVacio("número de sala");
//         return;
//     }
//     const nombreSala = (sala == 1) ? "Premium" : "Clásica";

//     let cantidad = 0;
//     let fila = 0;
//     cantidad = parseInt(prompt("¿Cuántas entradas querés comprar? El máximo disponible son 10 entradas."));
//     if (cantidad) {
//         if (cantidad > 10) {
//             alert("Lo sentimos la cantidad de entradas deseada (" + cantidad + ") excede la capacidad de la sala");
//             return;
//         }
//     } else {
//         alertaVacio("cantidad de entradas");
//         return;
//     }
//     fila = parseInt(prompt("Ingrese el número de fila. Hay un máximo de 20 filas."));
//     if (fila) {

//         if ((fila < 1) || (fila > 20)) {
//             alert("El número de fila que ingresaste no corresponde a ninguna fila existente. Por favor volvé a iniciar el proceso y seleccioná una fila entre 1 y 20.");
//             return;
//         }
//     } else {
//         alertaVacio("número de fila");
//         return;
//     }
//     let a_pagar = precioEntrada(sala, fila) * cantidad;
//     alert("Gracias por comprar tus entradas en Cine Vintage. Este es el resumen de tu compra:\n-> Película: " + peli[peli_index - 1] + "\n-> Sala: " + nombreSala + "\n-> Funcion: " + funciones[sala - 1][funcionElegida - 1] + "\n-> Cantidad de entradas: " + cantidad + "\n-> Fila: " + fila + "\n-> TOTAL A PAGAR: $" + a_pagar);
// }

//******************************************* */
//pasamos las películas a objetos dentro de un array//
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
let pelis = new Array();
pelis = [
    new Pelicula("2309101900_IND", "Indiana Jones y el templo de la perdición", 1984, "Harrison Ford", "Aventuras", "ATP", "Steven Spielberg", "En 1935, Indiana Jones llega a la India, todavía parte del Imperio británico, y se le pide que encuentre una piedra mística. Entonces se topa con un culto secreto que comete esclavitud y sacrificios humanos en las catacumbas de un palacio.", "1h 58m", 7.5),
    new Pelicula("2309101901_TOY", "Toy Story", 1995, "Tom Hank", "Animación", "ATP", "John Lasseter", "Un vaquero de juguete se encuentra celoso y amenazado cuando un nuevo juguete, un guardián espacial, se convierte en el favorito del niño al que pertenecen.", "1h 21m", 8.3),
    new Pelicula("2309101904_VOL", "Volver al futuro", 1985, "Michael J Fox", "Ciencia ficción, aventuras", "ATP", "Robert Zemeckis", "Marty McFly, un estudiante de secundaria de 17 años, es enviado accidentalmente treinta años al pasado en un DeLorean que viaja en el tiempo, inventado por su gran amigo, el excéntrico científico Doc Brown.", "1h 56m", 8.5),
    new Pelicula("2309052000_TIT", "Titanic", 1997, "Leonardo Di Caprio, Kate Winslett", "Romance, Drama", "PG-13", "James Cameron", "Una aristócrata de diecisiete años se enamora de un amable pero pobre artista a bordo del lujoso y desafortunado R.M.S. Titanic.", "3h 14m", 7.9),
    new Pelicula("2309040102_AFR", "Africa mía", 1985, "Robert Redford, Maryl Streep", "Romance, Drama, Biografía", "GP-13", "Sydney Pollack", "En la Kenia colonial del siglo XX, una baronesa danesa, propietaria de una plantación, mantiene una apasionada relación amorosa con un cazador de espíritu libre.", "2h 41m", 7.1)
]

//*********** Ponemos las salas también como objetos */
//habrá que pensar si dentro del objeto sala se pone 'ocupacion' para saber si ya está llena/
class Sala {
    constructor(nombre, filas, columnas) {
        this.nombre = nombre;
        this.filas = filas;
        this.columnas = columnas;
        this.capacidad = filas * columnas;
    }
}
const salas = new Array();
salas[0] = new Sala("Premium", 15, 10);
salas[1] = new Sala("Clásica", 25, 10);
salas[2] = new Sala("Infantil", 25, 10);

//para las funciones voy a definir un array directamente, suponiendo qeu los horarios son siempre los mismos
//y que solo varian las asignaciones (sala1 tiene las funciones ... entre los días ... con la peli ...)

//const funciones = new Array();
//el metodo getDay de JS define que el domingo es 0, lunes 1, etc. Entonces
//En el array de funciones (que es una matriz de dimension 2) una de las dimensione ssera el día de la
//semana, que va a tener key = 0, 1, 2, etc y la otra serán los horarios de las funciones para ese día
//funciones[0] = ["13:00","15:00",""] ;

function calcularPrecio(sala, dia) {
    let precio;
switch (sala) {
    case 0:
        precio=precioBase*1.2;
        break;
        case 1:
        precio=precioBase;
        break;
        case 2:
        precio=precioBase*0.8;
}
const diaFormateado = new Date(dia);
const diaDeSemana = diaFormateado.getDay();
switch (diaDeSemana) {
    case 6: //sábado
        precio=precio*1.1;
        break;
        case 3: //miercoles
        precio=precio*0.5;
        break;
        default:
            precio=precio;

}
return precio;
}

//hacer las funciones para cada pelicula y segun el dia
//agregar fechas de proyeccion de cada peli
//asignar funciones a salas
//agregar peliculas futuras a la cartelera
//armar carrito de compras de snacks
//armar vector de sala, funcion, cantidad de asientos ocupados

//para los asientos armo una matriz de filas y columnas, donde cada asiento ocupado 
//tiene el valor 1 y el libre el valor 0

//generamos los asientos para la función correspondiente, cuando se agrega la funcion. En la realidad este proceso
//se hace desde el back-end. Acá lo damos por hecho, junto con las películas y las funciones, que ya están guardadas
//en sus variables.
let asientos = new Array();
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

const precioBase = 2000; //valor de precio indicado desde el back end
//tengo que definir si el precio es una función o un objeto
//si es un objeto, las propiedades son sala, dia de la semana, hora
//si es una funcion, se calcula en base a la funcion (que ya tiene incorporados los datos de la sala, el día y la hora)
//y, tal vez, en base al asiento elegido

//vamos a poner las funciones como objetos. No sé si usar arrays o no. La idea es ponerle
//a cada funcion un nombre que incluya el dia, la hora y la sala, x ej funcion_2309241900_1
//esto corresponderia a la funcion del dia 24/9/23 a las 19:00 en la sala 1
//a cada funcion le damos un id con los datos que dijimos antes, para poder ubicar después los
//asientos de esa funcion

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
let funciones = new Array();
funciones = [
    new Funcion("2309101900_IND", 1, "2023-09-24", 1900),
    new Funcion("2309101900_IND", 1, "2023-09-24", 2200),
    new Funcion("2309052000_TIT", 0, "2023-09-28", 1315)
];
console.log (funciones);






function mostrarOcupacion(asientosOcupacion) {
    // console.log("Dentro de la función para mostrar asientos");
    let ocupacion = "";
    for (let i = 0; i < asientosOcupacion.length; i++) {
        ocupacion = "Fila " + (i + 1).toString() + " => ";
        console.log(ocupacion+asientosOcupacion[i].join(" "));
        ocupacion = "";
    }
}
//buscamos la funcion, asignamos asientos ocupados
//obtenemos los asientos y mostramos los asientos
for (const funcion of funciones) {
    if (funcion.id === "f_2023-09-242200_1") {
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

        console.log("esta es la disponibilidad de asientos para la pelicula " + peliculaFuncion + " proyectada en la sala " + salas[salaFuncion].nombre + " el día " + diaFuncion + " a las " + horaFuncion);
        break;
    }
}
mostrarOcupacion(asientosParticular);
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
    console.log("las filas con " + entradas + " o más asientos contiguos son: " + filasConAsientosContiguos.join());
}
//chequeando disponibilidad de asientos contiguos
let entradas = parseInt(prompt("¿Cuántas entradas querés comprar?"));
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
    console.log("Las filas con " + entradas + " o más asientos libres son: " + filasConAsientosLibres.join());
    console.log("El total de asientos libres en la sala es: " + totalAsientosLibres);


    asientosContiguos(entradas, asientosParticular);
} else {
    console.log("Esta función no tiene la cantidad de asientos libres solicitada");
    console.log("El total de asientos libres en la sala es: " + totalAsientosLibres);
}
console.log("el precio de las entradas es "+precioFuncion);