const cartelera=document.querySelector(".cartelera__contenedor");
const icono__derecha=document.querySelector(".cartelera__icono");
icono__derecha.addEventListener("click",()=> {
    const cartelera=document.querySelector(".cartelera__contenedor");
    let izquierda = window.getComputedStyle(cartelera).left;
cartelera.scroll({
    cartelera.style['left']=(izquierda - 400);
    behavior: "smooth",
  });
});