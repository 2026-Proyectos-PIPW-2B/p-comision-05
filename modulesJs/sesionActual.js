import { Sesion } from "../classes/Sesion.js"
import { Usuario } from "../classes/Usuario.js"
import * as usuarios from "./usuarios.js"
import * as carritos from "./carritos.js"
import * as registros from "./registros.js"

//#region Documentacion
/**
 * @fileoverview Control de la sesion actual con el objeto sesion, con guardado en localStorage.
 * @module sesionActual
 */
//#endregion

//#region Variables
/** @type {Sesion}> */
let sesionActual = JSON.parse(localStorage.getItem("sesionActual")) || null
//#endregion

/**
 * Crea un nuevo usuarioActual apartir del usuario obtenido del localStorage correspondiente a la clave dada, lo asigna a usuarioActual y lo sube al localStorage.
 * 
 * @param {string} nombreUsuario - NombreUsuario que se quiere pasar como clave.
 */
export function setSesionActual(nombreUsuario) {
    /** @type {Usuario} */
    const user = usuarios.getUsuario(nombreUsuario)
    if (user.tipo === "user") {
        sesionActual = new Sesion(user.nombreUsuario, user.nombre, user.apellido, carritos.getCarrito(user.nombreUsuario), registros.getRegistro(user.nombreUsuario))
    }
    else {
        sesionActual = new Sesion(user.nombreUsuario, user.nombre, user.apellido)
    }
    localStorage.setItem("sesionActual", JSON.stringify(sesionActual))
}

/**
 * Devuelve el objeto usuarioActual guardado en el localStorage.
 * 
 * @returns {usuarioActual | null} Retorna el objeto usuarioActual y si no existe retorna null.
 */
export function getSesionActual() {
    return sesionActual
}
