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
 * @abstract Para los asientos armo una matriz de filas y columnas, donde cada asiento ocupado tiene el valor 1 y el libre el valor 0. Cada vez que se genera una función (esto se haría en el backend), se inicializa la matriz con todos valores 0, porque todos los asientos están desocupados. Cuando un usuario compra entradas, el vector de asientos se modifica y los lugares elegidos pasan a tener valor 1. Esta función genera esa matriz con todos los asientos en 0.
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
 * @abstract Esta función se usa sólo para este simulador. En la vida real no se usaría. Lo que hace es asignarles valores 0 y 1 aleatoriamente a los asientos de la sala según la función elegida
 * @param {number} funcion El valor del index del vector funcion. A partir de ahí se busca en el vector salas el valor de las filas y columnas de la sala correspondiente
 * @var filasFuncion Cantidad de filas en la sala de la funcion correspondiente
 * @var columnasFuncion Cantidad de asientos por fila en la sala de la funcion correspondiente
 * @returns matriz con valores 0 y 1
 */
function simularOcupacion(funcion) {
    const filasFuncion = salas[funcion.sala].filas; 
const columnasFuncion = salas[funcion.sala].columnas;
    asientos = new Array(filasFuncion).fill().map(() => new Array(columnasFuncion).fill().map(() => Math.round(Math.random())));
    return asientos;
}
/**
 *
 * @abstract Agrega un esquema de la platea al dom, para que el usuario elija el asiento. Cada asiento se representa con un círculo, que en realidad es un checkbox. Los círculos rojos representan asientos ocupados, son checkboxes en estado disabled y tienen clase "ocupado". Los asientos libres son blancos y tienen clase "libre".
 * @param {array} asientosParticular Matriz de filas y columnas con ocupación de asientos simulada con la función simularOcupacion
 * @param {Node} platea nodo del DOM al que le agregamos los 'asientos'
 * @returns modifica el DOM, generando una grilla en la que cada checkbox tien un id del tipo f1-c1 (fila 1 - columna 1)
 */
function dibujarPlatea(asientosParticular, platea) {
    asientosParticular.forEach((arrayFila, indiceFila) => {
        const fila = document.createElement("div");
        fila.className = "fila";
        fila.id = `fila${indiceFila + 1}`;
        arrayFila.forEach((valor, indiceColumna) => {
            const lugar = document.createElement("input");
            lugar.type = "checkbox";
            lugar.className = "asiento";
            lugar.id = `f${indiceFila}-c${indiceColumna}`;
            if (valor === 1) {
                lugar.disabled = true;
                lugar.className = "asiento ocupado";
            } else {
                lugar.className = "asiento libre";
            }
            fila.appendChild(lugar);
        });
        platea.appendChild(fila);

    });
}
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
// //////// VARIABLES /////////  //
let asientos = new Array();
const salas = new Array();
let pelis = new Array();
const PRECIOBASE = 3000; //valor de precio indicado desde el backend
let funciones = new Array();

// //////// OBJETOS ///////////  //
//*********** Salas */
class Sala {
    constructor(nombre, filas, columnas, descripcion) {
        this.nombre = nombre;
        this.filas = filas;
        this.columnas = columnas;
        this.capacidad = filas * columnas;
        this.descripcion = descripcion;
    }
}

salas[0] = new Sala("Premium", 15, 10, "Nuestra sala VIP, cuenta con butacas reclinables con botones eléctricos para que cada expectador elija su posición ideal y así disfrute de su película preferida como si estuviera en primera clase de un viaje en avión. Además, menos cantidad de butacas y más espacio entre las mismas otorgan mayor privacidad, y cada butaca cuenta con bandeja para los snacks. NO está permitido el ingreso de menores de 12 años.");
salas[1] = new Sala("Clásica", 25, 10, "Sin escatimar en confort, esta sala tiene mayor capacidad que la Premium, butacas ultra cómodas con espacio posavasos. Está pensada para los usuarios que no quieren gastar tanto como en la sala Premium pero quieren asegurarse de pasar un momento de tranquilidad, sin interrupciones. Ofrecemos tanto películas ATP como las no aptas para menores de 18.");
salas[2] = new Sala("Infantil", 25, 15, "La sala más económica, con butacas confortables pero clásicas, en ella proyectamos mayormente películas para el público infantil. Si sos de aquellas personas que no quieren interrupciones, te aconsejamos las salas Clásica o Premium. Las butacas poseen espacio posavasos, pero están más juntas unas de otras.");

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
    new Pelicula("2309040102_AFR", "Africa mía", 1985, "Robert Redford, Maryl Streep", "Romance, Drama, Biografía", "GP-13", "Sydney Pollack", "En la Kenia colonial del siglo XX, una baronesa danesa, propietaria de una plantación, mantiene una apasionada relación amorosa con un cazador de espíritu libre.", "2h 41m", 7.1),
    new Pelicula("2310020824_KAR", "Karate Kid", 1984, "Ralph Macchio, Pat Morita", "Acción, Drama, Familiar", "ATP", "John G. Avildsen", "Un maestro de artes marciales acepta instruir a un adolescente acosado.", "2h 6m", 7.5)
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

