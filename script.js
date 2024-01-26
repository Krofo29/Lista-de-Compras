let listaProductos = [];
let tituloLista = 'LISTA DE COMPRAS';

// Cambiar el tiulo de la lista
function cambiarTitulo() {
    const nuevoTitulo = prompt('Ingrese el nuevo título:');
    if (nuevoTitulo !== null && nuevoTitulo !== '') {
        tituloLista = nuevoTitulo;
        document.getElementById('tituloLista').innerText = tituloLista;
    }
}

// Agregar productos a la lista
function agregarProducto() {
    const producto = document.getElementById('producto').value;
    const cantidad = document.getElementById('cantidad').value;

    if (producto.trim() !== '') {
        listaProductos.push({ producto, cantidad });
        actualizarLista();
        limpiarCampos();
        document.getElementById('producto').focus();
    }
}


// Teclear ENTER
function manejarEnter(event) {
    if (event.key === 'Enter') {
        if (document.activeElement.id === 'producto') {
            document.getElementById('cantidad').focus();
        } else if (document.activeElement.id === 'cantidad') {
            agregarProducto();
        }
    }
}

function actualizarLista() {
    const listaDiv = document.getElementById('lista');
    listaDiv.innerHTML = '';


    // Encabezado para cantidad y producto
    const encabezados = document.createElement('div');
    encabezados.innerHTML = `
        <div class="row mb-2 font-weight-bold">
            <div class="col-md-2">CANTIDAD</div>
            <div class="col-md-8">PRODUCTO</div>
        </div>
    `;
    listaDiv.appendChild(encabezados);

    listaProductos.forEach((item, index) => {
        const listItem = document.createElement('div');
        listItem.innerHTML = `
            <div class="row mb-2">
                <div class="col-md-2">${item.cantidad}</div>
                <div class="col-md-8">${item.producto}</div>
                <div class="col-md-2">
                    <button class="btn btn-danger btn-sm" onclick="borrarProducto(${index})">X</button>
                </div>
            </div>
        `;
        listaDiv.appendChild(listItem);
    });
}

function limpiarCampos() {
    document.getElementById('producto').value = '';
    document.getElementById('cantidad').value = '';
}

function finalizar() {
    // Generar archivo PDF
    const content = document.getElementById('lista');
    
    const options = {
        margin: 10,
        filename: 'lista_compras.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    const pdfElement = document.createElement('div');
    pdfElement.innerHTML = `<h2 style="color: black;">${tituloLista}</h2>`;
    
    // Encabezado para cantidad y producto en el PDF
    pdfElement.innerHTML += `
        <div class="row mb-2 font-weight-bold">
            <div class="col-md-2" style="color: black;">CANTIDAD</div>
            <div class="col-md-8" style="color: black;">PRODUCTO</div>
        </div>
    `;
    listaProductos.forEach((item) => {
        const listItem = document.createElement('div');
        listItem.innerHTML = `
            <div class="row mb-2">
                <div class="col-md-2" style="color: black;">${item.cantidad}</div>
                <div class="col-md-8" style="color: black;">${item.producto}</div>
            </div>
        `;
        pdfElement.appendChild(listItem);
    });

    html2pdf(pdfElement, options);
}

    // Boton para borrar producto
function borrarProducto(index) {
    listaProductos.splice(index, 1);
    actualizarLista();
}

    // Boton para copiar la lista
function copiarAlPortapapeles() {
    const textoLista = generarTextoLista();
    
    const textarea = document.createElement('textarea');
    textarea.value = textoLista;
    document.body.appendChild(textarea);

    textarea.select();
    document.execCommand('copy');

    document.body.removeChild(textarea);

    mostrarMensajeCopiado();
}

function generarTextoLista() {
    let texto = tituloLista + '\n\n';

    listaProductos.forEach(item => {
        texto += `${item.cantidad} ${item.producto}\n`;
    });

    return texto;
}


    // Alerta de mensaje copiado
function mostrarMensajeCopiado() {
    const mensaje = document.createElement('div');
    mensaje.innerText = 'Lista copiada al portapapeles';
    mensaje.className = 'alert alert-success';

    document.body.appendChild(mensaje);

    // Oculta el mensaje
    setTimeout(() => {
        document.body.removeChild(mensaje);
    }, 2000);
}

document.getElementById('producto').addEventListener('keyup', manejarEnter);
document.getElementById('cantidad').addEventListener('keyup', manejarEnter);
