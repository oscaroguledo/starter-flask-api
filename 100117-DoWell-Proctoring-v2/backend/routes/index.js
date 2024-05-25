const { handle_404_requests } = require("../controller/errorRouteController");
const statusRoutes = require("./statusRoutes");
const sampleRoutes = require("./sampleRoutes");
const eventRoutes = require("./eventRoutes");
const screenshotRoutes = require("./screenshotRoutes");
const eyetrackingdataRoutes = require("./eyetrackingdataRoutes")
const participantRoutes = require("./participantRoutes")
const messageRoutes = require("./messageRoutes")
const eyetrackingpositionRoutes = require("./eyetrackingpositionRoutes")
const faceCompareRoutes = require("./faceCompareRoutes");


module.exports = (app) => {
    // declaring all the different parent paths to be used in the api
    app.use("/api/v1/status", statusRoutes);
    app.use("/api/v1/samples", sampleRoutes);
    app.use("/api/v1/events", eventRoutes);
    app.use("/api/v1/screenshots", screenshotRoutes);
    app.use("/api/v1/eyetrackingdata", eyetrackingdataRoutes);
    app.use("/api/v1/eyetrackingposition", eyetrackingpositionRoutes);
    app.use("/api/v1/participants", participantRoutes);
    app.use("/api/v1/message", messageRoutes);
    app.use("/api/v1/facecompare", faceCompareRoutes);
    
    
    // handle unknown routes
    app.use(handle_404_requests);
}
