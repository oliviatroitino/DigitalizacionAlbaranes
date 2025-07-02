const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/session");
const { createDeliveryNote, getDeliveryNotes, getDeliveryNoteById, updateDeliveryNote, deleteDeliveryNote, downloadDeliveryNotePDF, signDeliveryNote } = require("../controllers/delivery-note");
const { validatorCreateDeliveryNote, validatorGetDeliveryNotes, validatorGetDeliveryNoteById, validatorUpdateDeliveryNote, validatorDeleteDeliveryNote } = require("../validators/delivery-note");
const { uploadMiddlewareMemory } = require("../utils/handleStorage");

router.post("/", authMiddleware, validatorCreateDeliveryNote, createDeliveryNote);
router.get("/", authMiddleware, validatorGetDeliveryNotes, getDeliveryNotes);
router.get("/:id", authMiddleware, validatorGetDeliveryNoteById, getDeliveryNoteById);
router.get("/:id/pdf", authMiddleware, downloadDeliveryNotePDF);
router.patch("/:id", authMiddleware, validatorUpdateDeliveryNote, updateDeliveryNote);
router.delete("/:id", authMiddleware, validatorDeleteDeliveryNote, deleteDeliveryNote)
router.post("/:id/signature", authMiddleware, uploadMiddlewareMemory.single('signature'), signDeliveryNote);

module.exports = router;
