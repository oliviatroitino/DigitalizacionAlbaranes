const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/session");
//// Validador
const { validatorCreateProject, validatorGetProjects, validatorGetProject, validatorUpdateProject, validatorRestoreProject } = require("../validators/project");
//// Controller
const { createProject, getProjects, getProject, updateProject, deleteProject, getDeletedProjects, restoreProject } = require("../controllers/project");

router.post("/", authMiddleware, validatorCreateProject, createProject);
router.get("/", authMiddleware, validatorGetProjects, getProjects);
router.get("/:id", authMiddleware, validatorGetProject, getProject);
router.patch("/:id", authMiddleware, validatorUpdateProject, updateProject);
router.delete("/:id", authMiddleware, validatorGetProject, deleteProject);
router.get("/deleted", authMiddleware, getDeletedProjects);
router.patch("/restore/:id", authMiddleware, validatorRestoreProject, restoreProject);

module.exports = router;