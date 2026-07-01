import { createRegistroCompra } from "../modulos/crearDomElements.js"
import * as registros from "../modulos/registros.js"
import * as sesionActual from "../modulos/sesionActual.js"

const sectionRegistro = document.getElementById("sectionRegistro")

function onLoad() {
    const registro = registros.getRegistro(sesionActual.get().nombreUsuario)
    if (registro.length > 0) {
        for (const [i, carrito] of registro.entries()) {
            createRegistroCompra(carrito, sectionRegistro, i)
        }
    }
    else {
        console.log("holas")
        document.getElementById("alertaRegistro").classList.remove("d-none")
    }
}

window.addEventListener("load", onLoad)