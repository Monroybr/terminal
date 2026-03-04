document.addEventListener("DOMContentLoaded", () => {

    const boton = document.getElementById("scrollTop");

    window.addEventListener("scroll", () => {

        const scrollActual = window.scrollY + window.innerHeight;
        const alturaPagina = document.documentElement.scrollHeight;

        if(scrollActual >= alturaPagina - 10){
            boton.classList.add("scroll-top--visible");
        }else{
            boton.classList.remove("scroll-top--visible");
        }

    });

    boton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

});