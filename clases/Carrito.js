import { Producto } from "./Producto.js";

/**
 * Conjunto de mapa de productos y fecha para guardado del mismo.
 */
export class Carrito {
    #productos
    #valorTotal
    #lugarAlmacenado
    #referencia
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
     * Devuelve el valor total de todos los productos en el carrito calculados en base a su cantidad.
     * 
     * @returns {Number} Retorna el total de todos los productos.
     */
    get valorTotal() {
        let toReturn = 0
        for (const producto of this.#productos.values()) {
            toReturn += producto.valorTotal
        }
        return toReturn
    }

    /**
     * Crea el producto y lo añade a los productos del carrito, lo guarda y lo sube al localStorage.
     * 
     * @param {Producto} producto - El objeto producto que se quiere guardar en el carrito.
     * @param {Number} cantidad - La cantidad de un producto que se quiere comprar.
     */
    setProducto(producto, cantidad) {
        this.#productos.set(producto.id, producto.generateProductoNewAlmacenamiento(this.#lugarAlmacenado, this.#referencia, cantidad))
        this.#guardarLocalStorage()
    }
    
    /**
     * Devuelve el Producto asignado al id dado como clave.
     * 
     * @param {string} id - El id del Producto que se quiere buscar.
     * @returns {Producto | undefined} Retorna el objeto Producto asignado al id y si no existe devuelve undefined.
     */
    getProducto(id) {
        return this.#productos.get(id)
    }

    /**
     * Remueve un Producto del mapa del carrito, que este asociado al id
     * 
     * @param {string} id - Id que se quiere pasar como clave para encontrar al Producto.
     */
    removeProducto(id) {
        this.#productos.delete(id)
        this.#guardarLocalStorage()
    }

    #guardarLocalStorage() {
        localStorage.setItem(this.#lugarAlmacenado, JSON.stringify(Array.from(this.#referencia.entries())))
    }
}