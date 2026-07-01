import { Producto } from "../clases/Producto.js"
import { createTarjetaTienda } from "../modulos/crearDomElements.js"
import { getEtiquetas } from "../modulos/etiquetas.js"
import * as stock from "../modulos/stock.js"

const sectionProductos = document.getElementById("sectionProductos")
const pageNumbers = document.getElementById("pageNumbers")
const pageSelectBack = document.getElementById("pageSelectBack")
const pageSelectFoward = document.getElementById("pageSelectFoward")
const scrollEtiquetas = document.getElementById("scrollEtiquetas")
const buttonBuscar = document.getElementById("buttonBuscar")
const inputBuscar = document.getElementById("inputBuscar")

const mediaQuery = window.matchMedia("(min-width: 992px)");

/** @type {Array<Producto>} */
const productoAMostrar = []

function paginado() {
    sectionProductos.replaceChildren()
    const primerProducto = Number(sectionProductos.dataset.primerProductoAMostrar)
    const productosSeparados = productoAMostrar.slice(primerProducto, primerProducto + 12)
    for (const producto of productosSeparados) {
        sectionProductos.append(createTarjetaTienda(producto))    
    }
    
    if (productoAMostrar.length == 0) {
        document.getElementById("alertaTienda").classList.remove("d-none")
        sectionProductos.classList.add("d-none")
    }
    else {
        sectionProductos.classList.remove("d-none")
        document.getElementById("alertaTienda").classList.add("d-none")
    }
}

function filtradoNombre(str) {
    productoAMostrar.length = 0
    for (const producto of stock.getStock().values()) {
        if (producto.nombre.includes(str)) {
            productoAMostrar.push(producto)
        }
    }
    if (productoAMostrar.length > 0) {
        paginado()
        numeroPaginas()
    }
    else {
        // Hacer msj de alerta
        mostrarTodosProductos()
    }
}

function filtradoEtiqueta(etiqueta) {
    productoAMostrar.length = 0
    for (const producto of stock.getStock().values()) {
        if (producto.etiquetas.includes(etiqueta)) {
            productoAMostrar.push(producto)
        }
    }
    paginado()
    numeroPaginas()
}

function numeroPaginas() {
    pageNumbers.replaceChildren()
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
    productoAMostrar.length = 0
    const productosStock = stock.getStock()
    for (const producto of productosStock.values()) {
        productoAMostrar.push(producto)
    }
    paginado()
    numeroPaginas()
}

function generateScrollCategorias() {
    // <input type="radio" name="categoriaSelecionada" id="radioPanificados" class="btn-check border-radio-etiqueta">
    // <label for="radioPanificados" class="px-neutral">Panificado</label>
    for (const etiqueta of getEtiquetas()) {
        const etiquetaConMayuscula = etiqueta.charAt(0).toUpperCase() + etiqueta.slice(1);
        const radio = document.createElement("input")
        radio.type = "radio"
        radio.name = "categoriaSelecionada"
        radio.id = etiqueta
        radio.dataset.etiqueta = etiqueta
        radio.dataset.selected = "false"
        radio.className = "btn-check border-radio-etiqueta"
        radio.addEventListener("click", handlerScrollRadio)
        const label = document.createElement("label")
        label.htmlFor = etiqueta
        label.className = "px-neutral fw-semibold scroll-lg-etiqueta"
        label.textContent = etiquetaConMayuscula
        scrollEtiquetas.append(radio, label)
    }
    scrollEtiquetas.dataset.etiquetaSeleccionada = ""
}

//#region Handlers
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

function handlerScrollRadio() {
    if (this.dataset.selected == "false") {
        this.dataset.selected = "true"
        if (scrollEtiquetas.dataset.etiquetaSeleccionada == "") {
            scrollEtiquetas.dataset.etiquetaSeleccionada = this.dataset.etiqueta
        }
        else if (scrollEtiquetas.dataset.etiquetaSeleccionada != this.dataset.etiqueta) {
            document.getElementById(scrollEtiquetas.dataset.etiquetaSeleccionada).dataset.selected = "false"
            scrollEtiquetas.dataset.etiquetaSeleccionada = this.dataset.etiqueta
        }
        filtradoEtiqueta(this.dataset.etiqueta)
    }
    else  if (this.dataset.selected == "true"){
        if (scrollEtiquetas.dataset.etiquetaSeleccionada == this.dataset.etiqueta) {
            scrollEtiquetas.dataset.etiquetaSeleccionada = ""
        }
        this.dataset.selected = "false"
        this.checked = false
        mostrarTodosProductos()
    }
}

function handlerButtonBuscar() {
    const str = inputBuscar.value
    if (str != "") {
        filtradoNombre(str)
    }
}

function handlerSearchCancel() {
    if (event.target.value === '') {
        mostrarTodosProductos()
    }

}

function handleScrollEtiquetas() {
    // If the user is already swiping horizontally on a touchpad, let the browser handle it
    if (event.deltaX !== 0) {
        return;
    }
    
    // Only intercept if there is purely vertical movement (like a standard mouse wheel)
    if (event.deltaY !== 0) {
        event.preventDefault();
        scrollEtiquetas.scrollBy({left: event.deltaY, behavior: "smooth"})
    }
}

function handleBreakpointChange(e) {
    if (e.matches) {
        scrollEtiquetas.removeEventListener("wheel", handleScrollEtiquetas)
        console.log("Event listener remove.")
    } else {
        scrollEtiquetas.addEventListener("wheel", handleScrollEtiquetas)
        console.log("Event listener add.")
    }
}
//#endregion

function onLoad() {
    // Agregar scroll
    mediaQuery.addEventListener("change", handleBreakpointChange);
    handleBreakpointChange(mediaQuery);

    // Boton buscar del search
    buttonBuscar.addEventListener("click", handlerButtonBuscar)
    inputBuscar.addEventListener("search", handlerSearchCancel)

    generateScrollCategorias()
    
    sectionProductos.dataset.primerProductoAMostrar = 0
    mostrarTodosProductos()

    pageSelectBack.addEventListener("click", handlerSelectBack)
    pageSelectFoward.addEventListener("click", handlerSelectFoward)
}

window.addEventListener("load", onLoad)