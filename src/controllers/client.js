require('dotenv').config();
const { ClientModel } = require('../models/nosql/client');
const { handleHttpError } = require('../utils/handleError.js');
const { matchedData } = require('express-validator');

const createClient = async (req, res) => {
    try {
        const user = req.user;
        if (!user) return handleHttpError(res, "ERROR_USER_NOT_FOUND", 404);
        if (user.deleted) return handleHttpError(res, "ERROR_USER_DELETED", 403);
        const body = matchedData(req);
        const result = await ClientModel.create({...body, userId: user._id});
        res.send({result, message: "Cliente creado correctamente."});
    } catch (error) {
        console.error(`ERROR_CREATE_CLIENT: ${error}`);
        handleHttpError(res, 'ERROR_CREATE_CLIENT', 403);
    }
};

const getClients = async (req, res) => {
    try {
        const user = req.user;
        const result = await ClientModel.find({userId: user.id, deleted: false})
        res.send(result);
    } catch (error) {
        console.error(`ERROR_GET_CLIENTS: ${error}`);
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
        console.error(`ERROR_GET_CLIENTS: ${error}`);
        handleHttpError(res, 'ERROR_GET_CLIENTS', 500);
    }
}

const updateClient = async (req, res) => {
    try {
        const body = matchedData(req, { locations: ['body'] });
        const id = req.params.id;
        const userId = req.user._id;

        const updatedClient = await ClientModel.findOneAndUpdate({
            _id: id,
            userId: userId,
            deleted: false
        }, body, {new: true}
        );

        if (!updatedClient) {
            return handleHttpError(res, 'ERROR_CLIENT_NOT_FOUND', 404);
        }

        res.send({ data: updatedClient, message: "Cliente actualizado correctamente." });
    } catch (error) {
        console.error(`ERROR_UPDATE_CLIENT: ${error}`);
        handleHttpError(res, 'ERROR_UPDATE_CLIENT', 403);
    }
};

const deleteClient = async (req, res) => {
    try {
        const { id } = matchedData(req);
        const soft = req.query.soft !== "false";

        const client = await ClientModel.findById(id);

        if(!client){
            handleHttpError(res, 'ERROR_CLIENT_NOT_FOUND', 404);
        }

        if (soft) {
            client.deleted = true;
            await client.save();
            return res.send({ message: "Cliente eliminado correctamente (soft delete)." });
        } else {
            await ClientModel.findByIdAndDelete(id);
            return res.send({ message: "Cliente eliminado permanentemente (hard delete)." });
        }

    } catch (error) {
        console.error(`ERROR_DELETE_CLIENT: ${error}`);
        handleHttpError(res, 'ERROR_DELETE_CLIENT', 403);
    }
}

const getDeletedClients = async (req, res) => {
    try {
        const user = req.user;

        const deletedClients = await ClientModel.find({
            userId: user._id,
            deleted: true
        });

        res.send(deletedClients);
    } catch (error) {
        console.error(`ERROR_GET_DELETED_CLIENTS: ${error}`);
        handleHttpError(res, "ERROR_GET_DELETED_CLIENTS", 500);
    }
};

const restoreClient = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;

        const client = await ClientModel.findOne({
            _id: id,
            userId: user._id,
            deleted: true
        });

        if (!client) {
            return handleHttpError(res, "CLIENT_NOT_FOUND_OR_NOT_DELETED", 404);
        }

        client.deleted = false;
        await client.save();

        res.send({ message: "Cliente restaurado correctamente.", client });
    } catch (error) {
        console.error(`ERROR_RESTORE_CLIENT: ${error}`);
        handleHttpError(res, "ERROR_RESTORE_CLIENT", 500);
    }
};


module.exports = { createClient, getClients, getClientById, updateClient, deleteClient, getDeletedClients, restoreClient };