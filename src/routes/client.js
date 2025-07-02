const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/session");
//// Validador
const { validatorCreateClient, validatorGetId, validatorUpdateClient, validatorRestoreClient } = require("../validators/client.js");
//// Controller
const { createClient, getClients, getClientById, updateClient, deleteClient, getDeletedClients, restoreClient } = require("../controllers/client.js");

router.post("/", authMiddleware, validatorCreateClient, createClient);
router.get("/", authMiddleware, getClients);
router.get("/deleted", authMiddleware, getDeletedClients);
router.get("/:id", authMiddleware, validatorGetId, getClientById);
router.patch("/:id", authMiddleware, validatorUpdateClient, updateClient);
router.delete("/:id", authMiddleware, validatorGetId, deleteClient);
router.patch("/restore/:id", authMiddleware, validatorRestoreClient, restoreClient);

module.exports = router;
