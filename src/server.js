import express from 'express';

import cors from 'cors';

import data from './api/data.route';

import chartData from './api/chart-data.route';

import streamData from './api/events.route';

import universes from './api/universes.route';

require('dotenv').config();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/v1/prices', data);
app.use('/api/v1/chart', chartData);
app.use('/api/v1/events', streamData);

app.use('/api/v1/universes', universes);

const port = process.env.PORT || 8000;
// // Register api routes
// app.use('/api/v1/movies', movies);
// app.use('/api/v1/user', users);
// app.use('/status', express.static('build'));
// app.use('/', express.static('build'));
app.get('/', (req, res) => {
	res.json(`Running on port ${port}`);
});

// app.use('*', (req, res) => res.status(404).json({error: 'not found'}));

export default app;
