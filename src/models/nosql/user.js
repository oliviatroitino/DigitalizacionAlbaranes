const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
    street: { type: String },
    number: { type: Number },
    postal: { type: Number },
    city: { type: String },
    province: { type: String }
}, {_id: false});

const CompanySchema = new mongoose.Schema({
    name: { type: String },
    cif: { type: String },
    address: AddressSchema
}, {_id: false});

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
    address: AddressSchema,
    company: CompanySchema
});

module.exports = {
    AddressSchema, CompanySchema,
    UserModel: mongoose.model("user", UserSchema)
};