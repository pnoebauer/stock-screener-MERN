import HistoricalDataDAO from '../dao/historical-data-DAO';
import LiveDataDAO from '../dao/live-data-DAO';

export default class DataController {
	static async apiInsertData(req, res, next) {
		const result = await HistoricalDataDAO.setHistoricalData();
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

	static async apiGetHistoricalData(req, res, next) {
		let {ticker} = req.params;
		// console.log(req.params);
		ticker = ticker.toUpperCase().split(',');
		// console.log(ticker);

		const result = await HistoricalDataDAO.getHistoricalData({ticker});

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

		const result = await HistoricalDataDAO.getSymbolWithIndicators(queryObject);

		res.json(result);
	}

	static async apiGetLiveData(req, res, next) {
		// const result = DataUpdates.getLiveData();

		const result = await LiveDataDAO.getLiveData();

		// console.log({result});

		res.json(result);
	}
}
