import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import data from './api/data.route';

import chartData from './api/chart-data.route';

import streamData from './api/events.route';

import universes from './api/universes.route';

require('dotenv').config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));
// app.use(morgan('combined'));

// const logger = new winston.Logger({
// 	transports: [
// 		new winston.transports.File({
// 			level: 'info',
// 			filename: './logs/all-logs.log',
// 			handleExceptions: true,
// 			json: true,
// 			maxsize: 5242880, //5MB
// 			maxFiles: 5,
// 			colorize: false,
// 		}),
// 		new winston.transports.Console({
// 			level: 'debug',
// 			handleExceptions: true,
// 			json: false,
// 			colorize: true,
// 		}),
// 	],
// 	exitOnError: false,
// });

// logger.stream = {
// 	write: function (message, encoding) {
// 		logger.info(message);
// 	},
// };

// app.use(require('morgan')('combined', {stream: logger.stream}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Register api routes
app.use('/api/v1/prices', data);
app.use('/api/v1/chart', chartData);
app.use('/api/v1/events', streamData);

app.use('/api/v1/universes', universes);

const port = process.env.PORT || 8000;

// app.use('/status', express.static('build'));
// app.use('/', express.static('build'));
app.get('/', (req, res) => {
	res.json(`Running on port ${port}`);
});

app.use('*', (req, res) => res.status(404).json({error: 'not found'}));

export default app;
