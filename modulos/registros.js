import { Producto } from "../clases/Producto"

//#region Documentacion
/**
 * @fileoverview Manejo de los registros de los usuarios, con guardado en localStorage.
 * @module registros
 */
//#endregion

//#region Variables
/** @type {Map<string, Array<Map<string, Producto>>>}> */
const registros = new Map(JSON.parse(localStorage.getItem("registros"))) || new Map()
//#endregion

/**
 * Crea un mapa de carritos(Map<string, Producto>), lo guarda en registros y lo sube al localStorage.
 * 
 * @param {string} nombreUsuario - NombreUsuario que se quiere pasar como clave.
 */
export function setRegistro(nombreUsuario) {
    registros.set(nombreUsuario, [])
    localStorage.setItem("registros", JSON.stringify(Array.from(registros.entries())))
}

/**
 * Obtine de los registros la lista de carritos guardados del nombreUsuario dado.
 * 
 * @param {string} nombreUsuario - NombreUsuario que se quiere pasar como clave.
 * @returns {Array<Map<string, Producto>>} Retorna una lista con los carritos que se compraron de ese usuario.
 */
export function getRegistro(nombreUsuario) {
    return registros.get(nombreUsuario)
}

/**
 * Añade un carrito dado a el registro asignado a el nombreUsuario dado.
 * 
 * @param {string} nombreUsuario - NombreUsuario que se quiere pasar como clave.
 * @param {Map<string, Producto>} carrito - Carrito a agregar a el registro del usuario dado.
 */
export function addCarrito(nombreUsuario, carrito) {
    registros.get(nombreUsuario).push(carrito)
    localStorage.setItem("registros", JSON.stringify(Array.from(registros.entries())))
}