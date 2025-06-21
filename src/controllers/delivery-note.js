require('dotenv').config();
const mongoose = require('mongoose');
const { ClientModel } = require('../models/nosql/client.js');
const DeliveryNoteModel = require('../models/nosql/delivery-note');
const ProjectModel = require('../models/nosql/project.js');
const { handleHttpError } = require('../utils/handleError.js');
const { matchedData } = require('express-validator');

const createDeliveryNote = async (req, res) => {
    try {
        const user = req.user;
        const data = matchedData(req);

        // buscar project

        const projectId = new mongoose.Types.ObjectId(data.project);

        // console.log("Buscando proyecto con:", {
        //     _id: projectId,
        //     deleted: false
        // });

        const project = await ProjectModel.findOne({
            _id: data.project,
            deleted: false
        });

        if(!project){
            return handleHttpError(res, "PROJECT_NOT_FOUND", 404);
        }

        // buscar cliente

        // console.log("Buscando cliente con:", {
        //     _id: data.clientId,
        //     userId: user._id,
        //     deleted: false
        // });

        const client = await ClientModel.findOne({
            _id: project.clientId,
            userId: user._id,
            deleted: false
        });

        if (!client) {
            return handleHttpError(res, "CLIENT_NOT_FOUND", 404);
        }

        // crear albaran
        const newDeliveryNote = await DeliveryNoteModel.create({
            ...data,
            client,
            project: data.project
        });

        res.send({message: "Albaran creado correctamente.", data: newDeliveryNote});
    } catch (error) {
        console.error("ERROR_CREATE_DELIVERYNOTE: ", error);
        handleHttpError(res, "ERROR_CREATE_DELIVERYNOTE", 500);
    }
};

const getDeliveryNotes = async (req, res) => {
    try {
        const user = req.user;
        const { project, clientId } = req.query;

        const filter = { deleted: false };

        if (project) {
            filter.project = project;
        }

        if (clientId) {
            filter.clientId = clientId;
        }

        const deliveryNotes = await DeliveryNoteModel.find(filter);

        res.send(deliveryNotes);
    } catch (error) {
        console.error("ERROR_GET_DELIVERYNOTES:", error);
        handleHttpError(res, "ERROR_GET_DELIVERYNOTES", 500);
    }
};

const getDeliveryNoteById = async (req, res) => {
    try {
        const { id } = req.params;

        const deliveryNote = await DeliveryNoteModel.findOne({
            _id: id,
            deleted: false
        });

        if (!deliveryNote) {
            return handleHttpError(res, "DELIVERYNOTE_NOT_FOUND", 404);
        }

        res.send(deliveryNote);
    } catch (error) {
        console.error("ERROR_GET_DELIVERYNOTE_BY_ID:", error);
        handleHttpError(res, "ERROR_GET_DELIVERYNOTE_BY_ID", 500);
    }
};

const updateDeliveryNote = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const deliveryNote = await DeliveryNoteModel.findOne({ _id: id, deleted: false });

        if (!deliveryNote) {
            return handleHttpError(res, "DELIVERYNOTE_NOT_FOUND", 404);
        }

        Object.assign(deliveryNote, data);

        await deliveryNote.save();

        res.send({ message: "Albarán actualizado correctamente.", data: deliveryNote });
    } catch (error) {
        console.error("ERROR_UPDATE_DELIVERYNOTE:", error);
        handleHttpError(res, "ERROR_UPDATE_DELIVERYNOTE", 500);
    }
};

const deleteDeliveryNote = async (req, res) => {
    try {
        const { id } = req.params;
        const soft = req.query.soft !== "false";

        const deliveryNote = await DeliveryNoteModel.findOne({ _id: id });

        if (!deliveryNote) {
            return handleHttpError(res, "DELIVERYNOTE_NOT_FOUND", 404);
        }

        if (soft) {
            deliveryNote.deleted = true;
            await deliveryNote.save();
            return res.send({ message: "Albarán eliminado correctamente (soft delete)." });
        } else {
            await DeliveryNoteModel.findByIdAndDelete(id);
            return res.send({ message: "Albarán eliminado permanentemente (hard delete)." });
        }
    } catch (error) {
        console.error("ERROR_DELETE_DELIVERYNOTE:", error);
        handleHttpError(res, "ERROR_DELETE_DELIVERYNOTE", 500);
    }
};

module.exports = { createDeliveryNote, getDeliveryNotes, getDeliveryNoteById, updateDeliveryNote, deleteDeliveryNote };