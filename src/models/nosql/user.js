const mongoose = require("mongoose");

const addressSchema = {
    street: { type: String },
    number: { type: Number },
    postal: { type: Number },
    city: { type: String },
    province: { type: String }
}

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    surnames: {
        type: String,
    },
    password: { type: String },
    email: {
        type: String,
        unique: true
    },
    emailCode: {
        type: Number,
    },
    nif: {
        type: String
    },
    status: {
        type: Number,
        default: 0 // 0 no verificado, 1 verificado
    },
    role: {
        type: String, 
        enum: ["user", "admin"], 
        default: "user"
    },
    address: addressSchema,
    company: {
        name: { type: String },
        cif: { type: String },
        address: addressSchema
    }
});

module.exports = mongoose.model("user", UserSchema);