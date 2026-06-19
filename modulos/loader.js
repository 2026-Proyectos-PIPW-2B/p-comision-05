import { Producto } from "../clases/Producto.js"
import { Usuario } from "../clases/Usuario.js"

/**
 * Funcion para cargar Producto de localStorage
 * 
 * @param {string} str 
 */
export function loadProducto(str) {
    const values = str.split("¡")
    return new Producto(values[0], JSON.parse(values[1]), values[2], JSON.parse(values[3]), JSON.parse(values[4]), values[5])
}

export function loadUsuario(str) {
    const values = str.split("¡")
    return new Usuario(values[0], values[1], values[2], values[3], values[4], JSON.parse(values[5]))
}

/**
 * Reconstruye el mapa de los string y Productos de stock.
 * 
 * @returns {Map<string, Producto>} Retorna el mapa del sotck reconstruido.
 */
export function loadStock() {
    const mapa = new Map()
    const stockKeys = JSON.parse(localStorage.getItem("stockKeys"))
    if (stockKeys !== null) {
        const stockValues = localStorage.getItem("stockValues").split("|")
        for (let i = 0; i < stockKeys.length; i++) {
            mapa.set(stockKeys[i], loadProducto(stockValues[i]))
        }
    }
    return mapa
}