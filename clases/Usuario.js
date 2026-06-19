/**
 * Guarda todos los datos de un usuario registrado en el sistema.
 */
export class Usuario {
    #nombreUsuario
    #nombre
    #apellido
    #contraseña
    #tipo 
    #habilitado

    /**
     * Crea un nuevo objeto Usuario con los valores dados.
     * 
     * @param {string} nombreUsuario - Nombre del usuario para loguearse.
     * @param {string} nombre - Nombre del usuario publico.
     * @param {string} apellido - Apellido del usuario publico.
     * @param {string} contraseña - Contraseña del usuario.
     * @param {string} tipo - Tipo de usuario(admin/user), arroja un error si se intenta asignar algo que no sea "user" o "admin".
     * @param {boolean} habilitado - Si el usuario esta habilitado, por defecto es true
     */
    constructor(nombreUsuario, nombre, apellido, contraseña, tipo, habilitado = true) {
        this.#nombreUsuario = nombreUsuario
        this.#nombre = nombre
        this.#apellido = apellido
        this.#contraseña = contraseña
        this.#tipo = tipo
        this.#habilitado = habilitado
    }

    // Setters
    set tipo(nuevoValor) {
        try {
            if (nuevoValor != "admin" || nuevoValor != "user") {
                throw new Error("El valor de tipo tiene que ser un string que sea user o admin");
            }
        } catch(error) {
            console.error(error.message); 
        }
        this.#tipo = nuevoValor
    }

    // Getters
    /**
     * Nombre del usuario para loguearse.
     * 
     * @type {string}
     * @readonly
     */
    get nombreUsuario() {
        return this.#nombreUsuario
    }
    /**
     * Nombre del usuario publico.
     * 
     * @type {string}
     * @readonly
     */
    get nombre() {
        return this.#nombre
    }
    /**
     * Apellido del usuario publico.
     * 
     * @type {string}
     * @readonly
     */
    get apellido() {
        return this.#apellido
    }
    /**
     * Contraseña del usuario, no deberia modificarse.
     * 
     * @type {string} 
     * @readonly
     */
    get contraseña() {
        return this.#contraseña
    }
    /**
     * Tipo de usuario(admin/user), arroja un error si se intenta asignar algo que no sea "user" o "admin".
     * 
     * @type {string} 
     * @public
     */
    get tipo() {
        return this.#tipo
    }
    /**
     * Reprenseta si el usuario esta habilitado o no para entrar a la pagina
     * 
     * @type {boolean}
     * @public
     */
    get habilitado() {
        return this.#habilitado
    }

    /**
     * Cambia el valor de habilitado, que por defecto es true.
     * 
     * @returns {boolean} Retorna el valor al que se cambio habilitado.
     */
    toggleHabilitado() {
        this.habilitado = !this.habilitado
        return this.habilitado
    }

    save() {
        return `${this.#nombreUsuario}!${this.#nombre}!${this.#apellido}!${this.#contraseña}!${this.#tipo}!${this.#habilitado}`
    }
}