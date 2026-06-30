
import dotenv from"dotenv";
dotenv.config();
import express from "express";
import cors from "cors"

import { connectDB } from "./DB/connectDB.js";
import router from "./modules/product/product.controller.js";
import autRouter from "./modules/auth/auth.controller.js"
import cartRouter from "./modules/cart/cart.controller.js";



const app = express();
app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://3bkreno-ecommerce-i6tzvuosh-abdelrahmans-projects-f1c08434.vercel.app",
    // أو لو عندك domain ثابت
    "https://3bkreno-ecommerce.vercel.app",
  ],
  credentials: true,
}));

const port = process.env.PORT;


app.use('/products', router);
app.use("/auth" , autRouter);
app.use("/cart" , cartRouter);

await connectDB();
app.listen( port , ()=>{
    console.log("server is running on port" , port);
})

