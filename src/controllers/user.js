const { matchedData } = require("express-validator");
const { encrypt, compare } = require("../utils/handlePassword");
const UserModel = require("../models/nosql/user");
const { handleHttpError } = require("../utils/handleError");
const { tokenSign } = require("../utils/handleJwt.js");
const { sendEmail } = require("../utils/handleEmail.js");

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
        body.emailCode = Math.floor(100000 + Math.random() * 900000).toString();
        body.password = hashedPassword;
        body.intentos = 0;
        body.role = "user";

        const newUser = await UserModel.create(body);

        await sendEmail({
            to: newUser.email,
            subject: "Validation code",
            html: `<p>Your code is <b>${newUser.emailCode}</b></p>`,
            from: process.env.EMAIL
        });

        const token = await tokenSign(newUser);
        
        newUser.set("password", undefined, {strict: false});
        // newUser.set("emailCode", undefined, {strict: false});

        res.send({ user: newUser , token, message: "User registered, check email."});
    } catch (err) {
        console.log(`Registration error ${err}`);
        handleHttpError(res, "ERROR_REGISTER_USER", 500);
    }
}

const verifyEmail = async (req, res) => {
    try {
        const body = matchedData(req);

        // buscar usuario por emai
        const user = await UserModel.findOne({ email: body.email });

        // comparar body.emailCode con user.emailCode
        if (!user) return handleHttpError(res, "ERROR_USER_NOT_FOUND", 401);

        if (body.emailCode == user.emailCode){
            user.status = 1;
            await user.save();
        } else {
            return handleHttpError(res, "ERROR_EMAILCODE_INCORRECT", 401);
        }

        // enviar email de confirmacion
        await sendEmail({
            to: user.email,
            subject: "User validated successfully",
            html: `<p>Thank you for registering.</p>`,
            from: process.env.EMAIL
        });

        const token = await tokenSign(user);

        user.set("password", undefined, { strict: false });
        res.send({ user: user , token, message: "User verified."});
    } catch (err) {
        console.log(`Verification error ${err}`);
       return handleHttpError(res, "ERROR_VERIFYING_USER", 500);
    }
}

const loginUser = async (req, res) => {
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
    res.send({ user, token });
}

module.exports = { registerUser, verifyEmail, loginUser };