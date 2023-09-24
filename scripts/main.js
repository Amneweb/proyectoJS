// **** **** **** DECLARACIONES **** **** **** //
// //////// FUNCTIONS ///////////  //
/**
 *
 * @abstract Permite mostrar las fechas en el formato DD/MM/YYYY
 * @param {number} anio Pasamos año como número
 * @param {number} dia Dia como número, sin 0 adelante cuando es < 10
 * @param {number} mes Mes como número (teniendo en cuenta que enero = 0 y diciembre = 11)
 * @returns fecha formateada con formato local
 */
const formatearDia = (anio, mes, dia) => new Date(anio, mes, dia).toLocaleDateString();
/**
 *
 * @abstract Para contar asientos libres en cada fila de la sala de cine (en un vector de ceros y unos, cuenta la cantidad de ceros) Esta misma función se puede usar para contar la cantidad de lugares en que un valor determinado aparece en un vector
 * @param {array} vector El array de 0 y 1 (en este caso es el array con los asientos libres (0) y ocupados (1))
 * @returns cantidad de 0 en el vector. En este caso representa la cantidad de asientos vacíos en la fila
 */
const contadorCeros = (vector) =>
    vector.reduce(
        (accumulator, currentValue) => currentValue === 0 ? accumulator + 1 : accumulator,
        0,
    );
/**
 *
 * @abstract Calcula el precio de las entradas según la sala y el día de la función
 * @param {number} sala El valor del index del vector salas
 * @param {number} dia
 * @param {number} anio 
 * @param {number} mes Estos 3 parámetros pasan a la función formatearDia
 * @returns precio de la función correspondiente. Se calcula en base a un PRECIOBASE que es una variable global, no se pasa como parámetro
 */
function calcularPrecio(sala, dia, mes, anio) {
    let precio;
    switch (sala) {
        case 0:
            precio = PRECIOBASE * 1.2;
            break;
        case 1:
            precio = PRECIOBASE;
            break;
        case 2:
            precio = PRECIOBASE * 0.8;
    }
    switch (() => new Date(anio, mes, dia).getDay()) {
        case 6: //sábado
            precio = parseInt(precio * 1.1);
            break;
        case 3: //miercoles
            precio = parseInt(precio * 0.5);
            break;
        default:
            precio = parseInt(precio);
    }
    return precio;
}
/**
 *
 * @abstract Para los asientos armo una matriz de filas y columnas, donde cada asiento ocupado tiene el valor 1 y el libre el valor 0. Cada vez que se genera una función, se inicializa la matriz con todos valores 0, porque todos los asientos están desocupados. Cuando un usuario compra entradas, el vector de asientos se modifica y los lugares elegidos pasan a tener valor 1.
 * @param {number} sala El valor del index del vector salas. A partir de ahí se busca en el vector salas el valor de las filas y columnas de la sala correspondiente
 * @returns array con valores 0
 */
function inicializarAsientos(sala) {
    const filasSala = salas[sala].filas;
    const columnasSala = salas[sala].columnas;
    asientos = new Array(filasSala).fill().map(() => new Array(columnasSala).fill(0));
    return asientos;
}
/**
 *
 * @abstract funcion para mostrar la matriz de asientos en pantalla (después servirá para ubicar los checkboxes en la grilla y mostrar el plano de la sala)
 * @param {array} matriz Corresponde a la matriz de filas y columnas de asientos en una sala. Lo primero que se hace es mapear el array de filas y se lo transforma en otro que contiene cada fila formateada (en cada fila, los elementos del array 'element' se unen entre sí con un join). Luego se hace el join de todas las filas y lo que separa cada elemento del join en este caso es un salto de línea.
 * @returns un string con los elementos de la matriz de asientos formateados
 */
