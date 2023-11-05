// **** **** **** DECLARACIONES **** **** **** //
// //////// FUNCTIONS ///////////  //
/**
 * 
 * @abstract para mostrar los precios con un formato de currency
 */
const currency = (valor) => valor.toLocaleString('es-ar', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
});

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
 * @abstract Para contar asientos libres en la sala (en un vector de ceros y unos, cuenta la cantidad de ceros) Primero hace un flat de la matriz (la convierte en un vector de 1 sola dimensión) y luego, con reduce, cuenta los 0
 * @param {array} matriz La matriz de 0 y 1 (en este caso es el array con los asientos libres (0) y ocupados (1))
 * @returns cantidad de 0, es decir la cantidad de asientos vacíos en la matriz
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
 * @abstract Agrega un esquema de la platea al dom, para que el usuario elija el asiento. Cada asiento se representa con un círculo, que en realidad es un checkbox. Los círculos grises representan asientos ocupados, son checkboxes en estado disabled y tienen clase "ocupado". Los asientos libres tienen clase "libre".
 * @param {array} asientosFuncionElegida Matriz de filas y columnas con ocupación de asientos simulada con la función simularOcupacion
 * @param {Node} DOMplatea nodo del DOM al que le agregamos los 'asientos'
 * @returns modifica el DOM, generando una grilla en la que cada checkbox tien un id del tipo f1-c1 (fila 1 - columna 1)
 * 
 */
function dibujarPlatea(asientos) {
    const FRAGMENTO = new DocumentFragment();
    const pantalla = document.createElement("div");
    pantalla.classList.add("pantalla");
    pantalla.innerText = "Pantalla";
    FRAGMENTO.append(pantalla);
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
        FRAGMENTO.append(fila);
    });
    return FRAGMENTO;
}
/**
 * 
 * @abstract dibujar las div con info de la película, puede ser en la sección cartelera o cuando se compran entradas
 * @param {object} PELIELEGIDA objeto peli con todos los datos de la película elegida en el input selector de funciones
 * @param {Element} DOMdatospeli div a la derecha del selector
 * @returns un DocumentFragment con la tabla que se muestra en las div overlay de la cartelera y en la div roja que aparce a la derecha del selector cuando el usuario elige la peli
 * 
 */
