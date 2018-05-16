const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');
const router = require('./routes');

//creates an express application
const app = express();

// middleware for logging
app.use(logger('dev'));

//middleware for parsing json data coming with the request
app.use(bodyParser.json());

//To serve static files such as images, CSS files, and JavaScript files
app.use(express.static(path.resolve(__dirname, 'public')));

//middleware and routing system
app.use('/', router);

const port = 4400;
app.listen(port, () => {
    const host = "localhost";
    console.log(`App is running @ http://${host}:${port}/`);
});