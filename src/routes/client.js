const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/session");
const { validatorCreateClient } = require("../validators/client.js");
const { createClient } = require("../controllers/client.js");

router.post("/", authMiddleware, validatorCreateClient, createClient);

module.exports = router;
