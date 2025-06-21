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

        console.log("Datos validados:", data);

        // buscar project

        const projectId = new mongoose.Types.ObjectId(data.project);

        console.log("Buscando proyecto con:", {
            _id: projectId,
            deleted: false
        });

         
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
}

module.exports = { createDeliveryNote };