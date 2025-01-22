const express = require("express");
const categoryController = require("../controllers/category.controller");
const upload = require("../middlewares/multer.middleware");
const {verifyToken} = require("../middlewares/auth.middleware");

const router = express.Router();
router.use(verifyToken)
router.post(
  "/categories",
  verifyToken,
  upload.single("image"),
  categoryController.createCategory
);
router.get("/categories", categoryController.getAllCategories);
router.get("/categories/:id", categoryController.getCategoryById);
router.put(
  "/categories/:id",
  upload.single("image"),
  categoryController.updateCategory
);
router.delete("/categories/:id", categoryController.deleteCategory);

module.exports = router;
