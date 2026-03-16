//Espera que el contenido HTML este cargado
document.addEventListener("DOMContentLoaded", () => {

    //selecciona el boton para volver al inciio de la página
    const boton = document.getElementById("scrollTop");

    // Detecta el desplazamiento vertical del usuario en la página
    window.addEventListener("scroll", () => {

        const scrollActual = window.scrollY + window.innerHeight;
        const alturaPagina = document.documentElement.scrollHeight;

        //cuando el usuario llegue al final de la página, muestra el boton
        if(scrollActual >= alturaPagina - 10){
            boton.classList.add("scroll-top--visible");
        }else{
            boton.classList.remove("scroll-top--visible");
        }

    });

    //al dar clic sube hasta el inicio de la página
    boton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

});