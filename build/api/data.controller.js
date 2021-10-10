"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dataDAO = require("../dao/dataDAO");

class DataController {
  static async apiGetData(req, res, next) {
    const result = await _dataDAO.DataDAO.getZips();
    console.log({
      result
    }); // const MOVIES_PER_PAGE = 20;
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

  static async apiInsertData(req, res, next) {
    const result = await _dataDAO.StockDataDAO.insertStockHist();
    console.log({
      result
    }); // const MOVIES_PER_PAGE = 20;
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
    const result = await _dataDAO.StockDataDAO.getPrices();
    console.log({
      result
    }); // const MOVIES_PER_PAGE = 20;
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

exports.default = DataController;
//# sourceMappingURL=data.controller.js.map