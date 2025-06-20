const ProjectModel = require("../models/nosql/project");
const ClientModel = require("../models/nosql/client");
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

        const newProject = await ProjectModel.create({...body, userId: user._id});

        res.send({ data: newProject, message: "Project created correctly."});
    } catch (error) {
        console.error("ERROR_CREATE_PROJECT:", error);
        handleHttpError(res, "ERROR_CREATE_PROJECT", 500);
    }
};

const getProjects = async (req, res) => {
    try {
        const user = req.user;
        const { client } = req.query;

        // console.log("Tipo de user._id:", typeof user._id);
        // console.log("user._id:", user._id);

        const filter = { userId: user._id };

        if (client) {
            filter.clientId = client;
        }

        const projects = await ProjectModel.find(filter);

        res.send(projects);
    } catch(error) {
        console.error("ERROR_GET_PROJECTS:", error);
        handleHttpError(res, "ERROR_GET_PROJECTS", 500);
    }
}

module.exports = { createProject, getProjects };