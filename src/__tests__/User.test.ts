import request from 'supertest';
import { app } from '../app';

import createConnection from '../database';
import { getConnection } from "typeorm";

describe('User', () => {
    beforeAll(async () => {
        const connection = await createConnection();
        await connection.runMigrations();
    })

    afterAll(async () => {
        const connection = getConnection();
        await connection.dropDatabase();
        await connection.close();
    })

    it('should be able to create a new user', async() => {
        const response = await request(app).post('/users')
            .send({
                email: 'test@example.com',
                name: 'test_username'
            })

        expect(response.status).toBe(201);
    })

    it('should not be able to create a user with the existing email', async () => {
        const response = await request(app).post('/users')
            .send({
                email: 'test@example.com',
                name: 'test_username'
            })

        expect(response.status).toBe(400);
    })

});
