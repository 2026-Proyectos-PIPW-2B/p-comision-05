import { Producto } from "../clases/Producto.js"
import { saveCarritos } from "./carritos.js"
import { Carrito } from "../clases/Carrito.js"
import * as sesionActual from "./sesionActual.js"
import * as stock from "./stock.js"
import * as carritos from "./carritos.js"
import * as registros from "./registros.js"

{/* <div class="col d-flex justify-content-center">
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

function handlerAñadirACarrito() {
    const carritoActual = carritos.getCarrito(sesionActual.get().nombreUsuario)
    // Realizo un chequeo de disponibilidad
    const cantidadToAgregar = Number(document.getElementById(`${this.dataset.id}/cantidad`).textContent)
    const cantidadDisponible = stock.getProducto(this.dataset.id).cantidad
    let cantidadAgregada = 0
    if (carritoActual.getProducto(this.dataset.id)) {
        cantidadAgregada = carritoActual.getProducto(this.dataset.id).cantidad
    }
    if (cantidadDisponible >= (cantidadAgregada + cantidadToAgregar)) {
        carritoActual.setProducto(stock.getProducto(this.dataset.id), cantidadToAgregar)
        saveCarritos()
        bootstrap.Popover.getOrCreateInstance(document.getElementById(`${this.dataset.id}/button`)).hide()
    }
}

function handlerRestar() {
    const spanCantidad = document.getElementById(`${this.dataset.id}/cantidad`)
    if (spanCantidad.textContent > 1) {
        spanCantidad.textContent = Number(spanCantidad.textContent) - 1
    }
}

function handlerSumar() {
    const spanCantidad = document.getElementById(`${this.dataset.id}/cantidad`)
    spanCantidad.textContent = Number(spanCantidad.textContent) + 1
}

/**
 * Crea una tarjeta de un Producto dado para mostrarla en la tienda.
 * 
 * @param {Producto} producto - El objeto Producto sobre el cual se quiere crear la tarjeta.
 * @param {HTMLElement} divAgregar
 */
export function createTarjetaTienda(producto, agregar) {
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
    divBody.classList.add("card-body", "d-flex", "flex-column")
    // Cuarto
    const h5 = document.createElement("h5")
    h5.textContent = producto.nombre.charAt(0).toUpperCase() + producto.nombre.slice(1).replace(/-/g, ' ')
    h5.classList.add("card-title")
    const p = document.createElement("p")
    p.textContent = producto.descripcion
    p.classList.add("card-text")
    const divPrecio = document.createElement("div")
    divPrecio.classList.add("d-flex", "justify-content-between", "align-items-center")
    // Quinto
    const span = document.createElement("span")
    span.textContent = `$${producto.valor} C/U`
    span.classList.add("fs-5")
    const button = document.createElement("button")
    button.classList.add("btn", "btn-primary", "align-self-end")
    button.id = `${producto.id}/button`
    // Crear popover
    const divPopover = document.createElement("div")
    // <button type="button" class="btn btn-outline-info mx-neutral"><i class="bi bi-dash"></i></button>
    const buttonRestar = document.createElement("button")
    buttonRestar.dataset.id = producto.id
    buttonRestar.classList.add("btn", "btn-outline-info", "me-neutral")
    buttonRestar.addEventListener("click", handlerRestar)
    const iRestar = document.createElement("i")
    iRestar.classList.add("bi", "bi-dash")
    buttonRestar.append(iRestar)
    const spanCantidad = document.createElement("span")
    spanCantidad.textContent = 1
    spanCantidad.id = `${producto.id}/cantidad`
    const buttonSumar = document.createElement("button")
    buttonSumar.dataset.id = producto.id
    buttonSumar.classList.add("btn", "btn-outline-info", "ms-neutral")
    buttonSumar.addEventListener("click", handlerSumar)
    const iSumar = document.createElement("i")
    iSumar.classList.add("bi", "bi-plus")
    buttonSumar.append(iSumar)
    const buttonAgregar = document.createElement("button")
    buttonAgregar.dataset.id = producto.id
    buttonAgregar.classList.add("btn", "btn-primary", "ms-neutral")
    buttonAgregar.addEventListener("click", handlerAñadirACarrito)
    const iAgregar = document.createElement("i")
    iAgregar.classList.add("bi", "bi-cart-plus")
    buttonAgregar.append(iAgregar)
    divPopover.append(buttonRestar, spanCantidad, buttonSumar, buttonAgregar)
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

    // Anidamiento
    button.append(i)
    divPrecio.append(span, button)
    divBody.append(h5, p, divPrecio)
    divTarjeta.append(img, divBody)
    divContenedor.append(divTarjeta)
    agregar.append(divContenedor)
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

function changeCantidadProductoCarrito() {
    const spanCantidad = document.getElementById(`${this.dataset.id}/cantidad`)
    const carritoActual = carritos.getCarrito(sesionActual.get().nombreUsuario)
    const productoACambiar = carritoActual.getProducto(this.dataset.id)
    productoACambiar.cantidad = Number(spanCantidad.textContent)
    saveCarritos()
    document.getElementById(`${this.dataset.id}/total`).textContent = `$${productoACambiar.valorTotal}`
    document.getElementById("spanTotalCompra").textContent = `$${carritoActual.valorTotal}`
}

function handlerRemoverProducto() {
    document.getElementById(this.dataset.id).remove()
    const carritoActual = carritos.getCarrito(sesionActual.get().nombreUsuario)
    carritoActual.removeProducto(this.dataset.id)
    saveCarritos()
    document.getElementById("spanTotalCompra").textContent = `$${carritoActual.valorTotal}`
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
    divContenedor.className = "d-flex flex-wrap rounded rounded-2 border p-neutral mb-neutral shadow"
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
    h5.textContent = producto.nombre
    const pDescripcion = document.createElement("p")
    pDescripcion.classList.add("flex-grow-1")
    pDescripcion.textContent = producto.descripcion
    const pTotal = document.createElement("p")
    pTotal.classList.add("m-0", "fs-5", "fw-semibold", "text-end")
    pTotal.id = `${producto.id}/total`
    pTotal.textContent = `$${producto.valorTotal}`
    // Segundo
    const divCantidad = document.createElement("div")
    divCantidad.classList.add("w-100", "pt-neutral", "border-top", "mt-neutral", "d-flex", "justify-content-end", "align-items-baseline")
    // Tercero
    const buttonRestar = document.createElement("button")
    buttonRestar.classList.add("btn", "btn-outline-info", "mx-neutral")
    buttonRestar.dataset.id = producto.id
    buttonRestar.addEventListener("click", handlerRestar)
    buttonRestar.addEventListener("click", changeCantidadProductoCarrito)
    const iRestar = document.createElement("i")
    iRestar.classList.add("bi", "bi-dash")
    buttonRestar.append(iRestar)

    const spanCantidad = document.createElement("span")
    spanCantidad.classList.add("fw-semibold")
    spanCantidad.textContent = producto.cantidad
    spanCantidad.id = `${producto.id}/cantidad`

    const buttonSumar = document.createElement("button")
    buttonSumar.classList.add("btn", "btn-outline-info", "mx-neutral")
    buttonSumar.dataset.id = producto.id
    buttonSumar.addEventListener("click", handlerSumar)
    buttonSumar.addEventListener("click", changeCantidadProductoCarrito)
    const iSumar = document.createElement("i")
    iSumar.classList.add("bi", "bi-plus")
    buttonSumar.append(iSumar)
    
    const buttonEliminar = document.createElement("button")
    buttonEliminar.classList.add("btn", "btn-info")
    buttonEliminar.dataset.id = producto.id
    buttonEliminar.addEventListener("click", handlerRemoverProducto)
    const iEliminar = document.createElement("i")
    iEliminar.classList.add("bi", "bi-trash3")
    buttonEliminar.append(iEliminar)

    // Anidamiento
    divImagen.append(img)
    divInfo.append(h5, pDescripcion, pTotal)
    divCantidad.append(buttonRestar, spanCantidad, buttonSumar, buttonEliminar)
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
    spanTextoCantidad.classList.add("fw-semibold")
    spanTextoCantidad.textContent = "Cantidad "
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
    const carrito = registros.getRegistro(sesionActual.get().nombreUsuario)[Number(this.dataset.numero)]
    for (const producto of carrito.productos.values()) {
        createTarjetaRegistro(producto, modalProductos)
    }
}

/**
 * 
 * @param {Carrito} carrito 
 * @param {HTMLElement} agregar 
 * @param {Number} numero 
 */
export function createRegistroCompra(carrito, agregar, numero) {
    // Primero
    const divContenedor = document.createElement("div")
    divContenedor.classList.add("w-100", "border", "rounded", "rounded-2", "p-neutral", "d-flex", "flex-column", "shadow")
    // Segundo
    const divTitulo = document.createElement("div")
    divTitulo.classList.add("w-100", "d-flex", "border-bottom", "mb-neutral", "align-items-baseline")
    // Tercero
    const h5Titulo = document.createElement("h5")
    h5Titulo.classList.add("w-50")
    h5Titulo.textContent = `Compra #${numero}`
    const divFecha = document.createElement("div")
    divFecha.classList.add("w-50", "fs-5", "text-end")
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
        divImagenes.append(spanOtros)
    }
    // Tercero
    const divTotal = document.createElement("div")
    divTotal.classList.add("w-50", "d-flex", "flex-column", "justify-content-end", "align-items-end")
    // Cuarto
    const spanValor = document.createElement("span")
    spanValor.classList.add("fs-5")
    spanValor.textContent = `Total: $${carrito.valorTotal}`
    const buttonModal = document.createElement("button")
    buttonModal.classList.add("btn", "btn-info")
    buttonModal.type = "button"
    buttonModal.dataset.bsToggle = "modal"
    buttonModal.dataset.bsTarget = "#modalCompra"
    buttonModal.dataset.numero = numero
    buttonModal.textContent = "Ver más"
    buttonModal.addEventListener("click", handlerVerMas)

    // Anidamiento
    divTotal.append(spanValor, buttonModal)
    divContenido.append(divImagenes, divTotal)
    divTitulo.append(h5Titulo, divFecha)
    divContenedor.append(divTitulo, divContenido)
    agregar.append(divContenedor)
}