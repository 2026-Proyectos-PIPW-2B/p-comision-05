import { setUsuario, removeUsuario, getUsuario, saveUsuarios,getUsuarios, existeUsuario } from "../modulos/usuarios.js";
import { crearFilaUsuario } from "../modulos/crearDomElements.js"; 

const tbodyUsuarios = document.getElementById('tabla-usuarios-body');

 
function actualizarTablaCompleta() {
    tbodyUsuarios.innerHTML = '';
    let mapaDeUsuarios = getUsuarios()

    for (const usuarioObjeto of mapaDeUsuarios.values()) {
        const nuevaFila = crearFilaUsuario(usuarioObjeto, cambioEstado, eliminarUsuario);
        tbodyUsuarios.appendChild(nuevaFila);
    }

}


function cambioEstado(nombreUsuario) {
    const usuario = getUsuario(nombreUsuario);

    if (usuario) {
        usuario.toggleHabilitado();
        saveUsuarios();
        const filaVieja = tbodyUsuarios.querySelector(`[data-id="${nombreUsuario}"]`);
        
        if (filaVieja) {
            const filaNueva = crearFilaUsuario(usuario, cambioEstado, eliminarUsuario);
            tbodyUsuarios.replaceChild(filaNueva, filaVieja);
        }
    }
}


function eliminarUsuario(nombreUsuario) {
    removeUsuario(nombreUsuario);
    const filaAEliminar = tbodyUsuarios.querySelector(`[data-id="${nombreUsuario}"]`);
    if (filaAEliminar) {
        filaAEliminar.remove(); //remove elimina el elemento del doom
    }
}

const botonCrearUsuario = document.getElementById("crearUsuario")
botonCrearUsuario.addEventListener("click" ,function(e){
    e.preventDefault();

    const registro_nombre = document.getElementById("registro_nombre")
    const registro_apellido = document.getElementById("registro_apellido")
    const registro_nombre_usuario = document.getElementById("registro_nombre_usuario")
    const registro_contraseña = document.getElementById("registro_contraseña")
    
    const rol_usuario = document.getElementById("rol_usuario") // Radio de Usuario
    const rol_usuario_admin = document.getElementById("rol_usuario_admin") // Radio de Admin

    const switch_estado = document.getElementById("switch_estado")

    const nombre = registro_nombre.value.trim();
    const apellido = registro_apellido.value.trim();
    const nombreUsuario = registro_nombre_usuario.value.trim();
    const contraseña = registro_contraseña.value.trim();
    
    // chequeo que fue seleccionado en el radio
    let tipo = 'user';
    if (rol_usuario_admin.checked) {
        tipo = 'admin';
    }

    const habilitado = switch_estado.checked;
    
    //chequeo que no haya campos vacios
    if (nombre === "" || apellido === "" || nombreUsuario === "" || contraseña === "") {
        alert("Debe completar todos los campos.");
        return; 
    }

    //verifico que el nombreDeUsuario no se repita, (si se repite, serian 2 llaves iguales)
    if (existeUsuario(nombreUsuario)) {
        alert("El nombre de usuario ya está registrado, elegi otro.");
        return;
    }

    setUsuario(nombreUsuario, nombre, apellido, contraseña, tipo);

    //aplico el estado del switch
    if (!habilitado) {
        const usuarioRecienCreado = getUsuario(nombreUsuario);
        if (usuarioRecienCreado) {
            usuarioRecienCreado.toggleHabilitado(); // 
            saveUsuarios(); 
        }
    }
    document.getElementById("formRegistro_usuario").reset();
    actualizarTablaCompleta();
    alert("¡Usuario registrado!");
});

actualizarTablaCompleta()