const ocupacion =(matriz)=> matriz.map((element, i) => ("Fila "+(i + 1) + " => [ " + element.join(" ] [ ")+" ]")).join('\n');
/**
 *
 * @abstract funcion para contar la cantidad de asientos libres CONTIGUOS. Eso después se compara con la cantidad de entradas a comprar y se muestra qué filas tienen asientos contiguos libres (no sé si esta función va a usarse en el proyecto final, pero por las dudas no la borro). Acá no puedo usar la función de contarCeros porque esa función (usando .reduce) recorre todo el array antes de decirme el total y en este caso paro de contar cuando llego a asientos = entradas. 
 * @param {array} asientosParticular Corresponde a la matriz de filas y columnas de asientos en una sala.
 * @param {number} entradas Cantidad de entradas a comprar.  
 * @returns un string que muestra todas las filas que tienen la cantidad necesarias de asientos contiguos (es decir, la cantidad de entradas)
 */
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
    return alertaFilas = "las filas con " + entradas + " o más asientos libres contiguos son: " + filasConAsientosContiguos.join();
}
/**
 *
 * @abstract para verificar si el valor introducido por el usuario en el prompt está dentro de las opciones mostradas. Si no lo está, se vuelve a mostrar el prompt pidiendo un nuevo valor. Se otorgan un total de 3 intentos, pasados los cuales se aborta el proceso. Creo que sólo se va a usar en esta entrega, en la que el usuario tiene que ingresar un número en el prompt. En el proyecto final habrá un select y el usuario sólo podrá ingresar un valor entre las opciones del select.
 * @param {number} iterador Valor máximo que se puede elegir
 * @param {string} listaX Mensaje en el alerta, con el listado de películas o funciones
 * @returns un array(2) con el valor ingresado y un booleano para saber si hay que abortar o seguir
 */
function errorHandler(iterador, listaX, item) {
    let continuar = true;
    let devolucion = new Array();
    for (let i = 1; i < 3; i++) {
        seleccionarX = prompt("Lo sentimos, ingresaste el número incorrecto. Volvé a intentarlo o ingresá NO.\nTe quedan " + (3 - i) + " intentos.\n" + listaX + "\n¿qué " + item + " elegís?\nIngresá el número correspondiente.");
        if ((parseInt(seleccionarX) >= 1) && (parseInt(seleccionarX) <= iterador)) {
            break;

        } else {
            if ((seleccionarX.trim().toUpperCase() === "NO")) {
                alert("¡Qué pena que te quieras ir!! ¡Nos vemos la próxima!");
                continuar = false;
                break;
            } else if (i === 2) {
                alert("Lo sentimos, ya lo intentaste demasiadas veces");
                continuar = false;
                break;
            }
        }
    }
    devolucion = [seleccionarX, continuar];
    return devolucion;
}


// //////// VARIABLES /////////  //
let asientos = new Array();
const salas = new Array();
let pelis = new Array();
const PRECIOBASE = 3000; //valor de precio indicado desde el back end
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
    constructor(pelicula, sala, dia, mes, anio, hora) {
        this.id = "f_" + anio + (mes + 1) + hora + "_" + sala;
        this.pelicula = pelicula;
        this.sala = sala;
        this.dia = dia;
        this.mes = mes;
        this.anio = anio;
        this.hora = hora;
        this.asientosFuncion = inicializarAsientos(sala);
        this.precio = calcularPrecio(sala, dia, mes, anio);
    }
}

