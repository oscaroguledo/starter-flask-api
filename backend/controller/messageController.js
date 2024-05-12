const { Message, validateMessage } = require('../models/messageModel');
const { Types} = require("mongoose"); // Adjust import statement
const { ObjectId } = Types; // Import ObjectId explicitly
const { generateDefaultResponseObject } = require("../utils/defaultResponseObject");
const { Event } = require('../models/eventModel');
const { Participant } = require("../models/participantModel");

exports.addmessage = async (data) => {
    try {
        // Validate request body
        const { error, value } = validateMessage(data);
        //const { error, value } = validateEventsChatStore(data);
        if (error) {
            return {
                success: false,
                message: error.details[0].message,
                data: null,
                error: null
            };
        }

        // Check if the event referenced by event_id exists
        const foundEvent = await Event.findById(value.eventId);
        if (!foundEvent) {
            // If event not found, return 404
            return {
                success: false,
                message: 'Event could not be found',
            };
        }

        // Create a new event chat entry
        const message = new Message({
            eventId: value.eventId,
            useremail: value.useremail,
            username: value.username,
            message: value.message,
            tagged: value.tagged
        });
        console.log("3")
        // Save the event chat entry to the database
        await message.save();

        // Return the created event chat entry
        return {
            success: true,
            message: "Event message created successfully",
            data: message,
            error: null
        };
    } catch (err) {
        // Handle errors
        console.error("Error creating event chat:", err);
        return {
            success: false,
            message: "Internal Server Error",
            data: null,
            error: err.message
        };
    }
};
exports.addmessageapi = async (req, res) => {
    try {
        // Validate request body
        const body ={...req.body};
        body.tagged=[];
        const { value, error } = validateMessage(body);
        //const { error, value } = validateEventsChatStore(data);
        if (error) {
            return res.status(404).json(generateDefaultResponseObject({
                success: false,
                message: error.details[0].message,
                data: null,
                error: null
            }));
        }

        // Check if the event referenced by event_id exists
        const foundEvent = await Event.findById(value.eventId);
        if (!foundEvent) {
            // If event not found, return 404
            return res.status(400).json(generateDefaultResponseObject({
                success: false,
                message: 'Event could not be found',
            }));
        }

        // Create a new event chat entry
        const participant = await Participant.find({event_id: value.eventId});
        
        const message = new Message({
            eventId: value.eventId,
            useremail: value.useremail,
            username: value.username,
            message: value.message,
            tagged: participant.filter(i => value.message.includes('@' + i._id)).map(i => i._id),
        });
        // Save the event chat entry to the database
        await message.save();

        // Return the created event chat entry
        return res.status(200).json(generateDefaultResponseObject({
            success: true,
            message: "Event message created successfully",
            data: message,
            error: null
        }));
    } catch (err) {
        // Handle errors
        console.error("Error creating event chat:", err);
        return res.status(400).json(generateDefaultResponseObject({
            success: false,
            message: "Internal Server Error",
            data: null,
            error: err.message
        }));
    }
};
exports.updatemessage = async (req, res) => {
    const value ={...req.body};

    try {
        // Create a new event chat entry
        const participant = await Participant.find({event_id: value.eventId});
        const message = await Message.findOneAndUpdate(
            { _id: value.messageId, eventId: value.eventId, editing_allowed: true }, 
            { $set: 
                {'message':value.message,'tagged':participant.filter(i => value.message.includes('@' + i._id)).map(i => i._id)} 
            }, 
            { new: true }
        );
        
        if (!message) return res.status(404).json(generateDefaultResponseObject({
            success: false,
            message: 'Message details either does not exist or editing of details has been disabled',
        }));

        return res.status(200).json(generateDefaultResponseObject({
            success: true,
            message: 'Successfully updated Message details',
            data: message,
        }));

    } catch (error) {
        return res.status(500).json(generateDefaultResponseObject({
            success: false,
            message: 'An error occured trying to save Message details',
            error: error,
        }));
    }
}
exports.getByParams = async (req, res) => {
    let query = {};
    if (req.body.start_date) {
        query.createdAt = {
            $gte: req.body.start_date
        };
    }
    if (req.body.end_date) {
        query.createdAt = {
            $lte: req.body.end_date
        };
    }

    // Construct the query object dynamically based on the parameters received
    if (req.body.eventId) query.eventId = req.body.eventId;
    if (req.body.username) query.useremail = req.body.username;
    if (req.body.useremail) query.useremail = req.body.useremail;
    if (req.body.messageId) query._id = req.body.messageId;
    if (req.body.message) query.message = req.body.message;
    
    if (req.body.createdAt) query.createdAt = req.body.createdAt;
    if (req.body.deleted) query.deleted = req.body.deleted;
    
    
    try {
        if (req.body.tagged && Array.isArray(req.body.tagged)) {
            // Convert each string to a valid ObjectId
            const taggedIds = req.body.tagged.map(id => new ObjectId(id));
            query.tagged = taggedIds;
        }
        const messages = await Message.find(query);
        return res.status(200).json(generateDefaultResponseObject({
            success: true,
            message: 'Messages retrieved successfully',
            data: messages}, res.status(200)));
    } catch (error) {
        return res.status(200).json(generateDefaultResponseObject({
            success: false,
            message: 'Failed to retrieve Messages',
            error: error,
        }, res.status(400)));
    }
}
exports.harddelete = async (req, res) => {
    let query = {};
    if (req.body.start_date) {
        query.createdAt = {
            $gte: req.body.start_date
        };
    }
    if (req.body.end_date) {
        query.createdAt = {
            $lte: req.body.end_date
        };
    }

    // Construct the query object dynamically based on the parameters received
    if (req.body.eventId) query.eventId = req.body.eventId;
    if (req.body.username) query.useremail = req.body.username;
    if (req.body.useremail) query.useremail = req.body.useremail;
    if (req.body.messageId) query._id = req.body.messageId;
    if (req.body.message) query.message = req.body.message;
    
    if (req.body.createdAt) query.createdAt = req.body.createdAt;
    if (req.body.deleted) query.deleted = req.body.deleted;
    
    try {
        if (req.body.tagged && Array.isArray(req.body.tagged)) {
            // Convert each string to a valid ObjectId
            const taggedIds = req.body.tagged.map(id => new ObjectId(id));
            query.tagged = taggedIds;
        }
        const messages = await Message.find(query);
        if (messages.length==0){
            return res.status(200).json(generateDefaultResponseObject({
                success: false,
                message: 'No Messages found matching query criteria'
            }, res.status(404)));
        }
        for (let i = 0; i < messages.length; i++) {
            const id = messages[i]._id;
            const deletedmessage = await Message.findByIdAndDelete(id);
            
            if (!deletedmessage) {
                return res.status(200).json(generateDefaultResponseObject({
                    success: false,
                    message: 'Failed to retrieve Messages',
                    error: `Message with id: ${id} not deleted`
                }, res.status(404)));
            }
        }
        
        return res.status(200).json(generateDefaultResponseObject({
            success: true,
            message: 'Successfully deleted Message(s).'}, res.status(200)));
    } catch (error) {
        return res.status(200).json(generateDefaultResponseObject({
            success: false,
            message: 'Failed to retrieve Messages',
            error: error,
        }, res.status(400)));
    }
}
exports.softdelete = async (req, res) => {
    let query = {};
    if (req.body.start_date) {
        query.createdAt = {
            $gte: req.body.start_date
        };
    }
    if (req.body.end_date) {
        query.createdAt = {
            $lte: req.body.end_date
        };
    }

    // Construct the query object dynamically based on the parameters received
    if (req.body.eventId) query.eventId = req.body.eventId;
    if (req.body.username) query.useremail = req.body.username;
    if (req.body.useremail) query.useremail = req.body.useremail;
    if (req.body.messageId) query._id = req.body.messageId;
    if (req.body.message) query.message = req.body.message;
    if (req.body.createdAt) query.createdAt = req.body.createdAt;
    if (req.body.deleted) query.deleted = req.body.deleted;
    
    try {
        if (req.body.tagged && Array.isArray(req.body.tagged)) {
            // Convert each string to a valid ObjectId
            const taggedIds = req.body.tagged.map(id => new ObjectId(id));
            query.tagged = taggedIds;
        }
        const messages = await Message.find(query);
        if (messages.length == 0) {
            return res.status(404).json({
                success: false,
                message: 'No Messages found matching query criteria'
            });
        }
        for (let i = 0; i < messages.length; i++) {
            const id = messages[i]._id;
            // Soft delete by updating the deleted field to true
            const deletedmessage = await Message.findByIdAndUpdate(id, { deleted: true });
            if (!deletedmessage) {
                return res.status(404).json({
                    success: false,
                    message: `Message with id: ${id} not found`
                });
            }
        }
        return res.status(200).json({
            success: true,
            message: 'Successfully deleted Message(s)'
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Failed to delete Message(s)',
            error: error.message
        });
    }
}

