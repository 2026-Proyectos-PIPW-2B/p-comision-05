//#region Tipos
/**
 * @typedef {Object} Sesion
 * @property {string} nombreUsuario - Nombre de usuario que se usa como clave
 * @property {string} nombre - Nombre publico para ver en el login.
 * @property {string} apellido - Apellido del usuario publico.
 */
//#endregion

//#region Documentacion
/**
 * @fileoverview Control de la sesion actual con el objeto sesion, con guardado en localStorage.
 * @module sesionActual
 */
//#endregion

/** @type {Sesion} */
let sesionActual = JSON.parse(localStorage.getItem("sesionActual")) || null

/**
 * Crea un nuevo usuarioActual apartir del usuario obtenido del localStorage correspondiente a la clave dada, lo asigna a usuarioActual y lo sube al localStorage.
 * 
 * @param {string} nombreUsuario - NombreUsuario que se quiere pasar como clave.
 * @param {string} nombre - Nombre del usuario para vista publica.
 * @param {string} apellido - Apellido del usuario que se quiere mostrar publicamente.
*/
export function set(nombreUsuario, nombre, apellido) {
    /** @type {Sesion} */
    sesionActual = {
        nombreUsuario: nombreUsuario,
        nombre: nombre, 
        apellido: apellido,
    }
    localStorage.setItem("sesionActual", JSON.stringify(sesionActual))
}

/**
 * Devuelve el objeto usuarioActual guardado en el localStorage.
 * 
 * @returns {Sesion | null} Retorna el objeto usuarioActual y si no existe retorna null.
*/
export function get() {
    return sesionActual
}

export function limpiarSesionActual() {
    sesionActual = null;
    localStorage.removeItem("sesionActual");
}