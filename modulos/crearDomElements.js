import { Producto } from "../clases/Producto.js"
import { Carrito } from "../clases/Carrito.js"
import * as sesionActual from "./sesionActual.js"
import * as stock from "./stock.js"
import * as carritos from "./carritos.js"
import * as registros from "./registros.js"

{
  /* <div class="col d-flex justify-content-center">
    <div class="card w-100">
        <img src="img\medialuna.png" class="card-img-top" alt="medialuna">
        <div class="card-body d-flex flex-column">
            <h5 class="card-title">Medialunas</h5>
            <p class="card-text">Facturas frescas </p>
            <div class="d-flex justify-content-between align-items-center">        
                <span class="fs-5">$9000 C/U</span>
                <a href="#" class="btn btn-primary"><i class="bi bi-cart-plus"></i></a>
            </div>
        </div>
    </div>
</div> */}

function changeCantidadProducto() {
    const numero = Number(this.value)
    if (numero < Number(this.min)) {
        this.value = this.min
    }
    else if (numero > Number(this.max)) {
        this.value = this.max
    }
}

function handlerAñadirACarrito() {
    const carritoActual = carritos.getCarrito(sesionActual.get().nombreUsuario)
    const inputCantidad = document.getElementById(`${this.dataset.id}/cantidad`)
    const cantidadAgregar = Number(inputCantidad.value)
    const productoStock = stock.getProducto(this.dataset.id)
    let productoCarrito = carritoActual.getProducto(productoStock.id)
    if (!productoCarrito || (productoCarrito.cantidad + cantidadAgregar) <= productoStock.cantidad) {
        bootstrap.Popover.getOrCreateInstance(document.getElementById(`${this.dataset.id}/button`)).hide()
        carritoActual.setProducto(productoStock, cantidadAgregar)
        carritos.saveCarritos()
        inputCantidad.max  = inputCantidad.max - cantidadAgregar
        setTimeout(() => {inputCantidad.value = 1}, 1000)
    }
    productoCarrito = carritoActual.getProducto(productoStock.id)
    if (productoCarrito.cantidad == productoStock.cantidad) {
        const span = document.getElementById(`${productoStock.id}/span`)
        span.textContent = ""
        span.className = "text-danger text-end"
        const iExclamation = document.createElement("i")
        iExclamation.className = "bi bi-exclamation-circle-fill"
        span.append(iExclamation)
        span.append(" Todos agregados")
        document.getElementById(`${productoStock.id}/button`).disabled = "true"
    }
}

/**
 * Crea una tarjeta de un Producto dado para mostrarla en la tienda.
 *
 * @param {Producto} producto - El objeto Producto sobre el cual se quiere crear la tarjeta.
 * @returns 
 */
