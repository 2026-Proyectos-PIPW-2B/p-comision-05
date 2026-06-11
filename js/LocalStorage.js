//#region Variables
import {imagenes} from "./imagenes.js"

/** @type {Map}> */
const usuarios = JSON.parse(localStorage.getItem("usuarios")) || new Map()
/** @type {Map}> */
const productos = JSON.parse(localStorage.getItem("productos")) || new Map()
//#endregion

export function setUsuario(usuario, nombre, apellido, contraseña) {
    const usuario = {
        usuario: usuario,
        nombre: nombre,
        apellido: apellido,
        contraseña: contraseña,
        carrito: new Map(),
        registro: new Map(),
    }

    usuarios.set()
    localStorage.setItem("usuarios", JSON.stringify(usuarios))
}

export function setProducto(nombre, etiquetas, descripcion, stock, valor) {
    const producto = {
        nombre: nombre,
        etiquetas: etiquetas,
        descripcion: descripcion,
        stock: stock,
        valor: valor,
        imagen: imagenes[nombre],
    }

    productos.push(producto)
    localStorage.setItem("productos", JSON.stringify(productos))
}

export function setUsuarioActual(usuario) {
    localStorage.setItem("usuarioActual", usuarios.get(usuario))
}

export function getUsuario(usuario) {
    return usuarios.get(usuario)
}