const express = require("express");
const couponController = require("../controllers/coupon.controller");
const router = express.Router();

// CRUD Routes
router.post("/coupons", couponController.createCoupon); 
router.get("/coupons", couponController.getAllCoupons); 
router.get("/coupons/:id", couponController.getCouponById);
router.put("/coupons/:id", couponController.updateCoupon); 
router.delete("/coupons/:id", couponController.deleteCoupon);
module.exports = router;
