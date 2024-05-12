// Initialize the required modules for file system operations
const fs = require('fs');
// Import utilities for constructing a standardized response object and face detection functions
const { generateDefaultResponseObject } = require("../utils/defaultResponseObject");
const { loadModels, compareFaces } = require('../utils/faceDetectorUtils');

// Define a class to handle face comparison requests
class FaceCompareController {
  // A static method to compare faces from uploaded images
  static async compare(req, res) {
    // Check if both image files are provided in the request
    if (!req.files || !req.files.image1 || !req.files.image2) {
      // Respond with 400 Bad Request if one or both images are missing
      return res.status(400).send('Both images must be provided.');
    }

    // Retrieve file paths of the uploaded images
    const image1Path = req.files.image1[0].path;
    const image2Path = req.files.image2[0].path;

    try {
      // Load models (if not already loaded) and prepare faceapi instance
      const faceapi = await loadModels();
      // Compare the two faces using the loaded models and the paths provided
      const [distance, result] = await compareFaces(faceapi, image1Path, image2Path);

      // Delete the images after processing
      fs.unlink(image1Path, err => {
        if (err) console.error("Failed to delete image1:", err);
      });
      fs.unlink(image2Path, err => {
        if (err) console.error("Failed to delete image2:", err);
      });

      // Construct a response based on the comparison result
      if (result === true) {
        // If faces match, respond with 200 OK and details including the similarity score
        return res.status(200).json(generateDefaultResponseObject({
          success: true,
          message: "Faces match",
          data: {
            match: result,
            EuclideanDistanceScore: distance
          },
          error: null
        }));
      }
      // If faces do not match, respond similarly with the outcome and similarity score
      return res.status(200).json(generateDefaultResponseObject({
        success: true,
        message: "Faces do not match",
        data: {
            match: result,
            EuclideanDistanceScore: distance
          },
        error: null
      }));
    } catch (error) {
      // Delete the images after processing
      fs.unlink(image1Path, err => {
        if (err) console.error("Failed to delete image1:", err);
      });
      fs.unlink(image2Path, err => {
        if (err) console.error("Failed to delete image2:", err);
      });
      // Handle errors such as model loading failures or image processing issues
      return res.status(500).json(generateDefaultResponseObject({
        success: false,
        message: error.toString(),
        data: null,
        error: null
      }));
    }
  }
}

// Export the controller for use in other parts of the application, typically in routes
module.exports = FaceCompareController;
