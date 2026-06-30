import { Producto } from "../clases/Producto.js"
import { createTarjetaTienda } from "../modulos/crearDomElements.js"
import * as stock from "../modulos/stock.js"

const sectionProductos = document.getElementById("sectionProductos")
const pageNumbers = document.getElementById("pageNumbers")
const pageSelectBack = document.getElementById("pageSelectBack")
const pageSelectFoward = document.getElementById("pageSelectFoward")
const scrollEtiquetas = document.getElementById("scrollEtiquetas")

/** @type {Array<Producto>} */
const productoAMostrar = []

function paginado() {
    sectionProductos.replaceChildren()
    const primerProducto = Number(sectionProductos.dataset.primerProductoAMostrar)
    const productosSeparados = productoAMostrar.slice(primerProducto, primerProducto + 12)
    for (const producto of productosSeparados) {
        sectionProductos.append(createTarjetaTienda(producto))    
    }
}

function filtradoNombre(str) {
    productoAMostrar.length = 0
    for (const producto of stock.getStock().values()) {
        if (producto.nombre.includes(str)) {
            productoAMostrar.push(producto)
        }
    }
    paginado()
}

function filtradoCategoria(categoria) {
    productoAMostrar.length = 0
    for (const producto of stock.getStock().values()) {
        if (producto.etiquetas.includes(categoria)) {
            productoAMostrar.push(producto)
        }
    }
    paginado()
}

function handlerRadioPage() {
    // Oculto todos los popovers abiertos en la pagina
    const buttonPopovers = document.querySelectorAll('[aria-describedby^="popover"]');
    for (const button of buttonPopovers) {
        button.click()
    }

    // Scrolleo hasta el inicio de la pagina
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })

    const numeroPagina = Number(this.dataset.number)
    let primerProductoACargar = 0
    if (numeroPagina > 0) {
        primerProductoACargar = (numeroPagina * 12)
    }
    sectionProductos.dataset.primerProductoAMostrar = primerProductoACargar
    console.log(sectionProductos.dataset.primerProductoAMostrar)
    paginado()
    pageNumbers.dataset.selected = numeroPagina + 1
    console.log(pageNumbers.dataset.selected)
}

function handlerSelectBack() {
    const numeroPagina = Number(pageNumbers.dataset.selected)
    if (numeroPagina > 1) {
        if (numeroPagina % 5 == 1) {
            document.getElementById(`botonera${pageNumbers.dataset.pageGroupSelected}`).classList.add("d-none")
            pageNumbers.dataset.pageGroupSelected = Number(pageNumbers.dataset.pageGroupSelected) - 1
            document.getElementById(`botonera${pageNumbers.dataset.pageGroupSelected}`).classList.remove("d-none")
        }
        document.getElementById(`radioPage${numeroPagina - 1}`).click()
    }
}

function handlerSelectFoward() {
    const numeroPagina = Number(pageNumbers.dataset.selected)
    if (numeroPagina < Number(pageNumbers.dataset.ultimaPagina)) {
        if (numeroPagina % 5 == 0) {
            document.getElementById(`botonera${pageNumbers.dataset.pageGroupSelected}`).classList.add("d-none")
            pageNumbers.dataset.pageGroupSelected = Number(pageNumbers.dataset.pageGroupSelected) + 1
            document.getElementById(`botonera${pageNumbers.dataset.pageGroupSelected}`).classList.remove("d-none")
        }
        document.getElementById(`radioPage${numeroPagina + 1}`).click()
    }
}

function numeroPaginas() {
    let cantidadPaginas = Math.floor(productoAMostrar.length / 12)
    if ((productoAMostrar.length % 12) != 0) {
        cantidadPaginas++
    }
    let cantidadBotoneras = 1
    let contador = 1
    let divBotonera = document.createElement("div")
    divBotonera.className = "btn-group"
    divBotonera.role = "group"
    divBotonera.id = `botonera${cantidadBotoneras++}`
    pageNumbers.append(divBotonera)
    for (let i = 0; i < cantidadPaginas; i++) {
        if (contador == 6) {
            let divDots = document.createElement("div")
            divDots.className = "text-info ps-neutral"
            divDots.textContent = "..."
            divBotonera.append(divDots)
    
            divBotonera = document.createElement("div")
            divBotonera.className = "btn-group d-none"
            divBotonera.role = "group"
            divBotonera.id = `botonera${cantidadBotoneras++}`
            pageNumbers.append(divBotonera)
            
            divDots = document.createElement("div")
            divDots.className = "text-info pe-neutral"
            divDots.textContent = "..."
            divBotonera.append(divDots)
            contador = 1
        }
        const radio = document.createElement("input")
        radio.type = "radio"
        radio.className = "btn-check"
        radio.id = `radioPage${i + 1}`
        radio.name = "radioPage"
        radio.dataset.number = i
        radio.autocomplete = "off"
        radio.addEventListener("change", handlerRadioPage)
        if (i == 0) {
            radio.checked = "true"
        }
        const label = document.createElement("label")
        label.className = "btn btn-outline-info border-0 rounded"
        label.htmlFor = `${radio.id}`
        label.textContent = `${i + 1}`
        divBotonera.append(radio, label)
        contador++
    }
    pageNumbers.dataset.selected = 1
    pageNumbers.dataset.ultimaPagina = cantidadPaginas
    pageNumbers.dataset.pageGroupSelected = 1
}

function mostrarTodosProductos() {
    productoAMostrar.length = 0
    const productosStock = stock.getStock()
    for (const producto of productosStock.values()) {
        productoAMostrar.push(producto)
    }
    paginado()
}

function onLoad() {
    // Scroll lateral
    scrollEtiquetas.addEventListener("wheel", (event) => {
        // If the user is already swiping horizontally on a touchpad, let the browser handle it
        if (event.deltaX !== 0) {
            return;
        }

        // Only intercept if there is purely vertical movement (like a standard mouse wheel)
        if (event.deltaY !== 0) {
            event.preventDefault();
            scrollEtiquetas.scrollBy({
                left: event.deltaY,
                behavior: "smooth" // Smooths out the wheel steps
            })
        }
    }, { passive: false })

    sectionProductos.dataset.primerProductoAMostrar = 0
    mostrarTodosProductos()
    numeroPaginas()

    pageSelectBack.addEventListener("click", handlerSelectBack)
    pageSelectFoward.addEventListener("click", handlerSelectFoward)
}

window.addEventListener("load", onLoad)