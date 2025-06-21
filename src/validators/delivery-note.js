const { check } = require("express-validator");
const { validateResults } = require("../utils/handleValidator");

const validatorCreateDeliveryNote = [
    check("name").optional().isString(),

    check("date").exists().notEmpty().isISO8601(),

    check("company.name").optional().isString(),
    check("company.cif").optional().isString(),
    check("company.address.street").optional().isString(),
    check("company.address.number").optional().isNumeric(),
    check("company.address.postal").optional().isNumeric(),
    check("company.address.city").optional().isString(),
    check("company.address.province").optional().isString(),

    check("address.street").optional().isString(),
    check("address.number").optional().isNumeric(),
    check("address.postal").optional().isNumeric(),
    check("address.city").optional().isString(),
    check("address.province").optional().isString(),

    check("project").exists().notEmpty().isMongoId(),

    check("client.name").optional().isString(),
    check("client.address.street").optional().isString(),
    check("client.address.number").optional().isNumeric(),
    check("client.address.postal").optional().isNumeric(),
    check("client.address.city").optional().isString(),
    check("client.address.province").optional().isString(),
    check("client.cif").optional().isString(),

    check("clientId").exists().notEmpty().isMongoId(),

    check("description").optional().isString(),
    check("format").optional().isString(),
    check("hours").optional().isNumeric(),
    check("workers").optional().isArray(),
    check("photo").optional().isString(),

    (req, res, next) => validateResults(req, res, next),
];

const validatorGetDeliveryNotes = [
    check("project").optional().isMongoId().withMessage("Invalid project ID"),
    check("clientId").optional().isMongoId().withMessage("Invalid client ID"),
    (req, res, next) => validateResults(req, res, next),
];

module.exports = { validatorCreateDeliveryNote, validatorGetDeliveryNotes };