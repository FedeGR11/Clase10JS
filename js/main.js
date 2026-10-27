const inputNombre = document.getElementById("input-nombre");
const inputPrecio = document.getElementById("input-precio");
const btnAgregar = document.getElementById("btn-agregar");
const inputBusqueda = document.getElementById("input-busqueda");
const contenedorProductos = document.getElementById("contenedor-productos");
const btnVaciar = document.getElementById("btn-vaciar");

let productosJS = [];

async function inicializarProductos() {
    const productosGuardados = localStorage.getItem("productosJS");
    if (productosGuardados) {
        productosJS = JSON.parse(productosGuardados);
        actualizarVista();
    } else {
        try {
            const response = await fetch("./data/data.json");

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data = await response.json();
            productosJS = data;
            guardarLocalStorage();
            actualizarVista();

            Toastify({
                text: "📦 Productos iniciales cargados con éxito",
                duration: 3000,
                gravity: "top",
                position: "right",
                style: { background: "#28a745" }
            }).showToast();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error al cargar los datos",
                text: `No se pudieron cargar los productos: ${error.message}`,
                confirmButtonColor: "#dc3545"
            });
        }
    }
}

inicializarProductos();

function guardarLocalStorage() {
    localStorage.setItem("productosJS", JSON.stringify(productosJS));
}

function renderizarProductos(lista) {
    contenedorProductos.innerHTML = "";

    lista.forEach(({ id, nombre, precio }) => {
        contenedorProductos.innerHTML += `
            <div>
                <h3>${nombre}</h3>
                <span>ID:${id}</span>
                <p>Precio: $${precio}</p>
                <button class="btn-editar" data-id="${id}">Editar precio</button>
                <button class="btn-eliminar" data-id="${id}">Eliminar</button>
            </div>
         `;
    });
}

function actualizarVista() {
    const textoFiltro = inputBusqueda.value.toLowerCase().trim();
    const productosFiltrados = productosJS.filter((producto) => producto.nombre.toLowerCase().includes(textoFiltro)
    );
    renderizarProductos(productosFiltrados);
}

setTimeout(() => {
    Toastify({
        text: "🔔 Sistema de inventario cargado correctamente. Datos sincronizados.",
        duration: 4000,
        gravity: "bottom",
        position: "left",
        style: { background: "#17a2b8" }
    }).showToast();
}, 3000);

btnAgregar.addEventListener("click", () => {
    try {
        const nombre = inputNombre.value.trim();
        const precio = parseFloat(inputPrecio.value);

        if (nombre === "" || isNaN(precio) || precio <= 0) {
            throw new Error("Por favor, ingrese un nombre y un precio válido.");
        }

        const nuevoId = productosJS.length > 0 ? Math.max(...productosJS.map(p => p.id)) + 1 : 1;
        const nuevoProducto = { id: nuevoId, nombre, precio };

        productosJS.push(nuevoProducto);
        guardarLocalStorage();
        actualizarVista();

        Toastify({
            text: `✅ ${nombre} agregado con éxito`,
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: { background: "#28a745" }
        }).showToast();

    } catch (error) {
        Toastify({
            text: `⚠️ ${error.message}`,
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: { background: "#dc3545" }
        }).showToast();
    } finally {
        inputNombre.value = "";
        inputPrecio.value = "";
    }
});

inputBusqueda.addEventListener("keyup", (e) => {
    actualizarVista();
});

contenedorProductos.addEventListener("click", (e) => {
    // 📌 Eliminación de producto
    if (e.target?.classList.contains("btn-eliminar")) {
        const idAEliminar = parseInt(e.target.getAttribute("data-id"));

        if (isNaN(idAEliminar)) {
            Toastify({
                text: "⚠️ No se pudo identificar el producto a eliminar.",
                duration: 3000,
                style: { background: "#dc3545" }
            }).showToast();
            return;
        }

        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción eliminará el producto del inventario.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                const indice = productosJS.findIndex(p => p.id === idAEliminar);

                if (indice !== -1) {
                    productosJS.splice(indice, 1);
                    guardarLocalStorage();
                    actualizarVista();

                    Toastify({
                        text: "🗑️ Producto eliminado con éxito",
                        duration: 3000,
                        gravity: "bottom",
                        position: "right",
                        style: { background: "#ffc107", color: "#000" }
                    }).showToast();
                }
            }
        });
    }

    // 📌 Edición de precio con SweetAlert2 (Modal en lugar de prompt)
    if (e.target?.classList.contains("btn-editar")) {
        const idAEditar = parseInt(e.target.getAttribute("data-id"));

        if (isNaN(idAEditar)) {
            Toastify({
                text: "⚠️ No se pudo identificar el producto a editar.",
                duration: 3000,
                style: { background: "#dc3545" }
            }).showToast();
            return;
        }

        const producto = productosJS.find(p => p.id === idAEditar);
        if (!producto) {
            Toastify({
                text: "⚠️ Producto no encontrado para editar.",
                duration: 3000,
                style: { background: "#dc3545" }
            }).showToast();
            return;
        }

        Swal.fire({
            title: `Editar precio de "${producto.nombre}"`,
            input: "number",
            inputValue: producto.precio,
            inputAttributes: {
                min: 0,
                step: "any"
            },
            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#6c757d",
            inputValidator: (value) => {
                const precioValido = parseFloat(value);
                if (!value || isNaN(precioValido) || precioValido <= 0) {
                    return "Por favor, ingrese un precio válido mayor a 0.";
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const nuevoPrecio = parseFloat(result.value);

                producto.precio = nuevoPrecio;
                guardarLocalStorage();
                actualizarVista();

                Toastify({
                    text: `✏️ Precio de "${producto.nombre}" actualizado a $${nuevoPrecio}.`,
                    duration: 3000,
                    gravity: "bottom",
                    position: "right",
                    style: { background: "#28a745" }
                }).showToast();
            }
        });
    }
});

btnVaciar.addEventListener("click", () => {
    try {
        if (productosJS.length === 0) {
            throw new Error("El inventario ya se encuentra vacío.");
        }

        Swal.fire({
            title: "¿Vaciar todo el inventario?",
            text: "Esta acción eliminará todos los productos registrados.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Sí, vaciar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                productosJS.length = 0;
                guardarLocalStorage();
                actualizarVista();

                Toastify({
                    text: "🧹 Se vació todo el inventario correctamente.",
                    duration: 3000,
                    gravity: "bottom",
                    position: "right",
                    style: { background: "#dc3545" }
                }).showToast();
            }
        });
    } catch (error) {
        Toastify({
            text: `⚠️ ${error.message}`,
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: { background: "#dc3545" }
        }).showToast();
    }
});


