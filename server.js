const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
	res.json('This is working');
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
	console.log(`App is running on port ${port}`);
});
