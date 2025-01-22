const express = require("express");
const router = express.Router();
const subCategoryController = require("../controllers/subCategory.controller");
const upload = require("../middlewares/multer.middleware");

router.post("/create", upload.single("image"), subCategoryController.createSubCategory);
router.get("/", subCategoryController.getSubCategories);
router.get("/:id", subCategoryController.getSubCategoryById);
router.put("/update/:id", upload.single("image"), subCategoryController.updateSubCategory);
router.delete("/:id", subCategoryController.deleteSubCategory);

module.exports = router;
