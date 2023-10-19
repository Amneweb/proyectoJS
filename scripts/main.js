// **** **** **** DECLARACIONES **** **** **** //
// //////// FUNCTIONS ///////////  //
/**
 *
 * @abstract Permite mostrar las fechas en el formato DD/MM/YYYY
 * @param {number} anio Pasamos año como número
 * @param {number} dia Dia como número, sin 0 adelante cuando es < 10
 * @param {number} mes Mes como número (teniendo en cuenta que enero = 0 y diciembre = 11)
 * @returns fecha formateada con formato local
 * 
 */
const formatearDia = (anio, mes, dia) => new Date(anio, mes, dia).toLocaleDateString();
/**
 * 
 * @abstract Para truncar un string a un máximo de caracteres
 * @param {string} palabra la palabra que eventualmente quiero acortar
 * @param {number} caracteres la cantidad de caracteres máxima
 * @returns la palabra cortada
 * 
 */
const acortarPalabra = (palabra, caracteres) => palabra.length > caracteres ? palabra.substring(0, caracteres) + "..." : palabra;
/**
 *
 * @abstract Para contar asientos en la sala (en un vector de ceros y unos, cuenta la cantidad de ceros) Primero hace un flat de la matriz (la convierte en un vector de 1 sola dimensión) y luego, con reduce, cuenta los 0
 * @param {array} matriz La matriz de 0 y 1 (en este caso es el array con los asientos libres (0) y ocupados (1))
 * @returns cantidad de 0, es decir la cantidad de asientos vacíos en la fila
 * 
 */
const cerosEnMatriz = (matriz) => {
    const vector = matriz.flat();
    const contador = vector.reduce(
        (accumulator, currentValue) => currentValue === 0 ? accumulator + 1 : accumulator,
        0,
    );
    return contador;
}
/**
 *
 * @abstract Calcula el precio de las entradas según la sala y el día de la función
 * @param {number} sala El valor del index del vector salas
 * @param {number} dia
 * @param {number} anio 
 * @param {number} mes Estos 3 parámetros pasan a la función formatearDia
 * @returns precio de la función correspondiente. Se calcula en base a un PRECIOBASE que es una variable global, no se pasa como parámetro
 * 
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
 * 
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
 * 
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
 * @param {array} asientosFuncionElegida Matriz de filas y columnas con ocupación de asientos simulada con la función simularOcupacion
 * @param {Node} platea nodo del DOM al que le agregamos los 'asientos'
 * @returns modifica el DOM, generando una grilla en la que cada checkbox tien un id del tipo f1-c1 (fila 1 - columna 1)
 * 
 */
