function changeTexto() {
    console.log(this.innerText)
    if (this.innerText == " Ver más") {
        this.innerText = " Ver menos"
    }
    else {
        this.innerText = " Ver más"
    }
}

function onLoad() {
    document.getElementById("buttonFooter").addEventListener("click", changeTexto)
}

window.addEventListener("load", onLoad)