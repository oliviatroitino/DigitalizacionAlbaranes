const mongoose = require("mongoose");
const { AddressSchema } = require("./user");

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
        address: AddressSchema,
        deleted: {
            type: Boolean,
            default: false,
            required: true
        }
    }
);

module.exports = {
    ClientSchema,
    ClientModel: mongoose.model("client", ClientSchema)
}