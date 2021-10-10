"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StockDataDAO = exports.DataDAO = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var zips, stocks;

var DataDAO = /*#__PURE__*/function () {
  function DataDAO() {
    _classCallCheck(this, DataDAO);
  }

  _createClass(DataDAO, null, [{
    key: "injectDB",
    value: function () {
      var _injectDB = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(conn) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!zips) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return");

              case 2:
                _context.prev = 2;
                _context.next = 5;
                return conn.db(process.env.MFLIX_TR).collection('zips');

              case 5:
                zips = _context.sent;
                // zips = await conn.db(process.env.MFLIX_TR).collection('movies');
                // console.log('zip', zips);
                console.log('zip inj');
                _context.next = 12;
                break;

              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](2);
                console.error("Unable to establish collection handles in dataDAO: ".concat(_context.t0));

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[2, 9]]);
      }));

      function injectDB(_x) {
        return _injectDB.apply(this, arguments);
      }

      return injectDB;
    }()
  }, {
    key: "getZips",
    value: function () {
      var _getZips = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var _ref,
            _ref$filters,
            filters,
            _ref$page,
            page,
            _ref$zipsPerPage,
            zipsPerPage,
            queryParams,
            cursor,
            displayCursor,
            zipsList,
            totalNumZips,
            _args2 = arguments;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _ref = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {}, _ref$filters = _ref.filters, filters = _ref$filters === void 0 ? null : _ref$filters, _ref$page = _ref.page, page = _ref$page === void 0 ? 0 : _ref$page, _ref$zipsPerPage = _ref.zipsPerPage, zipsPerPage = _ref$zipsPerPage === void 0 ? 20 : _ref$zipsPerPage;
                queryParams = {}; // if (filters) {
                // 	if ('text' in filters) {
                // 		queryParams = this.textSearchQuery(filters['text']);
                // 	} else if ('cast' in filters) {
                // 		queryParams = this.castSearchQuery(filters['cast']);
                // 	} else if ('genre' in filters) {
                // 		queryParams = this.genreSearchQuery(filters['genre']);
                // 	}
                // }
                // let { query = {}, project = {}, sort = DEFAULT_SORT } = queryParams;

                _context2.prev = 2;
                _context2.next = 5;
                return zips.find({
                  state: 'AL'
                });

              case 5:
                cursor = _context2.sent;
                _context2.next = 12;
                break;

              case 8:
                _context2.prev = 8;
                _context2.t0 = _context2["catch"](2);
                console.error("Unable to issue find command, ".concat(_context2.t0));
                return _context2.abrupt("return", {
                  zipsList: [],
                  totalNumZips: 0
                });

              case 12:
                // const zipsList = await cursor.toArray();
                // return {zipsList};
                displayCursor = cursor.skip(zipsPerPage * page).limit(zipsPerPage); // const zipsList = await displayCursor.toArray();
                // return {zipsList};

                _context2.prev = 13;
                _context2.next = 16;
                return displayCursor.toArray();

              case 16:
                zipsList = _context2.sent;

                if (!(page === 0)) {
                  _context2.next = 23;
                  break;
                }

                _context2.next = 20;
                return zips.countDocuments({
                  state: 'AL'
                });

              case 20:
                _context2.t1 = _context2.sent;
                _context2.next = 24;
                break;

              case 23:
                _context2.t1 = 0;

              case 24:
                totalNumZips = _context2.t1;
                return _context2.abrupt("return", {
                  zipsList: zipsList,
                  totalNumZips: totalNumZips
                });

              case 28:
                _context2.prev = 28;
                _context2.t2 = _context2["catch"](13);
                console.error("Unable to convert cursor to array or problem counting documents, ".concat(_context2.t2));
                return _context2.abrupt("return", {
                  zipsList: [],
                  totalNumZips: 0
                });

              case 32:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[2, 8], [13, 28]]);
      }));

      function getZips() {
        return _getZips.apply(this, arguments);
      }

      return getZips;
    }()
  }]);

  return DataDAO;
}();

exports.DataDAO = DataDAO;

