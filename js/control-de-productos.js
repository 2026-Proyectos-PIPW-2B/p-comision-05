import * as moduloProductos from "../modulos/stock.js";
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
const botonResetearFiltros = document.getElementById("botonResetearFiltros");
const filtroTitulo = document.getElementById("filtroTitulo");
const filtroDescripcion = document.getElementById("filtroDescripcion");
const filtroStock = document.getElementById("filtroStock");
const filtroEtiqueta = document.getElementById("filtroEtiqueta");
const botonAplicarFiltros = document.getElementById("botonAplicarFiltros");

const misProductos = moduloProductos.getStock();

const filtros = {
  titulo: "",
  descripcion: "",
  cantidad: "",
  etiqueta: "",
};

botonResetearFiltros.addEventListener("click", function () {
  filtros.titulo = "";
  filtros.descripcion = "";
  filtros.cantidad = "";
  filtros.etiqueta = "";

  filtroTitulo.value = "";
  filtroDescripcion.value = "";
  filtroDescripcion.value = "";
  filtroStock.value = "";
  filtroEtiqueta.value = "";

  mostrarProductos();
});

botonAplicarFiltros.addEventListener("click", function () {
  console.log("estoy en el boton de filtros");
  filtros.titulo = filtroTitulo.value;
  filtros.descripcion = filtroDescripcion.value;
  filtros.cantidad = filtroStock.value;
  filtros.etiqueta = filtroEtiqueta.value;
  mostrarProductos();
});

export function mostrarProductos() {
  const misProductos = moduloProductos.getStock();
  tbody.innerHTML = "";
  let contador = 1;

  //variables del filtro
  let titulo = filtros.titulo.toUpperCase().trim();
  let descripcion = filtros.descripcion.toUpperCase().trim();
  let cantidad = filtros.cantidad;
  let etiqueta = filtros.etiqueta.toUpperCase().trim();
  let estadoDeFiltro = !(
    titulo === "" &&
    descripcion === "" &&
    cantidad === "" &&
    etiqueta === ""
  );

  for (const [id, producto] of misProductos) {
    console.log("estoy viendo un producto");
    console.log(producto);
    //filtrado
    if (estadoDeFiltro) {
      if (titulo !== "" && !producto.nombre.toUpperCase().includes(titulo))
        continue; //si estaba buscando por titulo y el titulo no coincide, no lo muestra

      if (
        descripcion !== "" &&
        !producto.descripcion.toUpperCase().includes(descripcion)
      )
        continue;

      if (cantidad !== "" && !(producto.cantidad === parseInt(cantidad)))
        continue;

      if (etiqueta !== "") {
        let encontro = false;
        const arrayEtiquetas = producto.etiquetas;
        for (let i = 0; i < arrayEtiquetas.length && !encontro; i++) {
          encontro = arrayEtiquetas[i].toUpperCase() === etiqueta;
        }
        if (!encontro) continue;
      }
    }

    console.log(document.getElementById(id));
    //creacion de tabla
    const fila = document.createElement("tr");
    fila.id = producto.id;
    //#
    let celda = document.createElement("td");
    celda.textContent = contador;
    fila.appendChild(celda);

    //Titulo
    let celdaTitulo = document.createElement("td");
    celdaTitulo.textContent = producto.nombre;
    fila.appendChild(celdaTitulo);

    //Información
    const celdaDescripcion = document.createElement("td");
    celdaDescripcion.textContent = producto.descripcion;
    fila.appendChild(celdaDescripcion);

    //Stock
    const celdaStock = document.createElement("td");
    celdaStock.textContent = producto.cantidad;
    fila.appendChild(celdaStock);

    //Etiquetas

    const celdaEtiquetas = document.createElement("td");
    const etiquetas = producto.etiquetas;
    if (etiquetas.length > 0) {
      for (let i = 0; i < etiquetas.length; i++) {
        const contenedorEtiqueta = document.createElement("div");
        const etiqueta = document.createElement("span");
        etiqueta.textContent = etiquetas[i];
        //<i class="bi bi-backspace-reverse"></i>
        const icono = document.createElement("i");
        icono.classList.add("bi", "bi-backspace-reverse", "d-none");

        icono.classList.add("btn", "btn-sm");
        contenedorEtiqueta.classList.add("d-flex");
        contenedorEtiqueta.classList.add(coloresRandon());
        contenedorEtiqueta.classList.add("badge", "rounded-pill");

        contenedorEtiqueta.appendChild(etiqueta);
        etiqueta.appendChild(icono);
        celdaEtiquetas.appendChild(contenedorEtiqueta);

        icono.addEventListener("click", function (e) {
          console.log("estoy en el boton");
          //eliminar etiqueta
          contenedorEtiqueta.classList.add("d-none");
        });
      }
      fila.appendChild(celdaEtiquetas);

      //Valor
      const celdaValor = document.createElement("td");
      celdaValor.textContent = "$" + producto.valor;
      fila.appendChild(celdaValor);

      //Acciones
      const celdaBotones = document.createElement("td");
      celdaBotones.appendChild(crearBotonEliminar(id));
      celdaBotones.appendChild(crearBotonEditar(id));
      fila.appendChild(celdaBotones);

      tbody.appendChild(fila);
      contador++;
    }
  }
}
function crearBotonEliminar(id) {
  const botonEliminar = document.createElement("i");
  botonEliminar.classList.add("bi", "bi-trash3-fill", "btn", "btn-sm");

  botonEliminar.addEventListener("click", function () {
    moduloProductos.removeProducto(id);
    mostrarProductos();
    //document.getElementById(id).remove() usar para eliminar elementos
  });
  return botonEliminar;
}

