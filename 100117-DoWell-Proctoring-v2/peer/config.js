const { ExpressPeerServer } = require("peer");
const { peerServerPath } = require("./utils");

module.exports = (app, server, allowedOrigins=[]) => {
    const peerServer = ExpressPeerServer(server, {
        debug: true,
        path: `/${peerServerPath}`,
        corsOptions: {
            origin: allowedOrigins,
        },
    });

    peerServer.on("connection", (connection) => {
        console.log("Checking connection!");
        console.log("New peer connection with id: ", connection.id);
    })

    app.use('/', peerServer);
}