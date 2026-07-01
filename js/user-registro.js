import { createRegistroCompra } from "../modulos/crearDomElements.js"
import * as registros from "../modulos/registros.js"
import * as sesionActual from "../modulos/sesionActual.js"

const sectionRegistro = document.getElementById("sectionRegistro")

function onLoad() {
    const registro = registros.getRegistro(sesionActual.get().nombreUsuario)
    if (registro.length > 0) {
        for (let i = registro.length - 1; i >= 0; i--) {
            createRegistroCompra(registro[i], sectionRegistro, i)
        }
    }
    else {
        console.log("holas")
        document.getElementById("alertaRegistro").classList.remove("d-none")
    }
}

window.addEventListener("load", onLoad)