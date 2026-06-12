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

/** @type {Map<string, Array<Map<string, productoAComprar>>>}> */
const registros = JSON.parse(localStorage.getItem("registros")) || new Map()

//#endregion

export function setRegistro(nombreUsuario) {
    registros.set(nombreUsuario, new Map())
    localStorage.setItem("registros", JSON.stringify(registros))
}

export function getRegistro(nombreUsuario) {
    return registros.get(nombreUsuario)
}

export function addCompra(nombreUsuario, compra) {
    registros.get(nombreUsuario).push(compra)
    localStorage.setItem("registros", JSON.stringify(registros))
}