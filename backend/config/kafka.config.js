const { Kafka } = require("kafkajs");
const ip = require("ip");

require('dotenv').config();
const HOST = process.env.KAFKA_HOST || ip.address();
module.exports.config = {
    PORT: process.env.PORT || 8005,
    IP: process.env.IP || process.env.IPDEV,
    MONGO_DB_URI: process.env.MONGO_DB_URI || process.env.MONGO_DB_URI_DEV
};

module.exports.kafkaClient = new Kafka({
    clientId: "proctoring-app",
    brokers: [`${HOST}:9092`],
}); 

