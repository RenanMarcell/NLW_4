import request from 'supertest';
import { app } from '../app';

import createConnection from '../database';
import { getConnection } from "typeorm";

describe('Survey', () => {
    beforeAll(async () => {
        const connection = await createConnection();
        await connection.runMigrations();
    })

    afterAll(async () => {
        const connection = getConnection();
        await connection.dropDatabase();
        await connection.close();
    })

    it('should be able to create a new survey', async() => {
        const response = await request(app).post('/surveys')
            .send({
                title: 'Title example',
                description: 'Description example'
            })

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
    })

    it('should be able get all surveys', async() => {
        const response = await request(app).get('/surveys');

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
    })

});
