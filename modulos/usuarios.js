import { Usuario } from "../clases/Usuario.js"
import * as loader from "./loader.js"
import * as carritos from "../modulos/carritos.js"
import * as registros from "../modulos/registros.js"

//#region Documentacion
/**
 * @fileoverview Manejo de los usuarios, con guardado en localStorage.
 * @module usuarios
 */
//#endregion

//#region Variables
/** @type {Map<string, Usuario>}> */
const usuarios = loader.loadUsuarios()
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
    if (tipo === "user") {
        carritos.setCarrito(nombreUsuario)
        registros.setRegistro(nombreUsuario)
    }
    saveUsuarios()
}

/**
 * Devuelve el objeto usuario asignado al nombreUsuario dado como clave.
 * 
 * @param {string} nombreUsuario - NombreUsuario que se quiere pasar como clave.
 * @returns {Usuario | null} Retorna el objeto usuario y si no existe retorna null.
 */
export function getUsuario(nombreUsuario) {
    let toReturn = usuarios.get(nombreUsuario)
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
    saveUsuarios()
}

export function saveUsuarios() {
    localStorage.setItem("usuariosKeys", JSON.stringify(Array.from(usuarios.keys())))
    let values = ""
    for (const usuario of usuarios.values()) {
        values += `${usuario.save()}|`
    }
    localStorage.setItem("usuariosValues", values)
}

export function getUsuarios() {
    console.log("Estoy en modulos/usuarios/getUsuarios")
    console.log(usuarios)
    return usuarios
}

export function existeUsuario(nombreDeUsuario) {
    return usuarios.has(nombreDeUsuario) //compara las llaves con nombreDeUsuario y devuelve true o false
}