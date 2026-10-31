import User from "../../models/user.js";




export const createOrder = async (req, res , next)=>{
    const {address , paymentMethod } = req.body;

    const user = await  User.findById(req.user.id).populate("cart.product");

    if(!user.cart || user.cart.length === 0){
      return res.status(400).json({ success: false, message: "السلة فاضية" });  
    }

    const items = user.cart.map((item) =>({
        product : item.product._id,
        quantity:
    }));


}