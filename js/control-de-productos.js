import * as moduloProductos from "../modulos/stock.js";

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
    ["Panificado", "Salchicha "],
    "Pan dulce, relleno de pistacho con salchichas",
    8,
    125000,
  );
}

const tbody = document.getElementById("cuerpoDeTabla");

//
const misProductos = moduloProductos.getStock();


function mostrarProductos() {
  const misProductos = moduloProductos.getStock();
  tbody.innerHTML = "";
  let contador = 1;

  for (const [id, producto] of misProductos) {
    const fila = document.createElement("tr");

    //#
    const celda = document.createElement("td");
    celda.textContent = contador;
    fila.appendChild(celda);

    //Titulo
    const celdaTitulo = document.createElement("td");
    titulo=document.createElement("input")
    titulo.classList.add("form-check-input")
    titulo.value = producto.titulo
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

        contenedorEtiqueta.classList.add("d-flex");

        contenedorEtiqueta.appendChild(etiqueta);
        celdaEtiquetas.appendChild(contenedorEtiqueta);
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
  function crearBotonEliminar(id) {
    const botonEliminar = document.createElement("i");
    botonEliminar.classList.add("bi", "bi-trash3-fill","btn", "btn-sm");

    botonEliminar.addEventListener("click", function () {
      moduloProductos.removeProducto(id);
      mostrarProductos();
    });
    return botonEliminar;
  }

  function crearBotonEditar(id) {
    const botonEditar = document.createElement("i");
    botonEditar.classList.add("bi", "bi-pencil-square","btn", "btn-sm");
    botonEditar.addEventListener("click", function () {
      getProducto(id)

    });
    return botonEditar;
  }
}
mostrarProductos();
