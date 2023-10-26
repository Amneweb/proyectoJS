const icono__derecha=document.querySelector(".cartelera__icono");
const cartelera=document.querySelector(".cartelera__contenedor");
icono__derecha.addEventListener("click",()=>{
  document.querySelector(".cartelera__contenedor").scrollLeft += 500;
});
// cartelera.addEventListener("scroll",update);
// function update() {
//   const cartelera=document.querySelector(".cartelera__contenedor");
//   const posicion=cartelera.getBoundingClientRect().x;
//   return posicion;
// }
//  icono__derecha.addEventListener("click",()=>{
//    const cartelera=document.querySelector(".cartelera__contenedor");
//    cartelera.addEventListener("scroll",update);
// function update() {
//   const cartelera=document.querySelector(".cartelera__contenedor");
//   const posicion=cartelera.getBoundingClientRect().x;
//   return posicion;
// }
// posicion=update();
//    console.log(posicion);
//    let izquierda=posicion+300;
//    cartelera.scroll({
//     left: izquierda,
//     behavior: "smooth",
//   });
// });

// icono__derecha.addEventListener("click",()=>{
//   const cartelera=document.querySelector(".cartelera__contenedor");
//   let amount = 400;
//   cartelera.style['left']=(cartelera.offsetLeft+amount)+'px';
// })

// const carousel = ( function () {
  
//   let el, container, next, pos = 0, prev;
    
//   function toggleClasses() {
//     el.classList.add( 'carousel__container--js' );
//     if (el.scrollWidth > el.clientWidth ) {
//       el.classList.add( 'carousel__container--is-overflown');
//     }
    
//  }
   
//   function addEventListeners() {  
//     next.addEventListener( 'click', scroll, false );
//     //prev.addEventListener( 'click', scroll, false );
//   }
  
//   function init( element ) {
    
//     el = element.querySelector( '.cartelera__contenedor' );    
//     next = document.querySelector( '.icono__derecha' );   
//     //prev = element.querySelector( '.carousel__button--prev' );   
        
//     toggleClasses();
//     addEventListeners();   
//   }
  
//   function isOverflown() {
//     if ( el.clientWidth < el.scrollWidth ) {
//       el.classList.add( 'carousel__container--is-overflown' );
//     }
//   }
  
//   function scroll() {
//     var difference = el.scrollWidth - el.clientWidth;
//     var perTick = difference / 400 * 10;
          
//     if ( this.classList.contains( 'fa-arrow-right-arrow-left' ) ) {
//       pos += el.clientWidth;
//       console.log(pos);
//     } else {
//       pos -= el.clientWidth;
//       console.log(pos);
//     }
    
//     $( el ).animate({ scrollLeft : pos });    
//   }
    
//   return {
//     init : init
//   }
  
// })();

// carousel.init( document.querySelector( '.cartelera' ) );