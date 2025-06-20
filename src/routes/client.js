const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/session");
const { validatorCreateClient } = require("../validators/client");
const { createClient } = require("../controllers/client");

router.post("/", authMiddleware, validatorCreateClient, createClient);

module.exports = router;
