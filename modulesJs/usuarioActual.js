//#region Documentacion

/**
 * @typedef {object} usuarioActual
 * Una version acortada del objeto usuario que sirve para tener cargados los datos necesarios para las paginas.
 * 
 * @property {string} nombreUsuario - Nombre del usuario para loguearse.
 * @property {string} nombre  - Nombre del usuario publico.
 * @property {string} apellido  - Apellido del usuario publico. 
 */

//#endregion

//#region Variables

/** @type {object}> */
let usuarioActual = JSON.parse(localStorage.getItem("usuarioActual")) || null

//#endregion

/**
 * Crea un nuevo usuarioActual apartir del usuario obtenido del localStorage correspondiente a la clave dada, lo asigna a usuarioActual y lo sube al localStorage.
 * 
 * @param {string} nombreUsuario - NombreUsuario que se quiere pasar como clave.
 */
export function setUsuarioActual(nombreUsuario) {
    const usuarioACargar = usuarios.get(nombreUsuario)

    /** @type {usuarioActual} */
    usuarioActual = {
        nombreUsuario: usuarioACargar.nombreUsuario,
        nombre: usuarioACargar.nombre,
        apellido: usuarioACargar.apellido,
    }
    
    localStorage.setItem("usuarioActual", JSON.stringify(usuarioActual))
}

/**
 * Devuelve el objeto usuarioActual guardado en el localStorage.
 * 
 * @returns {usuarioActual | null} Retorna el objeto usuarioActual y si no existe retorna null.
 */
export function getUsuarioActual() {
    return usuarioActual
}
