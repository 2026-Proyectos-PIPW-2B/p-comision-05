import * as usuarios from "../modulos/usuarios.js"
import * as stock from "../modulos/stock.js"
import * as carritos from "../modulos/carritos.js"
import * as registros from "../modulos/registros.js"
import * as sesionActual from "../modulos/sesionActual.js"

// creo usuarios
function inicicarLocalStorage() {
   if (localStorage.length > 0) {
      usuarios.clear()
      stock.clear()
      carritos.clear()
      registros.clear()
      sesionActual.clear()
      localStorage.clear()
   }
   usuarios.setUsuario("admin", "joaquin", "jabali", "admin", "admin") 
   usuarios.setUsuario("user", "facundo", "ñandu", "user", "user")

   stock.setProducto("dona", ["salchicha", "pistacho"], "Una dona, le gustaria a homero", 32, 560)
   stock.setProducto("tortafrita", ["salchicha"], "Tortafrita hecha en grasa, calentitas", 8, 400)
   stock.setProducto("vigilante", ["panificado"], "Vigilantes con crema pastalera y menbrillo", 24, 600)
   stock.setProducto("torta-80-golpes", ["tortas"], "Torta golpeada muchas veces, para que este esponjosa", 4, 1200)
   stock.setProducto("medialuna-dulce", ["panificado", "glaseado"], "Torta golpeada muchas veces, para que este esponjosa", 4, 1200)
}

function onload() {
   console.log("iniciado")
   document.getElementById("buttonLocalStorage").addEventListener("click", inicicarLocalStorage)
}

window.addEventListener("load", onload)