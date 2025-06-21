const mongoose = require("mongoose");
const {ClientSchema} = require("./client");
const { AddressSchema, CompanySchema } = require("./user");

const DeliveryNoteSchema = mongoose.Schema({
    name: String,
    date: { type: Date, required: true },
    company: CompanySchema,
    address: AddressSchema,
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "project",
        required: true
    },
    client: ClientSchema,
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "client",
        required: true
    },
    description: String,
    format: String,
    hours: Number,
    workers: [String],
    photo: String,
    deleted: { type: Boolean, default: false }
});

module.exports = mongoose.model("deliveryNote", DeliveryNoteSchema);
