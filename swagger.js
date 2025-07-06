const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Mi API de Node.js',
            version: '1.0.0',
            description: 'Documentación de ejemplo con Swagger'
        },
        tags: [
            {
                name: 'Usuario',
                description: 'Operaciones relacionadas con usuarios'
            },
            {
                name: 'Cliente',
                description: 'Operaciones relacionadas con clientes'
            },
            {
                name: 'Proyecto',
                description: "Operaciones relacionadas con proyectos"
            },
            {
                name: 'Albarán',
                description: "Operaciones relacionadas con albaranes"
            }
        ]
    },
    apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
