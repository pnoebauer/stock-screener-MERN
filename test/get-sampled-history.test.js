import HistoricalDataDAO from '../src/dao/historical-data-DAO';

describe('Connection', () => {
	beforeAll(async () => {
		await HistoricalDataDAO.injectDB(global.stockClient);
	});

	test('get sampled data', async () => {
		const sampledStocks = await HistoricalDataDAO.getSampledHistoricalData();
	});
});
