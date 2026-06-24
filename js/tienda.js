import { createTarjetaTienda } from "../modulos/crearDomElements.js"
import { get } from "../modulos/sesionActual.js"
import * as stock from "../modulos/stock.js"

const divProductos = document.getElementById("divProductos")

function onLoad() {
    console.log(get())
    const productosStock = stock.getStock()
    for (const producto of productosStock.values()) {
        createTarjetaTienda(producto, divProductos)
    }
}

window.addEventListener("load", onLoad)