export function createTarjetaTienda(producto) {
    // Primero
    const divContenedor = document.createElement("div")
    divContenedor.id = producto.id
    divContenedor.classList.add("col", "d-flex", "justify-content-center")
    // Segundo
    const divTarjeta = document.createElement("div")
    divTarjeta.classList.add("card", "w-100", "shadow")
    // Tercero
    const img = document.createElement("img")
    img.src = producto.imagen
    img.alt = producto.nombre
    img.classList.add("card-img-top")
    const divBody = document.createElement("div")
    divBody.className = "card-body d-flex flex-column"
    // Cuarto
    const h5 = document.createElement("h5")
    h5.textContent = producto.nombre.charAt(0).toUpperCase() + producto.nombre.slice(1).replace(/-/g, ' ')
    h5.className = "card-title fw-semibold"
    const p = document.createElement("p")
    p.textContent = producto.descripcion
    p.classList.add("card-text", "h-50", "card-descripcion")
    const divPrecio = document.createElement("div")
    divPrecio.classList.add("d-flex", "justify-content-between", "align-items-center")
    // Quinto
    const span = document.createElement("span")
    span.textContent = `$${producto.valor} C/U`
    span.className = "text-secondary fs-5"
    span.id = `${producto.id}/span`

    const button = document.createElement("button")
    button.className = "btn btn-primary align-self-end"
    button.id = `${producto.id}/button`
    // Crear popover
    const divPopover = document.createElement("div")
    divPopover.classList.add("d-flex")
    // Agrego los botones y inputs del popover
    const inputCantidad = document.createElement("input")
    inputCantidad.classList.add("form-control", "fw-semibold", "border-info", "text-center")
    inputCantidad.type = "number"
    inputCantidad.min = "1"
    const productoCarrito = carritos.getCarrito(sesionActual.get().nombreUsuario).getProducto(producto.id)
    if (productoCarrito) {
        inputCantidad.max = producto.cantidad - productoCarrito.cantidad
    }
    else {
        inputCantidad.max = producto.cantidad
    }
    inputCantidad.value = "1"
    inputCantidad.id = `${producto.id}/cantidad`
    inputCantidad.dataset.id = producto.id
    inputCantidad.addEventListener("change", changeCantidadProducto)

    const buttonAgregar = document.createElement("button")
    buttonAgregar.dataset.id = producto.id
    buttonAgregar.classList.add("btn", "btn-info", "ms-neutral")
    buttonAgregar.addEventListener("click", handlerAñadirACarrito)
    const iAgregar = document.createElement("i")
    iAgregar.classList.add("bi", "bi-cart-plus")
    buttonAgregar.append(iAgregar)
    divPopover.append(inputCantidad, buttonAgregar)
    const popoverConDOM = new bootstrap.Popover(button, {
        content: divPopover, // <-- Pasamos el nodo del DOM directamente
        html: true, 
        trigger: 'click',
        sanitize: false, // Requerido si tu elemento tiene eventos inline como onclick
        placement: `top`,
        customClass: `custom-popover`
    })
    // Sexto
    const i = document.createElement("i")
    i.classList.add("bi", "bi-bag")

    // Chequeo cantidad
    if (productoCarrito && productoCarrito.cantidad >= producto.cantidad) {
        span.textContent = ""
        span.className = "text-danger text-end"
        const iExclamation = document.createElement("i")
        iExclamation.className = "bi bi-exclamation-circle-fill"
        span.append(iExclamation)
        span.append(" Todos agregados")
        button.disabled = "true"
    }

    // Anidamiento
    button.append(i)
    divPrecio.append(span, button)
    divBody.append(h5, p, divPrecio)
    divTarjeta.append(img, divBody)
    divContenedor.append(divTarjeta)
    return divContenedor
}

{/* <div class="d-flex flex-wrap rounded rounded-2 border p-neutral mb-neutral shadow">
    <div class="w-15">
        <img src="img/medialuna.png" alt="medialuna" class="w-100 rounded rounded-2">
    </div>
    <div class="w-85 ps-neutral d-flex flex-column">
        <h5>Medialunas</h5>
        <p class="flex-grow-1">Facturas frescas</p>
        <p id="totalProducto" class="m-0 fs-5 fw-semibold text-end">$9000</p>
    </div>
    <div class="w-100 pt-neutral border-top mt-neutral">
        <div class="w-100 d-flex justify-content-end">
            <button type="button" class="btn btn-outline-info mx-neutral"><i class="bi bi-dash"></i></button>
            <div class="d-flex align-items-center">
                <span class="fw-semibold">12</span>
            </div>
            <button type="button" class="btn btn-outline-info mx-neutral"><i class="bi bi-plus"></i></button>
            <button type="button" class="btn btn-info"><i class="bi bi-trash3"></i></button>
        </div>
    </div>
</div> */}


function handlerRemoverProducto() {
    const carritoActual = carritos.getCarrito(sesionActual.get().nombreUsuario)
    document.getElementById(this.dataset.id).remove()
    carritoActual.removeProducto(this.dataset.id)
    carritos.saveCarritos()
    document.getElementById("spanTotalCompra").textContent = `$${carritoActual.valorTotal}`
    document.getElementById("spanEnvio").textContent = `$${carritoActual.envio}`
}

function changeCantidadProductoCarrito() {
    const carritoActual = carritos.getCarrito(sesionActual.get().nombreUsuario)
    const producto = carritoActual.getProducto(this.dataset.id)
    producto.cantidad = this.value
    carritos.saveCarritos()
    document.getElementById(`${this.dataset.id}/total`).textContent = `$${producto.valorTotal}`
    document.getElementById("spanTotalCompra").textContent = `$${carritoActual.valorTotal}`
    document.getElementById("spanEnvio").textContent = `$${carritoActual.envio}`
}

