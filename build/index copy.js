"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _server = _interopRequireDefault(require("./server"));

var _mongodb = require("mongodb");

var _dataDAO = require("./dao/dataDAO");

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
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(client) {
    return _regenerator["default"].wrap(function _callee$(_context) {
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