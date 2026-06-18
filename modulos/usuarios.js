import { Usuario } from "../clases/Usuario"

//#region Documentacion
/**
 * @fileoverview Manejo de los usuarios, con guardado en localStorage.
 * @module usuarios
 */
//#endregion

//#region Variables
/** @type {Map<string, Usuario>}> */
const usuarios = new Map(JSON.parse(localStorage.getItem("usuarios"))) || new Map()
//#endregion

/**
 * Crea un nuevo usario con los datos dados, lo añade a usuarios y lo sube al localStorage.
 * 
 * @param {string} nombreUsuario - NombreUsuario que se quiere pasar como dato de inicio.
 * @param {string} nombre - Nombre del usuario publico.
 * @param {string} apellido - Apellido del usuario publico.
 * @param {string} contraseña - Contraseña privada del usuario.
 * @param {string} tipo - Tipo de usuario(admin/user).
 */
export function setUsuario(nombreUsuario, nombre, apellido, contraseña, tipo) {
    /** @type {Usuario}> */
    const usuario = new Usuario(nombreUsuario, nombre, apellido, contraseña, tipo)
    usuarios.set(nombreUsuario, usuario)
    localStorage.setItem("usuarios", JSON.stringify(Array.from(usuarios.entries())))
}

/**
 * Devuelve el objeto usuario asignado al nombreUsuario dado como clave.
 * 
 * @param {string} nombreUsuario - NombreUsuario que se quiere pasar como clave.
 * @returns {Usuario | null} Retorna el objeto usuario y si no existe retorna null.
 */
export function getUsuario(nombreUsuario) {
    const toReturn = usuarios.get(nombreUsuario)
    if (!toReturn) {
        toReturn = null
    }
    return toReturn
}

/**
 * 
 * @param {string} nombreUsuario 
 */
export function removeUsuario(nombreUsuario) {
    usuarios.delete(nombreUsuario)
    localStorage.setItem("usuarios", JSON.stringify(Array.from(usuarios.entries())))
}
