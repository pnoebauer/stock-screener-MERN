import {StockDataDAO, ContinuousPricesDAO} from '../dao/price-data-DAO';
import {DataUpdates} from '../utils/data-updater';

export default class ChartDataController {
	static async apiGetSampledStockData(req, res, next) {
		let {ticker} = req.params;
		// console.log(req.params);
		ticker = ticker.toUpperCase().split(',');
		// console.log(ticker);

		const result = await StockDataDAO.getSampledHistoricalPrices({ticker});

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
