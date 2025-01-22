const Product = require("../models/product.model");

exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({ message: "Product created successfully", product });
    } catch (error) {
        res.status(500).json({ error: "Error creating product" });
    }
};



exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndUpdate(
            id,
            { deleted: true },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product soft deleted", product });
    } catch (error) {
        res.status(500).json({ error: "Error deleting product" });
    }
};


exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const product = await Product.findOneAndUpdate(
            { _id: id, deleted: false },
            updates,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found or already deleted" });
        }

        res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
        res.status(500).json({ error: "Error updating product" });
    }
};


exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({ deleted: false });

        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ error: "Error fetching products" });
    }
};



exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findOne({ _id: id, deleted: false });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({ error: "Error fetching product" });
    }
};
