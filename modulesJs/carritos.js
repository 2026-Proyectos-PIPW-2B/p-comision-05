import { Carrito } from "../classes/Carrito.js"
import { Producto } from "../classes/Producto.js"
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
    carritos.set(nombreUsuario, new Carrito())
    localStorage.setItem("carritos", JSON.stringify(carritos))
}

/**
 * Crea el producto y lo añade al carrito asignado a el nombreUsuario dado, lo guarda y lo sube al localStorage.
 * 
 * @param {string} nombreUsuario - El nombreUsuario que se quiere pasar como clave.
 * @param {Producto} producto - El objeto productoAComprar que se quiere guardar en el carrito.
*/
export function setProductoToCarrito(nombreUsuario, producto) {
    carritos.get(nombreUsuario).productos.set(producto.id, producto.generateProductoNewAlmacenamiento("carritos", carritos))
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
 * Devuelve el productoAComprar, que coincide con el id, del carrito asignado al nombreUsuario dado.
 * 
 * @param {string} nombreUsuario - NombreUsuario que se quiere pasar como clave.
 * @param {string} id - El id del productoAComprar que se quiere buscar.
 * @returns {productoAComprar | null} Retorna el objeto productoAComprar asignado al id y si no existe devuelve null.
 */
export function getProductoFromCarrito(nombreUsuario, id) {
    return carritos.get(nombreUsuario).productos.get(id)
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
    registros.addCarrito(nombreUsuario, carritoAgregar)
    carritos.get(nombreUsuario).delete()
    setCarrito(nombreUsuario)
}