const { matchedData } = require("express-validator");
const { encrypt } = require("../utils/handlePassword");
const UserModel = require("../models/nosql/user");
const { handleHttpError } = require("../utils/handleError");
const { tokenSign } = require("../utils/handleJwt.js");

const registerUser = async (req, res) => {
    try {
        const body = matchedData(req);
        const hashedPassword = await encrypt(body.password);

        // ver si ya existe el usuario
        const existingUser = await UserModel.findOne({ email: body.email, status: true });

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
            to: user.email,
            subject: "Validation code",
            html: `<p>Your code is <b>${user.emailCode}</b></p>`,
            from: process.env.EMAIL
        });

        const token = await tokenSign(user);
        
        newUser.set("password", undefined, {strict: false});
        newUser.set("emailCode", undefined, {strict: false});

        res.send({ user: newUser , token, message: "User registered, check email."});
    } catch (err) {
        console.log(err);
        handleHttpError(res, "ERROR_REGISTER_USER", 500);
    }
}

module.exports = { registerUser };