const SubCategory = require("../models/subCategory.model");
const category = require ("../models/category.model");
const path = require("path");

// CREATE SUBCATEGORY WITH IMAGE UPLOAD
exports.createSubCategory = async (req, res) => {
    try {
        const { name, category_id } = req.body;

        const admin_id = req.user;

        const image = req.file ? `/uploads/${req.file.filename}` : null; // Save uploaded image path

        const subCategory = new SubCategory({
            name,
            image,
            category_id,
            admin_id,
        });

        await subCategory.save();
        res.status(201).json({ message: "SubCategory created successfully", subCategory });
    } catch (error) {
        res.status(500).json({ error: "Error creating subcategory", details: error.message });
    }
};

// DELETE (SOFT DELETE)
exports.deleteSubCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const subCategory = await SubCategory.findByIdAndUpdate(
            id,
            { deleted: true },
            { new: true }
        );

        if (!subCategory) {
            return res.status(404).json({ message: "SubCategory not found" });
        }

        res.status(200).json({ message: "SubCategory soft deleted", subCategory });
    } catch (error) {
        res.status(500).json({ error: "Error deleting subcategory", details: error.message });
    }
};

// UPDATE SUBCATEGORY (WITH IMAGE)
exports.updateSubCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const updates = { ...req.body };

        // Check if a new image is uploaded
        if (req.file) {
            updates.image = `/uploads/${req.file.filename}`;
        }

        const subCategory = await SubCategory.findOneAndUpdate(
            { _id: id, deleted: false },
            updates,
            { new: true }
        );

        if (!subCategory) {
            return res.status(404).json({ message: "SubCategory not found or already deleted" });
        }

        res.status(200).json({ message: "SubCategory updated successfully", subCategory });
    } catch (error) {
        res.status(500).json({ error: "Error updating subcategory", details: error.message });
    }
};

// GET ALL SUBCATEGORIES (EXCLUDE SOFT-DELETED)
exports.getSubCategories = async (req, res) => {
    try {
        const subCategories = await SubCategory.find({ deleted: false });

        res.status(200).json({ subCategories });
    } catch (error) {
        res.status(500).json({ error: "Error fetching subcategories", details: error.message });
    }
};

// GET SUBCATEGORY BY ID
exports.getSubCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const subCategory = await SubCategory.findOne({ _id: id, deleted: false });

        if (!subCategory) {
            return res.status(404).json({ message: "SubCategory not found" });
        }

        res.status(200).json({ subCategory });
    } catch (error) {
        res.status(500).json({ error: "Error fetching subcategory", details: error.message });
    }
};
