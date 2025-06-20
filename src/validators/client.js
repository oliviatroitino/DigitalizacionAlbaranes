const { check } = require("express-validator");
const { validateResults } = require("../utils/handleValidator");

const validatorCreateClient = [
  check("name").exists().notEmpty(),
  check("cif").exists().notEmpty(),
  check("address.street").exists().notEmpty(),
  check("address.number").exists().notEmpty().isNumeric(),
  check("address.postal").exists().notEmpty().isNumeric(),
  check("address.city").exists().notEmpty(),
  check("address.province").exists().notEmpty(),
  (req, res, next) => validateResults(req, res, next)
];

const validatorGetId = [
    check("id").exists().notEmpty().isMongoId(),
    (req, res, next) => {
        return validateResults(req, res, next);
    }
];

const validatorUpdateClient = [
    check("name").exists().notEmpty().isString(),
    check("cif")
        .exists()
        .notEmpty()
        .isString()
        .matches(/^[A-Z][0-9]{8}$/),
    check("address").exists().notEmpty(),
    check("address.street").exists().notEmpty().isString(),
    check("address.number").exists().notEmpty().isNumeric(),
    check("address.postal").exists().notEmpty().isNumeric(),
    check("address.city").exists().notEmpty().isString(),
    check("address.province").exists().notEmpty().isString(),
    (req, res, next) => {
        return validateResults(req, res, next);
    }
];

module.exports = { validatorCreateClient, validatorGetId, validatorUpdateClient };
