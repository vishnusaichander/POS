const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
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

module.exports = mongoose.model("SubCategory", subCategorySchema);
