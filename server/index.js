require('dotenv').config();
const util = require('util');
const express = require('express');
const bodyParser = require('body-parser');
const Messenger = require('./modules/messenger');

process.env.NODE_ENV='production';

const messenger = new Messenger();
const app = new express();
const expressPort = process.env.PORT || 5000;
const routes = require('./routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

require('./routes')(app);

app.listen(expressPort, () => console.log(`Rover app listening on port ${expressPort}!`));
