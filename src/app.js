//Declaramos los modulos a utilizar
const express = require("express");
const app = express();
const PUERTO = 8080;
const exphbs = require("express-handlebars");
const socket = require("socket.io");

//Declaramos Router
const viewsRouter = require("./routes/views.router.js");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");

//Obtenemos los productos
const ProductManager = require("./controllers/product-manager.js");
const productManager = new ProductManager("./src/models/productos.json");

//Middleware
app.use(express.static("./src/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Configuramos express handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

//Obtenemos el array de productos


//Listen
const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto ${PUERTO}`);
})

//Socket.io

const io = socket(httpServer);

io.on("connection", async (socket) => {
    console.log("Un cliente se ha conectado");

    //mandamos el array de los productos al cliente conectado:
    socket.emit("productos", await productManager.getProducts());

    //recibimos el evento de "eliminar producto" desde el cliente:
    socket.on("eliminarProducto", async (id) => {
        await productManager.deleteProduct(id);

        //mando la actualizacion de la lista al cliente:
        io.sockets.emit("productos", await productManager.getProducts());
    })

    //para que el cliente agregue un producto:
    socket.on("agregarProducto", async(producto) => {
        console.log(producto);
        await productManager.addProduct(producto);
        io.sockets.emit("productos", await productManager.getProducts());
    })
})

