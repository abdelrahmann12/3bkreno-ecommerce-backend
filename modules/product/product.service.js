import Product from "../../models/product.js";
import cloudinary from "../../src/config/cloudinary.js";

// في أول الملف أو في ملف منفصل constants.js

const VALID_CATEGORIES = ["puzzle", "women", "cars", "draw" ,"cards"];

export const addProduct = async (req, res, next) => {
  try {

    const { name, description, price, category, stock } = req.body;

    if (!name || !description || !price) {
      return res
        .status(400)
        .json({ message: "please fill all product inputs", success: false });
    }

    
    if (!req.files || req.files.length == 0) {
      return res
        .status(400)
        .json({ message: "يرجي رفع صوره واحده علي الاقل ", success: false });
    }

const uploadPromises = req.files.map((file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'kids-store/products' },
      (error, result) => error ? reject(error) : resolve(result.secure_url)
    ).end(file.buffer);
  });
});

const imageUrls = await Promise.all(uploadPromises);


    const product = await Product.create({
      name,
      description,
      price,
      images:imageUrls,
      category,
      stock,
    });

    res
      .status(201)
      .json({
        message: "product created successfuly",
        sucess: true,
        data: product,
      });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
};

export const getProductById = async (req, res, next) => {
    try{
      
        const { id } = req.params;
        const product = await Product.findById(id);
        
        if (!product) {
            return res
            .status(400)
            .json({ message: "product not found", success: false });
        }
        
        return res
        .status(200)
        .json({ message: "product found successfuly", success: true ,data:product});
    }catch(err){
        return res.status(err.cause || 500).json({message:err.message , success:false});
    }
    };


export const getProducts = async (req, res , next) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductByCategory = async (req , res , next)=>{
  try{
    const {category} = req.query;
    products = await Product.find({category});
    if(!products){
      return res.status(400).json({message:"no products found in this catrgory" , success:false})
    }

    if(products){
      return res.status(200).json({message:"products found successfuly" , success:true , data:products});
    }
  }catch(err){
    return res.status(error.cause ||500 ).json({message:err.message , success:false});
  }
}

export const updateProduct = async(req , res, next)=>{
  try{

    const {id} = req.params ;
    const {name , category , stock , price , description} = req.body; 
    
    const product = await Product.findByIdAndUpdate(id, { name, category, stock, price, description },{runValidators:true , new:true});
    if(!product){
      return res.status(500).json({message:"product not found" , success:false})
    }
    return res.status(200).json({
      message: "product updated successfully",
      success: true,
      data: product,
    });

  }catch(err){
    return res.status(500).json({message:err.message , success:false})
  }
  
}


export const DeleteProduct = async(req , res ,next)=>{
  try{

    const {id} = req.params ;
    console.log("ID:", id);
    const product = await Product.findById(id);
    
    if(!product){
      return res.status(400).json({message:"product not found" , success:false});
    }

    if(product.images?.length > 0){
      const deletePromises = product.images.map((imgUrl)=>{
        const parts = imgUrl.split("/");
        const fileName = parts[parts.length - 1];
        const folder = parts[parts.length - 2];
        const publicId = `kids-store/${folder}/${fileName.split(".")[0]}`;
      return cloudinary.uploader.destroy(publicId);

      })
      await Promise.all(deletePromises)

    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({message:"product deleted successfuly" , success:true});
  }catch(err){
    return res.status(500).json({message:err.message , success:false})
  }
}



