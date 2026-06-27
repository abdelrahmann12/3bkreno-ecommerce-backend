
import dotenv from"dotenv";
dotenv.config();
import express from "express";
import cors from "cors"

import { connectDB } from "./DB/connectDB.js";
import router from "./modules/product/product.controller.js";
import autRouter from "./modules/auth/auth.controller.js"



const app = express();
app.use(express.json());

app.use(cors({
    credentials:true,
    origin:"http://localhost:3000"
}))

const port = process.env.PORT;


app.use('/products', router);
app.use("/auth" , autRouter);

await connectDB();
app.listen( port , ()=>{
    console.log("server is running on port" , port);
})

