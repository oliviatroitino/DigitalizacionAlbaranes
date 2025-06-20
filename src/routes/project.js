const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/session");
const { validatorCreateProject, validatorGetProjects } = require("../validators/project");
const { createProject, getProjects } = require("../controllers/project");

router.post("/", authMiddleware, validatorCreateProject, createProject);
router.get("/", authMiddleware, validatorGetProjects, getProjects)

module.exports = router;