const mongoose = require("mongoose");

const ClientSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "user", 
            required: true 
        },
        name: {
            type: String,
            required: true
        },
        cif: {
            type: String,
            required: true
        },
        address: {
            street: {
                type: String
            },
            number: {
                type: Number
            },
            postal: {
                type: Number
            },
            city: {
                type: String
            },
            province: {
                type: String
            }
        },
        deleted: {
            type: Boolean,
            default: false
        }
    }
);

module.exports = mongoose.model("client", ClientSchema);