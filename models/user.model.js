const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");


const user_schema = new mongoose.Schema ({
    avatar: {
        type: Array,
        default: ['uploads/avatar/avatar.png']
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: " Please enter a valid Email Id"
        }
    },
    phone: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                return validator.isMobilePhone  && v.length === 10;
            },
            message: 'Phone number must 10 digits.',
        },
    },
    password:{
        type: String,
        required: [true, 'Password is required']
    },
    created_at:{
        type: Date,
        default: Date.now
    },
    updated_at:{
        type: Date,
        default: Date.now
    },
    date_of_birth:{
        type: Date,
        required: [true, 'Date of birth is required'],
        // validate: {
        //     validator: function (value) {
        //         // Check if the value is a valid date
        //         if (!validator.isDate(value.toISOString(), { format: 'YYYY-MM-DD', strictMode: true })) {
        //             return false;
        //         }

        //         // Ensure the user is at least 18 years old
        //         const today = new Date();
        //         const age = today.getFullYear() - value.getFullYear();
        //         const monthDiff = today.getMonth() - value.getMonth();
        //         const dayDiff = today.getDate() - value.getDate();

        //         // Adjust age calculation for birth month and day
        //         if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        //             return age - 1 >= 18;
        //         }
        //         return age >= 18;
        //     },
        //     message: 'Date of birth must be a valid date, and you must be at least 18 years old.',
        // },
    }
}, { timestamps: true })



user_schema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(16);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model("User", user_schema);

module.exports = User;