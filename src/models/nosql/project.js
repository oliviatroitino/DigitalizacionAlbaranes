const mongoose = require("mongoose");

const ProjectSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        projectCode: { type: String, required: true },
        email: { type: String, required: true },
        address: {
            street: { type: String, required: true },
            number: { type: Number, required: true },
            postal: { type: Number, required: true },
            city: { type: String, required: true },
            province: { type: String, required: true }
        },
        code: { type: String, required: true },
        clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        }
    }
);

module.exports = mongoose.model("project", ProjectSchema);