import { Router } from "express";
import { addProduct, DeleteProduct, getProductByCategory, getProductById, getProducts, toggleHidden, updateProduct } from "./product.service.js";
import { upload } from "../../src/middleware/upload.js";

 const router = Router();

 router.post("/addProduct" , upload.array('images' , 5) ,  addProduct);
 router.get("/:id" , getProductById);
//  router.get("/" , getProducts );
 router.put("/update/:id" , updateProduct);
 router.delete("/delete/:id" , DeleteProduct);
 router.get("/", getProductByCategory); // /products?category=puzzle
 // route
router.patch("/toggle-hidden/:id", toggleHidden);

export default router;