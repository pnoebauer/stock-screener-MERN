import HistoricalDataDAO from '../src/dao/historical-data-DAO';

describe('HistoricalDataDAO Testing', () => {
	beforeAll(async () => {
		await HistoricalDataDAO.injectDB(global.stockClient);
	});

	test('get sampled data', async () => {
		const sampledStocks = await HistoricalDataDAO.getSampledHistoricalData();
	});

	test('sampled data should be sorted by date', async () => {
		// oldest to newest
		expect.assertions(10);

		const sampledData = await HistoricalDataDAO.getSampledHistoricalData();
		const sortedData = sampledData.slice();

		sortedData.sort((a, b) => a.date.getTime() - b.date.getTime());
		// console.log({sortedData});

		for (let i = 0; i < Math.min(10, sampledData.length); i++) {
			const randomInt = Math.floor(Math.random() * sampledData.length - 1);
			// make sure that original sampledData array is already sorted (has same sort order as sortedData)
			expect(sampledData[randomInt]).toEqual(sortedData[randomInt]);
		}
	});

	test('sampled data length should not exceed the provided lookback', async () => {
		const lookBack = 20;

		const sampledData = await HistoricalDataDAO.getSampledHistoricalData({
			lookBack,
		});

		expect(sampledData.length).toBeLessThanOrEqual(lookBack);
	});

	test('provide invalid parameters', async () => {
		await expect(async () => {
			await HistoricalDataDAO.getSampledHistoricalData({
				lookBack: '-5000a',
			});
		}).rejects.toThrow();
	});
});
