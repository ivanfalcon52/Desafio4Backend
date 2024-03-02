const express=require("express");
const router=express.Router();
const ProductManager = require ("../controllers/product-manager");
const productManager = new ProductManager("./src/models/productos.json");

//"HOME"
router.get("/", async (req,res) => {
    try {
        const productos = await productManager.getProducts();
        res.render("home", {productos: productos})
    } catch (error) {
        console.log("error al obtener los productos",error);
        res.status(500).json({error:"Error interno del servidor"});
    }
})

//"REALTIMEPRODUCT"
router.get("/realtimeproducts", async (req,res) => {
    try {
        res.render("realTimeProducts");
    } catch (error) {
        console.log("error en la vista realTimeProducts",error);
        res.status(500).json({error:"Error interno del servidor"});
    }
})

module.exports=router;