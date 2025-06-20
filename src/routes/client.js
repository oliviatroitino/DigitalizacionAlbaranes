const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/session");
const { validatorCreateClient, validatorGetId } = require("../validators/client.js");
const { createClient, getClients, getClientById } = require("../controllers/client.js");

router.post("/", authMiddleware, validatorCreateClient, createClient);
router.get("/", authMiddleware, getClients);
router.get("/:id", authMiddleware, validatorGetId, getClientById);

module.exports = router;
