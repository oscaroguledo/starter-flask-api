const express = require('express');
const router = express.Router();
const { EyeTrackingPosition, validateEyeTrackingPosition } = require('../models/eyetrackingpositionModel');
const { generateDefaultResponseObject } = require("../utils/defaultResponseObject");
const { Participant } = require("../models/participantModel");
const { Eyetracking } = require('../models/eyetrackingModel');
const {Producer, Consumer} = require('../utils/kafka');

const create_new_eyetracking_position = async (req, res) => {
    try {
        // Validate the request body
        const { error, value } = validateEyeTrackingPosition(req.body);
        if (error) {
            return res.status(400).json(generateDefaultResponseObject({
                success: false,
                message: error.details[0].message
            }));
        }

        // Check if eye tracking model exists
        const eyeTrackingModel = await Eyetracking.findById(value.eyeTrackingModelId);
        if (!eyeTrackingModel) {
            // If eye tracking model not found, return 404
            return res.status(404).json(generateDefaultResponseObject({
                success: false,
                message: 'Eye tracking model could not be found',
            }));
        }
        // Create a new eye tracking position object
        const eyeTrackingPosition = new EyeTrackingPosition({
            eyeTrackingModelId: value.eyeTrackingModelId,
            XPos: value.XPos,
            YPos: value.YPos,
        });

        // Save the eye tracking position to the database
        await eyeTrackingPosition.save();

        const dataToSave = {
            eyeTrackingModelId: eyeTrackingPosition.eyeTrackingModelId,
            XPos: eyeTrackingPosition.XPos,
            YPos: eyeTrackingPosition.YPos,
            timestamp: Date().toString()
        };
        await Producer(dataToSave);

        return res.status(201).json(generateDefaultResponseObject({
            success: true,
            message: 'Eye tracking position created successfully',
            data: eyeTrackingPosition
        }));
    } catch (error) {
        return res.status(500).json(generateDefaultResponseObject({
            success: false,
            message: 'Failed to create eye tracking position',
            error: error.message
        }));
    }
};

module.exports = {
    create_new_eyetracking_position
};
