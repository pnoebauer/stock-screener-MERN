import app from './server';
import {MongoClient} from 'mongodb';

require('dotenv').config();

import LiveDataDAO from './dao/live-data-DAO';
import HistoricalDataDAO from './dao/historical-data-DAO';
import {DataUpdates} from './utils/data-updater';

const port = process.env.PORT || 8000;

// console.log('running', process.env.MONGODB_URI);

MongoClient.connect(process.env.MONGODB_URI, {
	// wtimeout: 25000,
	// poolSize: 50,
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
	.catch(err => {
		console.error(err.stack, '-----error stack');
		process.exit(1);
	})
	.then(async client => {
		// console.log(client);
		await HistoricalDataDAO.injectDB(client);
		await LiveDataDAO.injectDB(client);

		const server = app.listen(port, () => {
			console.log(`listening on port ${port}`);
		});
		server.keepAliveTimeout = 61 * 1000;

		// await
		DataUpdates.triggerUpdates();

		// const sampledHistory = await HistoricalDataDAO.getSampledHistoricalData();
		// const sampledHistory = await HistoricalDataDAO.getSampledHistoricalData({
		// 	ticker: 'AAPL',
		// 	lookBack: 5,
		// 	projection: ['open', 'close'],
		// });
		// console.log({sampledHistory});

		const queryObject = {
			symbol: 'AAPL',
			interval: 'day',
			indicators: {
				sma: {
					parameter: 'closePrice',
					lookBack: 20,
				},
				ema: {
					parameter: 'open',
					lookBack: 10,
				},
				// atr: {
				// 	lookBack: 5,
				// },
				// reg: {
				// 	parameter: 'close',
				// 	lookBack: 250,
				// },
				// mom: {
				// 	parameter: 'close',
				// 	lookBack: 250,
				// },
			},
		};

		// await HistoricalDataDAO.getSymbolWithIndicators(queryObject);

		// etimeout
		// https://stackoverflow.com/questions/23632914/how-to-handle-etimedout-error#:~:text=This%20is%20caused%20when%20your,t%20be%20thrown%20anymore%3A%20out.
		// const server = app.listen(8080);
		// server.keepAliveTimeout = 61 * 1000;
		// console.log(`listening on port ${port}`);
	});
