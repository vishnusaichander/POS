const Category = require("../models/category.model");

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, status } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
     
    console.log("req.user",req.user)
    const category = new Category({
      name,
      image,
      status,
      admin_id: req.userId,
    });

    const savedCategory = await category.save();
    res.status(201).json({ message: "Category created successfully", data: savedCategory });
  } catch (error) {
    res.status(500).json({ error: "Failed to create category", details: error.message });
  }
};



// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ deleted: false });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories", details: error.message });
  }
};



// Get a single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({ _id: id, deleted: false });

    if (!category) {
      return res.status(404).json({ error: "Category not found or deleted" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch category", details: error.message });
  }
};



// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updatedCategory = await Category.findOneAndUpdate(
      { _id: id, deleted: false },
      {
        ...(name && { name }),
        ...(status !== undefined && { status }),
        ...(image && { image }),
        updated_at: Date.now(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found or already deleted" });
    }

    res.status(200).json({ message: "Category updated successfully", data: updatedCategory });
  } catch (error) {
    res.status(500).json({ error: "Failed to update category", details: error.message });
  }
};




// Soft delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findOneAndUpdate(
      { _id: id, deleted: false },
      { deleted: true, updated_at: Date.now() }
    );

    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found or already deleted" });
    }

    res.status(200).json({ message: "Category soft deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category", details: error.message });
  }
};
