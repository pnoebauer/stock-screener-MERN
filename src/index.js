// require('dotenv').config();

// import express from 'express';

// const app = express();

// app.get('/', (req, res) => {
// 	res.status(200).json({message: 'Welcome to Node.js & Express'});
// });

// const port = process.env.PORT || 8000;

// app.listen(port, () => {
// 	console.log(`App is running on port ${port}`);
// });

// import 'core-js';

import app from './server';
import {MongoClient} from 'mongodb';

require('dotenv').config();

import {StockDataDAO} from './dao/dataDAO';
import DataCtrl from './api/data.controller';
import {FetchData, DataUpdates} from './utils/fetchData';

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

		// DataCtrl.apiGetStockData();
		// const prices = await StockDataDAO.getPrices();
		// console.log({prices});

		// await StockDataDAO.insertStockHist();
		// const data = await FetchData.fetchLiveData(['GOOGL']);
		// console.log({data});

		// app.listen(port, () => {
		// 	console.log(`listening on port ${port}`);
		// });
		const server = app.listen(port, () => {
			console.log(`listening on port ${port}`);
		});
		server.keepAliveTimeout = 61 * 1000;

		await DataUpdates.triggerUpdates();

		// etimeout
		// https://stackoverflow.com/questions/23632914/how-to-handle-etimedout-error#:~:text=This%20is%20caused%20when%20your,t%20be%20thrown%20anymore%3A%20out.
		// const server = app.listen(8080);
		// server.keepAliveTimeout = 61 * 1000;

		// console.log(`listening on port ${port}`);
	});
