import { Carrito } from "../clases/Carrito.js"
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
 * 
 * @param {string} str 
 * @returns {Carrito}
 */
export function loadCarrito(str) {
    const values = str.split("¿")
    // values[0] = fecha, values[1] = array de keys, values[2] = string de valores
    const mapa = new Map()
    if (str !== "") {
        const productosKeys = JSON.parse(values[1])
        const productosValues = values[2].split("°")
        for (let i = 0; i < productosKeys.length; i++) {
            mapa.set(productosKeys[i], loadProducto(productosValues[i]))
        }
    }
    return new Carrito(mapa, values[0])
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

/**
 * 
 * @returns 
 */
export function loadCarritos() {
    const mapa = new Map()
    const carritosKeys = JSON.parse(localStorage.getItem("carritosKeys"))
    if(carritosKeys !== null) {
        const carritosValues = localStorage.getItem("carritosValues").split("|")
        for (let i = 0; i < carritosKeys.length; i++) {
            mapa.set(carritosKeys[i], loadCarrito(carritosValues[i]))
        }
    }
    return mapa
}

export function loadUsuarios() {
    const mapa = new Map()
    const usuariosKeys = JSON.parse(localStorage.getItem("usuariosKeys"))
    if (usuariosKeys !== null) {
        const usuariosValues = localStorage.getItem("usuariosValues").split("|")
        for (let i = 0; i < usuariosKeys.length; i++) {
            mapa.set(usuariosKeys[i], loadUsuario(usuariosValues[i]))
        }
    }
    return mapa
}

export function loadRegistros() {
    const mapa = new Map()
    const registrosKeys = JSON.parse(localStorage.getItem("registrosKeys"))
    if (registrosKeys !== null) {
        const registrosValues = localStorage.getItem("registrosValues").split("|")
        console.log(registrosValues)
        for (let i = 0; i < registrosKeys.length; i++) {
            const array = []
            const carritosACargar = registrosValues[i].split("¬")
            for (const cargar of carritosACargar) {
                if (cargar !== "") {
                    array.push(loadCarrito(cargar))
                }
            }
            mapa.set(registrosKeys[i], array)
        }
    }
    return mapa
}