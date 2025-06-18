const express = require("express");
const router = express.Router();
//// Validador
const { validatorRegisterUser } = require("../validators/user");
//// Controller
const { registerUser } = require("../controllers/user");

router.post("/register", validatorRegisterUser, registerUser);

module.exports = router;