"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// // import movies from '../src/api/movies.route';
// // import users from '../src/api/users.route';
// import data from '../src/api/data.route';
const app = (0, _express.default)();
app.use((0, _cors.default)()); // process.env.NODE_ENV !== 'prod' && app.use(morgan('dev'));

app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: true
})); // app.use('/api/v1/user', data);
// // // Register api routes
// // app.use('/api/v1/movies', movies);
// // app.use('/api/v1/user', users);
// // app.use('/status', express.static('build'));
// // app.use('/', express.static('build'));

app.get('/', (req, res) => {
  res.json('This is working');
}); // app.use('*', (req, res) => res.status(404).json({error: 'not found'}));

var _default = app;
exports.default = _default;
//# sourceMappingURL=server.js.map