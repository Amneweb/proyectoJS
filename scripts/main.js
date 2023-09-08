function ejecutar() {
    const funciones = [
        ["Sábado 20/9 - 17:00",
            "Sábado 20/9 - 18:30",
            "Sábado 20/9 - 21:00",
            "Domingo 21/9 - 14:00",
            "Domingo 21/9 - 19:00"],
        ["Sábado 20/9 - 16:00",
            "Sábado 20/9 - 18:00",
            "Sábado 20/9 - 19:50",
            "Domingo 21/9 - 16:00",
            "Domingo 21/9 - 19:00"],
    ];
    function mostrarFuncion(sala) {
        let mostrar = "Acá te mostramos las funciones para dicha sala\n";
        funciones[sala - 1].forEach((element, index) => mostrar = mostrar + "\n" + (index + 1) + " -> " + element);
        return mostrar;
    }
    let precio = 0;
    function precioEntrada(sala, fila) {
        switch (sala) {
            case 1:
                if (fila <= 8) {
                    precio = 2900;
                } else {
                    precio = 3500;
                }
                break;
            case 2:
                if (fila <= 8) {
                    precio = 2200;
                } else {
                    precio = 2800;
                }
                break;
        }
        return precio;
    }
    function alertaVacio(variable) {
        alert("No ingresaste ningún valor de " + variable + ". Por favor volvá al inicio y cargá los datos nuevamente.")
    }
    const peli = new Array();
    peli[0] = "Titanic";
    peli[1] = "Indiana Jones y el templo de la perdición";
    peli[2] = "Toy Story";
    peli[3] = "Volver al futuro";
    peli[4] = "Africa mía";

    let listarNombres = "Estas son las películas en cartelera\n";
    for (let i = 0; i < 5; i++) {
        listarNombres = listarNombres + (i + 1) + "->" + peli[i] + "\n";
    }
    const peli_index = parseInt(prompt(listarNombres + "Por favor ingrese el número de la película elegida"));
    if (peli_index) {
        if ((peli_index < 1) || (peli_index > 5)) {
            alert("El número que ingresaste no corresponde a ninguna película. Por favor intentalo de nuevo");
            return;
        } else {
            alert("Gracias por elegir '" + peli[peli_index - 1] + "'. Ahora podés continuar la compra.");
        }
    } else {
        alertaVacio("película");
        return;
    }
    let sala = "";
    const lista_precios = "SALAS Y PRECIOS\n**** 1-> Sala Premium****\nFilas 1 a 8: $2900\nFilas 9 a 20: $3500\n**** 2-> Sala Clásica****\nFilas 1 a 8: $2200\nFilas 9 a 20: $2800\n";
    sala = parseInt(prompt(lista_precios + "Ingresá el número correspondiente a la sala elegida"));
    if (sala) {
        if ((sala < 1) || (sala > 2)) {
            alert("El número no corresponde a ninguna sala, por favor intentalo nuevamente");
            return;
        } else {
            mostrar = mostrarFuncion(sala);
            funcionElegida = prompt(mostrar + "\n¿Qué función elegís?");
        }
    } else {
        alertaVacio("número de sala");
        return;
    }
    const nombreSala = (sala == 1) ? "Premium" : "Clásica";

    let cantidad = 0;
    let fila = 0;
    cantidad = parseInt(prompt("¿Cuántas entradas querés comprar? El máximo disponible son 10 entradas."));
    if (cantidad) {
        if (cantidad > 10) {
            alert("Lo sentimos la cantidad de entradas deseada (" + cantidad + ") excede la capacidad de la sala");
            return;
        }
    } else {
        alertaVacio("cantidad de entradas");
        return;
    }
    fila = parseInt(prompt("Ingrese el número de fila. Hay un máximo de 20 filas."));
    if (fila) {

        if ((fila < 1) || (fila > 20)) {
            alert("El número de fila que ingresaste no corresponde a ninguna fila existente. Por favor volvé a iniciar el proceso y seleccioná una fila entre 1 y 20.");
            return;
        }
    } else {
        alertaVacio("número de fila");
        return;
    }
    let a_pagar = precioEntrada(sala, fila) * cantidad;
    alert("Gracias por comprar tus entradas en Cine Vintage. Este es el resumen de tu compra:\n-> Película: " + peli[peli_index - 1] + "\n-> Sala: " + nombreSala + "\n-> Funcion: " + funciones[sala - 1][funcionElegida - 1] + "\n-> Cantidad de entradas: " + cantidad + "\n-> Fila: " + fila + "\n-> TOTAL A PAGAR: $" + a_pagar);
}