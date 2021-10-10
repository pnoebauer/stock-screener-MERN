'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dataDAO = require('../dao/dataDAO');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DataController = function () {
	function DataController() {
		_classCallCheck(this, DataController);
	}

	_createClass(DataController, null, [{
		key: 'apiGetData',
		value: function () {
			var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
				var result;
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								_context.next = 2;
								return _dataDAO.DataDAO.getZips();

							case 2:
								result = _context.sent;

								console.log({ result: result });
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

							case 5:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function apiGetData(_x, _x2, _x3) {
				return _ref.apply(this, arguments);
			}

			return apiGetData;
		}()
	}, {
		key: 'apiInsertData',
		value: function () {
			var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
				var result;
				return regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								_context2.next = 2;
								return _dataDAO.StockDataDAO.insertStockHist();

							case 2:
								result = _context2.sent;

								console.log({ result: result });
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

							case 5:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function apiInsertData(_x4, _x5, _x6) {
				return _ref2.apply(this, arguments);
			}

			return apiInsertData;
		}()
	}, {
		key: 'apiGetStockData',
		value: function () {
			var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res, next) {
				var result;
				return regeneratorRuntime.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								_context3.next = 2;
								return _dataDAO.StockDataDAO.getPrices();

							case 2:
								result = _context3.sent;

								console.log({ result: result });
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

							case 5:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee3, this);
			}));

			function apiGetStockData(_x7, _x8, _x9) {
				return _ref3.apply(this, arguments);
			}

			return apiGetStockData;
		}()
	}]);

	return DataController;
}();

exports.default = DataController;
//# sourceMappingURL=data.controller.js.map