const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/session");
const { createDeliveryNote, getDeliveryNotes, getDeliveryNoteById, updateDeliveryNote } = require("../controllers/delivery-note");
const { validatorCreateDeliveryNote, validatorGetDeliveryNotes, validatorGetDeliveryNoteById, validatorUpdateDeliveryNote } = require("../validators/delivery-note");

router.post("/", authMiddleware, validatorCreateDeliveryNote, createDeliveryNote);
router.get("/", authMiddleware, validatorGetDeliveryNotes, getDeliveryNotes);
router.get("/:id", authMiddleware, validatorGetDeliveryNoteById, getDeliveryNoteById);
router.patch("/:id", authMiddleware, validatorUpdateDeliveryNote, updateDeliveryNote);

module.exports = router;