funciones = [
    new Funcion("2309101900_IND", 1, 24, 9, 2023, 1900),
    new Funcion("2309101900_IND", 1, 24, 9, 2023, 2200),
    new Funcion("2309052000_TIT", 0, 28, 9, 2023, 1315),
    new Funcion("2309101900_IND", 1, 25, 9, 2023, 1900),
    new Funcion("2309101900_IND", 1, 25, 9, 2023, 2200),
    new Funcion("2309101900_IND", 1, 26, 9, 2023, 2200),
    new Funcion("2309101900_IND", 1, 27, 9, 2023, 1500),
    new Funcion("2309101900_IND", 1, 27, 9, 2023, 1800),
    new Funcion("2309052000_TIT", 0, 28, 9, 2023, 1615),
    new Funcion("2309052000_TIT", 0, 5, 10, 2023, 1315),
    new Funcion("2309052000_TIT", 0, 6, 10, 2023, 1315),
    new Funcion("2309101904_VOL", 0, 21, 9, 2023, 1315),
    new Funcion("2309101904_VOL", 0, 21, 9, 2023, 1620),
    new Funcion("2309101904_VOL", 0, 21, 9, 2023, 1830),
    new Funcion("2309040102_AFR", 0, 23, 9, 2023, 1830),
    new Funcion("2309101901_TOY", 2, 23, 9, 2023, 1830)
];

// **** **** **** FIN DECLARACIONES **** **** **** /////////////////////

