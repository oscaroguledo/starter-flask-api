const Joi = require("joi");
const { Schema, model } = require("mongoose");
const Event = require("./eventModel");
const participant = require("./participantModel")

const eyetrackingSchema = new Schema({
    participant_id: {
        type: Schema.Types.ObjectId,
        ref: 'participant',
        required: true,
    },
    event_id: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
});

const validateEyetracking = (eyetracking) => {
    const schema = Joi.object({
        participant_id: Joi.string().required(),
        event_id: Joi.string().required(),
    });
    return schema.validate(eyetracking);
};

const Eyetracking = model("Eyetrackingmodel", eyetrackingSchema);

module.exports = { Eyetracking, validateEyetracking };
