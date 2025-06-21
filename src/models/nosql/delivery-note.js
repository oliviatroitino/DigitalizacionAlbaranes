const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    street: { type: String },
    number: { type: Number },
    postal: { type: Number },
    city: { type: String },
    province: { type: String }
}, { _id: false });

const clientSchema = new mongoose.Schema({
  name: String,
  address: addressSchema,
  cif: String
}, { _id: false });

const companySchema = new mongoose.Schema({
    name: { type: String },
    cif: { type: String },
    address: addressSchema
}, { _id: false });

const DeliveryNoteSchema = mongoose.Schema({
    name: String,
    date: { type: Date, required: true },
    company: companySchema,
    address: addressSchema,
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "project",
        required: true
    },
    client: clientSchema,
    description: String,
    format: String,
    hours: Number,
    workers: [String],
    photo: String,
    deleted: { type: Boolean, default: false }
});

module.exports = mongoose.model("deliveryNote", DeliveryNoteSchema);
