//Elementos del DOM que voy a usar
const cards = document.getElementById("cards");
const items = document.getElementById("items");
const footer = document.getElementById("footer");
const templateCard = document.getElementById("template-card").content;
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;
const fragment = document.createDocumentFragment();
let carrito = {};

//Eventos y respaldar carrito en storage

document.addEventListener("DOMContentLoaded", () => {
    fetchData();
    if (localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"));
        pintarCarrito();
    }
});

cards.addEventListener("click", (e) => {
    addCarrito(e);

    Toastify({
        text: "Producto agregado al carrito",
        duration: 3000,
        position: "center",
        style: {
            color: "white",
            background: "linear-gradient(to right, #111, #333)",
        },
    }).showToast();
});

items.addEventListener("click", (e) => {
    btnAccion(e);
});

// Traemos la informacion de el data.json donde tenemos los productos 
const fetchData = async () => {
    try {
        const respuesta = await fetch("./js/data.json");
        const data = await respuesta.json();
        //console.log(data);
        pintarCards(data);
    } catch (error) {
        console.log(error);
    }
};
//Pintamos los productos para que se visualicen en la página
const pintarCards = (data) => {
    data.forEach((producto) => {
        templateCard.querySelector("h5").textContent = producto.nombre;
        templateCard.querySelector("p").textContent = producto.precio;
        templateCard.querySelector("img").setAttribute("src", producto.img);
        templateCard.querySelector(".btn-outline-dark").dataset.id = producto.id;

        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);
    });
    cards.appendChild(fragment);

};

//Función para agregar productos al carrito
const addCarrito = (e) => {

    if (e.target.classList.contains("btn-outline-dark")) {
        setCarrito(e.target.parentElement);
    }
    e.stopPropagation();
};

const setCarrito = (objeto) => {
    const producto = {
        id: objeto.querySelector(".btn-outline-dark").dataset.id,
        nombre: objeto.querySelector("h5").textContent,
        precio: objeto.querySelector("p").textContent,
        cantidad: 1,
    };
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1;
    }

    carrito[producto.id] = { ...producto };

    pintarCarrito();
};

const pintarCarrito = () => {
    items.innerHTML = "";
    Object.values(carrito).forEach((producto) => {
        templateCarrito.querySelector("th").textContent = producto.id;
        templateCarrito.querySelectorAll("td")[0].textContent = producto.nombre;
        templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad;
        templateCarrito.querySelector(".btn-info").dataset.id = producto.id;
        templateCarrito.querySelector(".btn-danger").dataset.id = producto.id;
        templateCarrito.querySelector("span").textContent =
            producto.cantidad * producto.precio;
        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    });
    items.appendChild(fragment);
    pintarFooter();

    localStorage.setItem(`carrito`, JSON.stringify(carrito));
};

const pintarFooter = () => {
    footer.innerHTML = "";
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`;

        return;
    }

    const nCantidad = Object.values(carrito).reduce(
        (acc, { cantidad }) => acc + cantidad,
        0
    );
    const nPrecio = Object.values(carrito).reduce(
        (acc, { cantidad, precio }) => acc + cantidad * precio,
        0
    );

    templateFooter.querySelectorAll(`td`)[0].textContent = nCantidad;
    templateFooter.querySelector("span").textContent = nPrecio;

    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);

    footer.appendChild(fragment);

    const btnVaciar = document.getElementById("vaciar-carrito");
    btnVaciar.addEventListener("click", () => {
        carrito = {};
        pintarCarrito();
    });
};

const btnAccion = (e) => {
    //Accion de aumentar
    if (e.target.classList.contains("btn-info")) {
        const producto = carrito[e.target.dataset.id];
        producto.cantidad++;
        carrito[e.target.dataset.id] = { ...producto }; //Hacemos una copia de producto
        pintarCarrito();
    }
    //Acción de disminuir o eliminar la cantidad
    if (e.target.classList.contains("btn-danger")) {
        const producto = carrito[e.target.dataset.id];
        producto.cantidad--;
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id];
        }
        pintarCarrito();
    }

    e.stopPropagation();
};

