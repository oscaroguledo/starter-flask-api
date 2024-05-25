const Joi = require("joi");
const { Schema, SchemaTypes, model } = require("mongoose");

//screenshot schema
const screenshotSchema = new Schema({
    event_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref:"Event"
    },
    participant_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref:"participant"
    },
    name: {
        type: SchemaTypes.String,
        required: true,
    },
    email: {
        type: SchemaTypes.String,
        required: true,
    },
    image: {
        type: SchemaTypes.String,
        required: true,
    },
}, {timestamps:true})


// function to validate screenshot data
const validateScreenShotData = (ScreenShotData) => {
    const validation = Joi.object({
        event_id:Joi.string().length(24).hex().required(),
        participant_id: Joi.string().length(24).hex().required(),
        name: Joi.string().required(),
        email: Joi.string().email({ minDomainSegments: 2 }).required(),
        image: Joi.string().required(),
    })
    return validation.validate(ScreenShotData);
}

// model for screenshots
const ScreenShot = model('ScreenShot', screenshotSchema);

module.exports = {
    ScreenShot,
    validateScreenShotData,
}