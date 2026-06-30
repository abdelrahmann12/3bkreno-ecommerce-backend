import { Router } from "express";
import { addToCart, deleteCart, getCart } from "./cart.service.js";
import { verifyToken } from "../../src/middleware/verfiyToken.js";


const router = Router();

router.get("/" , verifyToken, getCart);
router.post("/add" , verifyToken, addToCart );
router.delete("/del" , verifyToken , deleteCart);

// router.delete("/del" , verifyToken , deleteProductFromCart);





export default router ;