function crearBotonEditar(id) {
  document
    .querySelectorAll(".etiquetasEditar .choclo")
    .forEach(function (hijo) {
      hijo.remove();
    });
  const botonEditar = document.createElement("i");
  const botonGuardarCambios = document.getElementById("botonGuardarCambios");

  botonEditar.classList.add("bi", "bi-pencil-square", "btn", "btn-sm");

  // Hago que el boton me apunte al modal editar, de esta forma cuando toco el boton, se abre ese modal
  botonEditar.setAttribute("data-bs-toggle", "modal");
  botonEditar.setAttribute("data-bs-target", "#modalEditar");

  botonEditar.addEventListener("click", function () {
    let elementos = document.querySelectorAll(".choclo");
    elementos.forEach((elemento) => {
      elemento.remove();
    });
    document
      .querySelectorAll(".etiquetasEditar .choclo")
      .forEach(function (hijo) {
        hijo.remove();
      });
      
    const producto = moduloProductos.getProducto(id);

    if (producto) {
      document
        .querySelectorAll(".etiquetasEditar .choclo")
        .forEach(function (hijo) {
          hijo.remove();
        });
      //asigno los value correspondientes al modal
      document.getElementById("editar-titulo").value = producto.nombre;
      document.getElementById("editar-info").value = producto.descripcion;
      document.getElementById("editar-stock").value = producto.cantidad;
      document.getElementById("editar-valor").value = producto.valor;
      let etiquetas = document.getElementById("editar-etiquetas");
      mostrarEtiquetas(etiquetas, producto.etiquetas);

      funcionParaBotonEditar = function () {
        document
          .querySelectorAll(".etiquetasEditar .choclo")
          .forEach(function (hijo) {
            hijo.remove();
          });
        let idProducto = producto.id;
        let tituloNuevo = document.getElementById("editar-titulo").value;
        let informacionNueva = document.getElementById("editar-info").value;
        let inputModalEtiquetas = document.getElementById("editar-etiquetas");
        let stockNuevo = document.getElementById("editar-stock").value;
        let nuevoValor = document.getElementById("editar-valor").value;

        // Modifico el objeto original, con los elementos ingresados
        moduloProductos.editarProducto(
          idProducto,
          tituloNuevo,
          informacionNueva,
          stockNuevo,
          nuevoValor,
        );
        // guardo en LocalStorage, muestro la tabla y termino el evento del modal
        moduloProductos.saveStock();
        mostrarProductos();

        // se cierra el modal de edición
        document.querySelector("#modalEditar .btn-close").click();
        document
          .querySelectorAll(".etiquetasEditar .choclo")
          .forEach(function (hijo) {
            hijo.remove();
          });
      };
      botonGuardarCambios.addEventListener("click", funcionParaBotonEditar);
    }
  });
  return botonEditar;
}

//Agrego un listener al cierre del modal(funciona cuando se toca la cruz o hago click fuera del modal o con escape)
document
  .getElementById("modalEditar")
  .addEventListener("hide.bs.modal", function () {
    const botonGuardarCambios = document.getElementById("botonGuardarCambios");

    //si hay una funcion en la memoria, la elimino
    if (funcionParaBotonEditar !== null) {
      botonGuardarCambios.removeEventListener("click", funcionParaBotonEditar);
      //reseteo porque borre el evento
      funcionParaBotonEditar = null;
    }
  });

function mostrarEtiquetas(input, array) {
  console.log(input);
  for (let i = 0; i < array.length; i++) {
    const contenedorEtiqueta = document.createElement("div");
    const etiqueta = document.createElement("span");
    etiqueta.textContent = array[i];
    //<i class="bi bi-backspace-reverse"></i>
    const icono = document.createElement("i");
    icono.classList.add("bi", "bi-backspace-reverse");

    icono.classList.add("btn", "btn-sm");
    contenedorEtiqueta.classList.add(coloresRandon());
    contenedorEtiqueta.classList.add("badge", "rounded-pill");
    etiqueta.classList.add("choclo");

    contenedorEtiqueta.appendChild(etiqueta);
    etiqueta.appendChild(icono);
    input.appendChild(contenedorEtiqueta);

    icono.addEventListener("click", function (e) {
      console.log("estoy en el boton");
      //eliminar etiqueta
      contenedorEtiqueta.classList.add("");
    });
  }
}

function coloresRandon() {
  const colores = [
    "text-bg-primary",
    "text-bg-secondary",
    "text-bg-success",
    "text-bg-danger",
    "text-bg-warning",
    "text-bg-info",
    "text-bg-light",
    "text-bg-dark",
    "text-bg-white",
  ];
  const randomIndex = Math.floor(Math.random() * colores.length);
  return colores[randomIndex];
}

mostrarProductos();
