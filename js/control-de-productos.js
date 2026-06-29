import * as moduloProductos from "../modulos/stock.js";
import { crearFilaProducto } from "../modulos/crearDomElements.js";
import * as moduloEtiquetas from "../modulos/etiquetas.js";
let funcionParaBotonEditar = null;

//para probar la tabla
//Simulacion de local storage
if (!localStorage.getItem("stock")) {
  console.log("Seteo datos en local Storage");

  moduloProductos.setProducto(
    "Medialuna",
    ["Glaseado", "Panificado"],
    "Medialuna glaseada con chispas sabor menta",
    15,
    45000,
  );

  moduloProductos.setProducto(
    "Torta de chocolate",
    ["Tortas"],
    "Torta de chocolate con relleno de dulce de leche",
    30,
    18000,
  );

  moduloProductos.setProducto(
    "Pan Dulce de pistacho",
    ["Panificado", "Salchicha"],
    "Pan dulce, relleno de pistacho con salchichas",
    8,
    125000,
  );
}

const tbody = document.getElementById("cuerpoDeTabla");
const formRegistro = document.getElementById("formRegistroProductos");
const botonGuardar = document.getElementById("botonRegistroGuardar");
const botonGuardarCambios = document.getElementById("botonGuardarCambios");

//elementos de los filtros
const filtroTitulo = document.getElementById("filtroTitulo");
const filtroDescripcion = document.getElementById("filtroDescripcion");
const filtroStock = document.getElementById("filtroStock");
const filtroEtiqueta = document.getElementById("filtroEtiqueta");
const botonAplicarFiltros = document.getElementById("botonAplicarFiltros");
const botonResetearFiltros = document.getElementById("botonResetearFiltros");

const inputNuevaEtiqueta = document.getElementById("inputNuevaEtiqueta");
const btnCrearEtiqueta = document.getElementById("btnCrearEtiqueta");
const listaEtiquetasGlobales = document.getElementById(
  "listaEtiquetasGlobales",
);
const registroEtiquetas = document.getElementById("registroEtiquetas");

let idProductoEnEdicion = null;
const filtrosActivos = {
  titulo: "",
  descripcion: "",
  cantidad: "",
  etiqueta: "",
};
//listeners
botonGuardar.addEventListener("click", registrarNuevoProducto);
botonGuardarCambios.addEventListener("click", guardarCambiosProducto);
botonAplicarFiltros.addEventListener("click", aplicarFiltros);
botonResetearFiltros.addEventListener("click", resetearFiltros);
btnCrearEtiqueta.addEventListener("click", gestionarAltaEtiqueta)

//funciones
function actualizarSelectoresEtiquetas() {
  const lista = moduloEtiquetas.getEtiquetas();
  //primer elemento
  registroEtiquetas.innerHTML = "";
  filtroEtiqueta.innerHTML = "";
  const opcionVacia = document.createElement("option");
  opcionVacia.value = "";
  opcionVacia.textContent = "Filtrar por etiqueta...";
  filtroEtiqueta.appendChild(opcionVacia);

  //etiquetas del array
  for (let i = 0; i < lista.length; i++) {
    const etiqueta = lista[i];

    const optionFiltro = document.createElement("option");
    optionFiltro.value = etiqueta;
    optionFiltro.textContent = etiqueta;
    filtroEtiqueta.appendChild(optionFiltro);

    const optionRegistro = document.createElement("option");
    optionRegistro.value = etiqueta;
    optionRegistro.textContent = etiqueta;
    registroEtiquetas.appendChild(optionRegistro);
  }

  renderizarListaGestion();
}

