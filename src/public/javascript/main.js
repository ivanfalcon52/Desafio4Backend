const socket=io();

socket.on("productos", (data) => {
    console.log(data)
    renderProductos(data);
})

//Renderizamos los productos
const renderProductos = (productos) => {
    const productsContainer = document.getElementById("products-container");
    productsContainer.innerHTML="";

    productos.forEach(item => {
        const card= document.createElement("div");
        card.classList.add("card");

        card.innerHTML= `
                        <p>${item.id}</p>
                        <p>${item.title}</p>
                        <p>${item.price}</p>
                        <button>Eliminar</button>
                        `;
        
        productsContainer.appendChild(card);

        //Evento eliminar

        card.querySelector("button").addEventListener("click", () => {
            eliminarProducto(item.id);
        })
    })
}

//creamos la funcion eliminarProducto
const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id);
}

//Agregamos productos del formulario
document.getElementById("enviar-btn").addEventListener("click", (event) => {
    event.preventDefault();
    agregarProducto();
})

//creamos la funcion para agregar producto
const agregarProducto = () => {
    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value=== "true",
    };
    
    socket.emit("agregarProducto", producto);

    
}
