const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/session");
const { uploadMiddlewareMemory } = require("../utils/handleStorage");
//// Validador
const { validatorCreateDeliveryNote, validatorGetDeliveryNotes, validatorGetDeliveryNoteById, validatorUpdateDeliveryNote, validatorDeleteDeliveryNote } = require("../validators/delivery-note");
//// Controller
const { createDeliveryNote, getDeliveryNotes, getDeliveryNoteById, updateDeliveryNote, deleteDeliveryNote, downloadDeliveryNotePDF, signDeliveryNote } = require("../controllers/delivery-note");

/**
 * @swagger
 * /api/deliverynote:
 *      post:
 *          tags:
 *              - Albarán
 *          summary: Crea un albarán asociado a un proyecto y cliente
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                              date:
 *                                  type: string
 *                              company:
 *                                  type: object
 *                                  properties:
 *                                      name:
 *                                          type: string
 *                                      cif:
 *                                          type: string
 *                                      address:
 *                                          type: object
 *                                          properties:
 *                                              street:
 *                                                  type: string
 *                                              number:
 *                                                  type: number
 *                                              postal:
 *                                                  type: number
 *                                              city:
 *                                                  type: string
 *                                              province:
 *                                                  type: string
 *                              address:
 *                                          type: object
 *                                          properties:
 *                                              street:
 *                                                  type: string
 *                                              number:
 *                                                  type: number
 *                                              postal:
 *                                                  type: number
 *                                              city:
 *                                                  type: string
 *                                              province:
 *                                                  type: string
 *                              project:
 *                                  type: string
 *                              clientId:
 *                                  type: string
 *                              description:
 *                                  type: string
 *                              format:
 *                                  type: string
 *                              hours:
 *                                  type: number
 *                              workers:
 *                                  type: string
 *                              photo:
 *                                  type: string   
 *          responses:
 *              200:
 *                  description: Albarán creado correctamente
 *              404:
 *                  description: Proyecto o cliente no encontrado 
 *              500:
 *                  description: Error al crear albarán
 *      get:
 *          tags:
 *              - Albarán
 *          summary: Busca todos los albaranes asociados a un proyecto
 *          responses:
 *              200:
 *                  description: Albaranes asociados al proyecto
 *              500:
 *                  description: Error al buscar albaranes
 */     
router.post("/", authMiddleware, validatorCreateDeliveryNote, createDeliveryNote);
router.get("/", authMiddleware, validatorGetDeliveryNotes, getDeliveryNotes);
/**
 * @swagger
 * /api/deliverynote/{id}:
 *      get:
 *          tags:
 *              - Albarán
 *          summary: Busca un albarán de id {id}
 *          parameters:
 *            - in: path
 *              name: id
 *              required: true
 *              schema:
 *                  type: string
 *              description: ID de MongoDB
 *          responses:
 *              200:
 *                  description: Albaran de id {id}
 *              404:
 *                  description: Albarán no encontrado
 *              500:
 *                  description: Error al buscar albarán
 */
router.get("/:id", authMiddleware, validatorGetDeliveryNoteById, getDeliveryNoteById);
/**
 * @swagger
 * /api/deliverynote/{id}/pdf:
 *      get:
 *          tags:
 *              - Albarán
 *          summary: Descarga el PDF de un albarán
 *          parameters:
 *            - in: path
 *              name: id
 *              required: true
 *              schema:
 *                  type: string
 *              description: ID de MongoDB
 *          responses:
 *              200:
 *                  description: Pdf descargado correctamente
 *              404:
 *                  description: Albarán o cliente no encontrado
 *              403:
 *                  description: Acceso denegado (cliente no pertenece a usuario)
 *              500:
 *                  description: Error al buscar albarán
 */
router.get("/:id/pdf", authMiddleware, downloadDeliveryNotePDF);
/**
 * @swagger
 * /api/deliverynote/{id}:
 *      patch:
 *          tags:
 *              - Albarán
 *          summary: Cambia los datos de un albarán de id {id}
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
 *                              description:
 *                                  type: string
 *                              hours:
 *                                  type: number
 *                              workers:
 *                                  type: string
 *                              photo:
 *                                  type: string
 *          responses:
 *              200:
 *                  description: Albaran de id {id} editado correctamente
 *              404:
 *                  description: Albarán no encontrado
 *              500:
 *                  description: Error al cambiar albarán
 */
router.patch("/:id", authMiddleware, validatorUpdateDeliveryNote, updateDeliveryNote);
/**
 * @swagger
 * /api/deliverynote/{id}:
 *      delete:
 *          tags:
 *              - Albarán
 *          summary: Borra un albarán de id {id}
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
 *                  description: Albaran borrado correctamente
 *              404:
 *                  description: Albarán no encontrado
 *              500:
 *                  description: Error al borrar albarán
 */
router.delete("/:id", authMiddleware, validatorDeleteDeliveryNote, deleteDeliveryNote)
/**
 * @swagger
 * /api/deliverynote/{id}/signature:
 *      post:
 *          tags:
 *              - Albarán
 *          summary: Firma el albarán
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
 *                  multipart/form-data:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              signature:
 *                                  type: string
 *                              required:
 *                                  - signature
 *          security:
 *              - bearerAuth: []
 *          responses:
 *              200:
 *                  description: Firma subida correctamente
 *              400:
 *                  description: Firma no proporcionado
 *              404:
 *                  description: Albarán no encontrado
 *              500:
 *                  description: Error al subir firma
 */
router.post("/:id/signature", authMiddleware, uploadMiddlewareMemory.single('signature'), signDeliveryNote);

module.exports = router;
