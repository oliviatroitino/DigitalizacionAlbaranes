const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/session");
const { validatorCreateClient, validatorGetId, validatorUpdateClient } = require("../validators/client.js");
const { createClient, getClients, getClientById, updateClient, deleteClient } = require("../controllers/client.js");

router.post("/", authMiddleware, validatorCreateClient, createClient);
router.get("/", authMiddleware, getClients);
router.get("/:id", authMiddleware, validatorGetId, getClientById);
router.patch("/:id", authMiddleware, validatorUpdateClient, updateClient);
router.delete("/:id", authMiddleware, validatorGetId, deleteClient);

module.exports = router;
