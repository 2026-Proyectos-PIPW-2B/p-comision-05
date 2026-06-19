/**
 * Objeto producto para guardase en stock o en compras que genera una id unica y asigna el path de una imagen segun el nombre dado.
 */
export class Producto { 
    /**
     * Nombre del Producto para mostrar.
     * 
     * @type {string}
     * @public
     */
    nombre
    /**
     * Una lista de etiquetas que se le pueden asignar.  
     * Cambiar las etiquetas tambien actualiza y guarda en el localStorage la estructura que lo contiene.
     * 
     * @type {Array<string>}
     * @public
     */
    etiquetas
    /**
     * Descripcion del producto.  
     * Cambiar la descripcion tambien actualiza y guarda en el localStorage la estructura que lo contiene.
     * 
     * @type {string}
     * @public
     */
    descripcion
    /**
     * Cantidad del producto que hay en stock o a comprar.  
     * Cambiar la cantidad tambien actualiza y guarda en el localStorage la estructura que lo contiene.
     * 
     * @type {Number}
     * @public
     */
    cantidad
    /**
     * Valor del producto.
     * 
     * @type {Number}
     * @public
     */
    valor
    #imagen
    #id

    /**
     * Crea un objeto Producto con los datos dados.
     * 
     * @param {string} nombre - Nombre del producto.
     * @param {Array<string>} etiquetas - Una lista de etiquetas que se le pueden asignar.
     * @param {string} descripcion - Descripcion del producto.
     * @param {Number} cantidad - Cantidad del producto que hay en stock.
     * @param {Number} valor - Valor del producto.
     * @param {string} id - Id es un paramatro opcional solo utilizado en el clone, no se pasa normalmente
     */
    constructor(nombre, etiquetas, descripcion, cantidad, valor, id = crypto.randomUUID()) {
        this.nombre = nombre
        this.etiquetas = etiquetas
        this.descripcion = descripcion
        this.cantidad = cantidad
        this.valor = valor
        this.#imagen = "imagenes[nombre]"
        this.#id = id
    }

    // Getters
    /**
     * Path de la imagen correspondiente al nombre.
     * 
     * @type {string}
     * @readonly
     */
    get imagen() {
        return this.#imagen
    }
    /**
     * Identificacion unica del producto.
     * 
     * @type {string}
     * @readonly
     */
    get id() {
        return this.#id
    }
    /**
     * Valor total sumando todos los productos (cantidad * valor).
     * 
     * @type {Number}
     * @readonly
     */
    get valorTotal() {
        return this.cantidad * this.valor
    }

    // Methods
    /**
     * Crea y devuelve un nuevo producto con las caracteristicas del que llama a la funcion y algunas que se pueden asignar.
     * 
     * @param {Number} cantidadAgregada - Cantidad que se va a comprar, por defecto agrega 1.
     * @returns {Producto} Retorna un nuevo objeto creado a partir del que llamo a la funcion.
     */
    cloneProducto(cantidadAgregada = 1) {
        /** @type {Producto} */
        const nuevoProducto = new this.constructor(this.nombre, this.etiquetas, this.descripcion, cantidadAgregada, this.valor, this.#id)
        return nuevoProducto
    }
    
    save() {
        return `${this.nombre}¡${JSON.stringify(this.etiquetas)}¡${this.descripcion}¡${this.cantidad}¡${this.valor}¡${this.#id}`
    }
}