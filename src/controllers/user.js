const { matchedData } = require("express-validator");
const { encrypt } = require("../utils/handlePassword");
const UserModel = require("../models/nosql/user");
const { handleHttpError } = require("../utils/handleError");

const registerUser = async (req, res) => {
    try {
        const body = matchedData(req);
        const password = await encrypt(body.password);
        const emailCode = Math.floor(100000 + Math.random() * 900000).toString();

        const userToCreate = {
            ...body, // copiar todo del body
            password, // sobreescribir con version encriptada
            emailCode // nuevo campo
        };

        const newUser = await UserModel.create(userToCreate);
        newUser.set("password", undefined, {strict: false});
        newUser.set("emailCode", undefined, {strict: false});

        res.send({ user: newUser });
    } catch (err) {
        console.log(err);
        handleHttpError(res, "ERROR_REGISTER_USER", 500);
    }
}

module.exports = { registerUser };