const express = require('express');
const app = express();

const insights = require('../controllers/insights.js');

app
.use('/', insights)

module.exports = app;