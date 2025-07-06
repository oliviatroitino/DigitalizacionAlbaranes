const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/session");
//// Validador
const { validatorCreateClient, validatorGetId, validatorUpdateClient, validatorRestoreClient } = require("../validators/client.js");
//// Controller
const { createClient, getClients, getClientById, updateClient, deleteClient, getDeletedClients, restoreClient } = require("../controllers/client.js");

/**
 * @swagger
 * /api/client/:
 *      post:
 *          tags: 
 *              - Cliente
 *          summary: Crea un cliente asociado a un usuario
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                              cif:
 *                                  type: string
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
 *                  description: Cliente creado correctamente
 *              404:
 *                  description: Usuario no encontrado
 *              403:
 *                  description: Usuario borrado (soft)
 *              500:
 *                  description: Error al crear cliente
 *      get:
 *          tags:
 *              - Cliente
 *          summary: Devuelve todos los clientes asociados al usuario
 *          responses: 
 *              200:
 *                  description: Clientes asociados al usuario
 *              500:
 *                  description: Error al buscar clientes
 */
router.post("/", authMiddleware, validatorCreateClient, createClient);
router.get("/", authMiddleware, getClients);
/**
 * @swagger
 * /api/client/deleted:
 *      get:
 *          tags:
 *              - Cliente
 *          summary: Devuelve los clientes borrados
 *          responses: 
 *              200:
 *                  description: Clientes borrados asociados al usuario
 *              500:
 *                  description: Error al buscar clientes borrados       
 */
router.get("/deleted", authMiddleware, getDeletedClients);
/**
 * @swagger
 * /api/client/{id}:
 *      get:
 *          tags:
 *              - Cliente
 *          summary: Devuelve el cliente con id {id}
 *          parameters:
 *            - in: path
 *              name: id
 *              required: true
 *              schema:
 *                  type: string
 *              description: ID de MongoDB
 *          responses:
 *              200:
 *                  description: Cliente con id {id}
 *              404:
 *                  description: Cliente no encontrado
 *              500:
 *                  description: Error al buscar cliente
 *      patch:
 *          tags:
 *              - Cliente
 *          summary: Cambia datos del cliente con id {id}
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
 *                              userId:
 *                                  type: string
 *                                  example: MongodbId
 *                              name:
 *                                  type: string
 *                              cif:
 *                                  type: string
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
 *                  description: Datos de cliente cambiados correctamente
 *              404:
 *                  description: Cliente no encontrado
 *              500:
 *                  description: Error al cambiar datos cliente
 *      delete:
 *          tags:
 *              - Cliente
 *          summary: Borra cliente
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
 *                  description: Cliente borrado correctamente
 *              404:
 *                  description: Cliente no encontrado
 *              500:
 *                  description: Error al borrar cliente
 */
router.get("/:id", authMiddleware, validatorGetId, getClientById);
router.patch("/:id", authMiddleware, validatorUpdateClient, updateClient);
router.delete("/:id", authMiddleware, validatorGetId, deleteClient);
/**
 * @swagger
 * /api/client/restore/{id}:
 *      patch:
 *          tags:
 *              - Cliente
 *          summary: Restaura clientes eliminados (soft)
 *          parameters:
 *            - in: path
 *              name: id
 *              required: true
 *              schema:
 *                  type: string
 *              description: ID de MongoDB
 *          responses:
 *              200:
 *                  description: Cliente restaurado correctamente
 *              404:
 *                  description: Cliente no encontrado o no borrado
 *              500:
 *                  description: Error al restaurar cliente
 */
router.patch("/restore/:id", authMiddleware, validatorRestoreClient, restoreClient);

module.exports = router;
