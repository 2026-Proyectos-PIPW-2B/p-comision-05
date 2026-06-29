import { createTarjetaTienda } from "../modulos/crearDomElements.js"
import * as stock from "../modulos/stock.js"

const sectionProductos = document.getElementById("sectionProductos")
const pageNumbers = document.getElementById("pageNumbers")
const pageSelectBack = document.getElementById("pageSelectBack")
const pageSelectFoward = document.getElementById("pageSelectFoward")
/** @type {Array<HTMLDivElement>} */
const tarjetas = []
/** @type {Array<HTMLDivElement>} */
const paginas = []

function paginado(tarjetasAMostrar) {
    paginas.length = 0
    let cantidadPaginas = 1
    let contador = 1
    let divPagina = document.createElement("div")
    divPagina.className = "row row-cols-2 row-cols-md-3 row-cols-lg-4 g-2"
    divPagina.id = `page${cantidadPaginas++}`
    sectionProductos.append(divPagina)
    paginas.push(divPagina)
    for (const tarjeta of tarjetasAMostrar) {
        if (contador == 13) {
            divPagina = document.createElement("div")
            divPagina.className = "row row-cols-2 row-cols-md-3 row-cols-lg-4 g-2 d-none"
            divPagina.id = `page${cantidadPaginas++}`
            sectionProductos.append(divPagina)
            paginas.push(divPagina)
            contador = 1
        }
        divPagina.append(tarjeta)
        contador++
    }
}

function handlerRadioPage() {
    // Select all elements initialized as popovers
    const buttonPopovers = document.querySelectorAll('[aria-describedby^="popover"]');
    for (const button of buttonPopovers) {
        button.click()
    }
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
    document.getElementById(`page${pageNumbers.dataset.selected}`).classList.add("d-none")
    pageNumbers.dataset.selected = this.dataset.number
    document.getElementById(`page${this.dataset.number}`).classList.remove("d-none")
}

function handlerSelectBack() {
    const numeroPagina = Number(pageNumbers.dataset.selected)
    console.log(numeroPagina)
    if (numeroPagina > 1) {
        if (numeroPagina % 5 == 1) {
            document.getElementById(`botonera${pageNumbers.dataset.pageGroupSelected}`).classList.add("d-none")
            pageNumbers.dataset.pageGroupSelected = pageNumbers.dataset.pageGroupSelected - 1
            document.getElementById(`botonera${pageNumbers.dataset.pageGroupSelected}`).classList.remove("d-none")
        }
        document.getElementById(`radioPage${numeroPagina - 1}`).click()
    }
}

function handlerSelectFoward() {
    const numeroPagina = Number(pageNumbers.dataset.selected)
    console.log(numeroPagina)
    if (numeroPagina < paginas.length) {
        if (numeroPagina % 5 == 0) {
            document.getElementById(`botonera${pageNumbers.dataset.pageGroupSelected}`).classList.add("d-none")
            pageNumbers.dataset.pageGroupSelected = Number(pageNumbers.dataset.pageGroupSelected) + 1
            console.log(pageNumbers.dataset.pageGroupSelected)
            document.getElementById(`botonera${pageNumbers.dataset.pageGroupSelected}`).classList.remove("d-none")
        }
        document.getElementById(`radioPage${numeroPagina + 1}`).click()
    }
}

function numeroPaginas() {
    let cantidadBotoneras = 1
    let contador = 1
    let divBotonera = document.createElement("div")
    divBotonera.className = "btn-group"
    divBotonera.role = "group"
    divBotonera.id = `botonera${cantidadBotoneras++}`
    pageNumbers.append(divBotonera)
    for (const [i, pagina] of paginas.entries()) {
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
        radio.dataset.number = i + 1
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
    pageNumbers.dataset.pageGroupSelected = 1
}

function onLoad() {
    const productosStock = stock.getStock()
    for (const producto of productosStock.values()) {
        if (producto.cantidad > 0) {
            tarjetas.push(createTarjetaTienda(producto))
        }
    }
    paginado(tarjetas)
    numeroPaginas()
    pageSelectBack.addEventListener("click", handlerSelectBack)
    pageSelectFoward.addEventListener("click", handlerSelectFoward)
}

window.addEventListener("load", onLoad)