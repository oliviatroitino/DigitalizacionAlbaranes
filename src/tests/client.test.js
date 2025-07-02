const request = require('supertest');
const { app, server } = require('../../app.js');
const mongoose = require('mongoose');
const express = require('express');
const ClientModel = require('../models/nosql/client.js').ClientModel;
const UserModel = require('../models/nosql/user').UserModel;
const { encrypt } = require('../utils/handlePassword');
const { tokenSign } = require('../utils/handleJwt');

describe('Client API tests', () => {
    var token = '';

    beforeEach(async() => {
        await UserModel.deleteMany({});
        await ClientModel.deleteMany({});
        const user = await UserModel.create({
            name: 'Test User',
            email: 'testuser@email.com',
            password: await encrypt('password123'),
            status: 1,
            role: 'user'
        });
        userId = user._id;
        token = await tokenSign(user);
    });

    // crear nuevo cliente
    describe('Create client', () => {    
        it('should create a new client', async () => {
            const newClient = {
                name: 'Cliente Test',
                cif: 'B12345678',
                address: {
                    street: 'Calle Falsa',
                    number: 123,
                    postal: 28080,
                    city: 'Madrid',
                    province: 'Madrid'
                }
            };

            const response = await request(app)
                .post('/api/client')
                .set('Authorization', `Bearer ${token}`)
                .set('Accept', 'application/json')
                .send(newClient)
                .expect(200);

            expect(response.body.result.name).toBe(newClient.name);
            expect(response.body.result.cif).toBe(newClient.cif);
            expect(response.body.result.userId).toBe(userId.toString());

            clientId = response.body.result._id;
        });

        it('should not create a new client (user not found)', async () => {
            await UserModel.deleteMany({});

            const fakeUserId = new mongoose.Types.ObjectId();
            const fakeToken = tokenSign({ _id: fakeUserId.toString() });

            const newClient = {
                name: 'Cliente Test',
                cif: 'B12345678',
                address: {
                    street: 'Calle Falsa',
                    number: 123,
                    postal: 28080,
                    city: 'Madrid',
                    province: 'Madrid'
                }
            };

            const response = await request(app)
                .post('/api/client')
                .set('Authorization', `Bearer ${fakeToken}`)
                .set('Accept', 'application/json')
                .send(newClient)
                .expect(404);

            expect(response.text).toBe('ERROR_USER_NOT_FOUND')
        });

    });


    afterAll(async () => {
        await mongoose.connection.close();
        server.close();
    });
})