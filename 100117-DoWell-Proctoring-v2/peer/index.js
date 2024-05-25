const express = require("express");
const fs = require("fs");
const http = require("http");
const https = require("https");

require("dotenv").config();


// Creating a new express application
const app = express();

const isProduction = process.env.NODE_ENV === 'production';
const PORT = isProduction ? 443 : 9000; // Use 443 for production, 9000 for development

let httpsServer;

if (isProduction) {
    // Load SSL certificate and key
    // const privateKey = fs.readFileSync('/etc/letsencrypt/live/www.uxlive.me/privkey.pem', 'utf8');
    // const certificate = fs.readFileSync('/etc/letsencrypt/live/www.uxlive.me/fullchain.pem', 'utf8');
    // const ca = fs.readFileSync('/etc/letsencrypt/live/www.uxlive.me/chain.pem', 'utf8');
    const privateKey = "";
    const certificate = "";
    const ca = "";

    const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
    };

    // Create an HTTPS server
    httpsServer = https.createServer(credentials, app);
} else {
    // Create an HTTP server
    httpsServer = http.createServer(app);
}

// Loading and parsing all the permitted frontend URLs for CORS
let allowedOrigins = [];

try {
    //console.warn(process.env.FRONTEND_URLS);
    allowedOrigins = JSON.parse(process.env.FRONTEND_URLS);
} catch (error) {
    if (typeof window === 'undefined') {
        // Node.js environment
        console.log("\x1b[31m%s\x1b[0m", error);
        console.log(
            "\x1b[31m%s\x1b[0m",
            "Error parsing the 'FRONTEND_URLS' variable stored in your .env file. Please make sure it is in this format: ", '["valid_url_1", "valid_url_2"]'
        );
    } else {
        // Browser environment
        console.log(`%c${error}`, "color: red;", "color: black;");
        console.log(
            "%cError parsing the 'FRONTEND_URLS' variable stored in your .env file. Please make sure it is in this format: %c['valid_url_1', 'valid_url_2']",
            "color: red;", "color: black;"
        );
    }

}

// Adding peer server
require('./config')(app, httpsServer, allowedOrigins);

httpsServer.listen(PORT, () => {
    console.log(`${isProduction ? 'HTTPS' : 'HTTP'} server running on port ${PORT}`);
});
