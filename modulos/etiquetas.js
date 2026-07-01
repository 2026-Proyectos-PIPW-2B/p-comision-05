import * as moduloProductos from "./stock.js";
import * as carritos from "./carritos.js";

// Cargo etiquetas de localStorage si hay, y si no inicializo un par
/**  @type {Array<string>} */
let etiquetasGlobales = JSON.parse(
    localStorage.getItem("etiquetasGlobales"),
) || ["glaseado", "panificado", "tortas", "salchicha", "pistacho"];

/** retorna un array de etiquetas, traido de localStorage, o previamente inicializado.
 * 
 * @returns {Array<string>}
 */ 
export function getEtiquetas() {
    return etiquetasGlobales;
}

//guardo etiquetas
export function guardarEtiquetas() {
    localStorage.setItem("etiquetasGlobales", JSON.stringify(etiquetasGlobales));
}

//agrega una etiqueta al listado, si esta no esta repetida.
export function agregarEtiqueta(nombre) {
    const etiquetaSinEspacios = nombre.trim();
    if (
        etiquetaSinEspacios === "" ||
        etiquetasGlobales.includes(etiquetaSinEspacios)
    )
        return false;

    etiquetasGlobales.push(etiquetaSinEspacios);
    guardarEtiquetas();
    return true;
}

//elimina etiqueta del array global de etiquetas, y de los productos que la tengan asociada.
//si la etiqueta pasado por parametro es distinta a las del array, se agrega 
export function eliminarEtiquetaGlobal(nombreEtiqueta) {
    //para el array de etiquetas
    const nuevaListaGlobal = [];
    for (let i = 0; i < etiquetasGlobales.length; i++) {
        if (etiquetasGlobales[i] !== nombreEtiqueta) {
            nuevaListaGlobal.push(etiquetasGlobales[i]);
        }
    }
    etiquetasGlobales = nuevaListaGlobal;
    guardarEtiquetas();

    //para la lista de productos 
    // limpio la etiqueta, de los productos que la tengan
    const misProductos = moduloProductos.getStock();
    if (misProductos) {
        for (const [id, producto] of misProductos) {
            if (producto.etiquetas) {
                producto.etiquetas = producto.etiquetas.filter(function (e) {
                    return e !== nombreEtiqueta;
                });

            }
        }
        console.log(etiquetasGlobales)
        //necesario para guardar los cambios hechos
        moduloProductos.saveStock();
    }

    //para los carritos
    // saco la etiquetas de los carritos
    const mapaCarritos = carritos.getCarritos();
    if (mapaCarritos) {
        for (const [usuarioId, carrito] of mapaCarritos) {
            if (carrito.productos) {
                const listaProductosCarrito = Array.from(carrito.productos.values());
                for (let k = 0; k < listaProductosCarrito.length; k++) {
                    const productosCarrito = listaProductosCarrito[k];
                    if (productosCarrito.etiquetas) {
                        productosCarrito.etiquetas = productosCarrito.etiquetas.filter(function (e) {
                            return e !== nombreEtiqueta;
                        });
                    }
                }
            }
        }
        carritos.saveCarritos();
    }
}
