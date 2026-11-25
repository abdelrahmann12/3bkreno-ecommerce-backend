import { Router } from "express";
import rateLimit from "express-rate-limit";
import { getProductReviews, addOrUpdateReview, deleteReview } from "./review.service.js";
import { verifyToken } from "../../src/middleware/verfiyToken.js";

const router = Router();

// حماية من السبام: 10 تقييمات في الساعة لكل IP
const reviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "حاولت كتير، جرّب بعد شوية",
  },
});

router.get("/products/:productId/reviews", getProductReviews);
router.post("/products/:productId/reviews", reviewLimiter, addOrUpdateReview);
router.delete("/reviews/:reviewId", verifyToken, deleteReview);

// مسار حذف التقييم (للأدمن) هنضيفه بعد ما نشوف الـ middleware بتاع التوكن عندك

export default router;
