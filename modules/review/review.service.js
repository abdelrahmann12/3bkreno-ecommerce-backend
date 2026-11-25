import mongoose from "mongoose";
import Review from "../../models/review.js";
import Product from "../../models/product.js";
import User from "../../models/user.js";

// بيحسب متوسط التقييمات وعددها ويحدّث المنتج
// (لازم حقلين rating و reviewsCount يكونوا في schema المنتج، وإلا Mongoose هيتجاهلهم)
const recalcProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$product",
        avg: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const { avg = 0, count = 0 } = stats[0] || {};
  await Product.findByIdAndUpdate(productId, {
    rating: Math.round(avg * 10) / 10, // رقم عشري واحد، مثلاً 4.3
    reviewsCount: count,
  });
};

// GET /products/:productId/reviews  (عام)
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.isValidObjectId(productId)) {
      return res
        .status(400)
        .json({ success: false, message: "معرّف المنتج غير صالح" });
    }

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);

    const [reviews, total] = await Promise.all([
      Review.find({ product: productId })
        .select("-visitorId") // مهم: ما نكشفش الـ id بتاع الزائر
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Review.countDocuments({ product: productId }),
    ]);

    return res.status(200).json({
      success: true,
      data: reviews,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /reviews/:reviewId  (للأدمن بس)
// بيتأكد إن المستخدم أدمن من الداتابيز، فمحتاج بس إن الـ middleware يحط req.user.id
export const deleteReview = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res
        .status(401)
        .json({ success: false, message: "سجّل دخول الأول" });
    }

    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ success: false, message: "للأدمن فقط" });
    }

    const { reviewId } = req.params;
    if (!mongoose.isValidObjectId(reviewId)) {
      return res
        .status(400)
        .json({ success: false, message: "معرّف التقييم غير صالح" });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "التقييم غير موجود" });
    }

    await review.deleteOne();
    await recalcProductRating(review.product); // يحدّث متوسط النجوم وعدد التقييمات

    return res.status(200).json({ success: true, message: "تم حذف التقييم" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /products/:productId/reviews  (عام، من غير تسجيل دخول)
// لو نفس المتصفح قيّم المنتج قبل كده، التقييم بيتعدّل بدل ما يتكرر
export const addOrUpdateReview = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.isValidObjectId(productId)) {
      return res
        .status(400)
        .json({ success: false, message: "معرّف المنتج غير صالح" });
    }

    const name = String(req.body.name ?? "").trim();
    const visitorId = String(req.body.visitorId ?? "").trim();
    const rating = Number(req.body.rating);
    const comment = String(req.body.comment ?? "").trim();

    if (!name || name.length > 50) {
      return res
        .status(400)
        .json({ success: false, message: "اكتب اسمك (حتى 50 حرف)" });
    }
    if (visitorId.length < 8 || visitorId.length > 100) {
      return res.status(400).json({ success: false, message: "طلب غير صالح" });
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ success: false, message: "التقييم لازم يكون من 1 إلى 5" });
    }
    if (comment.length > 500) {
      return res
        .status(400)
        .json({ success: false, message: "التعليق أطول من 500 حرف" });
    }

    const productExists = await Product.exists({ _id: productId });
    if (!productExists) {
      return res
        .status(404)
        .json({ success: false, message: "المنتج غير موجود" });
    }

    const review = await Review.findOneAndUpdate(
      { product: productId, visitorId },
      { name, rating, comment },
      {
        returnDocument: "after",
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      },
    );

    await recalcProductRating(productId);

    // نشيل الـ visitorId من الرد
    const data = review.toObject();
    delete data.visitorId;

    return res.status(201).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
