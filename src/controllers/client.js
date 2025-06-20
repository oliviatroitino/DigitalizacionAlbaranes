require('dotenv').config();
const ClientModel = require('../models/nosql/client');
const { handleHttpError } = require('../utils/handleError.js');
const { matchedData } = require('express-validator');

const createClient = async (req, res) => {
    try {
        const user = req.user;
        if (!user) throw new Error("ERROR_USER_NOT_FOUND");
        if (user.deleted) throw new Error("ERROR_USER_DELETED");
        const body = matchedData(req);
        const result = await ClientModel.create({...body, userId: user._id});
        res.send({result, message: "Cliente creado correctamente."});
    } catch (error) {
        console.error(`ERROR in createClient: ${error}`);
        handleHttpError(res, 'ERROR_CREATE_CLIENT', 403);
    }
};

const getClients = async (req, res) => {
    try {
        const user = req.user;
        const result = await ClientModel.find({userId: user.id, deleted: false})
        res.send(result);
    } catch (error) {
        console.error(`ERROR in getClients: ${error}`);
        handleHttpError(res, 'ERROR_GET_CLIENTS', 403);
    }
}

const getClientById = async (req, res) => {
    try {
        const {id} = matchedData(req);
        const userId = req.user._id;

        const client = await ClientModel.findOne({
            _id: id,
            userId: userId,
            deleted: false
        });

        if(!client){
            return handleHttpError(res, "CLIENT_NOT_FOUND", 404);
        }

        res.send(client);
    } catch (error) {
        console.error(`ERROR in getClient: ${error}`);
        handleHttpError(res, 'ERROR_GET_CLIENTS', 403);
    }
}

module.exports = { createClient, getClients, getClientById };