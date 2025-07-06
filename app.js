const express = require("express");
const app = express();
const cors = require("cors");
const setupSwagger = require('./swagger');

//////// Routers y conexión a MongoDB
const dbConnect = require('./src/config/mongo');
const userRouter = require('./src/routes/user.js');
const clientRouter = require('./src/routes/client.js');
const projectRouter = require('./src/routes/project.js');
const deliveryNoteRouter = require('./src/routes/delivery-note.js');

app.use(cors())
app.use(express.json());

//////// Rutas
app.use('/api/user', userRouter);
app.use('/api/client', clientRouter);
app.use('/api/project', projectRouter);
app.use('/api/deliverynote', deliveryNoteRouter);

setupSwagger(app);

dbConnect();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});

module.exports = {app, server}