// // need to
// // npm install --legacy-peer-deps

require('@babel/register');
require('dotenv').config();

// exports = module.exports = require('./src');

import app from './src/server';
import {MongoClient} from 'mongodb';

import {DataDAO, StockDataDAO} from './src/dao/dataDAO';
// import DataCtrl from '../src/api/data.controller';

const port = process.env.PORT || 8000;

console.log('running', process.env.MONGODB_URI);

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
		await DataDAO.injectDB(client);
		await StockDataDAO.injectDB(client);
		// await UsersDAO.injectDB(client);
		// await CommentsDAO.injectDB(client);

		// DataCtrl.apiGetData();

		app.listen(port, () => {
			console.log(`listening on port ${port}`);
		});
		// console.log(`listening on port ${port}`);
	});
