import {StockDataDAO} from '../dao/dataDAO';
import {DataUpdates} from '../utils/fetchData';

export default class DataController {
	static async apiInsertData(req, res, next) {
		const result = await StockDataDAO.insertStockHist();
		console.log({result});
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

		const result = await StockDataDAO.getPrices({ticker});

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

	static async apiGetLiveStockData(req, res, next) {
		const result = await DataUpdates.getLiveData();

		// console.log({result});

		res.json(result);
	}
}
