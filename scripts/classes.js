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