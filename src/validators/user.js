const { check } = require('express-validator');
const { validateResults } = require("../utils/handleValidator");

const validatorRegisterUser = [
    check("name").exists().notEmpty(),
    check("email").exists().notEmpty().isEmail(),
    check("password").exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next);
    }
];

const validatorLogin = [
  check("email").exists().notEmpty().isEmail(),
  check("password").exists().notEmpty(),
  (req, res, next) => validateResults(req, res, next)
];

const validatorUserData = [
  check("name").exists().notEmpty(),
  check("surnames").exists().notEmpty(),
  check("nif").exists().notEmpty(),
  check("address.street").exists().notEmpty(),
  check("address.number").exists().notEmpty().isNumeric(),
  check("address.postal").exists().notEmpty().isNumeric(),
  check("address.city").exists().notEmpty(),
  check("address.province").exists().notEmpty(),
  (req, res, next) => validateResults(req, res, next)
];

module.exports = { validatorRegisterUser, validatorLogin, validatorUserData }