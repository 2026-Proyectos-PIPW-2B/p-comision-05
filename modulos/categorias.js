/** @type {Array<string>} */
const categorias = JSON.parse(localStorage.getItem("categorias")) || ["sin categoria"]

/**
 * 
 * @returns {Array<string>}
 */
export function get() {
    return categorias
}

/**
 * 
 * @param {string} categoria 
 */
export function add(categoria) {
    categorias.push(categoria)
    save()
}

/**
 * 
 * @param {Number} number 
 */
export function remove(number) {
    categorias.fruits.splice(number, 1)
    save()
}

function save() {
    localStorage.setItem("categorias", JSON.stringify(categorias))
}