//----- script para mostrar las películas en cartelera y agregarlas también al select en la compra

const selectorPeliculas = document.querySelector("#select__pelicula");
pelis.forEach((elemento) => {
 const   peliculaEnCartelera = document.createElement("div");
    peliculaEnCartelera.className = "cartelera__div--imagen";
    peliculaEnCartelera.innerHTML = `<img class="cartelera__img" src="assets/imagenes/peliculas/${elemento.id}.jpg"
    alt="Póster de ${elemento.nombre}">
    <div class="cartelera__div--overlay">
                    <div class="text">
                        <p class="text--item text--item--left">Título</p>
                        <p class="text--item">${elemento.nombre}</p>
                        <p class="text--item text--item--left">Duración</p>
                        <p class="text--item">${elemento.duracion}</p>
                        <p class="text--item text--item--left">Director</p>
                        <p class="text--item">${elemento.director}</p>
                        <p class="text--item text--item--left">Actores</p>
                        <p class="text--item">${elemento.actor}</p>
                        <p class="text--item text--item--left">Género</p>
                        <p class="text--item">${elemento.genero}</p>
                        <p class="text--item text--item--left">Edad</p>
                        <p class="text--item">${elemento.edad}</p>
                        <p class="text--item text--item--left">Rating</p>
                        <p class="text--item">${elemento.rating}</p>
                        <p class="text--item text--item--left">Trama</p>
                        <p class="text--item text--item--trama">${elemento.resumen}</p>    
                    </div>
                    <div class="cartelera__boton">elegir</div>
                </div>
    `;
    document.querySelector(".cartelera__contenedor").appendChild(peliculaEnCartelera);
    //------- llenar los select para comprar entradas
  const  optionPelicula = document.createElement("option");
    optionPelicula.value = elemento.id;
    optionPelicula.innerText = elemento.nombre;
    selectorPeliculas.appendChild(optionPelicula);
});
//----- fin películas en cartelera y selector de peliculas




