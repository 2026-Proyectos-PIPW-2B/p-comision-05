//#region Documentacion

/**
 * @fileoverview Manejo del stock de productos y creacion de productos a comprar.
 * @module productos
 */

/**
 * @typedef {object} producto
 * Objeto producto para guardase en stock que genera una id unica y asigna el path de una imagen segun el nombre dado.
 * 
 * @property {string} nombre - Nombre del producto.
 * @property {array<string>} etiquetas - Una lista de etiquetas que se le pueden asignar.
 * @property {string} descripcion - Descripcion del producto. 
 * @property {number} cantidad - Cantidad del mismo producto que hay en stock, cada vez que se cambia se actualiza el localStorage.
 * @property {number} valor - Valor del producto.
 * @property {string} imagen - Path de la imagen correspondiente al nombre.
 * @property {string} id - Identificacion unica del producto.
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

/** @type {Map<string, producto>}> */
const stock = JSON.parse(localStorage.getItem("stock")) || new Map()

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
    /** @type {producto} */
    const producto = {
        nombre: nombre,
        etiquetas: etiquetas,
        descripcion: descripcion,
        cantidad: cantidad,
        valor: valor,
        imagen: "imagenes[nombre]",
        id: crypto.randomUUID(),    
    }

    stock.set(producto.id, producto)
    localStorage.setItem("stock", JSON.stringify(stock))
}

/**
 * Devuelve el stock de productos guardados en el localStorage.
 * 
 * @returns {Map<string, producto>} Retorna el mapa de productos, asignados a las ids.
 */
export function getStock() {
    return stock
}

/**
 * Devuelve un objeto productoAComprar creado a partir del producto guardado en stock que corresponde con el id.
 * 
 * @param {string} id - Identificacion del producto guardado en stock.
 * @param {number} cantidad - Cantidad del producto que se quiere comprar.
 */
export function getProductoAComprar(id, cantidad) {
    const productoStock = stock.get(id)
    
    /** @type {productoAComprar} */
    const productoAComprar = {
        nombre = productoStock.nombre,
        descripcion = productoStock.descripcion,
        cantidad = cantidad,
        valor = productoStock.valor,
        valorTotal = cantidad * valor,
        id: productoStock.id,
        // Setters
        set cantidad(nuevoValor) {
            this.cantidad = nuevoValor
            this.valorTotal = this.cantidad * this.valor
        },
    }

    return productoAComprar
}