/**
 * 
 * 
 * @param {Producto} producto 
 * @returns {HTMLElement}
 */
export function createTarjetaCarrito(producto, agregar) {
    // Primero
    const divContenedor = document.createElement("div")
    divContenedor.className = "d-flex flex-wrap rounded rounded-2 border p-neutral mb-neutral bg-white shadow"
    divContenedor.id = producto.id
    // Segundo
    const divImagen = document.createElement("div")
    divImagen.classList.add("w-15")
    // Tercero
    const img = document.createElement("img")
    img.classList.add("w-100", "rounded", "rounded-2")
    img.src = producto.imagen
    img.alt = producto.nombre
    // Segundo
    const divInfo = document.createElement("div")
    divInfo.classList.add("w-85", "ps-neutral", "d-flex", "flex-column")
    // Tercero
    const h5 = document.createElement("h5")
    h5.textContent = producto.nombre.charAt(0).toUpperCase() + producto.nombre.slice(1).replace(/-/g, ' ')
    h5.className = "fw-semibold border-bottom pb-neutral"
    const pDescripcion = document.createElement("p")
    pDescripcion.classList.add("flex-grow-1")
    pDescripcion.textContent = producto.descripcion
    const pTotal = document.createElement("p")
    pTotal.className = "m-0 fs-5 fw-semibold text-end text-secondary"
    pTotal.id = `${producto.id}/total`
    pTotal.textContent = `$${producto.valorTotal}`
    // Segundo
    const divCantidad = document.createElement("div")
    divCantidad.classList.add("w-100", "pt-neutral", "border-top", "mt-neutral", "d-flex", "justify-content-end", "align-items-baseline")
    // Tercero
    const inputCantidad = document.createElement("input")
    inputCantidad.className = "form-control fw-semibold border-primary w-8 text-center mx-neutral"
    inputCantidad.type = "number"
    inputCantidad.min = "1"
    inputCantidad.max = stock.getProducto(producto.id).cantidad
    inputCantidad.value = producto.cantidad
    inputCantidad.id = `${producto.id}/cantidad`
    inputCantidad.dataset.id = producto.id
    inputCantidad.addEventListener("change", changeCantidadProducto)
    inputCantidad.addEventListener("change", changeCantidadProductoCarrito)
    if (producto.cantidad >= inputCantidad.max) {
        const spanTexto = document.createElement("span")
        spanTexto.textContent = `Ultimas ${producto.cantidad} disponibles!`
        spanTexto.className = "text-danger"
        divCantidad.append(spanTexto)
    }
    
    const buttonEliminar = document.createElement("button")
    buttonEliminar.classList.add("btn", "btn-primary")
    buttonEliminar.dataset.id = producto.id
    buttonEliminar.addEventListener("click", handlerRemoverProducto)
    const iEliminar = document.createElement("i")
    iEliminar.classList.add("bi", "bi-trash3")
    buttonEliminar.append(iEliminar)

    // Anidamiento
    divImagen.append(img)
    divInfo.append(h5, pDescripcion, pTotal)
    divCantidad.append(inputCantidad, buttonEliminar)
    divContenedor.append(divImagen, divInfo, divCantidad)
    agregar.append(divContenedor)
}

/**
 * 
 * @param {Producto} producto 
 * @param {HTMLElement} agregar 
 */
