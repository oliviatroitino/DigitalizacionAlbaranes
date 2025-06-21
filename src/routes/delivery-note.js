const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/session");
const { createDeliveryNote, getDeliveryNotes, getDeliveryNoteById } = require("../controllers/delivery-note");
const { validatorCreateDeliveryNote, validatorGetDeliveryNotes, validatorGetDeliveryNoteById } = require("../validators/delivery-note");

router.post("/", authMiddleware, validatorCreateDeliveryNote, createDeliveryNote);
router.get("/", authMiddleware, validatorGetDeliveryNotes, getDeliveryNotes);
router.get("/:id", authMiddleware, validatorGetDeliveryNoteById, getDeliveryNoteById);

module.exports = router;
