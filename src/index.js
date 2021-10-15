import app from './server';
import {MongoClient} from 'mongodb';

require('dotenv').config();

import {ContinuousPricesDAO, StockDataDAO} from './dao/price-data-DAO';
import {DataUpdates} from './utils/data-updater';

const port = process.env.PORT || 8000;

// console.log('running', process.env.MONGODB_URI);

MongoClient.connect(process.env.MONGODB_URI, {
	// wtimeout: 25000,
	// poolSize: 50,
	useNewUrlParser: true,
	// useUnifiedTopology: true,
})
	.catch(err => {
		console.error(err.stack, '-----error stack');
		process.exit(1);
	})
	.then(async client => {
		// console.log(client);
		await StockDataDAO.injectDB(client);
		await ContinuousPricesDAO.injectDB(client);

		const server = app.listen(port, () => {
			console.log(`listening on port ${port}`);
		});
		server.keepAliveTimeout = 61 * 1000;

		// await DataUpdates.triggerUpdates();

		// await StockDataDAO.getSampledHistoricalPrices();
		await StockDataDAO.getSampledHistoricalPrices({
			ticker: 'AAPL',
			lookBack: 5,
			projection: ['openPrice', 'closePrice'],
		});

		// etimeout
		// https://stackoverflow.com/questions/23632914/how-to-handle-etimedout-error#:~:text=This%20is%20caused%20when%20your,t%20be%20thrown%20anymore%3A%20out.
		// const server = app.listen(8080);
		// server.keepAliveTimeout = 61 * 1000;
		// console.log(`listening on port ${port}`);
	});