//----llenamos el selector de funciones
const selectorFunciones = document.getElementById("select__funcion");
selectorPeliculas.addEventListener("change", (event) => {
    seleccionarPeli = event.target.value;
    const PROPIEDADES = window.getComputedStyle(selectorFunciones);
    if (PROPIEDADES.display === "none") { selectorFunciones.style["display"] = "block"; }
    console.log(PROPIEDADES.display);
    //guardamos el objeto de la pelicula elegida con todos sus datos en una constante
    const PELIELEGIDA = pelis.find((element) => element.id === seleccionarPeli);

//----- mostramos la info de la peli seleccionada a la derecha del selector
const datospeli = document.querySelector(".entradas__datospeli");
datospeli.innerHTML="";
console.log (datospeli);
function armarDatosPeli (PELIELEGIDA) {
    datospeli.innerHTML="";
    console.log("adentro de funcion armar datos peli");
    const FRAGMENTO = new DocumentFragment();
    const TITULOS = ["nombre","duración","director","año","actores","género","edad","rating","trama"];
    const CONTENIDO = [
        PELIELEGIDA.nombre,
        PELIELEGIDA.duracion,
        PELIELEGIDA.director,
        PELIELEGIDA.anio,
        PELIELEGIDA.actor,
        PELIELEGIDA.genero,
        PELIELEGIDA.edad,
        PELIELEGIDA.rating,
        PELIELEGIDA.resumen
    ]
    TITULOS.forEach((titulo,llave)=>{
        const itemTitulo = document.createElement('div');
        itemTitulo.className="datospeli datospeli__item datospeli__item--left";
        itemTitulo.textContent = titulo.toUpperCase();
FRAGMENTO.append(itemTitulo);
const itemContenido = document.createElement('div');
itemContenido.className="datospeli datospeli__item datospeli__item--right";
        itemContenido.textContent = CONTENIDO[llave];
        FRAGMENTO.append(itemContenido);      
    });
    return FRAGMENTO;
}
//const infopeli=armarDatosPeli(PELIELEGIDA);
//console.log("infopeli"+infopeli);
datospeli.appendChild(armarDatosPeli(PELIELEGIDA));
    
    //filtra el array de funciones en base a la película seleccionada
    //agregamos la primer opcion que es disabled pero muestra la peli elegida - para asegurarnos de que el programa pasó la info correcta
    selectorFunciones.innerHTML = `<option class="select--disabled" selected disabled value="">Elgí la función para la película ${PELIELEGIDA.nombre}</option>`;
    let funcionesPeliSeleccionada = funciones.filter((peliculaId) => peliculaId.pelicula == seleccionarPeli);

    //generamos un nuevo option por cada función
    funcionesPeliSeleccionada.forEach((elemento) => {
        optionFuncion = document.createElement("option");
        optionFuncion.value = elemento.id;
        optionFuncion.innerText = "Día " + formatearDia(elemento.anio, elemento.mes, elemento.dia) + " Hora " + elemento.hora;
        selectorFunciones.appendChild(optionFuncion);
    });
});
let seleccionarFuncion;
selectorFunciones.addEventListener("change", (event) => {
    seleccionarFuncion = event.target.value;
    console.log(event.target.value);
});
//console.log('funcion seleccionada' + seleccionarFuncion);
//buscamos la funcion, asignamos asientos ocupados aleatoriamente, obtenemos los asientos y los mostramos
//suponemos que la funcion es f_2023101830_2 - toy story 23/10 1830
funcionSeleccionada = "f_2023101830_2";
const funcion = funciones.find((element) => element.id === funcionSeleccionada);
console.log(funcion);
filasFuncion = salas[funcion.sala].filas;
columnasFuncion = salas[funcion.sala].columnas;


asientosParticular=simularOcupacion(funcion);
//asientosParticular = funcion.asientosFuncion;
console.log(asientosParticular);





//script para capturar cuando algún asiento es seleccionado

const entradasPrueba=2;
 const platea = document.getElementById("platea");
 dibujarPlatea(asientosParticular,platea);
platea.addEventListener("click", (event) => {
    idSeleccionado = event.target.id;
    if (event.target.classList.contains("indeterminado")) {
        //código de lo que pasa si hago click en asiento indeterminado
        event.target.checked = false;
        alert("Ya tenés " + entradasPrueba + " asientos seleccionados. Para cambiarlos debés liberar uno de los que ya elegiste");
    } else {
if (!event.target.classList.contains("elegido")) {
//código de lo que pasa si hago click en asiento libre
        event.target.classList.replace("libre", "elegido");

        const Elegidos = platea.querySelectorAll('input[type="checkbox"]:checked');
        let cantidadElegidos = Elegidos.length;
        //let Libres=platea.querySelectorAll(".libre");
        //   console.log(Libres);
        //alert(cantidadElegidos);
        if (cantidadElegidos === entradasPrueba) {
            const Libres = platea.querySelectorAll(".libre");
            console.log(Libres);
            Libres.forEach((element) => {
                element.classList.replace("libre", "indeterminado");
                //element.disabled=true;
                element.indeterminate = true;
            });
        }
    } else {
        //código de lo que pasa si hago click en asiento elegido
        const Indeterminados = platea.querySelectorAll(".indeterminado");
        alert ("asiento liberado :)");
        event.target.classList.replace("elegido", "libre");
        Indeterminados.forEach((element) => {
            element.classList.replace("indeterminado", "libre");
            //element.disabled=true;
            element.indeterminate = false;
        });


    }
    }
});


//////// CODIGO ANTERIOR
function ejecutarAnterior() {
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
    const funcion = funciones.find((element) => element.id === funcionSeleccionada);
    console.log(funcion);
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



