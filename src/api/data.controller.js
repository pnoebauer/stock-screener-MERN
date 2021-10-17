import {StockDataDAO, ContinuousPricesDAO} from '../dao/price-data-DAO';
import {DataUpdates} from '../utils/data-updater';

export default class DataController {
	static async apiInsertData(req, res, next) {
		const result = await StockDataDAO.setHistoricalPrices();
		// console.log({result});
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

	static async apiGetStockData(req, res, next) {
		let {ticker} = req.params;
		// console.log(req.params);
		ticker = ticker.toUpperCase().split(',');
		// console.log(ticker);

		const result = await StockDataDAO.getHistoricalPrices({ticker});

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

	static async apiGetLatestDataWithIndicators(req, res, next) {
		const queryObject = req.body;

		const result = await StockDataDAO.getSymbolWithIndicators(queryObject);
		// console.log('scanner endpoint');

		res.json(result);
	}

	static async apiGetLiveStockData(req, res, next) {
		// const result = DataUpdates.getLiveData();

		const result = await ContinuousPricesDAO.getContinuousPrices();

		// console.log({result});

		res.json(result);
	}
}
