const { check } = require('express-validator');
const { validateResults } = require("../src/utils/handleValidator");

const validatorRegisterUser = [
    check("name").exists().notEmpty(),
    check("email").exists().notEmpty().isEmail(),
    check("password").exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next);
    }
];

module.exports = { validatorRegisterUser }