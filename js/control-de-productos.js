window.addEventListener("load", iniciar);

import { crearFilaProducto } from "../modulos/crearDomElements.js";
import * as moduloProductos from "../modulos/stock.js";
import * as moduloEtiquetas from "../modulos/etiquetas.js";
import * as productosDisponibles from "../modulos/productosDisponibles.js"
import * as sesionActual from "../modulos/sesionActual.js"; 
let funcionParaBotonEditar = null;


const tbody = document.getElementById("cuerpoDeTabla");
const formRegistro = document.getElementById("formRegistroProductos");
const botonGuardar = document.getElementById("botonRegistroGuardar");
const botonGuardarCambios = document.getElementById("botonGuardarCambios");
const inputTitulos = document.getElementById("inputTitulos")

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
inputTitulos.addEventListener("change", actualizarImagenRegistro);


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
    divItem.className ="d-flex justify-content-between align-items-center p-2 border rounded bg-white";

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
    if (filtroTitulo && !producto.nombre.replace(/-/g, ' ').toUpperCase().includes(filtroTitulo))
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
  const info = document.getElementById("registroInfo").value.trim();
  const stockValue = document.getElementById("registroStock").value;
  const valorValue = document.getElementById("registroValor").value;
  const stock = parseInt(stockValue);
  const valor = parseFloat(valorValue);
  const tituloElegido = inputTitulos.value;
  const direccionImagen = document.getElementById("contenedorImagenRegistro");

  if (!tituloElegido || tituloElegido === "") {
    alert("Por favor selecciona un producto de la lista.");
    return;
  }

  if (info === "") {
    alert("Por favor ingresa una descripción para el producto.");
    return;
  }

  // Si están vacíos o el parseo se hizo sobre nada(parseFloat o int(nada) = nan), o metieron números negativos
  if (stockValue === "" || isNaN(stock) || stock < 0) {
    alert("Por favor ingresa un número de stock válido (mayor o igual a 0).");
    return;
  }

  if (valorValue === "" || isNaN(valor) || valor <= 0) {
    alert("Por favor ingresa un precio válido (mayor a 0).");
    return;
  }

  const misProductos = moduloProductos.getStock(); 
  let nombreDuplicado = false;

  const tituloSinCaracteres = tituloElegido.replace(/-/g, ' ').toUpperCase().trim();

  for (const [id, producto] of misProductos) {
    const tituloStockSinCaracteres = producto.nombre.replace(/-/g, ' ').toUpperCase().trim();
    if (tituloStockSinCaracteres === tituloSinCaracteres) {
      nombreDuplicado = true;
      break;
    }
  }

  if (nombreDuplicado) {
    alert("Ya existe un producto registrado con ese nombre, elegir otro.");
    return;
  }

  const etiquetasArray = [];
  const opcionesSeleccionadas = registroEtiquetas.selectedOptions;
  for (let i = 0; i < opcionesSeleccionadas.length; i++) {
    etiquetasArray.push(opcionesSeleccionadas[i].value);
  }

  moduloProductos.setProducto(tituloElegido, etiquetasArray, info, stock, valor);

  actualizarTablaCompleta();
  formRegistro.reset();

  const imagenModal = document.getElementById("vistaPreviaImagenRegistro");
  if (imagenModal) {
    imagenModal.src = "";          
    imagenModal.classList.add("d-none"); 
  }

  const modalOcultarInstancia = bootstrap.Modal.getInstance(
    document.getElementById("modal"),
  );
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

/* const listaGlobal = moduloEtiquetas.getEtiquetas();
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
    } */ 
function renderListaProductosDisponibles() {
  const inputTitulos = document.getElementById("inputTitulos")
  const listaDeProductos = productosDisponibles.get()
  inputTitulos.innerHTML

  const optionDefault = document.createElement("option")
  optionDefault.value = ""
  optionDefault.textContent = "Selecione un producto..."
  inputTitulos.appendChild(optionDefault)

  for (let i=0; i<listaDeProductos.length; i++) {
    const producto = listaDeProductos[i];
    const optionProducto = document.createElement("option")
    optionProducto.value = producto
    const textoUsuario = producto.replace(/-/g, ' ');
    optionProducto.textContent = textoUsuario.toUpperCase() 
    inputTitulos.appendChild(optionProducto);
  }
}

function actualizarImagenRegistro() {
  const imgElement = document.getElementById("vistaPreviaImagenRegistro");
  const claveProducto = inputTitulos.value; 
  console.log("Entre a actualizar imagen")
  console.log(claveProducto)
  if (claveProducto === "") {
    imgElement.src = "";
    imgElement.classList.add("d-none");
  } else {
    imgElement.src = `img/${claveProducto}.png`;
    imgElement.classList.remove("d-none"); 
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

function iniciar() {
  renderListaProductosDisponibles();
  actualizarSelectoresEtiquetas();
  actualizarTablaCompleta();
}
