const Joi = require("joi");
const { Schema, model } = require("mongoose");
const  Eyetracking  = require("./eyetrackingModel");

const eyeTrackingPositionSchema = new Schema({
    eyeTrackingModelId: {
        type: Schema.Types.ObjectId,
        ref: 'Eyetracking', // Reference to EyeTrackingModel if necessary
        required: true,
    },
    XPos: {
        type: Number,
        required: true,
    },
    YPos: {
        type: Number,
        required: true,
    },
});


const validateEyeTrackingPosition = (eyeTrackingPosition) => {
    const schema = Joi.object({
        eyeTrackingModelId: Joi.string().required(),
        XPos: Joi.number().required(),
        YPos: Joi.number().required(),
    });
    return schema.validate(eyeTrackingPosition);
};

const EyeTrackingPosition = model("EyeTrackingPosition", eyeTrackingPositionSchema);

module.exports = { EyeTrackingPosition, validateEyeTrackingPosition };
