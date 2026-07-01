import { createTarjetaCarrito } from "../modulos/crearDomElements.js"
import * as carritos from "../modulos/carritos.js"
import * as stock from "../modulos/stock.js"
import * as sesionActual from "../modulos/sesionActual.js"

const sectionProductos = document.getElementById("sectionProductos")
const carrito = carritos.getCarrito(sesionActual.get().nombreUsuario)

function handlerConfirmarCompra() {
    carritos.addCarritoToRegistro(sesionActual.get().nombreUsuario)
    console.log("carrito confirmado")
    sectionProductos.replaceChildren()
    document.getElementById("alertaCarrito").classList.remove("d-none")
    document.getElementById("spanTotalCompra").textContent = `$0`
    document.getElementById("spanEnvio").textContent = `$0`
}

function onLoad() {
    if (carrito !== null) {
        if (carrito.productos.size > 0) {
            document.getElementById("alertaCarrito").classList.add("d-none")
        }
        for (const producto of carrito.productos.values()) {
            createTarjetaCarrito(producto, sectionProductos)
        }

        document.getElementById("spanTotalCompra").textContent = `$${carrito.valorTotal}`
        document.getElementById("spanEnvio").textContent = `$${carrito.envio}`
        
        document.getElementById("buttonConfirmarCompra").addEventListener("click", handlerConfirmarCompra)
    }
}

window.addEventListener("load", onLoad)