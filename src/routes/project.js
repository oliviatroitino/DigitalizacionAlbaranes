const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/session");
const { validatorCreateProject, validatorGetProjects, validatorGetProject } = require("../validators/project");
const { createProject, getProjects, getProject } = require("../controllers/project");

router.post("/", authMiddleware, validatorCreateProject, createProject);
router.get("/", authMiddleware, validatorGetProjects, getProjects);
router.get("/:id", authMiddleware, validatorGetProject, getProject);

module.exports = router;