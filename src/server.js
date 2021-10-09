import express from 'express';

import cors from 'cors';

// import movies from '../src/api/movies.route';
// import users from '../src/api/users.route';

import data from '../src/api/data.route';

const app = express();

app.use(cors());
// process.env.NODE_ENV !== 'prod' && app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/v1/user', data);

// // Register api routes
// app.use('/api/v1/movies', movies);
// app.use('/api/v1/user', users);
// app.use('/status', express.static('build'));
// app.use('/', express.static('build'));
// app.use('*', (req, res) => res.status(404).json({error: 'not found'}));

export default app;
