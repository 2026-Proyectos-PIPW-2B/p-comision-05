import * as sesionActual from "../modulos/sesionActual.js"; 
import * as usuarios from "../modulos/usuarios.js";

function controlarSesionYBotones() {
  const usuarioLogueado = sesionActual.get();
  //si el usuario no esta logueado, que vaya directo al login
  if (!usuarioLogueado) {
    window.location.href = "login.html";
    return;
  }
  //todas los html, que linkeen este js, tienen que tener un boton con id: "btnCerrarSesion" 
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");
  btnCerrarSesion.addEventListener("click", function (){
      sesionActual.limpiarSesionActual();
      alert("Sesión cerrada, chau!");
      window.location.href = "login.html";
    });
}


window.onload = controlarSesionYBotones;