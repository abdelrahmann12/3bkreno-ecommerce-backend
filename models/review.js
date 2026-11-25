import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    // اسم الزائر (بيكتبه بنفسه)
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    // id عشوائي من متصفح الزائر، بنستخدمه بس لمنع التكرار وتعديل تقييمه
    // (مش بنرجّعه في أي response)
    visitorId: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: "التقييم لازم يكون رقم صحيح من 1 إلى 5",
      },
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  { timestamps: true },
);

// نفس المتصفح يقيّم المنتج الواحد مرة واحدة بس (لو قيّم تاني بيتعدّل تقييمه)
reviewSchema.index({ product: 1, visitorId: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
