import * as moduloProductos from "../modulos/stock.js";
import { crearFilaProducto } from "../modulos/crearDomElements.js";
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


//funciones 
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
  const registroEtiquetas = document
    .getElementById("registroEtiquetas")
    .value.trim();

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

  let etiquetasArray = [];
  if (registroEtiquetas) {
    const arraySeparado = registroEtiquetas.split(",");
    for (let i = 0; i < arraySeparado.length; i++) {
      etiquetasArray.push(arraySeparado[i].trim());
    }
  }

  moduloProductos.setProducto(titulo, etiquetasArray, info, stock, valor);
  const todosLosProductos = moduloProductos.getStock();
  const llaves = Array.from(todosLosProductos.keys());
  const ultimoId = llaves[llaves.length - 1];
  const productoCreado = moduloProductos.getProducto(ultimoId);

  const proximoIndice = tbody.children.length + 1;

  if (productoCreado) {
    const nuevaFila = crearFilaProducto(productoCreado,proximoIndice,eliminarProducto,iniciarEdicionProducto,);
    tbody.appendChild(nuevaFila);
  }

  formRegistro.reset();
  //busco si hay un modal activo
  const modalInstancia = bootstrap.Modal.getInstance(
    document.getElementById("modal"),
  );
  //si el modal existe, lo oculto
  if (modalInstancia) modalInstancia.hide();
}

function iniciarEdicionProducto(id) {
  idProductoEnEdicion = id;
  const producto = moduloProductos.getProducto(id);

  if (producto) {
    document.getElementById("editar-titulo").value = producto.nombre;
    document.getElementById("editar-info").value = producto.descripcion;
    document.getElementById("editar-stock").value = producto.cantidad;
    document.getElementById("editar-valor").value = producto.valor;

    const divEtiquetas = document.getElementById("editar-etiquetas");
    let inputEtiquetas = divEtiquetas.querySelector("input.inputEtiquetas");
    if (!inputEtiquetas) {
      inputEtiquetas = document.createElement("input");
      inputEtiquetas.classList.add("form-control", "inputEtiquetas", "mt-2");
      divEtiquetas.appendChild(inputEtiquetas);
    }
    if (producto.etiquetas) {
      //con join se unen todos elementos de un array a string, con una "," y un espacio
      inputEtiquetas.value = producto.etiquetas.join(", ");
    } else {
      inputEtiquetas.value = "";
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
  const inputEtiquetas = document
    .getElementById("editar-etiquetas")
    .querySelector(".inputEtiquetas");
  let etiquetasNuevas = [];
  if (inputEtiquetas && inputEtiquetas.value) {
    const arraySeparado = inputEtiquetas.value.split(",");
    for (let i = 0; i < arraySeparado.length; i++) {
      etiquetasNuevas.push(arraySeparado[i].trim()); //tambien elimino los espacios de la etiqueatas
    }
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
  const modalInstancia = bootstrap.Modal.getInstance(
    document.getElementById("modalEditar"),
  );
  if (modalInstancia) {
  modalInstancia.hide();
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

actualizarTablaCompleta()