export function createTarjetaRegistro(producto, agregar) {
    // Primero
    const divContenedor = document.createElement("div")
    divContenedor.className = "d-flex flex-wrap rounded rounded-2 border p-neutral mb-neutral shadow"
    // Segundo
    const divImagen = document.createElement("div")
    divImagen.classList.add("w-15")
    // Tercero
    const img = document.createElement("img")
    img.classList.add("w-100", "rounded", "rounded-2")
    img.src = producto.imagen
    img.alt = producto.nombre
    // Segundo
    const divInfo = document.createElement("div")
    divInfo.classList.add("w-85", "ps-neutral", "d-flex", "flex-column")
    // Tercero
    const h5 = document.createElement("h5")
    h5.textContent = producto.nombre
    const pDescripcion = document.createElement("p")
    pDescripcion.classList.add("flex-grow-1")
    pDescripcion.textContent = producto.descripcion
    const pTotal = document.createElement("p")
    pTotal.classList.add("m-0", "fs-5", "fw-semibold", "text-end")
    pTotal.textContent = `$${producto.valorTotal}`
    // Segundo
    const divCantidad = document.createElement("div")
    divCantidad.classList.add("w-100", "pt-neutral", "border-top", "mt-neutral", "d-flex", "justify-content-end", "align-items-baseline")
    // Tercero
    const spanTextoCantidad = document.createElement("span")
    spanTextoCantidad.classList.add("fw-semibold", "pe-1")
    spanTextoCantidad.textContent = "Cantidad:"
    const spanCantidad = document.createElement("span")
    spanCantidad.classList.add("fw-semibold")
    spanCantidad.textContent = producto.cantidad

    // Anidamiento
    divImagen.append(img)
    divInfo.append(h5, pDescripcion, pTotal)
    divCantidad.append(spanTextoCantidad, spanCantidad)
    divContenedor.append(divImagen, divInfo, divCantidad)
    agregar.append(divContenedor)
}

{/* <div class="w-100 border rounded rounded-2 p-neutral d-flex flex-column shadow">
    <div class="w-100 d-flex border-bottom mb-neutral align-items-baseline">
        <h5 class="w-50">Compra #12</h5>
        <span class="w-50 fs-5 text-end">Fecha: 02/06/2025</span>
    </div>
    <div class="w-100 d-flex">
        <div class="w-50 d-flex align-items-center">
            <img src="img/medialuna.png" alt="medialuna" class="rounded img-1 shadow">
            <img src="img/medialuna.png" alt="medialuna" class="rounded position-relative img-2 shadow">
            <img src="img/medialuna.png" alt="medialuna" class="rounded position-relative img-3 shadow">
            <span class="position-relative fw-semibold img-4">y otros...</span>
        </div>
        <div class="w-50 d-flex flex-column justify-content-end">
            <span class="fs-5">Total: $9000</span>
            <button type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalCompra">Ver mas</button>
        </div>
    </div>
</div>*/}

/**
 * 
 * @param {Carrito} carrito 
 * @returns {Array<string>}
 */
function generateArrayImagenes(carrito) {
    const array = []
    const productos = Array.from(carrito.productos.values())
    let i = 0
    while (i < 4 && i < productos.length) {
        array.push(productos[i].imagen)
        i++
    }
    return array
}

function handlerVerMas() {
    const modalProductos = document.getElementById("modalProductos")
    modalProductos.replaceChildren()
    const carrito = registros.getRegistro(this.dataset.usuario)[Number(this.dataset.numero)]
    for (const producto of carrito.productos.values()) {
        createTarjetaRegistro(producto, modalProductos)
    }
    document.getElementById("spanEnvioModal").textContent = `$${carrito.envio}`
}

/**
 * 
 * @param {Carrito} carrito 
 * @param {HTMLElement} agregar 
 * @param {Number} numero 
 * @param {string} usuario - Variable opcional que por defecto es el usuario actual.
 */
