const ProjectModel = require("../models/nosql/project");
const { matchedData } = require("express-validator");
const { handleHttpError } = require("../utils/handleError");
const { tokenSign } = require("../utils/handleJwt");

const createProject = async (req, res) => {
    try {
        const body = matchedData(req);
        const user = req.user;

        const client = await ClientModel.findOne({
            _id: body.clientId,
            userId: user._id,
            deleted: false
        }); 

        if (!client) {
            return handleHttpError(res, "CLIENT_NOT_FOUND", 404);
        }

        const newProject = await ProjectModel.create(body);

        res.send({ data: newProject, message: "Project created correctly."});
    } catch (error) {
        console.error("ERROR_CREATE_PROJECT:", error);
        handleHttpError(res, "ERROR_CREATE_PROJECT", 500);
    }
};

module.exports = { createProject };