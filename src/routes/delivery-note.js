const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/session");
const { createDeliveryNote } = require("../controllers/delivery-note");
const { validatorCreateDeliveryNote } = require("../validators/delivery-note");

router.post("/", authMiddleware, validatorCreateDeliveryNote, createDeliveryNote);

module.exports = router;
