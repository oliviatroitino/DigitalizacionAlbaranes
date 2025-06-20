const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/session");
const { validatorCreateProject } = require("../validators/project");
const { createProject } = require("../controllers/project");

router.post("/", authMiddleware, validatorCreateProject, createProject);

module.exports = router;