import { Producto } from "../clases/Producto";

{/* <div class="col d-flex justify-content-center">
    <div class="card w-100">
        <img src="img\medialuna.png" class="card-img-top" alt="medialuna">
        <div class="card-body d-flex flex-column">
            <h5 class="card-title">Medialunas</h5>
            <p class="card-text">Facturas frescas </p>
            <div class="d-flex justify-content-between align-items-center">        
                <span class="fs-5">$9000 C/U</span>
                <a href="#" class="btn btn-primary"><i class="bi bi-cart-plus"></i></a>
            </div>
        </div>
    </div>
</div> */}

{/* <div class="d-flex flex-wrap rounded rounded-2 border p-neutral mb-neutral">
    <div class="w-15">
        <img src="img/medialuna.png" alt="medialuna" class="w-100 rounded rounded-2">
    </div>
    <div class="w-85 ps-neutral d-flex flex-column">
        <h5>Medialunas</h5>
        <p class="flex-grow-1">Facturas frescas</p>
        <p id="totalProducto" class="m-0 fs-5 fw-semibold text-end">$9000</p>
    </div>
    <div class="w-100 pt-neutral border-top mt-neutral">
        <div class="w-100 d-flex justify-content-end">
            <button type="button" class="btn btn-outline-info mx-neutral"><i class="bi bi-dash"></i></button>
            <div class="d-flex align-items-center">
                <span class="fw-semibold">12</span>
            </div>
            <button type="button" class="btn btn-outline-info mx-neutral"><i class="bi bi-plus"></i></button>
            <button type="button" class="btn btn-info"><i class="bi bi-trash3"></i></button>
        </div>
    </div>
</div> */}

/**
 * Crea una tarjeta de un Producto dado para mostrarla en la tienda.
 * 
 * @param {Producto} producto - El objeto Producto sobre el cual se quiere crear la tarjeta.
 * @returns {Array<HTMLElement>} Retorna.
 */
export function createTarjetaTienda(producto) {
    // Primero
    const divContenedor = document.createElement("div")
    divContenedor.classList.add("col d-flex justify-content-center")
    // Segundo
    const divTarjeta = document.createElement("div")
    divTarjeta.classList.add("card w-100")
    // Tercero
    const img = document.createElement("img")
    img.src = producto.imagen
    img.alt = producto.nombre
    img.classList.add(card-img-top)
    const divBody = document.createElement("div")
    divBody.classList.add("card-body d-flex flex-column")
    // Cuarto
    const h5 = document.createElement("h5")
    h5.textContent = producto.nombre
    h5.classList.add("card-title")
    const p = document.createElement("p")
    p.textContent = producto.descripcion
    p.classList.add("card-text")
    const divPrecio = document.createElement("div")
    divPrecio.classList.add("d-flex justify-content-between align-items-center")
    // Quinto
    const span = document.createElement("span")
    span.textContent = `$${producto.valor} C/U`
    span.classList.add("fs-5")
    const button = document.createElement("button")
    button.dataset.id = producto.id
    button.classList.add("btn btn-primary align-self-end")
    // Sexto
    const i = document.createElement("i")
    i.classList.add("bi bi-cart-plus")

    // Anidamiento
    button.append(i)
    divPrecio.append(span, button)
    divBody.append(h5, p, divPrecio)
    divTarjeta.append(img, divBody)
    divContenedor.append(divTarjeta)

    return {divContenedor, button}
}

/**
 * 
 * 
 * @param {Producto} producto 
 * @returns {HTMLDivElement}
 */
export function createTarjetaCarrito(producto) {
    // Primero
    const divContenedor = document.createElement("div")
    divContenedor.classList.add("d-flex flex-wrap rounded rounded-2 border p-neutral mb-neutral")


    return divContenedor
}