// administrador de etiquetas, creo la lista de etiquetas con boton de borrado
function renderizarListaGestion() {
  listaEtiquetasGlobales.innerHTML = "";
  const lista = moduloEtiquetas.getEtiquetas();

  for (let i = 0; i < lista.length; i++) {
    const etiqueta = lista[i];

    const divItem = document.createElement("div");
    divItem.className ="d-flex justify-content-between align-items-center p-2 border rounded bg-light";

    const spanTexto = document.createElement("span");
    spanTexto.textContent = etiqueta;
    spanTexto.className = "fw-semibold text-dark";

    const btnBorrar = document.createElement("button");
    btnBorrar.className = "btn btn-sm btn-danger";
    btnBorrar.type = "button";

    const iconoBorrar = document.createElement("i");
    iconoBorrar.className = "bi bi-trash3-fill";
    btnBorrar.appendChild(iconoBorrar);

    btnBorrar.addEventListener("click", function () {
      moduloEtiquetas.eliminarEtiquetaGlobal(etiqueta);
      actualizarSelectoresEtiquetas();
      actualizarTablaCompleta(); 
    });

    divItem.appendChild(spanTexto);
    divItem.appendChild(btnBorrar);
    listaEtiquetasGlobales.appendChild(divItem);
  }
}


function gestionarAltaEtiqueta() {
  const nuevoValor = inputNuevaEtiqueta.value.trim();
  if (nuevoValor === "") {
    return;
  }
  const exito = moduloEtiquetas.agregarEtiqueta(nuevoValor);
  if (exito) {
    inputNuevaEtiqueta.value = "";
    actualizarSelectoresEtiquetas();
  } else {
    alert("La etiqueta ya existe o no es válida.");
  }
}

function actualizarTablaCompleta() {
  tbody.innerHTML = "";
  const misProductos = moduloProductos.getStock();
  let contador = 1;

  const filtroTitulo = filtrosActivos.titulo.toUpperCase().trim();
  const filtroDescripcion = filtrosActivos.descripcion.toUpperCase().trim();
  let filtroCantidad;
  if (filtrosActivos.cantidad) {
    filtroCantidad = parseInt(filtrosActivos.cantidad);
  } else {
    filtroCantidad = null;
  }
  const filtroEtiqueta = filtrosActivos.etiqueta.toUpperCase().trim();

  for (const [id, producto] of misProductos) {
    // Validacion de Filtros
    if (filtroTitulo && !producto.nombre.toUpperCase().includes(filtroTitulo))
      continue;
    if (
      filtroDescripcion &&
      !producto.descripcion.toUpperCase().includes(filtroDescripcion)
    )
      continue;
    if (filtroCantidad !== null && producto.cantidad !== filtroCantidad)
      continue;
    if (filtroEtiqueta) {
      let tieneEtiqueta = false;
      for (let i = 0; i < producto.etiquetas.length; i++) {
        if (producto.etiquetas[i].toUpperCase() === filtroEtiqueta) { 
          tieneEtiqueta = true;
          break;
        }
      }
      if (!tieneEtiqueta) continue;
    }
    

    const fila = crearFilaProducto(
      producto,
      contador,
      eliminarProducto,
      iniciarEdicionProducto,
    );
    tbody.appendChild(fila);
    contador++;
  }
}

function registrarNuevoProducto() {
  const titulo = document.getElementById("registroTitulo").value.trim();
  const info = document.getElementById("registroInfo").value.trim();
  const stock = parseInt(document.getElementById("registroStock").value);
  const valor = parseFloat(document.getElementById("registroValor").value);
  
  if (!titulo || !info || isNaN(stock) || isNaN(valor)) {
    alert("Por favor completar los campos faltantes");
    return;
  }

  const misProductos = moduloProductos.getStock(); // Traemos el Map de productos
  let nombreDuplicado = false;

  for (const [id, producto] of misProductos) {
    if (producto.nombre.toUpperCase().trim() === titulo.toUpperCase()) {
      nombreDuplicado = true;
      break;
    }
  }

  if (nombreDuplicado) {
    alert("ya existe un producto registrado con ese nombre, elegir otro.");
    return;
  }

  const etiquetasArray = [];
  const opcionesSeleccionadas = registroEtiquetas.selectedOptions;
  for (let i = 0; i < opcionesSeleccionadas.length; i++) {
    etiquetasArray.push(opcionesSeleccionadas[i].value);
  }

  moduloProductos.setProducto(titulo, etiquetasArray, info, stock, valor);

  actualizarTablaCompleta();
  formRegistro.reset();
  //busco si hay un modal activo
  const modalOcultarInstancia = bootstrap.Modal.getInstance(
    document.getElementById("modal"),
  );
  //si el modal existe, lo oculto
  if (modalOcultarInstancia) modalOcultarInstancia.hide();
}

