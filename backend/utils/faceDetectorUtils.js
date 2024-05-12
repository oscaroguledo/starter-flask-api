// Required modules
const fs = require('fs');
const path = require('path');
const faceapi = require('face-api.js');
const canvas = require('canvas');

// Set up canvas elements for face-api.js
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Define the path to the models directory
const MODELS_PATH = path.resolve(__dirname, '../aiFaceModels/');

// Flag to check if models have been initialized
let initialized = false;

// Function to load models from disk
async function loadModels() {
    // Return early if models are already loaded
    if (initialized) return faceapi;

    // Check if the models directory exists, throw error if not
    if (!fs.existsSync(MODELS_PATH)) {
        throw new Error(`Models not found at ${MODELS_PATH}`);
    }

    // Load specific face detection and recognition models
    await faceapi.nets.tinyFaceDetector.loadFromDisk(MODELS_PATH);
    await faceapi.nets.faceLandmark68TinyNet.loadFromDisk(MODELS_PATH);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODELS_PATH);
    
    // Set the initialized flag to true after successful loading
    initialized = true;
    console.log("Models loaded successfully.");
    return faceapi;
}

// Function to compare two faces
async function compareFaces(faceapi=null, image1Path=null, image2Path=null) {
  // Throw error if faceapi is not provided
  if (!faceapi) {
    throw new Error("Model not provided");
  }

  // Ensure both image paths are provided
  if (!image1Path || !image2Path) {
    throw new Error("Both images must be provided.");
  }

  // Load images using the canvas API
  const img1 = await canvas.loadImage(image1Path);
  const img2 = await canvas.loadImage(image2Path);

  // Perform face detection and obtain face descriptors
  const detections1 = await faceapi.detectSingleFace(img1, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks(true).withFaceDescriptor();
  const detections2 = await faceapi.detectSingleFace(img2, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks(true).withFaceDescriptor();

  // Handle case where faces are not detected in one or both images
  if (!detections1 || !detections2) {
    throw new Error("Faces not found in one or both images.");
  }

  // Calculate the Euclidean distance between the two face descriptors
  const distance = faceapi.euclideanDistance(detections1.descriptor, detections2.descriptor);

  // Log and return results based on the distance threshold
  if (distance < 0.5) {
    console.log("Faces match.");
    return [distance, true];
  } else {
    console.log("Faces do not match.");
    return [distance, false];
  }
}

// Export functions for use in other parts of the application
module.exports = {
  loadModels,
  compareFaces
};
