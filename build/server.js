'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// // import movies from '../src/api/movies.route';
// // import users from '../src/api/users.route';

// import data from '../src/api/data.route';

var app = (0, _express2.default)();

app.use((0, _cors2.default)());
// process.env.NODE_ENV !== 'prod' && app.use(morgan('dev'));
app.use(_express2.default.json());
app.use(_express2.default.urlencoded({ extended: true }));

// app.use('/api/v1/user', data);

// // // Register api routes
// // app.use('/api/v1/movies', movies);
// // app.use('/api/v1/user', users);
// // app.use('/status', express.static('build'));
// // app.use('/', express.static('build'));
app.get('/', function (req, res) {
	res.json('This is working');
});

// app.use('*', (req, res) => res.status(404).json({error: 'not found'}));

exports.default = app;
//# sourceMappingURL=server.js.map