import HistoricalDataDAO from '../src/dao/historical-data-DAO';

describe('Connection', () => {
	beforeAll(async () => {
		await HistoricalDataDAO.injectDB(global.stockClient);
	});

	test('Can access stock data', async () => {
		const stocks = global.stockClient.db('stock_data');

		const collections = await stocks.listCollections().toArray();

		const collectionNames = collections.map(elem => elem.name);

		expect(collectionNames).toContain('historical_prices');

		expect(collectionNames).toContain('continuous_prices');
	});
});
