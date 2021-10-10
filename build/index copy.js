"use strict";

var _server = _interopRequireDefault(require("./server"));

var _mongodb = require("mongodb");

var _dataDAO = require("./dao/dataDAO");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// import DataCtrl from '../src/api/data.controller';
var port = process.env.PORT || 8000;
console.log('running', process.env.MONGODB_URI);

_mongodb.MongoClient.connect(process.env.MONGODB_URI, {
  // wtimeout: 25000,
  // poolSize: 50,
  useNewUrlParser: true // useUnifiedTopology: true,

})["catch"](function (err) {
  console.error(err.stack, '-----error stack');
  process.exit(1);
}).then( /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(client) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _dataDAO.DataDAO.injectDB(client);

          case 2:
            _context.next = 4;
            return _dataDAO.StockDataDAO.injectDB(client);

          case 4:
            // await UsersDAO.injectDB(client);
            // await CommentsDAO.injectDB(client);
            // DataCtrl.apiGetData();
            _server["default"].listen(port, function () {
              console.log("listening on port ".concat(port));
            }); // console.log(`listening on port ${port}`);


          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}()); // const uri =
// 	'mongodb+srv://<username>:<password>@mflix.awuah.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
// const client = new MongoClient(process.env.MONGODB_URI, {
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true,
// });
// client.connect(err => {
// 	const collection = client.db('test').collection('devices');
// 	// perform actions on the collection object
// 	client.close();
// });
//# sourceMappingURL=index copy.js.map