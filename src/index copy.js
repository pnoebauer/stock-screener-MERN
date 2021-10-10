import app from './server';
import {MongoClient} from 'mongodb';

import {DataDAO, StockDataDAO} from './dao/dataDAO';
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

// const uri =
// 	'mongodb+srv://<username>:<password>@mflix.awuah.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
// const client = new MongoClient(process.env.MONGODB_URI, {
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true,
// });
// client.connect(err => {
// 	const collection = client.db('test').collection('devices');
// 	// perform actions on the collection object
// 	client.close();
// });
