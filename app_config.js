const http = require('http');
const port = process.env.PORT || 5000;
const express = require('express');
const app = express();
module.exports = app;
const server = http.createServer(app);
var session = require('express-session');
var bodyParser = require('body-parser');
var helmet = require('helmet');


app.listen(port);
app.disable('x-powered-by');
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(session({
	secret: 'mandarkoso',
	saveUninitialized: false,
	resave: false
}));