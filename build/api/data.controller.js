"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dataDAO = require("../dao/dataDAO");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DataController = /*#__PURE__*/function () {
  function DataController() {
    _classCallCheck(this, DataController);
  }

  _createClass(DataController, null, [{
    key: "apiGetData",
    value: function () {
      var _apiGetData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
        var result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
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

                res.json(result);

              case 5:
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
      var _apiInsertData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
        var result;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
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
      var _apiGetStockData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res, next) {
        var result;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
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