// *************     Empieza la interacción con el usuario   **********************//
function ejecutar() {
//generamos la lista de películas para mostrar al usuario
    let listaPelis = pelis.map((element, i) => (i + 1 + " => " + element.nombre)).join('\n');
//mostramos la lista de películas y pedimos que se elija una
    let seleccionarPeli = prompt(listaPelis + "\n¿qué película querés ver?\nIngresá el número correspondiente.");
//verificamos que el valor ingresado esté dentro del rango correcto. Si no lo es, corremos la función de verificación
    if ((parseInt(seleccionarPeli) > (pelis.length)) || (parseInt(seleccionarPeli) < 1) || (seleccionarPeli == null) || (seleccionarPeli == "")) {
        devolucion = errorHandler(pelis.length, listaPelis, "película");
        seleccionarPeli = devolucion[0];
        continuar = devolucion[1];
        if (!continuar) { return; }
    }
    peliSeleccionada = pelis[parseInt(seleccionarPeli) - 1].id;
//filtra el array de funciones en base a la película seleccionada
    let funcionesPeliSeleccionada = funciones.filter((peliculaId) => peliculaId.pelicula == peliSeleccionada);
//generamos un string con la lista de funciones para la película elegida
    let listaFunciones = funcionesPeliSeleccionada.map((element, i) => (i + 1 + " => Día" + formatearDia(element.anio, element.mes, element.dia) + " Hora " + element.hora)).join('\n');
//mostramos la lista de funciones y pedimos que se ingrese un valor
    let seleccionarFuncion = prompt("Esta es la lista de funciones para la película elegida \n" + listaFunciones + "\n¿Cuál elegís?");
    //verificamos que el valor ingresado sea el correcto. Si no lo es llamamos a errorHandler
    if ((parseInt(seleccionarFuncion) > (funcionesPeliSeleccionada.length)) || (parseInt(seleccionarFuncion) < 1) || (seleccionarFuncion == null) || (seleccionarFuncion == "")) {
        devolucion = errorHandler(funcionesPeliSeleccionada.length, listaFunciones, "función");
        seleccionarFuncion = devolucion[0];
        let continuar = devolucion[1];
        if (!continuar) { return; }
    }

    let funcionSeleccionada = funcionesPeliSeleccionada[parseInt(seleccionarFuncion) - 1].id;

    //buscamos la funcion, asignamos asientos ocupados aleatoriamente, obtenemos los asientos y los mostramos
    const funcion = funciones.find((element)=>element.id===funcionSeleccionada);
    console.log (funcion);
            filasFuncion = salas[funcion.sala].filas;
            columnasFuncion = salas[funcion.sala].columnas;
    //generamos ocupacion aleatoria con random para simular reservas anteriores. Los asientos con 0 están libres
            for (let x = 0; x < filasFuncion; x++) {
                for (let y = 0; y < columnasFuncion; y++) {
                    funcion.asientosFuncion[x][y] = Math.round(Math.random());
                }
            }

            asientosParticular = funcion.asientosFuncion;
            peliculaFuncion = funcion.pelicula;
            diaFuncion = formatearDia(funcion.anio, funcion.mes, funcion.dia);
            horaFuncion = funcion.hora;
            salaFuncion = funcion.sala;
            precioFuncion = funcion.precio;
            for (const peli of pelis) {
                if (peli.id == funcion.pelicula) {
                    peliculaFuncion = peli.nombre;
                    break;
                }
            }

            alert("ESTO ES SOLO UN EJEMPLO PARA VERIFICAR EL FUNCIONAMIENTO. \nEsta es la disponibilidad de asientos para la pelicula " + peliculaFuncion + " proyectada en la sala " + salas[salaFuncion].nombre + " el día " + diaFuncion + " a las " + horaFuncion + "\n Tené en cuenta que el 0 indica asiento vacío y el 1 asiento ocupado." + "\n" + ocupacion(asientosParticular));

    //pedimos la cantidad de entradas
    let entradas = parseInt(prompt("¿Cuántas entradas querés comprar?"));
    //contamos asientos libres para saber si alcanzan
    let counter = new Array;
    let totalAsientosLibres = 0;
    for (let x = 0; x < asientosParticular.length; x++) {
        counter[x] = contadorCeros(asientosParticular[x]);
        totalAsientosLibres = totalAsientosLibres + counter[x];
    }
    if (totalAsientosLibres < entradas) {
        let i = 0;
        while ((entradas > totalAsientosLibres) && (i < 3)) {
            entradas = prompt("Esta función no tiene la cantidad de asientos libres solicitada \nEl total de asientos libres en la sala es: " + totalAsientosLibres + "\nSi querés comprar menos entradas, ingresá la cantidad. Tenés " + (3 - i) + " intentos restantes. Si querés salir de la compra, escribí NO");
            if ((entradas.trim().toUpperCase() === "NO")) {
                alert("¡Qué pena que te quieras ir!! ¡Nos vemos la próxima!");
                return;
            } else { entradas = parseInt(entradas); i++; }
        }
        if (i >= 3) {
            alert("Lo sentimos, ya superaste el máximo de intentos. Nos vemos la próxima.");
            return;
        }
    }
    //generamos un array con los números de las filas que tienen asientos libres (por ahora no se usa)
    let filasConAsientosLibres = new Array();
    counter.forEach((element, index) => { if (element >= entradas) { filasConAsientosLibres.push(index + 1); } });

    // en el caso que la cantidad de entradas sea menor que la cantidad de asientos por fila, mostramos las filas que tienen los asientos contiguos necesarios. Si la cantidad de entradas es mayor, no lo mostramos y en el resumen final no aparecerá ninguna fila. En el caso real el usuario elegirá asiento por asiento y la elección de fila no será necesaria.
    if (entradas <= columnasFuncion) {
        elegirFilas = prompt(asientosContiguos(entradas, asientosParticular) + "\n ¿Qué fila elegís?\n(Por ahora, esto sólo muestra la info. Si luego el usuario ingresa cualquier otro número, no se hace ninguna validación)");
        //verificando que número ingresado sea correcto
        if ((parseInt(elegirFilas) > (asientosParticular.length)) || (parseInt(elegirFilas) < 1) || (elegirFilas == null) || (elegirFilas == "")) {
            devolucion = errorHandler(asientosParticular.length, "", "fila");
            elegirFilas = devolucion[0];
            continuar = devolucion[1];
            if (!continuar) { return; }
        } //fin verificacion
    } else { elegirFilas = "varias"; }

    alert("Resumen de tu compra:\n" + "Película => " + peliculaFuncion + "\n Proyectada en la sala => " + salas[salaFuncion].nombre + "\n Día => " + diaFuncion + "\n Hora => " + horaFuncion + "\n Fila => " + elegirFilas + "\n Cantidad de entradas => " + entradas + "\n TOTAL A PAGAR => " + "$" + (entradas * precioFuncion));

}