function armarDatosPeli(PELIELEGIDA) {
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
/**
 * 
 * @abstract dibujar la div de snacks en la página
 * @returns un DocumentFragment con las cards de los snacks
 * 
 */
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
 * 
 * @abstract dibujar la div de snacks en la sección de compra de entradas, una vez elegidas la película y los asientos
 * @returns un DocumentFragment con las cards de los snacks
 * 
 */
function dibujarSnacksEnEntradas(Snack) {
    const FRAGMENTO = new DocumentFragment();
    const snacks__item = document.createElement("div");
    snacks__item.classList.add("snacks__item");
    const snacks__img = document.createElement("img");
    snacks__img.setAttribute("src", `assets/imagenes/${Snack.id}.png`);
    snacks__img.setAttribute("alt", `Foto de ${Snack.nombre}`);
    const snacks__contenido = document.createElement("div");
    snacks__contenido.classList.add("snacks__item--contenido");
    const snacks__p = document.createElement("p");
    snacks__p.classList.add("snacks__titulo");
    snacks__p.innerText = `${Snack.nombre}`;
    const snacks__precio = document.createElement("p");
    snacks__precio.classList.add("snacks__precio");
    snacks__precio.innerText = `${currency(Snack.precio)}`;
    const snacks__input = document.createElement("input");
    snacks__input.classList.add("snacks__input");
    snacks__input.setAttribute("id", Snack.id);
    snacks__input.setAttribute("value", "Elegir");
    snacks__input.setAttribute("type", "button");
    snacks__contenido.append(snacks__img);
    snacks__contenido.append(snacks__p);
    snacks__contenido.append(snacks__precio);
    snacks__contenido.append(snacks__input);
    snacks__item.append(snacks__contenido);
    FRAGMENTO.append(snacks__item);
    return FRAGMENTO;
}

/**
 * 
 * @abstract dibuja el input select de las películas. Si el proceso se inicia desde el botón en el menú o desde cualquier botón general, el selector muestra "elegí la película". Si el proceso se inicia desde la cartelera (posters con overlays), el selector ya muestra la película elegida.
 * 
 */
function dibujarSelectorPeliculas(id = "") {
    const FRAGMENTO = new DocumentFragment();
    let pelisReordenadas;
    if (id == "") {
        pelisReordenadas = pelis;
        const optionInicial = document.createElement("option");
        optionInicial.value = "";
        optionInicial.classList.add("select--disabled");
        optionInicial.setAttribute("disabled", "disabled");
        optionInicial.setAttribute("selected", "selected");
        optionInicial.innerHTML = "Elegí la película";
        FRAGMENTO.appendChild(optionInicial);
    } else {
        pelisReordenadas = reordenarPelis(id);
    };

    pelisReordenadas.forEach((elemento) => {
        const optionPelicula = document.createElement("option");
        optionPelicula.value = elemento.id;
        optionPelicula.innerText = elemento.nombre;
        FRAGMENTO.appendChild(optionPelicula);
    }
    );
    return FRAGMENTO;
}
/**
 * @abstract dibuja la div roja a la derecha del selector 
 * @param {*} id id de la película seleccionada
 */
function dibujarDatosPeli(id) {
    const PELIELEGIDA = pelis.find((element) => element.id === id);
    DOMdatospeli = document.querySelector(".entradas__datospeli");
    DOMimagenPeli = document.querySelector(".entradas__imagen")
    DOMdatospeli.style["background-color"] = "var(--rojo-butaca)";
    DOMdatospeli.innerHTML = "";
    DOMdatospeli.appendChild(armarDatosPeli(PELIELEGIDA));
    DOMimagenPeli.innerHTML = `<img src="assets/imagenes/peliculas/${PELIELEGIDA.id}.jpg" alt="Poster película elegida">`;
}

/**
 * 
 * para armar el selector de funciones en base a la peli elegida
 */
function dibujarSelectorFunciones(id) {
    const DOMdivSelectorFunciones = document.querySelector("#entradas__funcion");
    const propiedadesFunciones = window.getComputedStyle(DOMdivSelectorFunciones);
    if (propiedadesFunciones.display === "none") {
        DOMdivSelectorFunciones.style["display"] = "block";
    }
    const PELIELEGIDA = pelis.find((element) => element.id === id);
    const mostrarNombreCorto = acortarPalabra(PELIELEGIDA.nombre, 12);
    const DOMselectorFunciones = document.querySelector("#select__funcion");
    DOMselectorFunciones.innerHTML = `<option class="select--disabled" selected disabled value="">Elegí la función para la película ${mostrarNombreCorto}</option>`;
    const funcionesPeliSeleccionada = funciones.filter((peliculaId) => peliculaId.pelicula == id);
    funcionesPeliSeleccionada.forEach((elemento) => {
        optionFuncion = document.createElement("option");
        optionFuncion.value = elemento.id;
        optionFuncion.innerText = "Día " + formatearDia(elemento.anio, elemento.mes, elemento.dia) + " Hora " + elemento.hora;
        DOMselectorFunciones.appendChild(optionFuncion);
    });
};
/**
 * 
 * @abstract cuando se carga el documento no se ve la sección de compra de entradas. Cuando se hace click en el botón de comprar se arma primero el esqueleto de esa parte y luego la interacción con el usuario desde la function armarDOM()
 */
function mostrarTodo() {
    divEntradas = document.querySelector("#section__entradas");
    divEntradas.innerHTML =
        `<section class="section__titulo--entradas">
            <h2>comprá tus entradas</h2>
            <h3 class="section__entradas--cerrar"><i class="fa-solid fa-xmark cerrar"></i></h3>
        </section>
        
        <section class="entradas">
            <div class="entradas__izquierda">
                <form action="" id="selectores">
                    <div class="entradas__selectores">
                        <div class="entradas__select">
                        <select name='select__pelicula' id='select__pelicula'></select>
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
                <div class="entradas__imagen">
                </div>
                <div class="entradas__datospeli">       
                </div>     
                <div class="platea" id="platea">   
                </div>
                <div class="carrito">
                </div>
            </div>
        </section>`;
}
/**
 * 
 * @param {Array} Elegidos array con el id de los asientos seleccionados (provienen de los checkboxes)
 * @returns muestra en la pantalla las filas y número de butaca, y genera un array sólo con el id de los elegidos
 */
function mostrarAsientos(Elegidos) {
    let COORDENADAS_ASIENTOS = "";
    const MOSTRAR_ASIENTOS = document.querySelector(".asientos__elegidos");
    const ElegidosID = [];
    Elegidos.forEach((elegido, llave) => {
        COORDENADAS_ASIENTOS += "<p>Asiento " + (llave + 1) + " <i class='fa-solid fa-right-long'></i> " + coordenadas(elegido.id) + "</p>";
        ElegidosID.push(elegido.id);
    });
    COORDENADAS_ASIENTOS += "<p class='aclaracion' id='advertencia'><i class='fa-solid fa-triangle-exclamation'></i>Para modificar los asientos, hacer click en la platea sobre el/los asientos seleccionados y elegir otro/s.</p>";
    MOSTRAR_ASIENTOS.innerHTML = COORDENADAS_ASIENTOS;
    return ElegidosID;
}
/**
 * 
 * @abstract evalua la situación de los asientos seleccionados por el usuario
 * @param {Event} event evento de click en los checkboxes de la platea
 * @param {*} entradasRequeridas cantidad de entradas a comprar
 */
function seleccionDeAsientos(event, entradasRequeridas) {
    idSeleccionado = event.target.id;
    DOMplatea = document.querySelector("#platea");
    if (event.target.classList.contains("indeterminado")) {
        //código de lo que pasa si hago click en asiento indeterminado
        event.target.checked = false;
        Swal.fire({
            html: '<h3>atención</h3><p>Ya tenés '+entradasRequeridas+ ' asientos seleccionados. Para cambiarlos debés liberar uno de los que ya elegiste</p>',
            icon: 'warning',
            iconColor: '#cc2d2c',
            confirmButtonColor:'#cc2d2c'
        })
        //alert("Ya tenés " + entradasRequeridas + " asientos seleccionados. Para cambiarlos debés liberar uno de los que ya elegiste");
    } else {
        if (!event.target.classList.contains("elegido")) {
            //código de lo que pasa si hago click en asiento libre
            event.target.classList.replace("libre", "elegido");
            const Elegidos = DOMplatea.querySelectorAll('input[type="checkbox"]:checked');
            if (Elegidos.length === entradasRequeridas) {
                const Libres = DOMplatea.querySelectorAll(".libre");
                Libres.forEach((element) => {
                    element.classList.replace("libre", "indeterminado");
                    element.indeterminate = true;
                });
                cargarAsientos(mostrarAsientos(Elegidos));
                document.querySelector("#totalEntradas") && document.querySelector("#totalEntradas").remove();
                const totalEnEntradas = document.createElement("div");
                totalEnEntradas.classList.add("totales");
                totalEnEntradas.id="totalEntradas";
                totalEnEntradas.innerHTML = `<p>Total entradas: ${currency(totalApagarEntradas)}</p>`; 
                const ENTRADAS_RESUMEN = document.querySelector(".entradas__resumen");
                ENTRADAS_RESUMEN.appendChild(totalEnEntradas);
                ENTRADAS_RESUMEN.appendChild(dibujarBotones());
            }
        } else {
            //código de lo que pasa si hago click en asiento elegido
            const Indeterminados = DOMplatea.querySelectorAll(".indeterminado");
            const MOSTRAR_ASIENTOS = document.querySelector(".asientos__elegidos");
            const divBotones = document.querySelector("#botones");
            if (document.body.contains(divBotones)) {
                document.querySelector("#botones").remove();
            }
            MOSTRAR_ASIENTOS.innerHTML = "<p class='aclaracion'>Asiento/s liberados. Seleccionar uno o más asientos para llegar a la cantidad de entradas.</p>";
            event.target.classList.replace("elegido", "libre");
            Indeterminados.forEach((element) => {
                element.classList.replace("indeterminado", "libre");
                element.indeterminate = false;
            });
        }
    }

}
/**
 * @abstract genera un objeto que luego será cargado al carrito que irá al storage
 * @param {Object} FUNCIONELEGIDA 
 * @param {*} entradasRequeridas 
 */
function armarCarritoEntradas(FUNCIONELEGIDA, entradasRequeridas) {
    sessionStorage.getItem("compra") && sessionStorage.removeItem("compra")
    Object.keys(carritoEntradas).length = 0;
    carrito.length = 0;
    carritoEntradas = {
        funcion: FUNCIONELEGIDA.id,
        cantidad: entradasRequeridas,
        lugares: []
    }
    carrito.push(carritoEntradas);
    cargarStorage();
}
function cargarAsientos(asientos) {
    carrito[0].lugares = asientos;
    sessionStorage.removeItem("compra");
    cargarStorage();
}
//manda los datos de las entradas al local storage

function cargarStorage() {
    sessionStorage.setItem('compra', JSON.stringify(carrito));
}
function recuperarStorage() {
    const carritoSS = JSON.parse(sessionStorage.getItem('compra'));
    return carritoSS;

}
function dibujarSnacksElegidos() {
    const carritoEnStorage = recuperarStorage();
    let totalGeneral;
    const listadoSnacks = document.querySelector(".entradas__izquierda");
    if (carritoEnStorage.length > 1) {
    
    
    if (!document.querySelector("#titulo-snacks")) {
        const tituloSnacks = document.createElement("h3");
        tituloSnacks.id = "titulo-snacks";
        tituloSnacks.innerHTML = "Snacks seleccionados";
        listadoSnacks.append(tituloSnacks);
    }
    document.querySelectorAll(".lista-snacks") && document.querySelectorAll(".lista-snacks").forEach((element) => element.remove());
    document.querySelector("#a-pagar") && document.querySelector("#a-pagar").remove();
    resultados = extraerRepetidos(); //es un vector de 2 elementos: carrito sin duplicados y total a pagar por snacks

    resultados[0].forEach((elemento) => {
        const snacksDIV = document.createElement("div");
        snacksDIV.classList.add("lista-snacks");
        snacksDIV.innerHTML = `<img src="assets/imagenes/${elemento[0].id}.png"><p>${elemento[1]} x ${elemento[0].nombre}</p><button class="basura" id="borrar-${elemento[0].id}"><i class="fa-solid fa-trash-can"></i></button>`;
        listadoSnacks.appendChild(snacksDIV);
        document.querySelector(`#borrar-${elemento[0].id}`).addEventListener("click", (event) => {
            borrarCarritoSnacks(event.target.id);
        });
    });
    const snacksTotales = document.createElement("div");
    snacksTotales.id = "a-pagar";
    snacksTotales.classList.add("totales");
    totalFormateado = currency(resultados[1]);
    snacksTotales.innerHTML = `<p>Total snacks: ${totalFormateado}</p>`;
    listadoSnacks.appendChild(snacksTotales);
    totalGeneral = currency(resultados[1]+totalApagarEntradas);
} else {
    document.querySelector(".lista-snacks").innerHTML=`<p>No hay snacks seleccionados</p>`;
    document.querySelector("#titulo-snacks").remove();
    document.querySelector("#a-pagar") && document.querySelector("#a-pagar").remove();
    totalGeneral = currency(totalApagarEntradas);
}
    document.querySelector("#total-gral") && document.querySelector("#total-gral").remove();
    const DOMtotalGeneral=document.createElement("div");
    DOMtotalGeneral.id="total-gral";
    
    DOMtotalGeneral.innerHTML=`<h3>Total general: ${totalGeneral}</h3>`;
    listadoSnacks.append(DOMtotalGeneral);


}

function enviarFormularioSelector(inputs) {
    //borra los datos de la pelicula
    const DOMdatospeli = document.querySelector(".entradas__datospeli");
    const DOMimagenPeli = document.querySelector(".entradas__imagen");
    DOMdatospeli.style["display"] = "none";
    DOMimagenPeli.style["display"] = "none";
    //genera variables en función a valores de los selects
    const FUNCIONELEGIDA = funciones.find((element) => element.id === inputs[1].value);
    const asientosFuncionElegida = simularOcupacion(FUNCIONELEGIDA);
    const totalLibres = cerosEnMatriz(asientosFuncionElegida);
    const entradasRequeridas = parseInt(inputs[2].value);
    //dibuja la platea y el resumen de lo solicitado
    if (entradasRequeridas <= totalLibres) {
        document.querySelector("#selectores").innerHTML = "";
        const ENTRADAS_RESUMEN = document.querySelector(".entradas__resumen");
        armarCarritoEntradas(FUNCIONELEGIDA, entradasRequeridas);
        dibujarEntradasResumen(ENTRADAS_RESUMEN, recuperarStorage());
        DOMplatea = document.querySelector("#platea");
        DOMplatea.append(dibujarPlatea(asientosFuncionElegida));
        DOMplatea.style["display"] = "block";
        DOMplatea.addEventListener("click", (event) => {
            seleccionDeAsientos(event, entradasRequeridas);
        });
    } else {
        alert("Lo sentimos, la sala no cuenta con la capacidad de asientos solicitada")
    }
}
function reordenarPelis(id) {
    let newPelis = pelis.filter((element) => element.id != id);
    newPelis.unshift(pelis[pelis.findIndex((element) => element.id === id)]);
    return newPelis;
}
/**
 * 
 * @abstract esta funcion es la que maneja toda la interacción con el usuario, desde la compra de entradas hasta el armado del carrito. Se la invoca desde la función mostrarTodo, una vez que se arma el esqueleto de la sección de venta de entradas
 * 
 */
function armarDOM(id = "") {

    const DOMbotonCerrar = document.querySelector(".cerrar");
    DOMbotonCerrar.addEventListener("click", () => {
        sweetCerrar()
        //sessionStorage.getItem("compra") && sessionStorage.removeItem("compra");
        //borrarTodo();
    });

    //1) armar selector de películas. 
    //Si vengo de la cartelera (id distinto de ""), ya está definido el id de la película y dibujo el selector de funciones sin esperar la interacción del usuario.
    const DOMselectorPeliculas = document.querySelector("#select__pelicula");
    DOMselectorPeliculas.appendChild(dibujarSelectorPeliculas(id));
    if (id != "") {
        dibujarSelectorFunciones(id);
        dibujarDatosPeli(id);
    }
    DOMselectorPeliculas.addEventListener("change", (event) => {
        dibujarSelectorFunciones(event.target.value);
        dibujarDatosPeli(event.target.value);
    });


    const DOMinputCantidad = document.querySelector(".entradas__cantidad");


    //2) le doy un evnt listener al selector de funciones, que hace que se muestre el input de cantidad de entradas
    const DOMselectorFunciones = document.querySelector("#select__funcion");
    DOMselectorFunciones.addEventListener("change", () => DOMinputCantidad.style["display"] = "block");

    //3)  genero el eventlistener para el form que contiene los selectores y el input de cantidad
    const formularioSelector = document.querySelector("#selectores");
    formularioSelector.addEventListener("submit", (event) => {
        event.preventDefault();
        const inputs = event.target.elements;
        enviarFormularioSelector(inputs);
    });

}
/**
 * 
 * @abstract para reiniciar el proceso de selección de películas. Se la llama con el botón modificar una vez que se seleccionó la película, o con la cruz de cerrar al comienzo de la sección de compra de entradas.
 * 
 */
function borrarTodo() {
    divEntradas = document.querySelector("#section__entradas");
    divEntradas.innerHTML = "";
    divEntradas.style['display']="none";
}
/**
 * 
 * @abstract usamos un sweetalert para alertar a la gente que está en un proceso de compra
 * 
 */
function sweet(id = undefined) {
    if (sessionStorage.getItem("compra")) {
        Swal.fire({
            title: 'Estás en un proceso de compra',
            icon: 'warning',
            html:
                'Si hacés click en borrar, se cerrará el proceso de compra.',
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText:
                'Borrar y empezar de nuevo',
            confirmButtonAriaLabel: 'Borrar y empezar de nuevo',
            cancelButtonText:
                '<i class="fa fa-thumbs-down"></i> Continuar compra actual',
            cancelButtonAriaLabel: 'Pulgar abajo'
        }).then((result) => {
            if (result.isConfirmed) {
                console.log("is confirmed");
                sessionStorage.removeItem("compra");
                mostrarTodo(id);
                armarDOM(id);
                document.querySelector("#section__entradas").style["display"]="block";
        
            } else {
                console.log("is denied");
            }
        })
    } else {
        console.log("session vacio");
        mostrarTodo(id);
        armarDOM(id);
        document.querySelector("#section__entradas").style["display"]="block";
    }
}
/**
 * 
 * @abstract funcion para generar sweet alert cuando se hace click en boton cerrar (cruz a la derecha de div de entradas)
 */
function sweetCerrar() {
    if (sessionStorage.getItem("compra")) {
        Swal.fire({
            title: 'Estás en un proceso de compra',
            icon: 'warning',
            html:
                'Si hacés click en borrar, se cerrará el proceso de compra.',
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText:
                '<i class="fa fa-thumbs-up"></i> Cerrar',
            confirmButtonAriaLabel: 'Cerrar',
            cancelButtonText:
                '<i class="fa fa-thumbs-down"></i> Continuar compra',
            cancelButtonAriaLabel: 'Pulgar abajo'
        }).then((result) => {
            if (result.isConfirmed) {
                console.log("is confirmed");
                sessionStorage.removeItem("compra");
                borrarTodo();
        
            } else {
                console.log("is denied");
            }
        })
    } else {
        borrarTodo();
    }
}

/**
 * 
 * @abstract genera la galería con los snacks 
 */
function mostrarSnacks() {
    document.querySelector("#botones").remove();
    document.querySelector("#advertencia").remove();
    document.querySelector("#platea").style["display"] = "none";
    document.querySelector(".carrito").innerHTML = `
        <h3>¿querés agregar snacks?</h3>
        <p>Elegí el que quieras o completá la compra de entradas sin snacks haciendo click en el botón TERMINAR</p>
        <div class="carrito__flexSnacks"></div>`;
    snacks.forEach((element) => {
        document.querySelector(".carrito__flexSnacks").appendChild(dibujarSnacksEnEntradas(element));
        document.querySelector(`#${element.id}`).addEventListener("click", (event) => {
            generarCarritoSnacks(event.target.id);
            dibujarSnacksElegidos(event.target.id);
        });
    });
}
/**
 * 
 * @param {String} id id del snack seleccionado con el botón correspondiente. Snack resumido genera un objeto con menos propiedades que el objeto completo y lo carga en el carrito (que ya tiene cargado el objeto de entradas)
 */
function generarCarritoSnacks(id) {
    const SNACKELEGIDO = snacks.find((element) => element.id === id);
    let snackResumido = (({ id, nombre, precio }) => ({ id, nombre, precio }))(SNACKELEGIDO);
    carrito.push(snackResumido);
    cargarStorage();
}
function borrarCarritoSnacks(id) {
    const nuevoID = id.slice(7);
    console.log(carrito);
 carrito.splice(carrito.findIndex((elemento)=>elemento.id===nuevoID),1);
 console.log(carrito);
    cargarStorage();
    dibujarSnacksElegidos();
}
/**
 * @abstract para que en la pantalla se visualicen sólo un renglón por snack. Si el snack se repite cambia la cantidad, pero sólo aparece un renglón por snack. El proceso es el siguiente:
 * 1) se ordena el carrito que viene del storage (carritoRecuperado) en base al id del snack
 * 2) se genera un nuevo array carritoSinDuplicados, al que se le van agregando los elementos del carrito. Este array tiene 2 elementos por fila: el objeto snack y la cantidad.
 * 3) si los elementos del carrito recuperado se repiten, no los agrego al nuevo carrito, sino que modifico la cantidad
 */
function extraerRepetidos() {
    const carritoRecuperado = recuperarStorage();
    const sorted = carritoRecuperado.splice(1).sort((a, b) => {
        if (a.id < b.id) { return -1; }
        if (a.id > b.id) { return 1; }
        return 0;
    });
    const carritoSinDuplicados = [];
    carritoSinDuplicados.push([sorted[0], 1]);
    for (i = 1; i < sorted.length; i++) {
        (sorted[i].id === sorted[i - 1].id) ? carritoSinDuplicados[carritoSinDuplicados.length - 1][1]++ : carritoSinDuplicados.push([sorted[i], 1]);
    }
    const temp = carritoSinDuplicados.map((elemento) => elemento[0].precio * elemento[1]);
    const totalAPagarSnacks = temp.reduce((accumulator, elemento) => accumulator + elemento);
    const aDevolver = [carritoSinDuplicados, totalAPagarSnacks];
    return aDevolver;
}

/**
 * 
 * @returns Dibuja los botones ACEPTAR y CAMBIAR PELICULA al final del resumen de las entradas compradas. El de aceptar genera que se muestre el carrito de snacks y el de cambiar hace que empiece todo de nuevo
 */

function dibujarBotones() {
    const FRAGMENTO = new DocumentFragment();
    const BOTONES = document.createElement("div");
    BOTONES.id = "botones";
    BOTON_ACEPTAR = document.createElement("input");
    BOTON_ACEPTAR.classList.add("boton__aceptar", "boton");
    BOTON_ACEPTAR.setAttribute("value", "👍 CONFIRMAR");
    BOTON_ACEPTAR.setAttribute("type", "button");
    BOTON_CAMBIAR = document.createElement("input");
    BOTON_CAMBIAR.classList.add("boton__cambiar", "boton");
    BOTON_CAMBIAR.setAttribute("value", "👎 Empezar de nuevo");
    BOTON_CAMBIAR.setAttribute("type", "button");
    BOTONES.append(BOTON_ACEPTAR);
    BOTONES.append(BOTON_CAMBIAR);
    FRAGMENTO.appendChild(BOTONES);
    BOTON_ACEPTAR.addEventListener("click", () => {
        mostrarSnacks();
    });
    BOTON_CAMBIAR.addEventListener("click", () => {
        sweet();
        //sessionStorage.getItem("compra") && sessionStorage.removeItem("compra");
        //borrarTodo();
        //mostrarTodo();
        //armarDOM();
    });
    return FRAGMENTO;
}
/**
 * 
 * @abstract Dibuja la tabla con la info de lo elegido hasta el momento. Por ahora no están los asientos
 * @param {Node} ENTRADAS_RESUMEN La div en donde vamos a mostrar lo cargado en el carrito del sessionStorage
 * @param {Array} carrito carrito del sessionStorage
 */
function dibujarEntradasResumen(ENTRADAS_RESUMEN, carrito) {
    const funcionelegida = funciones.find((element) => element.id === carrito[0].funcion);
    totalApagarEntradas = funcionelegida.precio * carrito[0].cantidad;
    const fecha = formatearDia(funcionelegida.anio, funcionelegida.mes, funcionelegida.dia);
    const pelielegida = pelis.find((element) => element.id === funcionelegida.pelicula);
    const entradasRequeridas = carrito[0].cantidad;
    ENTRADAS_RESUMEN.innerHTML = `
            <h3>resumen de lo solicitado</h3>
            <div class="resumen__datospeli">
                <div class="datospeli__item datospeli__item--left">Película </div>
                <div class="datospeli__item datospeli__item--right">${pelielegida.nombre}</div>
                <div class="datospeli__item datospeli__item--left">Duración</div>
                <div class="datospeli__item datospeli__item--right">${pelielegida.duracion}</div>
                <div class="datospeli__item datospeli__item--left">Sala</div>
                <div class="datospeli__item datospeli__item--right">${salas[funcionelegida.sala].nombre}</div>
                <div class="datospeli__item datospeli__item--left">Función</div>
                <div class="datospeli__item datospeli__item--right">${fecha}, ${funcionelegida.hora}</div>
                <div class="datospeli__item datospeli__item--left">Entradas</div>
                <div class="datospeli__item datospeli__item--right">${entradasRequeridas}</div>
                <div class="datospeli__item datospeli__item--left">Precio unitario</div>
                <div class="datospeli__item datospeli__item--right">${currency(funcionelegida.precio)}</div>
                <div class="datospeli__item datospeli__item--left">Asientos</div>
                <div class="datospeli__item datospeli__item--right asientos__elegidos"><p class="aclaracion"><i class="fa-solid fa-circle-exclamation"></i>Elegir butacas haciendo click en los asientos libres que se muestran a la derecha.</p></div>
                </div>`;
}
/**
 * 
 * @abstract separa los números de fila y asiento del string del id del asiento elegido 
 * @param {string} id el id del asiento elegido
 * @returns un string 'legible' de la ubicación del asiento
 */
const coordenadas = (id) => {
    let guion = id.indexOf("-");
    let nrofila = parseInt(id.slice(1, guion));
    nrofila++;
    let nrocolumna = parseInt(id.slice((guion + 2), id.length));
    nrocolumna++;
    let coordenadas_asientos = "Fila: " + nrofila + " Butaca: " + nrocolumna;
    return coordenadas_asientos;
}

// //////// VARIABLES /////////  //
let asientos = [];
let salas = [];
let pelis = [];
let snacks = [];
let carrito = [];
const PRECIOBASE = 3000; //valor de precio indicado desde el backend
let funciones = [];
let carritoEntradas = {};
let totalApagarEntradas;


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
    constructor(id, nombre, imdbID, anio, actor, genero, edad, director, resumen, duracion, rating) {
        this.id = id;
        this.nombre = nombre;
        this.imdbID=imdbID;
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
    new Pelicula("2309101900_IND", "Indiana Jones y el templo de la perdición","tt0087469", 1984, "Harrison Ford", "Aventuras", "ATP", "Steven Spielberg", "En 1935, Indiana Jones llega a la India, todavía parte del Imperio británico, y se le pide que encuentre una piedra mística. Entonces se topa con un culto secreto que comete esclavitud y sacrificios humanos en las catacumbas de un palacio.", "1h 58m", 7.5),
    new Pelicula("2309101901_TOY", "Toy Story", "tt0114709", 1995, "Tom Hank", "Animación", "ATP", "John Lasseter", "Un vaquero de juguete se encuentra celoso y amenazado cuando un nuevo juguete, un guardián espacial, se convierte en el favorito del niño al que pertenecen.", "1h 21m", 8.3),
    new Pelicula("2309101904_VOL", "Volver al futuro", "tt0088763", 1985, "Michael J Fox", "Ciencia ficción, aventuras", "ATP", "Robert Zemeckis", "Marty McFly, un estudiante de secundaria de 17 años, es enviado accidentalmente treinta años al pasado en un DeLorean que viaja en el tiempo, inventado por su gran amigo, el excéntrico científico Doc Brown.", "1h 56m", 8.5),
    new Pelicula("2309052000_TIT", "Titanic", "tt0120338", 1997, "Leonardo Di Caprio, Kate Winslett", "Romance, Drama", "PG-13", "James Cameron", "Una aristócrata de diecisiete años se enamora de un amable pero pobre artista a bordo del lujoso y desafortunado R.M.S. Titanic.", "3h 14m", 7.9),
    new Pelicula("2309040102_AFR", "Africa mía", "tt0089755", 1985, "Robert Redford, Maryl Streep", "Romance, Drama, Biografía", "GP-13", "Sydney Pollack", "En la Kenia colonial del siglo XX, una baronesa danesa, propietaria de una plantación, mantiene una apasionada relación amorosa con un cazador de espíritu libre.", "2h 41m", 7.1),
    new Pelicula("2310020824_KAR", "Karate Kid", "tt0087538", 1984, "Ralph Macchio, Pat Morita", "Acción, Drama, Familiar", "ATP", "John G. Avildsen", "Un maestro de artes marciales acepta instruir a un adolescente acosado.", "2h 6m", 7.5)
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
    new Funcion("2309101901_TOY", 2, 23, 9, 2023, 1830),
    new Funcion("2310020824_KAR", 2, 2, 11, 2023,1530)
];



// **** **** **** FIN DECLARACIONES **** **** **** /////////////////////

// ************* Armado del DOM inicial  ****************************************//
(sessionStorage.getItem("compra")) && sessionStorage.removeItem("compra");
const botonEntradas = document.querySelectorAll(".comprar_entradas");
botonEntradas.forEach((element) => element.addEventListener("click", () => {
    sweet();
    //if (verificarFlag()) {
    //    mostrarTodo();
    //    armarDOM();
    //}
}
));
/** 
 * 
* @abstract armamos la parte de la cartelera con los posters y el overlay
 * 
*/
pelis.forEach((elemento) => {
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
    botonCartelera.id = elemento.id;
    botonCartelera.innerText = "elegir";
    botonCartelera.style.cursor = "pointer";
    const botonFetch = document.createElement("div");
    botonFetch.className = "cartelera__boton";
    botonFetch.id = elemento.imdbID;
    botonFetch.innerText = "ver más";
    botonFetch.style.cursor = "pointer";
    overlay.append(botonFetch);
    overlay.append(botonCartelera);
    peliculaEnCartelera.append(overlay);
    document.querySelector(".cartelera__contenedor").appendChild(peliculaEnCartelera);
    botonCartelera.addEventListener("click", (event) => sweet(event.target.id));
    botonFetch.addEventListener("click", (event) => apitmdb(event.target.id)); 
});
/** 
 * 
 * @abstract Armamos el carousel de snacks en la parte estática de la página
 * 
*/
const sectionSnacks = document.querySelector(".snacks");
snacks.forEach((element) => sectionSnacks.appendChild(dibujarSnacks(element)));
