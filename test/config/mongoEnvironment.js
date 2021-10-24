// import {MongoClient} from 'mongodb';
// import NodeEnvironment from 'jest-environment-node';

const MongoClient = require('mongodb').MongoClient;
const NodeEnvironment = require('jest-environment-node');

class MongoEnvironment extends NodeEnvironment {
	async setup() {
		if (!this.global.stockClient) {
			this.global.stockClient = await MongoClient.connect(process.env.MONGODB_URI, {
				// wtimeout: 2500,
				// poolSize: 50,
				useNewUrlParser: true,
				useUnifiedTopology: true,
			});
			await super.setup();
		}

		// console.log(this.global.stockClient);
	}

	async teardown() {
		await this.global.stockClient.close();
		await super.teardown();
	}

	runScript(script) {
		return super.runScript(script);
	}
}

module.exports = MongoEnvironment;
