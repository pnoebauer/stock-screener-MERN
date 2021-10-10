"use strict";

var _server = _interopRequireDefault(require("./server"));

var _mongodb = require("mongodb");

var _dataDAO = require("./dao/dataDAO");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import DataCtrl from '../src/api/data.controller';
const port = process.env.PORT || 8000;
console.log('running', process.env.MONGODB_URI);

_mongodb.MongoClient.connect(process.env.MONGODB_URI, {
  // wtimeout: 25000,
  // poolSize: 50,
  useNewUrlParser: true // useUnifiedTopology: true,

}).catch(err => {
  console.error(err.stack, '-----error stack');
  process.exit(1);
}).then(async client => {
  await _dataDAO.DataDAO.injectDB(client);
  await _dataDAO.StockDataDAO.injectDB(client); // await UsersDAO.injectDB(client);
  // await CommentsDAO.injectDB(client);
  // DataCtrl.apiGetData();

  _server.default.listen(port, () => {
    console.log(`listening on port ${port}`);
  }); // console.log(`listening on port ${port}`);

}); // const uri =
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