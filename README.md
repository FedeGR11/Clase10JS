# 🛒 Mi Tienda - Gestor de Inventario
Aplicación web interactiva desarrollada en **JavaScript** para la administración de un catálogo de productos informáticos. Permite consultar un inventario inicial mediante peticiones asíncronas (`fetch`), agregar nuevos artículos, buscar en tiempo real, editar precios y eliminar elementos de forma individual o total, manteniendo la persistencia en `localStorage`.
---
## ✨ Funcionalidades
* **Consumo de datos con Fetch & Async/Await:** Carga del catálogo inicial desde un archivo local `data/data.json` o sincronización con `localStorage` en caso de existir datos previos.
* **Persistencia local:** Los datos se actualizan y almacenan en `localStorage` bajo la clave `productosJS`.
* **Búsqueda en tiempo real:** Filtrado dinámico por coincidencia en el nombre del producto mediante eventos de teclado.
* **Gestión de catálogo (CRUD básico):**
  * Alta de productos con cálculo automático de ID incremental.
  * Modificación de precios mediante modales interactivos de **SweetAlert2**.
  * Eliminación individual con diálogo de confirmación.
  * Vaciado completo del inventario.
* **Feedback al usuario:** Notificaciones visuales no intrusivas con **Toastify** para confirmar acciones o alertar sobre errores.
* **Control de flujo robusto:** Validación de entradas y control de errores en cada interacción mediante bloques `try/catch/finally`.
---
## 🛠️ Tecnologías y Librerías
* **HTML5 & CSS3** (Maquetación y estilos personalizados).
* **JavaScript ES6+** (DOM, Event Listeners, Fetch API, Async/Await, Desestructuración, Spread Operator).
* [SweetAlert2](https://sweetalert2.github.io/) (Modales de confirmación y edición de datos).
* [Toastify JS](https://apvarun.github.io/toastify-js/) (Alertas flotantes de estado).
---
## 🚀 Cómo ejecutar el proyecto
> **Importante:** Al utilizar `fetch()` para leer un archivo JSON local, es necesario correr la aplicación sobre un servidor local para evitar bloqueos por políticas CORS del navegador (`file://`).
1. Cloná o descargá este repositorio.
2. Abrí la carpeta del proyecto en **Visual Studio Code**.
3. Hacé clic derecho sobre el archivo `index.html`.
4. Seleccioná **"Open with Live Server"**.
---
## 📁 Estructura del Proyecto
```text
├── index.html        # Estructura principal y enlaces a CDNs
├── css/
│   └── style.css     # Estilos de la interfaz y mensajes de feedback
├── data/
│   └── data.json     # Archivo JSON con los datos iniciales del catálogo
├── js/
│   └── main.js       # Lógica de negocio, eventos, fetch y persistencia
└── README.md         # Documentación del proyecto