const { matchedData } = require("express-validator");
const { encrypt, compare } = require("../utils/handlePassword");
const { UserModel } = require("../models/nosql/user");
const { handleHttpError } = require("../utils/handleError");
const { tokenSign } = require("../utils/handleJwt.js");
const { sendEmail, generateEmailCode } = require("../utils/handleEmail.js");

const registerUser = async (req, res) => {
    try {
        const body = matchedData(req);
        const hashedPassword = await encrypt(body.password);

        // ver si ya existe el usuario
        const existingUser = await UserModel.findOne({ email: body.email });

        if (existingUser) {
            // ya existe el email y está validado
            return handleHttpError(res, 'ERROR_USER_EXISTS', 409);
        }

        body.status = false;
        body.emailCode = generateEmailCode();
        console.log(body.emailCode)
        body.password = hashedPassword;
        body.intentos = 0;
        body.role = "user";

        const newUser = await UserModel.create(body);

        await sendEmail({
            to: newUser.email,
            subject: "Código de validación",
            html: `<p>Su código es <b>${newUser.emailCode}</b></p>`,
            from: process.env.EMAIL
        });

        const token = await tokenSign(newUser);
        
        newUser.set("password", undefined, {strict: false});
        // newUser.set("emailCode", undefined, {strict: false});

        res.send({ user: newUser , token, message: "Usuario registrado, revisar email."});
    } catch (error) {
        console.log(`ERROR_REGISTER_USER: ${error}`);
        handleHttpError(res, "ERROR_REGISTER_USER", 500);
    }
}

const verifyEmail = async (req, res) => {
    try {
        const body = matchedData(req);

        // buscar usuario por emai
        const user = await UserModel.findOne({ email: body.email });

        // comparar body.emailCode con user.emailCode
        if (!user) return handleHttpError(res, "ERROR_USER_NOT_FOUND", 404);

        if (body.emailCode == user.emailCode){
            user.status = 1;
            await user.save();
        } else {
            return handleHttpError(res, "ERROR_EMAILCODE_INCORRECT", 401);
        }

        // enviar email de confirmacion
        await sendEmail({
            to: user.email,
            subject: "Usuario verificado correctamente",
            html: `<p>Gracias por registrarse.</p>`,
            from: process.env.EMAIL
        });

        const token = await tokenSign(user);

        user.set("password", undefined, { strict: false });
        res.send({ user: user , token, message: "Usuario verificado."});
    } catch (error) {
        console.log(`ERROR_VERIFYING_USER: ${error}`);
        return handleHttpError(res, "ERROR_VERIFYING_USER", 500);
    }
}

const loginUser = async (req, res) => {
    try {    
        const body = matchedData(req);
        const user = await UserModel.findOne({ email: body.email });

        if(!user){
            return handleHttpError(res, "ERROR_USER_NOT_FOUND", 404);
        }

        if (user.status !== 1) {
            return handleHttpError(res, "USER_NOT_VALIDATED", 401);
        }

        const correctPassword = await compare(body.password, user.password);

        if(!correctPassword){
            return handleHttpError(res, "ERROR_INCORRECT_PASSWORD", 401);
        }

        const token = await tokenSign(user);
        user.set("password", undefined, { strict: false });
        res.send({ user, token, message: "User logged in." });
    } catch (error) {
        console.log(`ERROR_LOGGING_USER_IN: ${error}`);
        return handleHttpError(res, "ERROR_LOGGING_USER_IN", 500);
    }
}

const updateUser = async (req, res) => {
    try {
        const data = matchedData(req);
        const user = req.user;

        user.name = data.name;
        user.surnames = data.surnames;
        user.nif = data.nif;

        await user.save();

        user.set("password", undefined, { strict: false });

        res.send({ message: "Datos usuario actualizados correctamente: ", user });

    } catch (error) {
        console.error(`ERROR_UPDATE_USER: ${error}`);
        handleHttpError(res, "ERROR_UPDATE_USER", 500);
    }
};

const updateCompany = async (req, res) => {
    try {
        const data = matchedData(req);
        const user = req.user;

        if (!user.company) {
            user.company = {}; // por si no existe
        }

        user.company.companyName = data.companyName;
        user.company.companyCif = data.companyCif;
        user.company.companyAddress = data.companyAddress;

        await user.save();

        user.set("password", undefined, { strict: false });

        res.send({ message: "Datos compañía actualizados correctamente: ", user });
    } catch (error) {
        console.error(`ERROR_UPDATE_COMPANY: ${error}`);
        handleHttpError(res, "ERROR_UPDATE_COMPANY", 500);
    }
};

module.exports = { registerUser, verifyEmail, loginUser, updateUser, updateCompany };