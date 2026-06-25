import * as users from "../modulos/usuarios.js";

//nombreUsuario, nombre, apellido, contraseña, tipo todo boolean
users.setUsuario("juanCarlos", "juan", "carlos", "asd123", "admin")
users.setUsuario("facundoArana", "facundo", "araña", "asd123", "user")

const inputNombre = document.getElementById("inputNombre");
const inputPassword = document.getElementById("inputPassword");
const inputBotonLogin = document.getElementById("botonLogin");
const inputMensajeNombre = document.getElementById("mensajeNombre");
const inputMensajePassword = document.getElementById("mensajeContraseña");

function vaciarMensajes() {
  inputNombre.classList.remove("is-invalid", "is-valid");
  inputMensajeNombre.textContent = "";

  inputPassword.classList.remove("is-invalid", "is-valid");
  inputMensajePassword.textContent = "";
}

inputBotonLogin.addEventListener("click", function(e) {
  e.preventDefault();
  let nombreUsuarioPasado = inputNombre.value
  let password = inputPassword.value;

  let usuario = users.getUsuario(nombreUsuarioPasado);

  if (usuario === null) {
    vaciarMensajes();
    inputNombre.classList.add("is-invalid");
    inputMensajeNombre.textContent = "Usuario Incorrecto";
  } else {
    if (!usuario.habilitado) {
      vaciarMensajes();
      alert("El usuario pasado, no esta habilitado");
      return;
    } else {
      if (usuario.contraseña != password) {
        vaciarMensajes();
        inputNombre.classList.add("is-valid");
        inputMensajeNombre.textContent = "Usuario Correcto";

        inputPassword.classList.add("is-invalid");
        inputMensajePassword.textContent = "Contraseña Incorrecto";
        console.log("estoy aqui");
      } else {
        vaciarMensajes();
        if (usuario.tipo === "admin") {
          window.location.href = "control-de-productos.html";
        } else {
          window.location.href = "tienda.html";
        }
      }
    }
  }});
