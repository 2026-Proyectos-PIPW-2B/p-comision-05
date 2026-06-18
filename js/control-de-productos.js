import * as moduloProductos from "../modulos/stock.js";

//para probar la tabla
//Simulacion de local storage
if (!localStorage.getItem("stock")) {
  console.log("Seteo datos en local Storage");
  
  moduloProductos.setProductoToStock(
    "Medialuna", 
    ["Glaseado", "Panificado"], 
    "Medialuna glaseada con chispas sabor menta", 
    15, 
    45000
  );
  
  moduloProductos.setProductoToStock(
    "Torta de chocolate", 
    ["Tortas"], 
    "Torta de chocolate con relleno de dulce de leche", 
    30, 
    18000
  );
  
  moduloProductos.setProductoToStock(
    "Pan Dulce de pistacho", 
    ["Panificado", "Salchicha "], 
    "Pan dulce, relleno de pistacho con salchichas", 
    8, 
    125000
  );
}

const tbody = document.getElementById("cuerpoDeTabla");

//
console.log("fuera del for")
const misProductos = moduloProductos.getStock();
  console.log(misProductos)

function mostrarProductos() {
  const misProductos = moduloProductos.getStock();
  console.log(misProductos)
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

    //Etiquetas - no esta completo
    const celdaEtiquetas = document.createElement("td");
    const etiquetas = producto.etiquetas;
    if (etiquetas.length > 0) {
      for (let i = 0; i < etiquetas.length; i++)
        celdaEtiquetas.textContent += etiquetas[i]+" ";
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
  const boton = document.createElement("button");
  const botonEliminar = document.createElement("i");
  botonEliminar.classList.add("bi", "bi-trash3-fill");
  boton.appendChild(botonEliminar);

  boton.addEventListener("click", function () {
    console.log("Borre un producto")
    moduloProductos.removeProducto(id);
    mostrarProductos()
  });
  return boton;
}

function crearBotonEditar(id) {
  const boton = document.createElement("button");
  const botonEditar = document.createElement("i");
  botonEditar.classList.add("bi", "bi-pencil-square");
  boton.appendChild(botonEditar);

  boton.addEventListener("click", function () {
    console.log("Estoy en el boton");
    
    
  });
  return boton; 
}
mostrarProductos()