const { check } = require("express-validator");
const { validateResults } = require("../utils/handleValidator");

const validatorCreateProject = [
    check("name").exists().notEmpty().isString(),
    check("projectCode").exists().notEmpty().isString(),
    check("email").exists().notEmpty().isEmail(),
    check("code").exists().notEmpty().isString(),

    check("address").exists(),
    check("address.street").exists().notEmpty().isString(),
    check("address.number").exists().notEmpty().isNumeric(),
    check("address.postal").exists().notEmpty().isNumeric(),
    check("address.city").exists().notEmpty().isString(),
    check("address.province").exists().notEmpty().isString(),

    check("clientId").exists().notEmpty().isMongoId(),

    (req, res, next) => {
      return validateResults(req, res, next);
    }
];

const validatorGetProjects = [
    check("client")
      .optional()
      .isMongoId()
      .withMessage("Client ID must be a valid Mongo ID"),
    (req, res, next) => validateResults(req, res, next),
];

const validatorGetProject = [
    check("id")
      .exists().withMessage("ID is required")
      .notEmpty().withMessage("ID cannot be empty")
      .isMongoId().withMessage("ID must be a valid Mongo ID"),
    (req, res, next) => {
      return validateResults(req, res, next);
    }
];

const validatorUpdateProject = [
    check("name").optional().isString(),
    check("projectCode").optional().isString(),
    check("email").optional().isEmail(),
    check("code").optional().isString(),

    check("address").optional(),
    check("address.street").optional().isString(),
    check("address.number").optional().isNumeric(),
    check("address.postal").optional().isNumeric(),
    check("address.city").optional().isString(),
    check("address.province").optional().isString(),

    check("clientId").optional().isMongoId(),

    (req, res, next) => validateResults(req, res, next)
];

const validatorRestoreProject = [
  check("id")
    .exists().withMessage("ID es obligatorio")
    .notEmpty().withMessage("ID no puede estar vacío")
    .isMongoId().withMessage("ID debe ser un Mongo ID válido"),
  (req, res, next) => validateResults(req, res, next),
];



module.exports = { 
  validatorCreateProject, 
  validatorGetProject, 
  validatorGetProjects, 
  validatorUpdateProject,
  validatorRestoreProject
};
