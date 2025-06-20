const express = require("express");
const app = express();
const cors = require("cors");

//////// Routers y conexión a MongoDB
const dbConnect = require('./src/config/mongo');
const userRouter = require('./src/routes/user.js');
const clientRouter = require('./src/routes/client.js');

app.use(cors())
app.use(express.json());

//////// Rutas
app.use('/api/user', userRouter);
app.use('/api/client', clientRouter)

dbConnect();

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});