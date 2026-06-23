import { saveCarritos } from "./carritos.js"
import * as sesionActual from "./sesionActual.js"
import * as stock from "./stock.js"
import * as carritos from "./carritos.js"

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

function handlerAñadirACarrito() {
    carritos.getCarrito(sesionActual.get().nombreUsuario).setProducto(stock.getProducto(this.dataset.id))
    saveCarritos()
}
/**
 * Crea una tarjeta de un Producto dado para mostrarla en la tienda.
 * 
 * @param {Producto} producto - El objeto Producto sobre el cual se quiere crear la tarjeta.
 * @param {*} divAgregar
 */
export function createTarjetaTienda(producto, divAgregar) {
    // Primero
    const divContenedor = document.createElement("div")
    divContenedor.classList.add("col", "d-flex", "justify-content-center")
    // Segundo
    const divTarjeta = document.createElement("div")
    divTarjeta.classList.add("card", "w-100")
    // Tercero
    const img = document.createElement("img")
    img.src = producto.imagen
    img.alt = producto.nombre
    img.classList.add("card-img-top")
    const divBody = document.createElement("div")
    divBody.classList.add("card-body", "d-flex", "flex-column")
    // Cuarto
    const h5 = document.createElement("h5")
    h5.textContent = producto.nombre
    h5.classList.add("card-title")
    const p = document.createElement("p")
    p.textContent = producto.descripcion
    p.classList.add("card-text")
    const divPrecio = document.createElement("div")
    divPrecio.classList.add("d-flex", "justify-content-between", "align-items-center")
    // Quinto
    const span = document.createElement("span")
    span.textContent = `$${producto.valor} C/U`
    span.classList.add("fs-5")
    const button = document.createElement("button")
    button.dataset.id = producto.id
    button.classList.add("btn", "btn-primary", "align-self-end")
    button.addEventListener("click", handlerAñadirACarrito)
    // Sexto
    const i = document.createElement("i")
    i.classList.add("bi", "bi-cart-plus")

    // Anidamiento
    button.append(i)
    divPrecio.append(span, button)
    divBody.append(h5, p, divPrecio)
    divTarjeta.append(img, divBody)
    divContenedor.append(divTarjeta)
    divAgregar.append(divContenedor)
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
    divContenedor.classList.add("d-flex", "flex-wrap", "rounded rounded-2", "border", "p-neutral", "mb-neutral")


    return divContenedor
}


export function crearFilaUsuario(usuario, funcionoCambiarEstado, funcionEliminar) {
    const tr = document.createElement('tr');
    tr.dataset.id = usuario.nombreUsuario; 

    if (!usuario.habilitado) {
        tr.classList.add('opacity-50'); 
    }
    
    let celdaNombre = document.createElement("td")
    celdaNombre.textContent = usuario.nombre

    let celdaApellido = document.createElement("td")
    celdaApellido.textContent = usuario.apellido

    let celdaUsuario = document.createElement("td")
    celdaUsuario.textContent = usuario.nombreUsuario

    let celdaContraseña = document.createElement("td")
    celdaContraseña.textContent = usuario.contraseña
    
    //badge es el efecto de pastilla de bootstrap - es como un boton desactivado
    const tdEstado = document.createElement('td');
    const badgeEstado = document.createElement('span');
    badgeEstado.classList.add('badge');
    
    if (usuario.habilitado) {
        badgeEstado.textContent = 'Habilitado';
        badgeEstado.classList.add('bg-success');
    } else {
        badgeEstado.textContent = 'Deshabilitado';
        badgeEstado.classList.add('bg-secondary');
    }
    tdEstado.appendChild(badgeEstado);

    const tdRol = document.createElement('td');
    const badgeRol = document.createElement('span');
    badgeRol.classList.add('badge', 'bg-info', 'text-dark');
    badgeRol.textContent = usuario.tipo;
    tdRol.appendChild(badgeRol);

    const tdHistorial = document.createElement('td');
    const iconoHistorial = document.createElement('i');
    iconoHistorial.classList.add('bi', 'bi-justify');
    iconoHistorial.title = "Usuario registrado";
    tdHistorial.appendChild(iconoHistorial);

    const tdAcciones = document.createElement('td');
    
    const divContenedor = document.createElement('div');
    divContenedor.classList.add('d-flex', 'align-items-center', 'gap-3');

    const iconoBorrar = document.createElement('i');
    iconoBorrar.classList.add('bi', 'bi-trash3-fill', 'text-danger');
    iconoBorrar.style.cursor = 'pointer';
    iconoBorrar.addEventListener('click', function() {
        funcionEliminar(usuario.nombreUsuario); 
    });

    // Estructura de Switch de Bootstrap
    const divSwitch = document.createElement('div');
    divSwitch.classList.add('form-check', 'form-switch', 'm-0');

    const inputSwitch = document.createElement('input');
    inputSwitch.classList.add('form-check-input');
    inputSwitch.type = 'checkbox';
    inputSwitch.setAttribute('role', 'switch');
    inputSwitch.checked = usuario.habilitado; 
    
    inputSwitch.addEventListener('change', () => {
        funcionoCambiarEstado(usuario.nombreUsuario); 
    });

    divSwitch.appendChild(inputSwitch);
    divContenedor.appendChild(iconoBorrar);
    divContenedor.appendChild(divSwitch);
    tdAcciones.appendChild(divContenedor);

    tr.appendChild(celdaNombre);
    tr.appendChild(celdaApellido);
    tr.appendChild(celdaUsuario);
    tr.appendChild(celdaContraseña);
    tr.appendChild(tdEstado);
    tr.appendChild(tdRol);
    tr.appendChild(tdHistorial);
    tr.appendChild(tdAcciones);

    return tr;
}