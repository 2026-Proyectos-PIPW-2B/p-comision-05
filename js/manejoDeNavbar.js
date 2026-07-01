import * as sesionActual from "../modulos/sesionActual.js"; 

const textoSesion = document.getElementById("textoSesion")
const buttonCerrarSesion = document.getElementById("buttonCerrarSesion")

function cerrarSesion() {
    sesionActual.clear()
    window.location.href = "login.html"
}

function onLoad() {
    const usuarioLogueado = sesionActual.get();
    
    const nombreMayuscula = usuarioLogueado.nombre.charAt(0).toUpperCase() + usuarioLogueado.nombre.slice(1)
    const apellidoMayuscula = usuarioLogueado.apellido.charAt(0).toUpperCase() + usuarioLogueado.apellido.slice(1)
    textoSesion.textContent = `${nombreMayuscula} ${apellidoMayuscula}`

    //todas los html, que linkeen este js, tienen que tener un boton con id: "buttonCerrarSesion" 
    buttonCerrarSesion.addEventListener("click", cerrarSesion)
}

window.addEventListener("load", onLoad)