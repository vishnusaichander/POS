const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    address: {
        street: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        zipCode: {
            type: String,
        },
        country: {
            type: String,
        }
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
    },
    preferences: {
        notifications: {
            type: Boolean,
            default: false,
        },
        preferredLanguage: {
            type: String,
        }
    }
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
});

module.exports = mongoose.model("Customer", customerSchema);