var StockDataDAO = /*#__PURE__*/function () {
  function StockDataDAO() {
    _classCallCheck(this, StockDataDAO);
  }

  _createClass(StockDataDAO, null, [{
    key: "injectDB",
    value: function () {
      var _injectDB2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(conn) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!stocks) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt("return");

              case 2:
                _context3.prev = 2;
                _context3.next = 5;
                return conn.db('stock_data').collection('historical_prices');

              case 5:
                stocks = _context3.sent;
                _context3.next = 11;
                break;

              case 8:
                _context3.prev = 8;
                _context3.t0 = _context3["catch"](2);
                console.error("Unable to establish collection handles in dataDAO: ".concat(_context3.t0));

              case 11:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[2, 8]]);
      }));

      function injectDB(_x2) {
        return _injectDB2.apply(this, arguments);
      }

      return injectDB;
    }()
  }, {
    key: "getPrices",
    value: function () {
      var _getPrices = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var _ref2,
            _ref2$filters,
            filters,
            _ref2$page,
            page,
            _ref2$pricesPerPage,
            pricesPerPage,
            cursor,
            displayCursor,
            pricesList,
            totalNumPrices,
            _args4 = arguments;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _ref2 = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : {}, _ref2$filters = _ref2.filters, filters = _ref2$filters === void 0 ? null : _ref2$filters, _ref2$page = _ref2.page, page = _ref2$page === void 0 ? 0 : _ref2$page, _ref2$pricesPerPage = _ref2.pricesPerPage, pricesPerPage = _ref2$pricesPerPage === void 0 ? 20 : _ref2$pricesPerPage;
                _context4.prev = 1;
                _context4.next = 4;
                return stocks.find();

              case 4:
                cursor = _context4.sent;
                _context4.next = 11;
                break;

              case 7:
                _context4.prev = 7;
                _context4.t0 = _context4["catch"](1);
                console.error("Unable to issue find command, ".concat(_context4.t0));
                return _context4.abrupt("return", {
                  pricesList: [],
                  totalNumPrices: 0
                });

              case 11:
                // const pricesList = await cursor.toArray();
                // return {pricesList};
                displayCursor = cursor.skip(pricesPerPage * page).limit(pricesPerPage); // const pricesList = await displayCursor.toArray();
                // return {pricesList};

                _context4.prev = 12;
                _context4.next = 15;
                return displayCursor.toArray();

              case 15:
                pricesList = _context4.sent;

                if (!(page === 0)) {
                  _context4.next = 22;
                  break;
                }

                _context4.next = 19;
                return stocks.countDocuments({
                  ticker: 'AAPL'
                });

              case 19:
                _context4.t1 = _context4.sent;
                _context4.next = 23;
                break;

              case 22:
                _context4.t1 = 0;

              case 23:
                totalNumPrices = _context4.t1;
                return _context4.abrupt("return", {
                  pricesList: pricesList,
                  totalNumPrices: totalNumPrices
                });

              case 27:
                _context4.prev = 27;
                _context4.t2 = _context4["catch"](12);
                console.error("Unable to convert cursor to array or problem counting documents, ".concat(_context4.t2));
                return _context4.abrupt("return", {
                  pricesList: [],
                  totalNumPrices: 0
                });

              case 31:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[1, 7], [12, 27]]);
      }));

      function getPrices() {
        return _getPrices.apply(this, arguments);
      }

      return getPrices;
    }()
  }, {
    key: "insertStockHist",
    value: function () {
      var _insertStockHist = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        var myDate, upsertResult;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                // var myDate = new Date(2014, 11, 12, 0, 0);
                myDate = new Date('10/16/1995Z');
                _context5.prev = 1;
                _context5.next = 4;
                return stocks.updateOne( // this is the "query" portion of the update
                {
                  ticker: 'AAPL',
                  timestamp: myDate
                }, // this is the update
                {
                  $set: {
                    // timestamp: new Date(),
                    timestamp: myDate,
                    open: 154.1,
                    high: 164.1,
                    low: 124.1,
                    close: 134.1
                  }
                }, // this is the options document. We've specified upsert: true, so if the
                // query doesn't find a document to update, it will be written instead as
                // a new document
                {
                  upsert: true
                });

              case 4:
                upsertResult = _context5.sent;
                return _context5.abrupt("return", {
                  success: true
                });

              case 8:
                _context5.prev = 8;
                _context5.t0 = _context5["catch"](1);
                console.error("Error occurred while updating stock, ".concat(_context5.t0));
                return _context5.abrupt("return", {
                  error: _context5.t0
                });

              case 12:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[1, 8]]);
      }));

      function insertStockHist() {
        return _insertStockHist.apply(this, arguments);
      }

      return insertStockHist;
    }()
  }]);

  return StockDataDAO;
}();

exports.StockDataDAO = StockDataDAO;
//# sourceMappingURL=dataDAO.js.map