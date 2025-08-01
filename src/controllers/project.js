const ProjectModel = require("../models/nosql/project");
const {ClientModel} = require("../models/nosql/client");
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

        res.send({ data: newProject, message: "Proyecto creado correctamente."});
    } catch (error) {
        console.error(`ERROR_CREATE_PROJECT: ${error}`);
        handleHttpError(res, "ERROR_CREATE_PROJECT", 500);
    }
};

const getProjects = async (req, res) => {
    try {
        const user = req.user;
        const { client } = req.query;

        const filter = { userId: user._id }; // deberian ser los no deleted pero no me funciona

        if (client) {
            filter.clientId = client;
        }

        const projects = await ProjectModel.find(filter);

        res.send(projects);
    } catch(error) {
        console.error(`ERROR_GET_PROJECTS: ${error}`);
        handleHttpError(res, "ERROR_GET_PROJECTS", 500);
    }
}

const getProject = async (req, res) => {
    try {
        const { id } = matchedData(req);

        const project = await ProjectModel.findOne({_id: id});
        
        res.send(project);
    } catch(error) {
        console.error(`ERROR_GET_PROJECT: ${error}`);
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
        console.error(`ERROR_UPDATE_PROJECT: ${error}`);
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

const getDeletedProjects = async (req, res) => {
    try {
        const user = req.user;

        const deletedProjects = await ProjectModel.find({
            userId: user._id,
            deleted: true
        });

        res.send(deletedProjects);
    } catch (error) {
        console.error(`ERROR_GET_DELETED_PROJECTS: ${error}`);
        handleHttpError(res, "ERROR_GET_DELETED_PROJECTS", 500);
    }
};

const restoreProject = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;

        const project = await ProjectModel.findOne({
            _id: id,
            userId: user._id,
            deleted: true
        });

        if (!project) {
            return handleHttpError(res, "PROJECT_NOT_FOUND_OR_NOT_DELETED", 404);
        }

        project.deleted = false;
        await project.save();

        res.send({ message: "Proyecto restaurado correctamente.", project });
    } catch (error) {
        console.error(`ERROR_RESTORE_PROJECT: ${error}`);
        handleHttpError(res, "ERROR_RESTORE_PROJECT", 500);
    }
};

module.exports = { createProject, getProjects, getProject, updateProject, deleteProject, getDeletedProjects, restoreProject };