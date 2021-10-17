import {StockDataDAO, ContinuousPricesDAO} from '../dao/price-data-DAO';
import {DataUpdates} from '../utils/data-updater';

export default class ChartDataController {
	static async apiGetSampledStockData(req, res, next) {
		const queryObject = req.body;

		// console.log({queryObject});

		const {symbol, lookBack, samplePeriod, endDate} = queryObject;

		// const result = await StockDataDAO.getSampledHistoricalPrices({ticker});
		const result = await StockDataDAO.getSampledHistoricalPrices({
			ticker: symbol,
			endDate: new Date(endDate),
			interval: samplePeriod,
			lookBack,
		});

		// console.log('chart endpoint', result);

		res.json(result);
	}
}
