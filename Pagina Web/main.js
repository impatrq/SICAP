const nav = document.querySelector("nav");
    window.addEventListener("scroll", function() {
        nav.classList.toggle("active", window.scrollY > 0);
    })
const botonFacul = document.querySelector("#boton-facul");
const cerrarModal = document.querySelector("#cerrar-modal");
const modal = document.querySelector("#modal"); 
botonFacul.addEventListener("click", ()=>{
    modal.showModal()
})
const botonTiti = document.querySelector("#boton-titi");
const cerrarModal1 = document.querySelector("#cerrar-modal1");
const modal1 = document.querySelector("#modal1"); 
botonTiti.addEventListener("click", ()=>{
    modal1.showModal()
})
const botonFacus = document.querySelector("#boton-facus");
const cerrarModal2 = document.querySelector("#cerrar-modal2");
const modal2 = document.querySelector("#modal2"); 
botonFacus.addEventListener("click", ()=>{
    modal2.showModal()
})
const botonPablo = document.querySelector("#boton-pablo");
const cerrarModal3 = document.querySelector("#cerrar-modal3");
const modal3 = document.querySelector("#modal3"); 
botonPablo.addEventListener("click", ()=>{
    modal3.showModal()
})
const botonLauty = document.querySelector("#boton-lauty");
const cerrarModal4 = document.querySelector("#cerrar-modal4");
const modal4 = document.querySelector("#modal4"); 
botonLauty.addEventListener("click", ()=>{
    modal4.showModal()
})

// Cerrar modal al hacer clic fuera del contenido
modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.close();
    }
});
modal1.addEventListener("click", (event) => {
    if (event.target === modal1) {
        modal1.close();
    }
});
modal2.addEventListener("click", (event) => {
    if (event.target === modal2) {
        modal2.close();
    }
});
modal3.addEventListener("click", (event) => {
    if (event.target === modal3) {
        modal3.close();
    }
});
modal4.addEventListener("click", (event) => {
    if (event.target === modal4) {
        modal4.close();
    }
});

