import { Carrito } from "../clases/Carrito.js"
import { Producto } from "../clases/Producto.js"
import * as registros from "./registros.js"

//#region Documentacion
/**
 * @fileoverview Manejo de los carritos de los usuarios, con guardado en localStorage.
 * @module carritos
 */
//#endregion

//#region Variables
/** @type {Map<string, Carrito>}> */
const carritos = JSON.parse(localStorage.getItem("carritos")) || new Map()
//#endregion

/**
 * Crea un nuevo carrito asignado a el nombreUsuario que se pasa como paramentro y lo guarda en el localStorage.
 * 
 * @param {string} nombreUsuario - El nombreUsuario que se quiere pasar como clave.
 */
export function setCarrito(nombreUsuario) {
    carritos.set(nombreUsuario, new Carrito("carritos", carritos))
    localStorage.setItem("carritos", JSON.stringify(carritos))
}


/**
 * Añade un nuevo carrito asignado a el nombreUsuario que se pasa como paramentro y lo guarda en el localStorage.
 * 
 * @param {string} nombreUsuario - El nombreUsuario que se quiere pasar como clave.
 */
export function getCarrito(nombreUsuario) {
    const toReturn = carritos.get(nombreUsuario)
    if (!toReturn) {
        toReturn = null
    }
    return toReturn
}

/**
 * Borra el carrito asignado al usuario dado y guarda el localStorage.
 * 
 * @param {string} nombreUsuario - NombreUsuario que esta asignado al carrito.
 */
export function removeCarrito(nombreUsuario) {
    carritos.delete(nombreUsuario)
    localStorage.setItem("carritos", JSON.stringify(carritos))
}

/**
 * Borra todo el carrito y crea uno nuevo asignado al mismo usuario, para "limpiarlo", y guarda el localStorage.
 * 
 * @param {string} nombreUsuario - NombreUsuario que esta asignado al carrito.
 */
export function clearCarrito(nombreUsuario) {
    carritos.delete(nombreUsuario)
    setCarrito(nombreUsuario)
}

/**
 * Agrega el carrito del usuario a el registro del mismo vinculado a la clave nombreUsuario, y limpia el carrito del mismo usuario.
 * 
 * @param {string} nombreUsuario - El nombreUsuario que se quiere pasar como clave.
 */
export function addCarritoToRegistro(nombreUsuario) {
    const carritoAgregar = carritos.get(nombreUsuario)
    // Creacion de fecha
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0')
    const mes = String(fecha.getMonth() + 1).padStart(2, '0')
    const fechaFormateada = `${dia}/${mes}/${fecha.getFullYear()} ${fecha.getHours}:${fecha.getMinutes}`
    carritoAgregar.fecha = fechaFormateada
    // Guardo y limpio el carrito
    registros.addCarrito(nombreUsuario, carritoAgregar)
    clearCarrito(nombreUsuario)
}
