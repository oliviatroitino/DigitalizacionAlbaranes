require('dotenv').config();
const mongoose = require('mongoose');
const db_uri = process.env.NODE_ENV === 'test' ? process.env.DB_URI_TEST : process.env.DB_URI;

const dbConnect = () => {
    mongoose.set('strictQuery', false) // evitar warnings
    try {
        mongoose.connect(db_uri);
    } catch (error) {
        console.error("Error conectando a la BD:", error);
    }
    mongoose.connection.on("connected", () => console.log("Conectado a la base de datos."));
};

module.exports = dbConnect;