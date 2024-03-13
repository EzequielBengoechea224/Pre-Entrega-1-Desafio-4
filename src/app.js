import express from "express";
import {ProductManager} from "./ProductManager.js";
import productsRouter from "./routes/productsRoutes.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const PM = new ProductManager("../data/products.json")

app.use("/api/products", productsRouter);


const PORT = 8080;
app.listen(PORT,()=>{
    console.log(`Servidor activo http://localhost:${PORT}`);
})