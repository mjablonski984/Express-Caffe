const express = require('express');
const errorhandler = require('errorhandler');
const cors = require('cors');
const app = express();
const apiRouter = require('./api/api');
const createTables = require('./migration');

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
app.use(errorhandler());
app.use('/api', apiRouter);

createTables();

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = app;
