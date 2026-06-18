/**
 * Objeto producto para guardase en stock o en compras que genera una id unica y asigna el path de una imagen segun el nombre dado.
 */
export class Producto { 
    #nombre
    #etiquetas
    #descripcion
    #cantidad
    #valor
    #lugarAlmacenado
    #referencia
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
     * @param {string} lugarAlmacenado - Lugar donde se almacena el producto stock, registro o carrito.
     * @param {any} referencia - Referencia a la estructura que lo contiene.
     * @param {string} id - Id es un paramatro opcional solo utilizado en el clone, no se pasa normalmente
     */
    constructor(nombre, etiquetas, descripcion, cantidad, valor, lugarAlmacenado, referencia, id = crypto.randomUUID()) {
        this.#nombre = nombre
        this.#etiquetas = etiquetas
        this.#descripcion = descripcion
        this.#cantidad = cantidad
        this.#valor = valor
        this.#lugarAlmacenado = lugarAlmacenado
        this.#referencia = referencia
        this.#imagen = "imagenes[nombre]"
        this.#id = id
    }

    // Setters
    set nombre(nuevoValor) {
        this.#nombre = nuevoValor
        this.#guardarLocalStorage()
    }
    set etiquetas(nuevoValor) {
        this.#etiquetas = nuevoValor
        this.#guardarLocalStorage()
    }
    set descripcion(nuevoValor) {
        this.#descripcion = nuevoValor
        this.#guardarLocalStorage()
    }
    set cantidad(nuevoValor) {
        this.#cantidad = nuevoValor
        console.log("hola")
        this.#guardarLocalStorage()
    }
    set valor(nuevoValor) {
        this.#valor = nuevoValor
        this.#guardarLocalStorage()
    }

    // Getters
    /**
     * Nombre del producto.  
     * Cambiar el nombre tambien actualiza y guarda en el localStorage la estructura que lo contiene.
     * 
     * @type {string}
     * @public
     * @
     */
    get nombre() {
        return this.#nombre
    }
    /**
     * Una lista de etiquetas que se le pueden asignar.  
     * Cambiar las etiquetas tambien actualiza y guarda en el localStorage la estructura que lo contiene.
     * 
     * @type {Array<string>}
     * @public
     */
    get etiquetas() {
        return this.#etiquetas
    }
    /**
     * Descripcion del producto.  
     * Cambiar la descripcion tambien actualiza y guarda en el localStorage la estructura que lo contiene.
     * 
     * @type {string}
     * @public
     */
    get descripcion() {
        return this.#descripcion
    }
    /**
     * Cantidad del producto que hay en stock o a comprar.  
     * Cambiar la cantidad tambien actualiza y guarda en el localStorage la estructura que lo contiene.
     * 
     * @type {Number}
     * @public
     */
    get cantidad() {
        return this.#cantidad
    }
    /**
     * Valor del producto.
     * 
     * @type {Number}
     * @public
     */
    get valor() {
        return this.#valor
    }
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
        return this.#cantidad * this.#valor
    }

    // Methods
    /**
     * Crea y devuelve un nuevo producto con las caracteristicas del que llama a la funcion y algunas que se pueden asignar.
     * 
     * @param {string} lugarAlmacenado - Nombre del lugar donde se almacena en el localStorage.
     * @param {object} referencia - Referencia a la nueva estructura a la que se agrega. 
     * @param {Number} cantidadAgregada - Cantidad que se va a comprar, por defecto agrega 1.
     * @returns {Producto} Retorna un nuevo objeto creado a partir del que llamo a la funcion.
     */
    generateProductoNewAlmacenamiento(lugarAlmacenado, referencia, cantidadAgregada = 1) {
        /** @type {Producto} */
        const nuevoProducto = new this.constructor(this.nombre, this.etiquetas, this.descripcion, cantidadAgregada, this.valor, lugarAlmacenado, referencia, this.#id)
        return nuevoProducto
    }
    
    #guardarLocalStorage() {
        localStorage.setItem(this.#lugarAlmacenado, JSON.stringify(Array.from(this.#referencia.entries())))
    }
}