function dibujarPlatea(asientos, platea) {
    platea.innerHTML = `<div class="pantalla">Pantalla</div>`;
    asientos.forEach((arrayFila, indiceFila) => {
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
 * @param {array} matrizAsientos Corresponde a la matriz de filas y columnas de asientos en una sala.
 * @param {number} entradas Cantidad de entradas a comprar.  
 * @returns un string que muestra todas las filas que tienen la cantidad necesarias de asientos contiguos (es decir, la cantidad de entradas)
 * 
 */
function asientosContiguos(entradas, matrizAsientos) {
    let filasConAsientosContiguos = new Array();
    let contador = 0;
    for (let i = 0; i < matrizAsientos.length; i++) {
        for (let j = 0; j < matrizAsientos[i].length; j++) {
            if (matrizAsientos[i][j] === 0) {
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
 * @param {object} PELIELEGIDA objeto peli con todos los datos de la película elegida en el selector
 * @param {Element} datospeli div a la derecha del selector
 * @returns un DocumentFragment con la tabla que se muestra en las div overlay de la cartelera y en la div roja que aparce a la derecha del selector cuando el usuario elige la peli
 * 
 */
function armarDatosPeli(PELIELEGIDA, datospeli) {
    datospeli.innerHTML = "";
    const FRAGMENTO = new DocumentFragment();
    const TITULOS = [
        "nombre",
        "duración",
        "director",
        "año",
        "actores",
        "género",
        "edad",
        "rating",
        "trama"
    ];
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
    TITULOS.forEach((titulo, llave) => {
        const itemTitulo = document.createElement('div');
        itemTitulo.classList.add("datospeli__item", "datospeli__item--left");
        itemTitulo.textContent = titulo.toUpperCase();
        FRAGMENTO.append(itemTitulo);
        const itemContenido = document.createElement('div');
        itemContenido.classList.add("datospeli__item", "datospeli__item--right");
        itemContenido.textContent = CONTENIDO[llave];
        FRAGMENTO.append(itemContenido);
    });
    return FRAGMENTO;
}
//<div class="snacks__item">
//                <img src="assets/imagenes/popcornYbebida.png" alt="Foto de balde de pochoclo y 2 vasos de bebida">
//               <div class="snacks__item--contenido">
//                   <p class="snacks__p snacks__p--nombre">Pochoclo 'entre dos'</p>
//                  <p class="snacks__p">Balde de pochoclos para compartir, y dos vasos de gaseosa a elección.</p>
//              </div>
//          </div>
function dibujarSnacks(Snack) {
    const FRAGMENTO = new DocumentFragment();
    const snacks__item = document.createElement("div");
    snacks__item.classList.add("snacks__item");
    const snacks__img = document.createElement("img");
    snacks__img.setAttribute("src", `assets/imagenes/${Snack.id}.png`);
    snacks__img.setAttribute("alt", `Foto de ${Snack.nombre}`);
    const snacks__contenido = document.createElement("div");
    snacks__contenido.classList.add("snacks__item--contenido");
    const snacks__p = [];
    snacks__p[0] = document.createElement("p");
    snacks__p[0].classList.add("snacks__p", "snacks__p--nombre");
    snacks__p[0].innerText = `${Snack.nombre}`;
    snacks__p[1] = document.createElement("p");
    snacks__p[1].classList.add("snacks__p");
    snacks__p[1].innerText = `${Snack.descripcion}`;
    snacks__contenido.append(snacks__img);
    snacks__p.forEach((element) => snacks__contenido.append(element));
    snacks__item.append(snacks__contenido);
    FRAGMENTO.append(snacks__item);
    return FRAGMENTO;
}
/**
 * @abstract esta funcion es la que maneja toda la interacción con el usuario, desde la compra de entradas hasta el armado del carrito. Se la invoca desde la función mostrarTodo, una vez que se arma el esqueleto de la sección de venta de entradas
 * 
 */
function armarDOM(peliculaDeCartelera) {
    const selectorPeliculas = document.querySelector("#select__pelicula");
    const datospeli = document.querySelector(".entradas__datospeli");
    const selectorFunciones = document.querySelector("#select__funcion");
    const platea = document.querySelector("#platea");
    const divSelectorFunciones = document.querySelector("#entradas__funcion");
    const inputCantidad = document.querySelector(".entradas__cantidad");
    const imagenpeli = document.querySelector(".entradas__imagen");
    if (!peliculaDeCartelera) {
        console.log("undefined ? "+peliculaDeCartelera)
        selectorPeliculas.innerHTML = `<option class="select--disabled" selected disabled value="">Elegí la película</option>`;
    } else {
        let PELIDECARTELERA = pelis.find((element) => element.id === peliculaDeCartelera);
        console.log(peliculaDeCartelera);
        console.log(PELIDECARTELERA);
        selectorPeliculas.innerHTML = `<option selected value="${peliculaDeCartelera}">${PELIDECARTELERA.nombre}</option>`;
    const changeEvent = new Event("change",{value: peliculaDeCartelera} );
    selectorPeliculas.dispatchEvent(changeEvent);
    generarSelectorFunciones(changeEvent);
} 
    pelis.forEach((elemento) => {
        if (peliculaDeCartelera === elemento.id) {
            console.log("en el lado donde SI hay coincidencia")
            return;
        } else {
        const optionPelicula = document.createElement("option");
        optionPelicula.value = elemento.id;
        optionPelicula.innerText = elemento.nombre;
        selectorPeliculas.appendChild(optionPelicula);
    }
    });
selectorPeliculas.addEventListener("change",generarSelectorFunciones);
function generarSelectorFunciones(event) { //abre el primer input select: peliculas 
        seleccionarPeli = event.target.value;
        const propiedadesFunciones = window.getComputedStyle(divSelectorFunciones);
        if (propiedadesFunciones.display === "none") {
            divSelectorFunciones.style["display"] = "block";
        }

        let PELIELEGIDA = pelis.find((element) => element.id === seleccionarPeli);
        /**
         * 
         * @abstract mostramos la info de la peli seleccionada en un div a la derecha del selector (o abajo si usamos celular)
         * @param {Element} datospeli div roja, a la que le agrego datos de la película usando la función armarDatosPeli
         * @param {Element} imagenpeli div que contiene el poster de la película, que aparece entre datospeli y el selector
         * 
         */

        datospeli.style["background-color"] = "var(--rojo-butaca)";
        datospeli.innerHTML = "";
        datospeli.appendChild(armarDatosPeli(PELIELEGIDA, datospeli));

        imagenpeli.innerHTML = `<img src="assets/imagenes/peliculas/${PELIELEGIDA.id}.jpg" alt="Poster película elegida">`;
        /**
         * 
         * @abstract armamos el selector de funciones en base a PELIELEGIDA
         * @param {string} mostrarNombreCorto el nombre de la película se baja a un máximo de caracteres para mostrarlo como primera opción del select de funciones, que sirve para verificar que las opciones corresponden a la película elegida
         * @param {Element} selectorFunciones lo habíamos inicializado más arriba con un querySelector y corresponde al input select de las funciones
         * @param {Element} funcionesPeliSeleccionada
         * @returns llenamos el input select con todas las funciones correspondientes a PELIELEGIDA
         */
        const mostrarNombreCorto = acortarPalabra(PELIELEGIDA.nombre, 12);
        selectorFunciones.innerHTML = `<option class="select--disabled" selected disabled value="">Elegí la función para la película ${mostrarNombreCorto}</option>`;
        let funcionesPeliSeleccionada = funciones.filter((peliculaId) => peliculaId.pelicula == seleccionarPeli);
        funcionesPeliSeleccionada.forEach((elemento) => {
            optionFuncion = document.createElement("option");
            optionFuncion.value = elemento.id;
            optionFuncion.innerText = "Día " + formatearDia(elemento.anio, elemento.mes, elemento.dia) + " Hora " + elemento.hora;
            selectorFunciones.appendChild(optionFuncion);
        });
        /**
         * 
         * @abstract asignamos evento al select de las funciones. El evento hace que el input de cantidad sea visible. Además se muestra el botón de enviar formulario.
         */
        selectorFunciones.addEventListener("change", (event) => { //abre segundo select: elegir funcion
            const propiedadesPlatea = window.getComputedStyle(platea);
            const propiedadesCantidad = window.getComputedStyle(inputCantidad);
            if (propiedadesCantidad.display === "none") {
                inputCantidad.style["display"] = "block";
            }
            if (propiedadesPlatea.display === "block") {
                platea.style["display"] = "none";
                platea.innerHTML = "";
                datospeli.style["display"] = "block";
            }
        }); //cierra el segundo input select: funcion
    }; //cierra el primer input select: peliculas

    let inputs;
    const formularioSelector = document.querySelector("#selectores");
    formularioSelector.addEventListener("submit", enviarFormularioSelector);

    function enviarFormularioSelector(event) {
        event.preventDefault();


        datospeli.style["display"] = "none";
        imagenpeli.style["display"] = "none";


        let formulario = event.target;
        inputs = formulario.elements;

        const FUNCIONELEGIDA = funciones.find((element) => element.id === inputs[1].value);
        PELIELEGIDA__FORM = inputs[0].value;
        PELIELEGIDA = pelis.find((element) => element.id === PELIELEGIDA__FORM);

        asientosFuncionElegida = simularOcupacion(FUNCIONELEGIDA);

        const totalLibres = cerosEnMatriz(asientosFuncionElegida);

        //script para dibujar la platea y capturar cuando algún asiento es seleccionado
        const entradasRequeridas = parseInt(inputs[2].value);


        if (entradasRequeridas <= totalLibres) {


            const ENTRADAS_RESUMEN = document.querySelector(".entradas__resumen");
            formularioSelector.innerHTML = "";
            totalApagarEntradas = FUNCIONELEGIDA.precio * entradasRequeridas;
            ENTRADAS_RESUMEN.innerHTML = `<h3>resumen de lo solicitado</h3>
        <div class="resumen__datospeli">
            <div class="datospeli__item datospeli__item--left">película </div>
            <div class="datospeli__item datospeli__item--right">${PELIELEGIDA.nombre}</div>
            <div class="datospeli__item datospeli__item--left">duración</div>
            <div class="datospeli__item datospeli__item--right">${PELIELEGIDA.duracion}</div>
            <div class="datospeli__item datospeli__item--left">sala</div>
            <div class="datospeli__item datospeli__item--right">${salas[FUNCIONELEGIDA.sala].nombre}</div>
            <div class="datospeli__item datospeli__item--left">cantidad de entradas</div>
            <div class="datospeli__item datospeli__item--right">${entradasRequeridas}</div>
            <div class="datospeli__item datospeli__item--left">precio unitario</div>
            <div class="datospeli__item datospeli__item--right">${FUNCIONELEGIDA.precio}</div>
            <div class="datospeli__item datospeli__item--left">asientos</div>
            <div class="datospeli__item datospeli__item--right asientos__elegidos">Elegir butacas haciendo click en los asientos libres que se muestran a la derecha.</div>
            <div class="datospeli__item datospeli__item--left">total a pagar</div>
            <div class="datospeli__item datospeli__item--right">${totalApagarEntradas}</div>
        </div>`;

            dibujarPlatea(asientosFuncionElegida, platea);
            platea.style["display"] = "block";
            let COORDENADAS_ASIENTOS = "";
            const MOSTRAR_ASIENTOS = document.querySelector(".asientos__elegidos");
            platea.addEventListener("click", (event) => {
                idSeleccionado = event.target.id;


                function coordenadas(id) {
                    let guion = id.indexOf("-");
                    let nrofila = parseInt(id.slice(1, guion));
                    nrofila++;
                    let nrocolumna = parseInt(id.slice((guion + 2), id.length));
                    nrocolumna++;
                    let coordenadas_asientos = "Fila: " + nrofila + " Butaca: " + nrocolumna;
                    return coordenadas_asientos;
                }
                if (event.target.classList.contains("indeterminado")) {
                    //código de lo que pasa si hago click en asiento indeterminado
                    event.target.checked = false;
                    alert("Ya tenés " + entradasRequeridas + " asientos seleccionados. Para cambiarlos debés liberar uno de los que ya elegiste");
                } else {
                    if (!event.target.classList.contains("elegido")) {
                        //código de lo que pasa si hago click en asiento libre
                        event.target.classList.replace("libre", "elegido");

                        const Elegidos = platea.querySelectorAll('input[type="checkbox"]:checked');
                        let cantidadElegidos = Elegidos.length;

                        if (cantidadElegidos === entradasRequeridas) {
                            const Libres = platea.querySelectorAll(".libre");
                            Libres.forEach((element) => {
                                element.classList.replace("libre", "indeterminado");

                                element.indeterminate = true;
                            });
                            const ElegidosID = [];
                            Elegidos.forEach((elegido, llave) => {
                                COORDENADAS_ASIENTOS += "<p>Asiento " + (llave + 1) + " <i class='fa-solid fa-right-long'></i> " + coordenadas(elegido.id) + "</p>";
                                ElegidosID.push(elegido.id);
                            });
                            MOSTRAR_ASIENTOS.innerHTML = COORDENADAS_ASIENTOS;
                            const objEntradas = new Entrada(FUNCIONELEGIDA.id, ElegidosID, totalApagarEntradas, entradasRequeridas);
                            console.log(objEntradas);
                            //const vintageLS=window.localStorage;
                            //vintageLS.setItem('entradas', JSON.stringify(objEntradas));
                            localStorage.setItem('entradas', JSON.stringify(objEntradas));
                            const vintageLS = localStorage.getItem('entradas');
                            console.log("en JSON " + vintageLS);
                            console.log("corregido " + JSON.parse(vintageLS));
                            const BOTONES = document.createElement("div");
                            BOTONES.id = "botones";
                            BOTON_ACEPTAR = document.createElement("input");
                            BOTON_ACEPTAR.classList.add("boton__aceptar", "boton");
                            BOTON_ACEPTAR.setAttribute("value", "CONFIRMAR");
                            BOTON_ACEPTAR.setAttribute("type", "button");
                            BOTON_CAMBIAR = document.createElement("input");
                            BOTON_CAMBIAR.classList.add("boton__cambiar", "boton");
                            BOTON_CAMBIAR.setAttribute("value", "MODIFICAR");
                            BOTON_CAMBIAR.setAttribute("type", "button");
                            BOTONES.append(BOTON_ACEPTAR);
                            BOTONES.append(BOTON_CAMBIAR);
                            ENTRADAS_RESUMEN.appendChild(BOTONES);
                            BOTON_ACEPTAR.addEventListener("click", () =>{ preguntarSnacks()});
                            BOTON_CAMBIAR.addEventListener("click", ()=>{
                                FLAG_ENTRADAS = 0;
                                borrarTodo();
                            });
                            
                        }
                    } else {
                        //código de lo que pasa si hago click en asiento elegido
                        const Indeterminados = platea.querySelectorAll(".indeterminado");
                        COORDENADAS_ASIENTOS = "";
                        document.querySelector("#botones").remove();
                        MOSTRAR_ASIENTOS.innerText = "Asiento/s liberados. Seleccionar uno o más asientos para llegar a la cantidad de entradas.";
                        event.target.classList.replace("elegido", "libre");
                        Indeterminados.forEach((element) => {
                            element.classList.replace("indeterminado", "libre");
                            element.indeterminate = false;
                        });


                    }
                }
            });
        } else { alert("Lo sentimos, la sala no cuenta con la capacidad de asientos solicitada") }
    }
}

/**
 * @abstract para reiniciar el proceso de selección de películas. Se la llama con el botón modificar una vez que se seleccionó la película.
 * 
 */
function borrarTodo() {
    divEntradas.innerHTML = "";
    mostrarTodo();
}
/**
 * @abstract se usa para verificar si está armado el esqueleto de la sección de venta de entradas. Es por si un usuario ya empezó a elegir películas y sin querer vuelve a apretar el botón de comprar entradas, para que no se le pierdan los datos ingresados
 * 
 */
function verificarFlag(id) {
    if (FLAG_ENTRADAS != 0) { 
        console.log("flag en evento de boton "+FLAG_ENTRADAS);
        alert ("ya estás en un proceso de compra de entradas, si haces click nuevamente se perderán los datos cargados"); return;   
    } else
    { FLAG_ENTRADAS = 1;
        document.querySelector("#section__entradas").scrollIntoView("smooth");
        mostrarTodo(id);
    } 
}
/**
 * @abstract cuando se carga el documento no se ve la sección de compra de entradas. Cuando se hace click en el botón de comprar se arma primero el esqueleto de esa parte y luego la interacción con el usuario desde la function armarDOM(), invocada al final de esta
 */
function mostrarTodo(cartelera_id) {
    divEntradas.innerHTML =
        `<section class="section__titulo section__titulo--entradas">
    <h2><i class="fa-solid fa-ticket"></i>comprá tus entradas</h2>
</section>
<section class="main entradas">
<div class="entradas__izquierda">
    <form action="" id="selectores">
        <div class="entradas__selectores">
            <div class="entradas__select">
            <select name="select__pelicula" id="select__pelicula">
                
            </select>
            </div>
            <div class="entradas__select" id="entradas__funcion">
            <select name="select__funcion" id="select__funcion">
                
            </select>
            </div>
            <div class="entradas__cantidad">
                <input type="number" id="entradas" name="entradas__input" class="select" placeholder="¿Cuántas entradas querés?">
                <input type="submit" value="Enviar" id="boton__entradas" name="entradas__button" class="select">
            </div>
           
        </div>
    </form>
    <div class="entradas__resumen">
            
    </div> 
    </div>
    <div class="entradas__derecha">
    <div class="entradas__imagen"></div>
    <div class="entradas__datospeli">
        
    </div>     
    <div class="platea" id="platea">
        
    </div>
    <div class="carrito"></div>
    </div>`;
    armarDOM(cartelera_id);
}
function preguntarSnacks() {
    const MAS = prompt("¿quieres comprar snacks o solo las entradas?");
    if (MAS=="SI") { 
        document.querySelector("#botones").remove();
        platea.style["display"] = "none";
        const mostrar = mostrarSnacks();
        document.querySelector(".carrito").appendChild(mostrar);}
}

function mostrarSnacks() {
    const FRAGMENTO_SNACKS = new DocumentFragment();
    const CARRITO_SNACKS = document.createElement("div");
    CARRITO_SNACKS.classList.add("carrito_snacks");
    const UL_SNACKS = document.createElement("ul");
    UL_SNACKS.classList.add("ul_snacks");
    snacks.forEach((element)=>{
        let LI_SNACKS = document.createElement("li");
        LI_SNACKS.innerText = element.nombre;
        UL_SNACKS.append(LI_SNACKS);
    });
    CARRITO_SNACKS.append(UL_SNACKS);
    FRAGMENTO_SNACKS.append(CARRITO_SNACKS);
    return FRAGMENTO_SNACKS;
}
// //////// VARIABLES /////////  //
let FLAG_ENTRADAS = 0;
console.log("flag "+FLAG_ENTRADAS);
let asientos = new Array();
let salas = new Array();
let pelis = new Array();
let snacks = new Array();
let carrito = [];
const PRECIOBASE = 3000; //valor de precio indicado desde el backend
let funciones = new Array();

const sectionSnacks = document.querySelector(".snacks");
const divEntradas = document.querySelector("#section__entradas");
const botonEntradas = document.querySelectorAll(".comprar_entradas");
botonEntradas.forEach((element)=>element.addEventListener("click", (event)=> verificarFlag(undefined)));


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

//*********** Snacks */
class Snack {
    constructor(id, nombre, descripcion, calorias, precio) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.calorias = calorias;
        this.precio = precio;
    }
}

snacks = [
    new Snack("sn_001", "Pochoclo 'entre dos'", "Balde de pochoclos para compartir, y dos vasos de gaseosa a elección.", "1500", 2000),
    new Snack("sn_002", "Popcorn Vintage", "Cartón de nuestro exquisito pochoclo Vintage. Puede ser dulce o salado. Simple o bañado en manteca derretida.", "1000", 1200),
    new Snack("sn_003", "Chipá anaranjado", "Bandeja de chipá (pan de queso) para compartir. Trae 10 unidades. Acompañado de 2 vasos de jugo de naranja recién exprimido.", "1800", 2500),
    new Snack("sn_004", "Pancho a la Vintage", "Salchicha de primera calidad en panes esponjosos, con mostaza y ketchup, acompañado de gaseosa a elección.", "2500", 800),
    new Snack("sn_005", "Cereales con naranja", "Dos barras de cereal con chips de chocolate y un vaso de jugo de naranja recién exprimido.", "1500", 800),
    new Snack("sn_006", "Ignacio's Cheddar", "Bandeja de nachos con mucho cheddar para untar. Acompañada de un vaso de gaseosa a elección.", "2200", 3000),
    new Snack("sn_007", "Frutas saludables", "Ensalada de fruta recién hecha, con todas las frutas que te imaginás, y más.", "2200", 500)
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

class Entrada {
    constructor(funcion, asientos, total, cantidad) {
        this.funcion = funcion;
        this.asientos = asientos;
        this.total = total;
        this.cantidad = cantidad;
    }
}
// **** **** **** FIN DECLARACIONES **** **** **** /////////////////////

// ************* Armado del DOM  ****************************************//
/** 
 * 
* @abstract Con el código que sigue armamos el overlay de las películas en cartelera y las 'options' del selector de películas
 * @param {Element} selectorPeliculas input en div entradas__selects con las opciones de películas en cartelera para elegir
 * @param {Element} peliculaEnCartelera div dentro de contenedor__peliculas, que va a contener la imagen de las películas y el overlay
 * 
*/

pelis.forEach((elemento) => {
    /** 
     * 1era parte: armamos la cartelera
     */
    const peliculaEnCartelera = document.createElement("div");
    peliculaEnCartelera.className = "cartelera__div--imagen";
    const poster = document.createElement("img");
    poster.src = `assets/imagenes/peliculas/${elemento.id}.jpg`;
    poster.className = "cartelera__img";
    peliculaEnCartelera.append(poster);
    const overlay = document.createElement("div");
    overlay.className = "cartelera__div--overlay";
    const texto = document.createElement("div");
    texto.className = "cartelera__datospeli";
    texto.append(armarDatosPeli(elemento, texto));
    overlay.append(texto);
    const botonCartelera = document.createElement("div");
    botonCartelera.className = "cartelera__boton";
    botonCartelera.id=elemento.id;
    botonCartelera.innerText = "elegir";
    //botonCartelera.style.cursor="pointer";
    overlay.append(botonCartelera);
    peliculaEnCartelera.append(overlay);
    document.querySelector(".cartelera__contenedor").appendChild(peliculaEnCartelera);
    botonCartelera.addEventListener("click",(event)=> verificarFlag(event.target.id) );
});

/** 
 * 
 * @abstract Armamos el carousel de snacks
 * @param {Array} snacks array de objetos
 * 
*/
snacks.forEach((element) => sectionSnacks.appendChild(dibujarSnacks(element)));

// *************     Empieza la interacción con el usuario  **********************//
/**
 * 
 * @abstract primer interacción con el usuario, se elige la película. Una vez elegida la película empieza a armarse el DOM dinámicamente
 * @param {Element} selectorFunciones  input para elegir funciones, que al comienzo está escondido
 * @param {Element} selectorPeliculas input para elegir películas, con el evento change evalúa la visibilidad del selector de funciones y si está oculto lo muestra, y lo llena de options en función del id de la película elegida. También se muestra la info de la película en una div a la derecha (o abajo en el caso de celular)
 * @param {Element} platea div preparada para contener a los checkboxes que representarán a los asientos. Si estaba tenía display block, hay que ponerle none y volver a abrirla, para que cambie los asientos cuando cambia la película
 * @param {Element} PELIELEGIDA objeto peli de la película elegida con el selector
 * 
 */
/** 
     * 2da parte: armamos el selector
     */



