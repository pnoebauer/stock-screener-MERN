import HistoricalDataDAO from '../dao/historical-data-DAO';

export default class ChartDataController {
	static async apiGetSampledStockData(req, res, next) {
		const queryObject = req.body;

		const {symbol, lookBack, samplePeriod, endDate} = queryObject;

		let parameterObj = {};
		if (typeof symbol === 'string') {
			parameterObj.ticker = symbol;
		}
		if (new Date(endDate) instanceof Date && isFinite(new Date(endDate))) {
			parameterObj.endDate = new Date(endDate);
		}
		if (typeof samplePeriod === 'string') {
			parameterObj.interval = samplePeriod;
		}

		parameterObj.lookBack = lookBack;

		const result = await HistoricalDataDAO.getSampledHistoricalData(parameterObj);

		res.json(result);
	}
}
