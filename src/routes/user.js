const express = require("express");
const router = express.Router();
//// Validador
const { validatorRegisterUser, validatorLogin, validatorUserData, validatorCompanyData } = require("../validators/user");
const { validatorEmailCode } = require("../validators/email");
//// Controller
const { registerUser, verifyEmail, loginUser, updateUser, updateCompany } = require("../controllers/user");
const authMiddleware = require("../middleware/session.js");

/**
 * @swagger
 * /api/user/register:
 *      post:
 *          tags: 
 *              - Usuario
 *          summary: Registra al usuario con su email y password
 *          requestBody:
 *               required: true
 *               content:
 *                   application/json:
 *                       schema:
 *                           type: object
 *                           properties:
 *                               name:
 *                                   type: string 
 *                                   example: Ricardo
 *                               email:
 *                                   type: string
 *                                   example: dodepax275@kimdyn.com
 *                               password:
 *                                   type: string
 *                                   example: HolaMundo123
 *          responses:
 *              200:
 *                  description: Usuario registrado correctamente
 *              409:
 *                  description: Usuario ya existente
 *              500:
 *                  description: Error
 */
router.post("/register", validatorRegisterUser, registerUser);
/**
 * @swagger
 * /api/user/validation:
 *      put:
 *          tags: 
 *              - Usuario
 *          summary: Valida al usuario con el código enviado a su email
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                                  example: dodepax275@kimdyn.com
 *                              emailCode:
 *                                  type: number
 *                                  example: 123456
 *          responses:
 *              200: 
 *                  description: Usuario validado correctamente
 *              404:
 *                  description: Usuario no encontrado
 *              401:
 *                  description: Código incorrecto
 *              500:
 *                  description: Error
 */
router.put("/validation", validatorEmailCode, verifyEmail);
/**
 * @swagger
 * /api/user/login:
 *      post:
 *          tags: 
 *              - Usuario
 *          summary: Entra al usuario en sesión
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                                  example: dodepax275@kimdyn.com
 *                              password:
 *                                  type: string
 *                                  example: HolaMundo123
 *          responses:
 *              200: 
 *                  description: Usuario logged in correctamente
 *              404:
 *                  description: Usuario no encontrado
 *              401:
 *                  description: Usuario no validado o contraseña incorrecta
 *              500:
 *                  description: Error
 */
router.post("/login", validatorLogin, loginUser);
/**
 * @swagger
 * /api/user/:
 *      patch:
 *          tags: 
 *              - Usuario
 *          summary: Edita o agrega datos del usuario
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                              surnames:
 *                                  type: string
 *                              nif:
 *                                  type: string
 *          responses:
 *              200: 
 *                  description: Usuario editado correctamente
 *              500:
 *                  description: Error
 */
router.patch("/", authMiddleware, validatorUserData, updateUser);
/**
 * @swagger
 * /api/user/company:
 *      patch:
 *          tags: 
 *              - Usuario
 *          summary: Edita o agrega datos de la compañía del usuario
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
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
 *          responses:
 *              200:
 *                  description: Datos de company editados correctamente                   
 */
router.patch("/company", authMiddleware,  validatorCompanyData, updateCompany);

module.exports = router;