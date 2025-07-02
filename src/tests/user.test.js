const request = require('supertest');
const { app, server } = require('../../app.js');
const mongoose = require('mongoose');
const express = require('express');
const UserModel = require('../models/nosql/user').UserModel;
const { encrypt } = require('../utils/handlePassword');
const { tokenSign } = require('../utils/handleJwt');


jest.mock('../utils/handleEmail.js', () => ({
    sendEmail: jest.fn(() => Promise.resolve()),
    generateEmailCode: () => '123456'
}));

describe('User API tests', () => {
    var token = '';

    // datos usuario inicial
    const initialUser = {
        name: 'TestUser',
        email: 'testuser@example.com',
        password: 'TestPass123'
    };

    beforeAll(async () => {
        await UserModel.deleteMany({});
    })

    // registro
    it('should register a user', async () => {
        const response = await request(app)
            .post('/api/user/register')
            .send(initialUser)
            .set('Accept', 'application/json')
            .expect(200)

        const user = response.body.user;
        const token = response.body.token;
        expect(user.email).toEqual(initialUser.email);
        expect(user.role).toEqual('user');
        expect(user.status).toEqual(0);
        expect(user.password).toBeUndefined();
        expect(token).toBeDefined();
    });

    it('should not register a user (existing user)', async () => {
        const existingUser = {
            name: 'Ya Existe',
            email: 'existe@example.com',
            password: await encrypt('password123'),
            status: 0,
            role: 'user'
        };

        await UserModel.create(existingUser);
        
        const response = await request(app)
            .post('/api/user/register')
            .send(existingUser)
            .set('Accept', 'application/json')
            .expect(409)

        expect(response.text).toBe('ERROR_USER_EXISTS')
    });

    // validacion
    it('should validate a user', async () => {
        const response = await request(app)
            .put('/api/user/validation')
            .send({
                email: initialUser.email,
                emailCode: '123456'
            })
            .set('Accept', 'application/json')
            .expect(200)

        const user = response.body.user;
        const token = response.body.token;
        expect(user.status).toEqual(1);
        expect(token).toBeDefined();
    });

    it('should not validate a user (user not found)', async () => {
        const response = await request(app)
            .put('/api/user/validation')
            .send({
                email: 'wrongemail@gmail.com',
                emailCode: '654321'
            })
            .set('Accept', 'application/json')
            .expect(404)

        expect(response.text).toBe("ERROR_USER_NOT_FOUND")
    });

    it('should not validate a user (email code incorrect)', async () => {
        const response = await request(app)
            .put('/api/user/validation')
            .send({
                email: initialUser.email,
                emailCode: '654321'
            })
            .set('Accept', 'application/json')
            .expect(401)

        expect(response.text).toBe("ERROR_EMAILCODE_INCORRECT")
    });

    // login
    it('should log in a user', async () => {
        const response = await request(app)
            .post('/api/user/login')
            .send({
                email: initialUser.email,
                password: initialUser.password
            })
            .set('Accept', 'application/json')
            .expect(200);

        const user = response.body.user;
        const token = response.body.token;
        expect(user.email).toEqual(initialUser.email);
        expect(token).toBeDefined();
    })

    it('should not log in a user (wrong password)', async () => {
        const response = await request(app)
            .post('/api/user/login')
            .send({
                email: initialUser.email,
                password: 'wrongpassword'
            })
            .set('Accept', 'application/json')
            .expect(401);

        expect(response.text).toBe("ERROR_INCORRECT_PASSWORD")
    })

    it('should not log in a user (non existent user)', async () => {
        const response = await request(app)
            .post('/api/user/login')
            .send({
                email: 'wrongemail@gmail.com',
                password: 'wrongpassword'
            })
            .set('Accept', 'application/json')
            .expect(404);

        expect(response.text).toBe("ERROR_USER_NOT_FOUND")
    })

    it('should not log in a user (non validated user)', async() => {
        const unvalidatedUser = {
            name: 'NoValido',
            email: 'novalido@example.com',
            password: await encrypt('password123'),
            status: 0, // no validado
            role: 'user'
        };

        await UserModel.create(unvalidatedUser);

        const response = await request(app)
            .post('/api/user/login')
            .send({
                email: unvalidatedUser.email,
                password: 'password123'
            })
            .set('Accept', 'application/json')
            .expect(401);
            
            expect(response.text).toBe('USER_NOT_VALIDATED');
    })

    // update user data
    it('should update user data', async() => {
        const newUser = await UserModel.create({
            name: 'OriginalName',
            surnames: 'OriginalSurname',
            email: 'updateuser@example.com',
            password: await encrypt('password123'),
            status: 1,
            role: 'user'
        });
        const token = await tokenSign(newUser);

        const data = {
            "name": "Ricardo",
            "surnames": "Martínez Gómez",
            "nif": "12345678Z",
            "address": {
                "street": "Calle",
                "number": 123,
                "postal": 28013,
                "city": "Madrid",
                "province": "Madrid"
            }
        }

        const response = await request(app)
            .patch(`/api/user/`)
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .expect(200);

        const user = response.body.user;
        expect(user.email).toEqual(newUser.email);
        expect(token).toBeDefined();

    });

    it('should not update user data', async() => {
        const token = 'sjkhgskdgfh'

        const data = {
            "name": "Ricardo",
            "surnames": "Martínez Gómez",
            "nif": "12345678Z",
            "address": {
                "street": "Calle",
                "number": 123,
                "postal": 28013,
                "city": "Madrid",
                "province": "Madrid"
            }
        }

        const response = await request(app)
            .patch(`/api/user/`)
            .set('Authorization', `Bearer ${token}`)
            .send(data)
            .expect(401);

        expect(response.text).toBe('NOT_SESSION')
    });

    afterAll(async () => {
        await mongoose.connection.close();
        server.close();
    });

})