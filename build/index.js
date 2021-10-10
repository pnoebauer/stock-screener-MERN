"use strict";

var _server = _interopRequireDefault(require("./server"));

var _mongodb = require("mongodb");

var _dataDAO = require("./dao/dataDAO");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
// require('@babel/register');
require('dotenv').config();

// // import DataCtrl from '../src/api/data.controller';
const port = process.env.PORT || 8000; // console.log('running', process.env.MONGODB_URI);

_mongodb.MongoClient.connect(process.env.MONGODB_URI, {
  // wtimeout: 25000,
  // poolSize: 50,
  useNewUrlParser: true // useUnifiedTopology: true,

}).catch(err => {
  console.error(err.stack, '-----error stack');
  process.exit(1);
}).then(async client => {
  // console.log(client);
  await _dataDAO.DataDAO.injectDB(client); // await StockDataDAO.injectDB(client);
  // await UsersDAO.injectDB(client);
  // await CommentsDAO.injectDB(client);
  // 		// DataCtrl.apiGetData();

  _server.default.listen(port, () => {
    console.log(`listening on port ${port}`);
  }); // console.log(`listening on port ${port}`);

});
//# sourceMappingURL=index.js.map