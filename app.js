const express = require("express");
const app = express();
const cors = require("cors");

//////// Routers y conexión a MongoDB
// const dbConnect = require('./config/mongo');
// const userRouter = require('./routes/user.js');
// etc...

app.use(cors())
app.use(express.json());

//////// Rutas
// app.use('/users', userRouter);

dbConnect();

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});