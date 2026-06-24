import { Carrito } from "../clases/Carrito.js"
import { Producto } from "../clases/Producto.js"
import * as loader from "./loader.js"

//#region Documentacion
/**
 * @fileoverview Manejo de los registros de los usuarios, con guardado en localStorage.
 * @module registros
 */
//#endregion

//#region Variables
/** @type {Map<string, Array<Carrito>>}> */
const registros = loader.loadRegistros()
//#endregion

/**
 * Crea un mapa de carritos(Map<string, Producto>), lo guarda en registros y lo sube al localStorage.
 * 
 * @param {string} nombreUsuario - NombreUsuario que se quiere pasar como clave.
 */
export function setRegistro(nombreUsuario) {
    registros.set(nombreUsuario, [])
    saveRegistros()
}

/**
 * Obtiene de los registros la lista de carritos guardados del nombreUsuario dado.
 * 
 * @param {string} nombreUsuario - NombreUsuario que se quiere pasar como clave.
 * @returns {Array<Carrito>} Retorna una lista con los carritos que se compraron de ese usuario.
 */
export function getRegistro(nombreUsuario) {
    return registros.get(nombreUsuario)
}

/**
 * Añade un carrito dado a el registro asignado a el nombreUsuario dado.
 * 
 * @param {string} nombreUsuario - NombreUsuario que se quiere pasar como clave.
 * @param {Carrito} carrito - Carrito a agregar a el registro del usuario dado.
 */
export function addCarrito(nombreUsuario, carrito) {
    registros.get(nombreUsuario).push(carrito)
    saveRegistros()
}

export function saveRegistros() {
    localStorage.setItem("registrosKeys", JSON.stringify(Array.from(registros.keys())))
    let values = ""
    for (const array of registros.values()) {
        for (const carrito of array) {
            values += `${carrito.save()}¬`  
        }
        values += "|"
    }
    localStorage.setItem("registrosValues", values)
}