const Joi = require("joi");
const { Schema, SchemaTypes, model } = require("mongoose");

const participantSchema = new Schema({
    email: {
        type: SchemaTypes.String,
        required: true,
    },
    name: {
        type: SchemaTypes.String,
        required: true,
    },
    event_id: {
        type: SchemaTypes.ObjectId,
        ref: 'Event',
        required: true,
    },
    user_image: {
        type: SchemaTypes.String,
    },
    user_lat: {
        type: SchemaTypes.Number,
    },
    user_lon: {
        type: SchemaTypes.Number,
    },
    time_started: {
        type: SchemaTypes.Date,
    },
    hours_spent_in_event: {
        type: SchemaTypes.Number,
        default: 0,
    },
    deleted: {
        type: SchemaTypes.Boolean,
        default: false
    },
    editing_allowed: {
        type: SchemaTypes.Boolean,
        default: true,
    },
}, { timestamps: true })

const validParticipantUpdateTypes = ['time-started', 'hours-spent', 'location'];

const validateParticipantData = (participantObj, isUpdating=false, updateType='') => {
    let validParticipantSchema;

    if (isUpdating) {
        if (!validParticipantUpdateTypes.includes(updateType)) return {
            error: {
                details: [
                    {
                        message: "'type' missing in request params"
                    },
                ]
            }
        };

        if (updateType === 'time-started') {
            validParticipantSchema = Joi.object({
                participant_id: Joi.string().hex().required(),
                event_id: Joi.string().hex().required(),
            })
        }

        if (updateType === 'hours-spent') {
            validParticipantSchema = Joi.object({
                hours_spent_in_event: Joi.number().required(),
                participant_id: Joi.string().hex().required(),
                event_id: Joi.string().hex().required(),
            })
        }
        
        if (updateType === 'location') {
            validParticipantSchema = Joi.object({
                user_lat: Joi.number().required(),
                user_lon: Joi.number().required(),
                participant_id: Joi.string().hex().required(),
                event_id: Joi.string().hex().required(),
            })
        }
        
    } else {
        validParticipantSchema = Joi.object({
            name: Joi.string().min(2).required(),
            email: Joi.string().email({ minDomainSegments: 2 }).required(),
            event_id: Joi.string().hex().required(),
            user_image: Joi.string().min(0),
            user_lat: Joi.number(),
            user_lon: Joi.number(),
            hours_spent_in_event: Joi.number(),
        })
    }

    return validParticipantSchema.validate(participantObj);
}

const Participant = model('participant', participantSchema);

module.exports = {
    Participant,
    validateParticipantData,
    validParticipantUpdateTypes,
}