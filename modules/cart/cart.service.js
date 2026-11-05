// import User from "../../models/user.js";



// export const getCart =async (req , res ,next)=>{
//     try{
//         const user = await User.findById(req.user.id).populate("cart.product")
//      return res.status(200).json({ success: true, data: user.cart });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// }

// export const addToCart = async (req , res ,next) =>{
//     try{
//         const {product , quantity = 1} = req.body;
//         const user = await User.findById(req.user.id);

//         const existingItem = user.cart.find((item)=> item.product.toString() === product);

//         if(existingItem){
//             existingItem.quantity += quantity ;
//         }else{
//             user.cart.push({product , quantity})
//         }

//         await user.save();
//         return res.status(200).json({message:"تم اضافة المنتج" , success:true , data:user.cart})

//     }catch(err){
//         return res.status(500).json({ success: false, message: err.message });
//     }
// }


// export const deleteCart = async(req , res , next)=>{
//     try{
//         const { productId } = req.body;
//         const cartExist = await User.findByIdAndUpdate(req.user.id,{
//             $pull:{cart:{product:productId}}
//         });
//            return res.status(200).json({ success: true, message: "تم حذف المنتج " });
//     }catch(err){
//          return res.status(500).json({ success: false, message: err.message });
//     }

    

// }

// // export const deleteProductFromCart = async(req , res , next)=>{
// //     try{
// //         const {productId} = req.body;
// //         const user = await User.findByIdAndUpdate(req.user.id);
// //         user.cart = user.cart.filter((item)=>{
// //             item.product.toString() !== productId;
// //         })
// //         user.save()

// //         return res.status(200).json({message:"تم حذف منتجات بنجاح" , success:true})

// //     }catch(err){
// //          return res.status(500).json({ success: false, message: err.message });
// //     }
// // }



import Product from "../../models/product.js";

// جلب منتجات السلة
export const getCart = async (req, res) => {
  try {
    const { products = [] } = req.body;

    const cart = await Promise.all(
      products.map(async (item) => {
        const product = await Product.findById(item.product);

        if (!product) return null;

        return {
          product,
          quantity: item.quantity,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: cart.filter(Boolean),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// إضافة منتج للسلة
export const addToCart = async (req, res) => {
  try {
    const { product, quantity = 1 } = req.body;

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const productExist = await Product.findById(product);

    if (!productExist) {
      return res.status(404).json({
        success: false,
        message: "المنتج غير موجود",
      });
    }

    return res.status(200).json({
      success: true,
      message: "تم إضافة المنتج",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// حذف منتج من السلة
export const deleteCart = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    return res.status(200).json({
      success: true,
      message: "تم حذف المنتج",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