export function createRegistroCompra(carrito, agregar, numero, usuario = sesionActual.get().nombreUsuario) {
    // Primero
    const divContenedor = document.createElement("div")
    divContenedor.className = "w-100 border rounded rounded-2 p-neutral d-flex flex-column shadow bg-white"
    // Segundo
    const divTitulo = document.createElement("div")
    divTitulo.classList.add("w-100", "d-flex", "border-bottom", "mb-neutral", "align-items-baseline")
    // Tercero
    const h5Titulo = document.createElement("h5")
    h5Titulo.className = "w-50 fw-semibold"
    h5Titulo.textContent = `Compra #${numero + 1}`
    const divFecha = document.createElement("div")
    divFecha.className = "w-50 fs-5 text-end fw-normal"
    divFecha.textContent = `Fecha: ${carrito.fecha}`
    // Segundo
    const divContenido = document.createElement("div")
    divContenido.classList.add("w-100", "d-flex")
    // Tercero
    const divImagenes = document.createElement("div")
    divImagenes.classList.add("w-50", "d-flex", "align-items-center")
    // Cuarto
    const imagenes = generateArrayImagenes(carrito)
    if (imagenes.length > 0) {
        const imagen1 = document.createElement("img")
        imagen1.classList.add("rounded", "img-1", "shadow")
        imagen1.src = imagenes[0]
        imagen1.alt = imagenes[0].slice(5, -4)
        divImagenes.append(imagen1)
    }
    if (imagenes.length > 1) {
        const imagen2 = document.createElement("img")
        imagen2.classList.add("rounded", "position-relative", "img-2", "shadow")
        imagen2.src = imagenes[1]
        imagen2.alt = imagenes[1].slice(5, -4)
        divImagenes.append(imagen2)
    }
    if (imagenes.length > 2) {
        const imagen3 = document.createElement("img")
        imagen3.classList.add("rounded", "position-relative", "img-3", "shadow")
        imagen3.src = imagenes[2]
        imagen3.alt = imagenes[2].slice(5, -4)
        divImagenes.append(imagen3)
    }
    if (imagenes.length > 3) {
        const spanOtros = document.createElement("span")
        spanOtros.classList.add("position-relative", "fw-semibold", "img-4")
        spanOtros.textContent = "y otros..."
        divImagenes.append(spanOtros)
    }
    // Tercero
    const divTotal = document.createElement("div")
    divTotal.classList.add("w-50", "d-flex", "flex-column", "justify-content-end", "align-items-end")
    // Cuarto
    const divValor = document.createElement("div")
    divValor.className = "fs-5"
    const spanTextoTotal = document.createElement("span")
    spanTextoTotal.textContent = `Total: `
    const spanValor = document.createElement("span")
    spanValor.className = "text-secondary fw-semibold"
    spanValor.textContent = `$${carrito.valorTotal}`
    divValor.append(spanTextoTotal, spanValor)

    const buttonModal = document.createElement("button")
    buttonModal.className = "btn btn-primary"
    buttonModal.type = "button"
    buttonModal.dataset.bsToggle = "modal"
    buttonModal.dataset.bsTarget = "#modalCompra"
    buttonModal.dataset.numero = numero
    buttonModal.dataset.usuario = usuario
    buttonModal.textContent = "Ver más"
    buttonModal.addEventListener("click", handlerVerMas)

    // Anidamiento
    divTotal.append(divValor, buttonModal)
    divContenido.append(divImagenes, divTotal)
    divTitulo.append(h5Titulo, divFecha)
    divContenedor.append(divTitulo, divContenido)
    agregar.append(divContenedor)
}

export function crearFilaProducto(producto,indice,funcionEliminar,functionEditar,
) {
  const tr = document.createElement("tr");
  tr.dataset.id = producto.id;

  const tdNumero = document.createElement("td");
  tdNumero.textContent = indice;

  const tdTitulo = document.createElement("td");
  tdTitulo.textContent = producto.nombre.replace(/-/g, ' ').toUpperCase();

  const tdInfo = document.createElement("td");
  tdInfo.textContent = producto.descripcion;

  const tdStock = document.createElement("td");
  tdStock.textContent = producto.cantidad;

  const tdEtiquetas = document.createElement("td");
  if (producto.etiquetas && producto.etiquetas.length > 0) {
    for (let i = 0; i < producto.etiquetas.length; i++) {
      const etiqueta = producto.etiquetas[i];
      const spanEtiqueta = document.createElement("span");
      spanEtiqueta.classList.add("badge", "rounded-pill", "me-1", "text-dark");
      spanEtiqueta.textContent = etiqueta;
      tdEtiquetas.appendChild(spanEtiqueta);
    }
  }

  const tdValor = document.createElement("td");
  tdValor.textContent = `$${producto.valor}`;

  const tdAcciones = document.createElement("td");
  const divContenedor = document.createElement("div");
  divContenedor.classList.add("d-flex", "gap-3", "align-items-center");

  const iconoBorrar = document.createElement("i");
  iconoBorrar.classList.add("bi", "bi-trash3-fill", "text-danger");
  iconoBorrar.style.cursor = "pointer";
  iconoBorrar.addEventListener("click", function() {
    funcionEliminar(producto.id)
  });

  const iconoEditar = document.createElement("i");
  iconoEditar.classList.add("bi", "bi-pencil-square", "text-warning");
  iconoEditar.style.cursor = "pointer";
  iconoEditar.setAttribute("data-bs-toggle", "modal");
  iconoEditar.setAttribute("data-bs-target", "#modalEditar");
  iconoEditar.addEventListener("click", function(){
    functionEditar(producto.id)
  });

  divContenedor.append(iconoBorrar, iconoEditar);
  tdAcciones.appendChild(divContenedor);

  // Unimos todas las celdas en la fila
  tr.append(
    tdNumero,
    tdTitulo,
    tdInfo,
    tdStock,
    tdEtiquetas,
    tdValor,
    tdAcciones,
  );
  return tr;
}



