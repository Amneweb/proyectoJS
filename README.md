# proyectoJS
## Idea general del proyecto final
El proyecto consiste en una aplicación web de venta de entradas de un cine, con la opción de también agregar al carrito combos de snacks.

Los pasos a seguir por el usuario serán:
1. Elección de película
1. Elección de sala (Premium, Clásica o Infantil)
1. Elección de función (fecha y hora)
1. Elección de asientos dependiendo de disponibilidad y cantidad de entradas
1. Elección de ofertas de snacks
1. Pago
> Al final del recorrido el usuario obtendrá un pdf con un código QR que será su entrada.
## Funcionalidades particulares en cada paso del recorrido del usuario
**Pasos 1 a 3:** La elección de la película (con un select) dispara la aparición de las opciones del paso 2, que a su vez genera la aparición de un menú desplegable para el paso 3. Es decir que los horarios de las funciones dependerán de la sala elegida, y ésta a su vez dependerá de la película elegida. 

**Paso 4:** Una vez definido el paso 3 le preguntaremos al usuario cuántas entradas quiere y, si la disponibilidad de asientos libres en la sala es igual o mayor a dicha cantidad, le mostraremos un plano de la sala con la ubicación de asientos libres. El usuario deberá hacer click en los asientos de preferencia.

La idea es que en función de la ubicación de los asientos (y de la sala) el precio de la entrada varía.

Para mostrar los asientos pensé en un *select* en el que cada opción es un círculo ubicado en la fila y columna correspondiente. Cuando el usuario hace click en el círculo queda seleccionado el asiento, cuyo id será, x ejemplo f10c4 (fila 10 columna 4)

**Paso 5:** Se muestra el total a pagar hasta el momento y se ofrece la posibilidad de comprar snacks. Si el usuario desea comprar snacks, se le mostrarán las opciones y se sumará la elección al carrito de compras.

**Paso 6:** Se simulará un pago (botón que diga pagar)

**Final** Se genera un pdf con el resumen de la compra y un QR (o por lo menos se mostrará en pantalla)

## Tercer entrega
Se agrega la interacción del usuario desde el DOM. Aun hay varias cosas por corregir, pero el funcionamiento básico está correcto.
Cuando el usuario entra a la página no se ve la sección de compra de entradas. Ésta recién aparece cuando se hace click en el botón superior, en el link central de comprar entradas o en el botón ELEGIR del overlay de los pósters de la cartelera. 
Las secciones CARTELERA y SNACKS son generadas desde javascript. La sección de las salas es estática, pero también podría generarse dinámicamente.
Hay algunos alerts que serán reemplazados por swift alerts para la próxima entrega.
**Pasos para 'comprar':**
- Una vez abierta la sección de compra de entradas, el usuario debe seleccionar la película, luego la función y la cantidad de entradas. 
- Cuando se envía el formulario se entra en el proceso de selección de asientos, para el cual se muestra la platea con los asientos libres y ocupados (esto se genera aleatoriamente). 
- Una vez seleccionados los asientos se ofrece la posibilidad de comprar snacks y se muestran los snacks disponibles. Al hacer click en cada uno de ellos se irán agregando al listado, que a su vez irá mostrando el total.

Usé **sessionStorage** en lugar de localStorage porque la compra de entradas va a tener un tiempo límite, ya que los asientos de la platea deben ser liberados para la posible compra de otro usuario. 

## Segunda entrega
El recorrido del usuario y el método general de funcionamiento es similar al de la primer entrega. El archivo js sigue siendo main.js, pero con las siguientes modificaciones:
- Las funciones se simplifican utilizando métodos de arrays
- Las películas, fechas de proyección (que denominamos funciones) y las salas, se guardan como OBJETOS, que a su vez son elementos de arrays
- Se utilizan funciones flecha y funciones de orden superior
- Se mejoran los controles de errores cuando el usuario ingresa un valor no compendido entre las opciones ofrecidas. Ahora se ofrece un total de 3 intentos antes de interrumpir la secuencia.
- Se muestra un esquema de filas y columnas con asientos vacíos y ocupados. En esta entrega esto sólo es a efectos ilustrativos. Más adelante se va a usar para armar el plano de la sala, en el que el usuario podrá hacer click en el asiento elegido, que va a tener un color diferente si está ocupado o libre.
## Primera entrega
> El archivo js de esta primer entrega es main.js
### Disparador del simulador básico
En esta primera entrega se trabaja sólo con prompts y alerts, aunque para que el programa empiece a funcionar hay que hacer click en un botón que se muestra en la página. (Hay dos botones que disparan el programa, son bastante obvios)

TODO el proceso está dentro de una función denominada *ejecutar*, que es la que se dispara cuando se hace click en el botón. (Este tipo de funcionamiento lo copié de una de las primeras diapositivas de la clase 1 del curso).
### Recorrido del usuario
El primer prompt muestra 5 opciones de películas, cada una identificada con un número, que será el que el usuario deberá ingresar para elegir su película.
A partir de ahí se van mostrando prompts con las opciones de sala y función, y finalmente se piden las cantidades de entradas y el número de fila.
En base a las elecciones del usuario se calcula el total a pagar y se muestra en un alert final, con un resumen de 'la compra':
- Película
- Sala
- Función
- Cantidad de entradas
- Fila
- Total a pagar
### Errores
Si el usuario no ingresa ningún número, o ingresa opciones inválidas, se le muestra un alert diciéndole que hubo un error (y explicando cuál fue) y se suspende el proceso.

