const ProjectModel = require("../models/nosql/project");
const ClientModel = require("../models/nosql/client");
const { matchedData, body } = require("express-validator");
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

        const filter = { userId: user._id }; // TODO deberian ser los no deleted pero no sale

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

const getProject = async (req, res) => {
    try {
        const { id } = matchedData(req);

        const project = await ProjectModel.findOne({_id: id});
        
        res.send(project);
    } catch(error) {
        console.error("ERROR_GET_PROJECT:", error);
        handleHttpError(res, "ERROR_GET_PROJECT", 500);
    }
}

const updateProject = async (req, res) => {
    try {
        const body = matchedData(req, { locations: ['body'] });
        const id = req.params.id;
        const updatedProject = await ProjectModel.findOneAndUpdate({_id: id}, body);

        if (!updatedProject) {
            return handleHttpError(res, 'ERROR_PROJECT_NOT_FOUND', 404);
        }

        res.send({ data: updatedProject, message: "Proyecto actualizado correctamente." });
    } catch( error ){
        console.error("ERROR_UPDATE_PROJECT:", error);
        handleHttpError(res, "ERROR_UPDATE_PROJECT", 500);
    }
}

const deleteProject = async (req, res) => {
    try {
        const { id } = matchedData(req);
        const soft = req.query.soft !== "false";

        const project = await ProjectModel.findById(id);

        if(!project){
            handleHttpError(res, 'ERROR_PROJECT_NOT_FOUND', 404);
        }

        if (soft) {
            project.deleted = true;
            await project.save();
            return res.send({ message: "Proyecto eliminado correctamente (soft delete)." });
        } else {
            await ProjectModel.findByIdAndDelete(id);
            return res.send({ message: "Proyecto eliminado permanentemente (hard delete)." });
        }
    } catch (error) {
        console.error(`ERROR_DELETE_PROJECT: ${error}`);
        handleHttpError(res, 'ERROR_DELETE_PROJECT', 403);
    }
}

module.exports = { createProject, getProjects, getProject, updateProject, deleteProject };