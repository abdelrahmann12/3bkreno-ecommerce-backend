import User from "../../models/user.js";



export const getCart =async (req , res ,next)=>{
    try{
        const user = await User.findById(req.user.id).populate("cart.product")
     return res.status(200).json({ success: true, data: user.cart });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export const addToCart = async (req , res ,next) =>{
    try{
        const {product , quantity = 1} = req.body;
        const user = await User.findById(req.user.id);

        const existingItem = user.cart.find((item)=> item.product.toString() === product);

        if(existingItem){
            existingItem.quantity += quantity ;
        }else{
            user.cart.push({product , quantity})
        }

        await user.save();
        return res.status(200).json({message:"تم اضافة المنتج" , success:true , data:user.cart})

    }catch(err){
        return res.status(500).json({ success: false, message: err.message });
    }
}


export const deleteCart = async(req , res , next)=>{
    try{
        const { productId } = req.body;
        const cartExist = await User.findByIdAndUpdate(req.user.id,{
            $pull:{cart:{product:productId}}
        });
           return res.status(200).json({ success: true, message: "تم حذف المنتج " });
    }catch(err){
         return res.status(500).json({ success: false, message: err.message });
    }

    

}

// export const deleteProductFromCart = async(req , res , next)=>{
//     try{
//         const {productId} = req.body;
//         const user = await User.findByIdAndUpdate(req.user.id);
//         user.cart = user.cart.filter((item)=>{
//             item.product.toString() !== productId;
//         })
//         user.save()

//         return res.status(200).json({message:"تم حذف منتجات بنجاح" , success:true})

//     }catch(err){
//          return res.status(500).json({ success: false, message: err.message });
//     }
// }
