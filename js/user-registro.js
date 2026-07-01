import { Carrito } from "../clases/Carrito.js"
import { createRegistroCompra } from "../modulos/crearDomElements.js"
import * as registros from "../modulos/registros.js"
import * as sesionActual from "../modulos/sesionActual.js"

const sectionRegistro = document.getElementById("sectionRegistro")
const pageNumbers = document.getElementById("pageNumbers")
const pageSelectBack = document.getElementById("pageSelectBack")
const pageSelectFoward = document.getElementById("pageSelectFoward")

/** @type {Array<Carrito>} */
const comprasAMostrar = []

function paginado() {
    sectionRegistro.replaceChildren()
    const primerCompra = Number(sectionRegistro.dataset.primerCompraAMostrar)
    const comprasSeparadas = comprasAMostrar.slice(primerCompra, primerCompra + 10)
    for (const [i, compra] of comprasSeparadas.entries()) {
        createRegistroCompra(compra, sectionRegistro, i + primerCompra)    
    }

    if (comprasAMostrar.length == 0) {
        document.getElementById("alertaRegistro").classList.remove("d-none")
        sectionRegistro.classList.add("d-none")
    }
    else {
        sectionRegistro.classList.remove("d-none")
        document.getElementById("alertaRegistro").classList.add("d-none")
    }
}

function numeroPaginas() {
    pageNumbers.replaceChildren()
    let cantidadPaginas = Math.floor(comprasAMostrar.length / 10)
    if ((comprasAMostrar.length % 10) != 0) {
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
            divDots.className = "text-primary ps-neutral"
            divDots.textContent = "..."
            divBotonera.append(divDots)
    
            divBotonera = document.createElement("div")
            divBotonera.className = "btn-group d-none"
            divBotonera.role = "group"
            divBotonera.id = `botonera${cantidadBotoneras++}`
            pageNumbers.append(divBotonera)
            
            divDots = document.createElement("div")
            divDots.className = "text-primary pe-neutral"
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
        label.className = "btn btn-outline-primary border-0 rounded"
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
    comprasAMostrar.length = 0
    const registro = registros.getRegistro(sesionActual.get().nombreUsuario)
    for (const carrito of registro) {
        comprasAMostrar.push(carrito)
    }
    paginado()
    numeroPaginas()
}

//#region Handlers
function handlerRadioPage() {
    // Scrolleo hasta el inicio de la pagina
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })

    const numeroPagina = Number(this.dataset.number)
    let primerCompraACargar = 0
    if (numeroPagina > 0) {
        primerCompraACargar = (numeroPagina * 10)
    }
    sectionRegistro.dataset.primerCompraAMostrar = primerCompraACargar
    paginado()
    pageNumbers.dataset.selected = numeroPagina + 1
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
//#endregion

function onLoad() {
    sectionRegistro.dataset.primerCompraAMostrar = 0
    mostrarTodosProductos()

    pageSelectBack.addEventListener("click", handlerSelectBack)
    pageSelectFoward.addEventListener("click", handlerSelectFoward)
}

window.addEventListener("load", onLoad)