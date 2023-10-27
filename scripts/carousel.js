const icono__derecha__cartelera=document.querySelector(".to-right--cartelera");
const icono__izquierda__cartelera=document.querySelector(".to-left--cartelera");
const icono__izquierda__snacks=document.querySelector(".to-left--snacks");
const icono__derecha__snacks=document.querySelector(".to-right--snacks");
icono__derecha__cartelera.addEventListener("click",()=>{
  document.querySelector(".cartelera__contenedor").scrollLeft += 500;
});
icono__izquierda__cartelera.addEventListener("click",(event)=>{
  document.querySelector(".cartelera__contenedor").scrollLeft -= 500;
});
icono__derecha__snacks.addEventListener("click",()=>{
  document.querySelector(".snacks").scrollLeft += 500;
});
icono__izquierda__snacks.addEventListener("click",(event)=>{
  document.querySelector(".snacks").scrollLeft -= 500;
});