function iniciarEdicionProducto(id) {
  idProductoEnEdicion = id;
  const producto = moduloProductos.getProducto(id);

  if (producto) {
    document.getElementById("editar-titulo").value = producto.nombre;
    document.getElementById("editar-info").value = producto.descripcion;
    document.getElementById("editar-stock").value = producto.cantidad;
    document.getElementById("editar-valor").value = producto.valor;

    const selectEditar = document.getElementById("selectEditarEtiquetas");
    selectEditar.innerHTML = "";

    const listaGlobal = moduloEtiquetas.getEtiquetas();
    for (let i = 0; i < listaGlobal.length; i++) {
      const etiqueta = listaGlobal[i];
      const optionEtiqueta = document.createElement("option");
      optionEtiqueta.value = etiqueta;
      optionEtiqueta.textContent = etiqueta;

      // Si el producto actual tiene esta etiqueta, queda marcado (selected = true)
      if (producto.etiquetas) {
        for (let j = 0; j < producto.etiquetas.length; j++) {
          if (producto.etiquetas[j] === etiqueta) {
            optionEtiqueta.selected = true;
            break;
          }
        }
      }
      selectEditar.appendChild(optionEtiqueta);
    }
  }
}

function guardarCambiosProducto() {
  //chequeo que haya un producto en edicion (que idProductoEnEdicion no sea null)
  if (!idProductoEnEdicion) return;

  const tituloNuevo = document.getElementById("editar-titulo").value.trim();
  const informacionNueva = document.getElementById("editar-info").value.trim();
  const stockNuevo = parseInt(document.getElementById("editar-stock").value);
  const nuevoValor = parseFloat(document.getElementById("editar-valor").value);
  const selectEditar = document.getElementById("selectEditarEtiquetas");
  const etiquetasNuevas = [];

  const opcionesEditadas = selectEditar.selectedOptions;
  for (let i = 0; i < opcionesEditadas.length; i++) {
    etiquetasNuevas.push(opcionesEditadas[i].value);
  }

  moduloProductos.editarProducto(
    idProductoEnEdicion,
    tituloNuevo,
    informacionNueva,
    stockNuevo,
    nuevoValor,
  );
  const producto = moduloProductos.getProducto(idProductoEnEdicion);
  if (producto) producto.etiquetas = etiquetasNuevas;

  moduloProductos.saveStock();

  //reemplazo directo de la fila en el HTML
  const filaVieja = tbody.querySelector(`[data-id="${idProductoEnEdicion}"]`);
  if (filaVieja && producto) {
    const numeroActual = filaVieja.querySelector("td").textContent;

    const filaNueva = crearFilaProducto(
      producto,
      numeroActual,
      eliminarProducto,
      iniciarEdicionProducto,
    );
    tbody.replaceChild(filaNueva, filaVieja);
  }

  //chekeo si el modal esta activo, si esta lo oculto y borro idProductoEnEdicion
  const modalEditarInstancia = bootstrap.Modal.getInstance(
    document.getElementById("modalEditar"),
  );
  if (modalEditarInstancia) {
    modalEditarInstancia.hide();
    idProductoEnEdicion = null;
  }
}

function eliminarProducto(id) {
  moduloProductos.removeProducto(id);

  const filaAEliminar = tbody.querySelector(`[data-id="${id}"]`);
  if (filaAEliminar) {
    filaAEliminar.remove();
  }
}

function aplicarFiltros() {
  filtrosActivos.titulo = filtroTitulo.value;
  filtrosActivos.descripcion = filtroDescripcion.value;
  filtrosActivos.cantidad = filtroStock.value;
  filtrosActivos.etiqueta = filtroEtiqueta.value;
  actualizarTablaCompleta();
}

function resetearFiltros() {
  filtrosActivos.titulo = "";
  filtrosActivos.descripcion = "";
  filtrosActivos.cantidad = "";
  filtrosActivos.etiqueta = "";
  filtroTitulo.value = "";
  filtroDescripcion.value = "";
  filtroStock.value = "";
  filtroEtiqueta.value = "";
  actualizarTablaCompleta();
}

actualizarSelectoresEtiquetas();
actualizarTablaCompleta();
