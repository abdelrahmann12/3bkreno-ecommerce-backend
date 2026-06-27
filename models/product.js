import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    images: {
      type: [String], // الـ URL بتاع الصورة (من Cloudinary)
      required: true,
      validator: (arr) => arr.length > 0,
      message: "اختار صوره واحده علي الاقل ",
    },
    category: {
      type: String, // زي "ألعاب" أو "بازل" أو "عرايس"
      required: true,
    },
    stock: {
      type: Number,
      default: 10, // عدد القطع المتاحة
    },
    //   ageGroup: {
    //     type: String,  // زي "3-5 سنوات" مفيد لمتجر أطفال
    //   },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
