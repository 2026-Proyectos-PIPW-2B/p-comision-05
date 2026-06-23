import * as funcionesStock from "../modulos/stock.js";
import { mostrarProductos } from "./control-de-productos.js";

const registroTitulo = document.getElementById("registroTitulo")
const registroInfo = document.getElementById("registroInfo")
const registroStock = document.getElementById("registroStock")
const registroEtiquetas = document.getElementById("registroEtiquetas")
const registroValor = document.getElementById("registroValor")
const botonRegistroGuardar = document.getElementById("botonRegistroGuardar")
const formRegistroProductos = document.getElementById("formRegistroProductos")

//const direccionesDeImagen

const mensajeRegistroTitulo = document.getElementById("mensajeRegistroTitulo")
const mensajeRegistroInfo = document.getElementById("mensajeRegistroInfo")
const mensajeRegistroStock = document.getElementById("mensajeRegistroStock")
const mensajeRegistroEtiquetas = document.getElementById("mensajeRegistroEtiquetas")
const mensajeRegistroValor = document.getElementById("mensajeRegistroValor")

botonRegistroGuardar.addEventListener("click",function(e){
    e.preventDefault()
    //reseteo de input

    //validarRegistro y mostrar mensajes
    let estadoRegistro = validarRegistro()

    //termina validar registro
    if (estadoRegistro) {
        guardarProducto()
        formRegistroProductos.reset()
        registroTitulo.classList.remove("is-valid")
        registroInfo.classList.remove("is-valid")
        registroStock.classList.remove("is-valid")
        registroValor.classList.remove("is-valid")


    }
})

function validarRegistro() {
    let titulo = registroTitulo.value
    let informacion = registroInfo.value
    let stock = registroStock.value
    let etiquetas = registroEtiquetas.value
    let valor = registroValor.value
    let estadoRegistro = true
    
    //filtro titulo
    if (titulo==="" || titulo.trim().length === 0) {
        mostrarMensaje(mensajeRegistroTitulo,"Debe Ingresar Un Titulo")
        registroTitulo.classList.add("is-invalid")
        registroTitulo.classList.remove("is-valid")

        estadoRegistro = false
    } else {
        mostrarMensaje(mensajeRegistroTitulo,"OK")
        registroTitulo.classList.add("is-valid")
        registroTitulo.classList.remove("is-invalid")
    }
    //filtro informacion del producto
    if (informacion==="" || informacion.trim().length === 0) {
        mostrarMensaje(mensajeRegistroInfo,"Debe Ingresar Informacion")
        registroInfo.classList.add("is-invalid")
        registroInfo.classList.remove("is-valid")
        estadoRegistro = false
    } else {
        registroInfo.classList.add("is-valid")
        registroInfo.classList.remove("is-invalid")
    }
    //filtro stock
    if (stock==="" || stock.trim().length === 0) {
        mostrarMensaje(mensajeRegistroStock,"Debe Ingresar Una Cantidad")
        registroStock.classList.add("is-invalid")
        registroStock.classList.remove("is-valid")
        estadoRegistro = false
    } else {
        mostrarMensaje(mensajeRegistroStock,"OK")
        registroStock.classList.add("is-valid")
        registroStock.classList.remove("is-invalid")
    }
    //filtro valor de un producto
    if (valor==="" || valor.trim().length === 0 || valor<=0) {
        mostrarMensaje(mensajeRegistroValor,"Debe Ingresar un Valor Valido")
        registroValor.classList.add("is-invalid")
        registroValor.classList.remove("is-valid")
        estadoRegistro = false
    } else {
        mostrarMensaje(mensajeRegistroValor,"OK")
        registroValor.classList.add("is-valid")
        registroValor.classList.remove("is-invalid")
    }
    
    return estadoRegistro
}

function mostrarMensaje(input, mensaje) {
    input.textContent = mensaje
}

function guardarProducto(){
    let titulo = registroTitulo.value 
    let informacionDelProducto = registroInfo.value
    let stock = registroStock.value
    let etiquetas = registroEtiquetas.value
    let valor = registroValor.value

    etiquetas = etiquetas.toUpperCase().trim().split()
    console.log(etiquetas)
    funcionesStock.setProducto(titulo,etiquetas,informacionDelProducto,stock,valor)
    mostrarProductos()
}