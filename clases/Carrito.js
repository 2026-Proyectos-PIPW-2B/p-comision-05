import { Producto } from "./Producto";

/**
 * Conjunto de mapa de productos y fecha para guardado del mismo.
 */
export class Carrito {
    #productos
    /**
     * Fecha para guarda al confirmar el carrito.
     * 
     * @type {string}
     * @public
     */
    fecha

    /**
     * Crea un Carrito con un mapa vacio asignado a productos y sin fecha.
     */
    constructor() {
        this.#productos = new Map()
        this.fecha = null
    }

    // Getters
    /**
     * Mapa de duplas string(id)/Producto(objeto producto a comprar o guardado).
     * 
     * @type {Map<string, Producto>}
     * @public
     */
    get productos() {
        return this.#productos
    }

    /**
     * Devuelve un producto asignado al id(string) dado.
     * 
     * @param {string} id - Id del producto que se quiere buscar
     * @returns {Producto} Retorna el producto asignado a el id dado.
     */
    getProducto(id) {
        return this.#productos.get(id)
    }
}