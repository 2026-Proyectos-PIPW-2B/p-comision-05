//#region 

import * as registros from "./registros.js"

//#endregion

//#region Documentacion

/**
 * @fileoverview Manejo de los carritos de los usuarios, con guardado en localStorage.
 * @module carritos
 */

/**
 * @typedef {object} productoAComprar
 * Objeto productoAComprar para agregar a carritos o compras.
 * 
 * @property {string} nombre - Nombre del producto dado por el producto base.
 * @property {string} descripcion - Descripcion del producto dado por el producto base.
 * @property {number} cantidad - Cantidad del producto a comprar.
 * @property {number} valor - Valor del producto a comprar dado por el producto base.
 * @property {number} valorTotal - Valor total calculado a partir del valor y la cantidad.
 * @property {string} id - Identificacion del producto para vincularlo con el producto en el stock.
 */

//#endregion

//#region Variables

/** @type {Map<string, Map<string, productoAComprar>>}> */
const carritos = JSON.parse(localStorage.getItem("carritos")) || new Map()

//#endregion

/**
 * Añade un nuevo carrito asignado a el nombreUsuario que se pasa como paramentro y lo guarda en el localStorage.
 * 
 * @param {string} nombreUsuario - El nombreUsuario que se quiere pasar como clave.
 */
export function addCarrito(nombreUsuario) {
    carritos.set(nombreUsuario, new Map())
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
export function getProductoDeCarrito(nombreUsuario, id) {
    return carritos.get(nombreUsuario).get(id)
}

/**
 * Añade el productoAComprar al carrito asignado a la clave dada, lo guarda y lo sube al localStorage.
 * 
 * @param {string} nombreUsuario - El nombreUsuario que se quiere pasar como clave.
 * @param {productoAComprar} productoAComprar - El objeto productoAComprar que se quiere guardar en el carrito.
 */
export function addProducto(nombreUsuario, productoAComprar) {
    carritos.get(usuario).set(productoAComprar.id, productoAComprar)
    localStorage.setItem("carritos", JSON.stringify(carritos))
}

function clearCarrito(nombreUsuario) {
    carritos.get(nombreUsuario).delete()
    addCarrito(nombreUsuario)
}

/**
 * Agrega el carrito del usuario a el registro del mismo vinculado a la clave nombreUsuario, y limpia el carrito del mismo usuario.
 * 
 * @param {string} nombreUsuario - El nombreUsuario que se quiere pasar como clave.
 */
export function addCarritoARegistro(nombreUsuario) {
    registros.addCompra(nombreUsuario, carritos.get(nombreUsuario))
    clearCarrito(nombreUsuario)
}
