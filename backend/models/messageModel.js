const Joi = require("joi");
const { Schema, SchemaTypes, model } = require("mongoose"); // Adjust import statement
const { ObjectId } = SchemaTypes; // Import ObjectId explicitly
const Event = require("./eventModel");

const messageSchema = new Schema({
    eventId: {
        type: ObjectId,
        ref: 'Event',
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    useremail: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    tagged:{
        type:Array,
        required:true,
    },
    deleted: {
        type: SchemaTypes.Boolean,
        default: false
    },
    editing_allowed: {
        type: SchemaTypes.Boolean,
        default: true,
    },
    image: {
        type: SchemaTypes.String,
        required: false,
    },
}, { timestamps: true });

const validateMessage = (messageObject, isUpdating=false) => {
    let schema;
    if (isUpdating) {
        schema = Joi.object({
            messageId: Joi.string().hex().required(),
            eventId: Joi.string().hex().required(),
            message: Joi.string().required(),
        });
        
    } else {schema = Joi.object({
        eventId: Joi.string().hex().required(),
        username: Joi.string().required(),
        useremail: Joi.string().email({ minDomainSegments: 2 }).required(),
        message: Joi.string().required(),
        tagged:Joi.array().required(),
    });}
    return schema.validate(messageObject);
};

const Message = model("Message", messageSchema);

module.exports = { Message, validateMessage };
