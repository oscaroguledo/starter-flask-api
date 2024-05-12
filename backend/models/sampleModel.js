const Joi = require("joi");
const { Schema, SchemaTypes, model } = require("mongoose");

// creating a sample schema
const sampleSchema = new Schema({
    event_id: {
        type: SchemaTypes.ObjectId,
        required: true,
        ref:"Event"
    },


    name: {
        type: SchemaTypes.String,
        required: true,
    },
    age: {
        type: SchemaTypes.Number,
        required: true,
    },
    email: {
        type: SchemaTypes.String,
        required: true,
        unique: true,
    },
    isValid: {
        type: SchemaTypes.Boolean,
        default: true,
    },
    gender: {
        type: SchemaTypes.String,
        required: true,
        enum: ['M', 'F'],
    },
}, {timestamps:true})

// function to validate sample data
const validateSampleData = (sampleData, isExistingData=false) => {
    let validDetails;
    
    if (isExistingData) {
        validDetails = Joi.object({
            name: Joi.string().required(),
            age: Joi.number().required(),
            isValid: Joi.boolean(),
            gender: Joi.string().required().valid('M', 'F'),
        })
    } else {
        validDetails = Joi.object({
            name: Joi.string().required(),
            age: Joi.number().required(),
            email: Joi.string().email({ minDomainSegments: 2 }).required(),
            isValid: Joi.boolean(),
            gender: Joi.string().required().valid('M', 'F'),
        })
    }

    return validDetails.validate(sampleData);
}

// model for the samples
const SampleModel = model('sample', sampleSchema);

module.exports = {
    SampleModel,
    validateSampleData,
}