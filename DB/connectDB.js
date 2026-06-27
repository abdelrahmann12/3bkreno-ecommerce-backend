import mongoose from "mongoose";


export function connectDB(){
mongoose.connect(process.env.MONGOURL)
  .then(() => {
    console.log("database connected successfully")
  })
  .catch(() => {
    console.log("database connection error")
  })
}
