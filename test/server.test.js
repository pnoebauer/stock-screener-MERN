import request from 'supertest'; // supertest is a framework that allows to easily test web apis
import app from '../src/server';
import {UNIVERSES} from '../src/assets/constants';

import HistoricalDataDAO from '../src/dao/historical-data-DAO';

describe('server routes testing for /prices and /universes endpoints', () => {
	beforeAll(async () => {
		await HistoricalDataDAO.injectDB(global.stockClient);
	});

	test('GET /prices/test endpoint', async () => {
		const {body} = await request(app).get('/api/v1/prices/test'); //uses the request function that calls on express app instance
		expect(body).toEqual('test');
	});

	test('GET /universes endpoint', async () => {
		const {body} = await request(app).get('/api/v1/universes');
		expect(body).toEqual(UNIVERSES);
	});
	// });

	// describe('server routes testing for /chart endpoints', () => {
	// 	beforeAll(async () => {
	// 		await HistoricalDataDAO.injectDB(global.stockClient);
	// 	});

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

	test('POST /chart endpoint with lookBack smaller than default', async () => {
		const lookBack = 50;

		const {body} = await request(app).post('/api/v1/chart').send({
			symbol: 'AAPL',
			lookBack,
			samplePeriod: 'day',
		});
		// console.log(body);

		expect(body.length).toBeLessThanOrEqual(lookBack);
	});

	// controller should convert remove invalid parameters
	test('POST /chart endpoint with invalid lookback', async () => {
		const lookBack = 'invalid'; //provide invalid symbol

		const {body} = await request(app).post('/api/v1/chart').send({
			lookBack,
		});
		// console.log(body.length);

		expect(body).toBeInstanceOf(Array);
	});

	test('POST /chart endpoint with invalid stock symbol', async () => {
		const symbol = 'invalid'; //provide invalid lookback

		const {body} = await request(app).post('/api/v1/chart').send({
			symbol,
		});
		// console.log(body.length);

		expect(body).toBeInstanceOf(Array);
	});

	test('POST /chart endpoint with invalid sample period', async () => {
		const samplePeriod = 'invalid';

		const {body} = await request(app).post('/api/v1/chart').send({
			samplePeriod,
		});
		// console.log(body);

		expect(body).toBeInstanceOf(Array);
	});

	test('POST /chart endpoint with invalid end date', async () => {
		const endDate = 'invalid';

		const {body} = await request(app).post('/api/v1/chart').send({
			endDate,
		});
		// console.log(body);

		expect(body).toBeInstanceOf(Array);
	});
});
