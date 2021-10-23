import {StockDataDAO, ContinuousPricesDAO} from '../dao/price-data-DAO';
import {DataUpdates} from '../utils/data-updater';

export default class ChartDataController {
	static async apiGetSampledStockData(req, res, next) {
		const queryObject = req.body;

		const {symbol, lookBack, samplePeriod, endDate} = queryObject;

		const result = await StockDataDAO.getSampledHistoricalPrices({
			ticker: symbol,
			endDate: new Date(endDate),
			interval: samplePeriod,
			lookBack,
		});

		res.json(result);
	}
}
