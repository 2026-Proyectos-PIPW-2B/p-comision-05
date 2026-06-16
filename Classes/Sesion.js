import { Producto } from "./Producto"

/**
 * Objeto para guardar los datos de la sesion para rapido acceso.
 */
export class Sesion {
    /**
     * Nombre del usuario para loguearse.
     * 
     * @type {string}
     * @readonly
     */
    nombreUsuario
    /**
     * Nombre del usuario publico.
     * 
     * @type {string}
     * @readonly
     */
    nombre
    /**
     * Apellido del usuario publico.
     * 
     * @type {string}
     * @readonly
     */
    apellido
    carrito
    registro

    /**
     * Crae un objeto Sesion con los datos dados.
     * 
     * @param {string} nombreUsuario - Nombre del usuario para loguearse.
     * @param {string} nombre - Nombre del usuario publico.
     * @param {string} apellido - Apellido del usuario publico.
     * @param {Map<string, Producto>} carrito - Mapa de duplas nombreUsuario/Producto.
     * @param {Array<Map<string, Producto>>} registro - Array de carritos ya confirmados del usuario
     */
    constructor(nombreUsuario, nombre, apellido, carrito = null, registro = null) {
        this.nombreUsuario = nombreUsuario
        this.nombre = nombre
        this.apellido = apellido
        this.carrito = carrito
        this.registro = registro
    }
}