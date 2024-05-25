const morgan = require("morgan");
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

module.exports = (app, allowedOrigins=[]) => {
    // using morgan to log request details
    app.use(morgan('combined'));

    // configuring to parse any incoming json requests
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use(express.json());

    // configuring cors
    app.use(cors({
        origin: Array.isArray(allowedOrigins) ? allowedOrigins : [],
        credentials: true,
    }));

    // adding all the routes of the application
    require('../routes/index')(app);
};
