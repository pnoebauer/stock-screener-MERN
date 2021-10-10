"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _server = _interopRequireDefault(require("./server"));

var _mongodb = require("mongodb");

var _dataDAO = require("./dao/dataDAO");

// require('dotenv').config();
// import express from 'express';
// const app = express();
// app.get('/', (req, res) => {
// 	res.status(200).json({message: 'Welcome to Node.js & Express'});
// });
// const port = process.env.PORT || 8000;
// app.listen(port, () => {
// 	console.log(`App is running on port ${port}`);
// });
// import 'core-js';
require('dotenv').config();

// // import DataCtrl from '../src/api/data.controller';
var port = process.env.PORT || 8000; // console.log('running', process.env.MONGODB_URI);

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
            // await StockDataDAO.injectDB(client);
            // await UsersDAO.injectDB(client);
            // await CommentsDAO.injectDB(client);
            // 		// DataCtrl.apiGetData();
            _server["default"].listen(port, function () {
              console.log("listening on port ".concat(port));
            }); // console.log(`listening on port ${port}`);


          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
//# sourceMappingURL=index.js.map