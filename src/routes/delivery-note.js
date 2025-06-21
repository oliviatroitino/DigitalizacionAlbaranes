const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/session");
const { createDeliveryNote, getDeliveryNotes } = require("../controllers/delivery-note");
const { validatorCreateDeliveryNote, validatorGetDeliveryNotes } = require("../validators/delivery-note");

router.post("/", authMiddleware, validatorCreateDeliveryNote, createDeliveryNote);
router.get("/", authMiddleware, validatorGetDeliveryNotes, getDeliveryNotes);

module.exports = router;
