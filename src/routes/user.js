const express = require("express");
const router = express.Router();
//// Validador
const { validatorRegisterUser, validatorLogin, validatorUserData, validatorCompanyData } = require("../validators/user");
const { validatorEmailCode } = require("../validators/email");
//// Controller
const { registerUser, verifyEmail, loginUser, updateUser, updateCompany } = require("../controllers/user");
const authMiddleware = require("../middleware/session.js");

router.post("/register", validatorRegisterUser, registerUser);
router.put("/validation", validatorEmailCode, verifyEmail);
router.post("/login", validatorLogin, loginUser);
router.patch("/", authMiddleware, validatorUserData, updateUser);
router.patch("/company", authMiddleware,  validatorCompanyData, updateCompany);

module.exports = router;