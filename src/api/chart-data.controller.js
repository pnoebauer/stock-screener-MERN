import {StockDataDAO, ContinuousPricesDAO} from '../dao/price-data-DAO';
import {DataUpdates} from '../utils/data-updater';

export default class ChartDataController {
	static async apiGetSampledStockData(req, res, next) {
		const queryObject = req.body;

		console.log({queryObject});

		const intervalMap = {
			day: '$dayOfMonth',
			week: '$week',
			month: '$month',
			year: '$year',
		};

		const {symbol, lookBack, samplePeriod, endDate} = queryObject;

		// const result = await StockDataDAO.getSampledHistoricalPrices({ticker});
		const result = await StockDataDAO.getSampledHistoricalPrices({
			ticker: symbol,
			endDate: new Date(endDate),
			interval: intervalMap[samplePeriod],
			lookBack,
		});

		// console.log({result}, req.params);

		// const MOVIES_PER_PAGE = 20;
		// const { moviesList, totalNumMovies } = await MoviesDAO.getMovies();
		// let response = {
		// 	movies: moviesList,
		// 	page: 0,
		// 	filters: {},
		// 	entries_per_page: MOVIES_PER_PAGE,
		// 	total_results: totalNumMovies,
		// };
		// res.json(response);

		res.json(result);
	}
}
