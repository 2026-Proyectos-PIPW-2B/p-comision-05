//#region Documentacion

/**
 * @typedef {object} usuario
 * Guarda todos los datos de un usuario registrado en el sistema.
 * 
 * @property {string} nombreUsuario - Nombre del usuario para loguearse.
 * @property {string} nombre  - Nombre del usuario publico.
 * @property {string} apellido  - Apellido del usuario publico.
 * @property {string} contraseña  - Contraseña del usuario.
 * @property {boolean} habilitado  - Estado del usuario.
 * @property {string} tipo  - Tipo de usuario(admin/user), arroja un error si se intenta asignar algo que no sea "user" o "admin".
 * @property {function(): boolean} toggleHabilitado - Cambia el valor de habilitado, que por defecto es true.  
 * 
 * Devuelve el valor al que cambio habilitado.
 */

//#endregion

//#region Variables

/** @type {Map<string, usuario>}> */
const usuarios = JSON.parse(localStorage.getItem("usuarios")) || new Map()

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
    /** @type {usuario}> */
    const usuario = {
        nombreUsuario: nombreUsuario,
        nombre: nombre,
        apellido: apellido,
        contraseña: contraseña,
        habilitado: true,
        tipo: tipo,
        // Declaracion de funciones
        toggleHabilitado() {
            this.habilitado = !this.habilitado
            return this.habilitado
        },
        // Setters
        set tipo(nuevoValor) {
            try {
                if (nuevoValor != "admin" || nuevoValor != "user") {
                    throw new Error("El valor de tipo tiene que ser un string que sea user o admin");
                }
            } catch(error) {
                console.error(error.message); 
            }
            this.tipo = nuevoValor
        },
    }

    usuarios.set(nombreUsuario, usuario)
    localStorage.setItem("usuarios", JSON.stringify(usuarios))
}

/**
 * Devuelve el objeto usuario asignado al nombreUsuario dado como clave.
 * 
 * @param {string} nombreUsuario - NombreUsuario que se quiere pasar como clave.
 * @returns {usuario | null} Retorna el objeto usuario y si no existe retorna null.
 */
export function getUsuario(nombreUsuario) {
    const toReturn = usuarios.get(nombreUsuario)
    if (!toReturn) {
        toReturn = null
    }
    return toReturn
}
