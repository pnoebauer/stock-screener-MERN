import request from 'supertest'; // supertest is a framework that allows to easily test web apis
import app from '../src/server';
import {UNIVERSES} from '../src/assets/constants';

import HistoricalDataDAO from '../src/dao/historical-data-DAO';

describe('testing-server-routes', () => {
	beforeAll(async () => {
		await HistoricalDataDAO.injectDB(global.stockClient);
	});

	test('GET prices/test endpoint', async () => {
		const {body} = await request(app).get('/api/v1/prices/test'); //uses the request function that calls on express app instance
		expect(body).toEqual('test');
	});

	test('GET /universes endpoint', async () => {
		const {body} = await request(app).get('/api/v1/universes');
		expect(body).toEqual(UNIVERSES);
	});

	test('POST /chart endpoint', async () => {
		const lookBack = 300;

		const {body} = await request(app).post('/api/v1/chart').send({
			symbol: 'AAPL',
			lookBack,
			samplePeriod: 'day',
			endDate: '2021-10-16',
		});

		// console.log(body);
		expect(body.length).toBeLessThanOrEqual(lookBack);
	});
});
