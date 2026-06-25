import { createTarjetaCarrito } from "../modulos/crearDomElements.js"
import * as carritos from "../modulos/carritos.js"
import * as sesionActual from "../modulos/sesionActual.js"

const sectionProductos = document.getElementById("sectionProductos")


function handlerConfirmarCompra() {
    carritos.addCarritoToRegistro(sesionActual.get().nombreUsuario)
    sectionProductos.replaceChildren()
}

function onLoad() {
    const carrito = carritos.getCarrito(sesionActual.get().nombreUsuario)
    if (carrito !== null) {
        if (carrito.productos.size > 0) {
            document.getElementById("alertaCarrito").classList.add("d-none")
        }
        for (const producto of carrito.productos.values()) {
            createTarjetaCarrito(producto, sectionProductos)
        }
        document.getElementById("spanTotalCompra").textContent = `$${carrito.valorTotal}`
        document.getElementById("buttonConfirmarCompra").addEventListener("click", handlerConfirmarCompra)
    }
}

window.addEventListener("load", onLoad)