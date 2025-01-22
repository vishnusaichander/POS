const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    purchase_date: {
        type: String,
    },
    sub_category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
    },
    name: {
        type: String,
        required: true,
    },
    images: {
        type: String,
    },
    description: {
        type: String,
    },
    sku: {
        type: String,
        required: true,
        unique: true,
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    actual_price: {
        type: String,
    },
    discount: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    supplier_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier",
    },
    status: {
        type: Boolean,
        default: true,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
    }
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
});

module.exports = mongoose.model("Product", productSchema);
