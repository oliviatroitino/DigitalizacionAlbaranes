const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/session");
//// Validador
const { validatorCreateProject, validatorGetProjects, validatorGetProject, validatorUpdateProject, validatorRestoreProject } = require("../validators/project");
//// Controller
const { createProject, getProjects, getProject, updateProject, deleteProject, getDeletedProjects, restoreProject } = require("../controllers/project");

/**
 * @swagger
 * /api/project/:
 *      post:
 *          tags:
 *              - Proyecto
 *          summary: Crea un proyecto asociado a un cliente (y por lo tanto a un usuario)
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  example: Proyecto Reforma
 *                              projectCode:
 *                                  type: string
 *                                  example: REF-001
 *                              email:
 *                                  type: string
 *                                  example: contacto@reforma.com
 *                              address:
 *                                  type: object
 *                                  properties:
 *                                      street:
 *                                          type: string
 *                                      number:
 *                                          type: number
 *                                      postal:
 *                                          type: number
 *                                      city:
 *                                          type: string
 *                                      province:
 *                                          type: string
 *          responses:
 *              200:
 *                  description: Proyecto creado correctamente
 *              404:
 *                  description: Cliente no encontrado
 *              500:
 *                  description: Error al crear proyecto
 * 
 *      get:
 *          tags:
 *              - Proyecto
 *          summary: Busca todos los proyectos asociados a los clientes de un usuario
 *          responses:
 *              200:
 *                  description: Proyectos asociados al usuario
 *              500:
 *                  description: Error al buscar proyectos
 */
router.post("/", authMiddleware, validatorCreateProject, createProject);
router.get("/", authMiddleware, validatorGetProjects, getProjects);
/**
 * @swagger
 * /api/project/{id}:
 *      get:
 *          tags:
 *              - Proyecto
 *          summary: Busca un proyecto con id {id}
 *          parameters:
 *            - in: path
 *              name: id
 *              required: true
 *              schema:
 *                  type: string
 *              description: ID de MongoDB
 *          responses:
 *              200:
 *                  description: Proyecto con id {id}
 *              500:
 *                  description: Error al buscar proyecto
 * 
 *      patch:
 *          tags:
 *              - Proyecto
 *          summary: Edita datos del proyecto
 *          parameters:
 *            - in: path
 *              name: id
 *              required: true
 *              schema:
 *                  type: string
 *              description: ID de MongoDB
 *          requestBody: 
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          parameters:
 *                              name:
 *                                  type: string
 *                                  example: Proyecto Remodelación
 *                              email:
 *                                  type: string
 *                                  example: nuevo.email@ejemplo.com
 *                              address:
 *                                  type: object
 *                                  properties:
 *                                      street:
 *                                          type: string
 *                                      number:
 *                                          type: number
 *                                      postal:
 *                                          type: number
 *                                      city:
 *                                          type: string
 *                                      province:
 *                                          type: string
 *          responses:
 *              200:
 *                  description: Proyecto editado correctamente
 *              404:
 *                  description: Proyecto no encontrado
 *              500:
 *                  description: Error al editar proyecto
 *      delete:
 *          tags:
 *              - Proyecto
 *          summary: Borra el proyecto con id {id}
 *          parameters:
 *            - in: path
 *              name: id
 *              required: true
 *              schema:
 *                  type: string
 *              description: ID de MongoDB
 *            - in: query
 *              name: soft
 *              required: false
 *              schema:
 *                  type: boolean
 *                  default: true
 *              description: Si es false, realiza hard delete. Por omisión (true), marca el registro como eliminado (soft delete).
 *          responses:
 *              200:
 *                  description: Proyecto borrado correctamente
 *              404:
 *                  description: Proyecto no encontrado
 *              500:
 *                  description: Error al editar proyecto
 */
router.get("/:id", authMiddleware, validatorGetProject, getProject);
router.patch("/:id", authMiddleware, validatorUpdateProject, updateProject);
router.delete("/:id", authMiddleware, validatorGetProject, deleteProject);
/**
 * @swagger
 * /api/project/deleted:
 *      delete:
 *          tags:
 *              - Proyecto
 *          summary: Busca los proyectos borrados (soft)
 *          responses:
 *              200:
 *                  description: Proyectos borrados asociados al usuario
 *              500:
 *                  description: Error al buscar proyectos borrados
 */
router.get("/deleted", authMiddleware, getDeletedProjects);
/**
 * @swagger
 * /api/project/restore/{id}:
 *      patch:
 *          tags:
 *              - Proyecto
 *          summary: Restaura el proyecto borrado con id {id}
 *          parameters:
 *            - in: path
 *              name: id
 *              required: true
 *              schema:
 *                  type: string
 *              description: ID de MongoDB
 *          responses:
 *              200:
 *                  description: Proyecto restaurado correctamente
 *              404:
 *                  description: Proyecto no encontrado o no borrado
 *              500:
 *                  description: Error al restaurar proyecto
 */
router.patch("/restore/:id", authMiddleware, validatorRestoreProject, restoreProject);

module.exports = router;