import { Producto } from "../clases/Producto.js"

//#region Documentacion
/**
 * @fileoverview Manejo del stock de productos.
 * @module stock
 */
//#endregion

//#region Variables
/** @type {Map<string, Producto>}> */
const stock = JSON.parse(localStorage.getItem("stock")) || new Map()
console.log(stock)
//#endregion


/**
 * Crea un objeto producto con los datos dado, lo añade a stock y lo sube a localStorage.
 * 
 * @param {string} nombre - Nombre del producto.
 * @param {array<string>} etiquetas - Lista de etiiquetas a asignar.
 * @param {string} descripcion - Descripcion del producto.
 * @param {number} cantidad - Cantidad de productos disponibles en stock.
 * @param {number} valor - Valor del producto.
 */
export function setProductoToStock(nombre, etiquetas, descripcion, cantidad, valor) {
    /** @type {Producto} */
    const producto = new Producto(nombre, etiquetas, descripcion, cantidad, valor, "stock", stock)
    stock.set(producto.id, producto)
    localStorage.setItem("stock", JSON.stringify(stock))
}

/**
 * Devuelve el stock de productos guardados en el localStorage.
 * 
 * @returns {Map<string, Producto>} Retorna el mapa de duplas id/Producto.
 */
export function getStock() {
    return stock
}

/**
 * Devuelve el producto asignado a la id dada en el stock.
 * 
 * @returns {Producto} Retorna el objeto Producto asignado a la id.
 */
export function getProducto(id) {
    return stock.get(id)
}

/**
 * Remueve el producto asociado, a la id dada en stock
 * 
 * 
 */
export function removeProducto(id) {
    stock.delete(id)
    console.log(stock)
}


