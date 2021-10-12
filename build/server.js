"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _data = _interopRequireDefault(require("./api/data.route"));

require('dotenv').config();

var app = (0, _express["default"])();
app.use((0, _cors["default"])());
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use('/api/v1/user', _data["default"]);
var port = process.env.PORT || 8000; // // Register api routes
// app.use('/api/v1/movies', movies);
// app.use('/api/v1/user', users);
// app.use('/status', express.static('build'));
// app.use('/', express.static('build'));

app.get('/', function (req, res) {
  res.json("This is working ".concat(port));
}); // app.use('*', (req, res) => res.status(404).json({error: 'not found'}));

var _default = app;
exports["default"] = _default;
//# sourceMappingURL=server.js.map