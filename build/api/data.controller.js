"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _dataDAO = require("../dao/dataDAO");

var DataController = /*#__PURE__*/function () {
  function DataController() {
    (0, _classCallCheck2["default"])(this, DataController);
  }

  (0, _createClass2["default"])(DataController, null, [{
    key: "apiGetData",
    value: function () {
      var _apiGetData = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
        var result;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _dataDAO.DataDAO.getZips();

              case 2:
                result = _context.sent;
                console.log({
                  result: result
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
                // res.json(result);

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function apiGetData(_x, _x2, _x3) {
        return _apiGetData.apply(this, arguments);
      }

      return apiGetData;
    }()
  }, {
    key: "apiInsertData",
    value: function () {
      var _apiInsertData = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
        var result;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _dataDAO.StockDataDAO.insertStockHist();

              case 2:
                result = _context2.sent;
                console.log({
                  result: result
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

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function apiInsertData(_x4, _x5, _x6) {
        return _apiInsertData.apply(this, arguments);
      }

      return apiInsertData;
    }()
  }, {
    key: "apiGetStockData",
    value: function () {
      var _apiGetStockData = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
        var result;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return _dataDAO.StockDataDAO.getPrices();

              case 2:
                result = _context3.sent;
                console.log({
                  result: result
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

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function apiGetStockData(_x7, _x8, _x9) {
        return _apiGetStockData.apply(this, arguments);
      }

      return apiGetStockData;
    }()
  }]);
  return DataController;
}();

exports["default"] = DataController;
//# sourceMappingURL=data.controller.js.map