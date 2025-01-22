const Coupon = require("../models/coupon.model"); 


exports.createCoupon = async (req, res) => {
    try {
      const {
        code,
        discountType,
        discountValue,
        minPurchaseAmount,
        maxDiscountAmount,
        startDate,
        endDate,
        usageLimit,
        applicableUsers,
      } = req.body;
  
      const coupon = new Coupon({
        code,
        discountType,
        discountValue,
        minPurchaseAmount,
        maxDiscountAmount,
        startDate,
        endDate,
        usageLimit,
        applicableUsers,
      });
  
      const savedCoupon = await coupon.save();
      res.status(201).json(savedCoupon);
    } catch (error) {
      res.status(500).json({ error: "Failed to create coupon", details: error.message });
    }
  };
  


  exports.getAllCoupons = async (req, res) => {
    try {
      const coupons = await Coupon.find().populate("applicableUsers", "name email");
      res.status(200).json(coupons);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch coupons", details: error.message });
    }
  };
  


  exports.getCouponById = async (req, res) => {
    try {
      const { id } = req.params;
      const coupon = await Coupon.findById(id).populate("applicableUsers", "name email");
  
      if (!coupon) {
        return res.status(404).json({ error: "Coupon not found" });
      }
  
      res.status(200).json(coupon);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch coupon", details: error.message });
    }
  };
  

  exports.updateCoupon = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
  
      const updatedCoupon = await Coupon.findByIdAndUpdate(
        id,
        { ...updatedData },
        { new: true, runValidators: true } // Return updated document and validate
      );
  
      if (!updatedCoupon) {
        return res.status(404).json({ error: "Coupon not found" });
      }
  
      res.status(200).json(updatedCoupon);
    } catch (error) {
      res.status(500).json({ error: "Failed to update coupon", details: error.message });
    }
  };
  

  exports.deleteCoupon = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedCoupon = await Coupon.findByIdAndDelete(id);
  
      if (!deletedCoupon) {
        return res.status(404).json({ error: "Coupon not found" });
      }
  
      res.status(200).json({ message: "Coupon deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete coupon", details: error.message });
    }
  };
  