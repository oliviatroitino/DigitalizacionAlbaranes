const express = require("express");
const router = express.Router();
//// Validador
const { validatorRegisterUser, validatorLogin } = require("../validators/user");
const { validatorEmailCode } = require("../validators/email");
//// Controller
const { registerUser, verifyEmail, loginUser } = require("../controllers/user");

router.post("/register", validatorRegisterUser, registerUser);
router.put("/validation", validatorEmailCode, verifyEmail);
router.post("/login", validatorLogin, loginUser);

module.exports = router;