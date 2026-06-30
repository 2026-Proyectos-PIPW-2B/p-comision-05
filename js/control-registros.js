window.addEventListener("load", iniciar);

import * as usuarios from "../modulos/usuarios.js";
import * as registros from "../modulos/registros.js";
import * as crearDomElements from "../modulos/crearDomElements.js";
import * as sesionActual from "../modulos/sesionActual.js"; 

const selectUsuario = document.getElementById("selectUsuario");
const inputFechaDeInicio = document.getElementById("inputFechaInicio");
const inputFechaFinal = document.getElementById("inputFechaFinal");
const btnFiltroRegistroAdmin = document.getElementById("filtroRegistroAdmin");
const btnCerrarSesion = document.getElementById("btnCerrarSesion");

const contenedorCompras = document.getElementById("contenedorCompras");

function cargarSelectUsuarios() {
  selectUsuario.innerHTML = "";

  let primerOption = document.createElement("option");
  primerOption.value = "";
  primerOption.textContent = "Seleccione un Usuario...";
  selectUsuario.appendChild(primerOption);

  const mapaUsuarios = usuarios.getUsuarios();
  for (const usuario of mapaUsuarios.values()) {
    if (usuario.tipo === "admin") {
      continue; 
    }
    const option = document.createElement("option");
    option.value = usuario.nombreUsuario;
    option.textContent = `${usuario.nombre} ${usuario.apellido} (${usuario.nombreUsuario})`;
    selectUsuario.appendChild(option);
  }
}


btnFiltroRegistroAdmin.addEventListener("click", function (e) {
  e.preventDefault();
  const usuarioSeleccionado = selectUsuario.value;
  const listaCarritos = registros.getRegistro(usuarioSeleccionado);

  console.log("estoy en el boton");

  if (!usuarioSeleccionado) {
    alert("seleccione un usuario para ver su historial.");
    return;
  }
  contenedorCompras.innerHTML = "";
  //mensaje si el carrito esta vacio
  if (!listaCarritos || listaCarritos.length === 0) {
    const mensajeVacio = document.createElement("p");
    mensajeVacio.className = "text-center fs-5 mt-4";
    mensajeVacio.textContent = `El usuario ${usuarioSeleccionado} no registra compras.`;
    contenedorCompras.appendChild(mensajeVacio);
    return;
  }

  let fechaInicioVal = null;
  let fechaFinalVal = null;

  if (inputFechaDeInicio.value) {
    const fechaInicFormateada = inputFechaDeInicio.value.replace(/-/g, "/");
    fechaInicioVal = new Date(fechaInicFormateada);
    fechaInicioVal.setHours(0, 0, 0, 0); // desde el primer segundo del día
  }

  if (inputFechaFinal.value) {
    const fechaFinFormateada = inputFechaFinal.value.replace(/-/g, "/");
    fechaFinalVal = new Date(fechaFinFormateada);
    fechaFinalVal.setHours(23, 59, 59, 999); // hasta el ultimo segundo del dia
  }

  let comprasMostradas = 0;

  for (let i = 0; i < listaCarritos.length; i++) {
    const carrito = listaCarritos[i];
    const partesFecha = carrito.fecha.split("/");
    let fechaCarrito;

    if (partesFecha.length === 3) {
      //el mes en Date() va de 0 a 11, por eso el (partesFecha[1] - 1)
      fechaCarrito = new Date(
        partesFecha[2],
        partesFecha[1] - 1,
        partesFecha[0],
      );
    } else {
      fechaCarrito = new Date(carrito.fecha);
    }

    fechaCarrito.setHours(12, 0, 0, 0);

    if (fechaInicioVal && fechaCarrito < fechaInicioVal) continue;
    if (fechaFinalVal && fechaCarrito > fechaFinalVal) continue;

    crearDomElements.createRegistroCompra(
      carrito,
      contenedorCompras,
      i,
      usuarioSeleccionado,
    );
    comprasMostradas++;
  }

  // Mensaje
  if (comprasMostradas === 0) {
    const mensajeNoRango = document.createElement("p");
    mensajeNoRango.className = "text-center fs-5 mt-4 text-muted";
    mensajeNoRango.textContent =
      "No hay compras en el rango de fechas seleccionado.";
    contenedorCompras.appendChild(mensajeNoRango);
  }
});

function iniciar() {
    cargarSelectUsuarios();
}