export function crearFilaUsuario(usuario, funcionoCambiarEstado, funcionEliminar,funcionHistorial) {
    const tr = document.createElement('tr');
    tr.dataset.id = usuario.nombreUsuario; 

    if (!usuario.habilitado) {
        tr.classList.add('opacity-50'); 
    }
    
    let celdaNombre = document.createElement("td")
    celdaNombre.textContent = usuario.nombre

    let celdaApellido = document.createElement("td")
    celdaApellido.textContent = usuario.apellido

    let celdaUsuario = document.createElement("td")
    celdaUsuario.textContent = usuario.nombreUsuario

    let celdaContraseña = document.createElement("td")
    celdaContraseña.textContent = usuario.contraseña
    
    //badge es el efecto de pastilla de bootstrap - es como un boton desactivado
    const tdEstado = document.createElement('td');
    const badgeEstado = document.createElement('span');
    badgeEstado.classList.add('badge');
    
    if (usuario.habilitado) {
        badgeEstado.textContent = 'Habilitado';
        badgeEstado.classList.add('bg-success');
    } else {
        badgeEstado.textContent = 'Deshabilitado';
        badgeEstado.classList.add('bg-secondary');
    }
    tdEstado.appendChild(badgeEstado);

    const tdRol = document.createElement('td');
    const badgeRol = document.createElement('span');
    badgeRol.classList.add('badge', 'bg-info', 'text-dark');
    badgeRol.textContent = usuario.tipo;
    tdRol.appendChild(badgeRol);

    const tdHistorial = document.createElement('td');
    const iconoHistorial = document.createElement('i');
    iconoHistorial.classList.add('bi', 'bi-justify');
    iconoHistorial.title = "Usuario registrado";
    iconoHistorial.style.cursor = "pointer"; 
    iconoHistorial.setAttribute("data-bs-toggle", "modal"); 
    iconoHistorial.setAttribute("data-bs-target", "#modalHistorial"); 
    iconoHistorial.dataset.usuario = usuario.nombreUsuario; 
    iconoHistorial.addEventListener('click', function() {
        funcionHistorial(usuario.nombreUsuario);
    });
    tdHistorial.appendChild(iconoHistorial);

    const tdAcciones = document.createElement('td');
    
    const divContenedor = document.createElement('div');
    divContenedor.classList.add('d-flex', 'align-items-center', 'gap-3');

    const iconoBorrar = document.createElement('i');
    iconoBorrar.classList.add('bi', 'bi-trash3-fill', 'text-danger');
    iconoBorrar.style.cursor = 'pointer';
    iconoBorrar.addEventListener('click', function() {
        funcionEliminar(usuario.nombreUsuario); 
    });

    // Estructura de Switch de Bootstrap
    const divSwitch = document.createElement('div');
    divSwitch.classList.add('form-check', 'form-switch', 'm-0');

    const inputSwitch = document.createElement('input');
    inputSwitch.classList.add('form-check-input');
    inputSwitch.type = 'checkbox';
    inputSwitch.setAttribute('role', 'switch');
    inputSwitch.checked = usuario.habilitado; 
    
    inputSwitch.addEventListener('change', () => {
        funcionoCambiarEstado(usuario.nombreUsuario); 
    });

    divSwitch.appendChild(inputSwitch);
    divContenedor.appendChild(iconoBorrar);
    divContenedor.appendChild(divSwitch);
    tdAcciones.appendChild(divContenedor);

    tr.appendChild(celdaNombre);
    tr.appendChild(celdaApellido);
    tr.appendChild(celdaUsuario);
    tr.appendChild(celdaContraseña);
    tr.appendChild(tdEstado);
    tr.appendChild(tdRol);
    tr.appendChild(tdHistorial);
    tr.appendChild(tdAcciones);

    return tr;
}
