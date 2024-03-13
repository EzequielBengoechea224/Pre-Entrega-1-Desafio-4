import fs from "fs";

export class ProductManager {
    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async addProduct(title, desc, price, thumbnail, code, stock) {

        try {
            const nuevoProd = {
                id: this.GetId(),
                title: title,
                description: desc,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock
            };

            this.products.find((prod) => prod.code === code) ? console.error("Ya existe un producto con ese código") : this.products.push(nuevoProd);
            

            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, "\t"));
            console.log("El producto fue agregado con éxito!!");
        } catch (error) {
            console.log(error);
        }
    }

    async getProducts(limit = null) {
        try {
            let productos = await fs.promises.readFile(this.path, "utf-8");
            productos = JSON.parse(productos);

            if (limit !== null && !isNaN(limit)) {
                // Limitar la lista de productos al límite especificado
                productos = productos.slice(0, parseInt(limit));
            }

            return productos;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
    //Busco productos basandome en su id y los muestro
    async getProductById(id) {
        try {
            console.log("Buscando por ID");
            this.products = await this.getProducts();
            let prodEncontrado = this.products.find((prod) => prod.id === id);
            if (prodEncontrado) {
                return prodEncontrado;
            } else {
                return console.warn("El producto solicitado no fue encontrado, probablemente no existe");
            }
        } catch (error) {
            console.error(error);
        }
    }
    //Metodo para modificar un producto Basandose en su ID
    async updateProduct(id, valor) {
        try {
            let productos = await fs.promises.readFile(this.path, "utf-8");
            productos = JSON.parse(productos);

            const productoIndex = productos.findIndex((producto) => producto.id === id);

            if (productoIndex !== -1) {
                productos[productoIndex] = {
                    ...productos[productoIndex],
                    ...valor
                };
                await fs.promises.writeFile(this.path, JSON.stringify(productos, null, "\t"));
                console.log("El producto se modificó de forma exitosa!");
            } else {
                console.error("No se encontró ningún producto con ese ID");
            }
        } catch (error) {
            console.error(error);

        }
    }

    //Metodo para eliminar productos basandose en su ID
    async deleteProduct(id){
        try {
            let productos = await fs.promises.readFile(this.path, "utf-8");
            productos = JSON.parse(productos);

            const productoIndex = productos.findIndex(producto => producto.id === id);

            if (productoIndex !== -1) {
                productos.splice(productoIndex, 1);

                await fs.promises.writeFile(this.path, JSON.stringify(productos, null, "\t"));

                console.log("El producto fue eliminado con éxito!");
            } else {
                console.error("No se encontró ningún producto con el ID especificado");
            }
        } catch (error) {
            console.error(error);
        }
    }

    //Metodo para generar un ID
    async GetId(){
        const productos = await this.getProducts();

        if(productos.length > 0 ){
            return productos.length + 1;
        }
        return 1;
    }
}

