import { createTarjetaTienda } from "../modulos/crearDomElements.js"
import * as stock from "../modulos/stock.js"

const divProductos = document.getElementById("divProductos")

function handlerAñadirACarrito() {
    carritos.getCarrito(sesionActual.get().nombreUsuario).setProducto(stock.getProducto(this.dataset.id))
    saveCarritos()
}

function onLoad() {
    const productosStock = stock.getStock()
    for (const producto of productosStock.values()) {
        createTarjetaTienda(producto, divProductos)
    }
}

window.addEventListener("load", onLoad)