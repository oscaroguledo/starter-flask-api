const { default: mongoose } = require("mongoose");
const { generateDefaultResponseObject } = require("../utils/defaultResponseObject");

const validateMongooseId = (id) => {
    /**
     * Checks if a string is a valid mongo id.
     * 
     * @param id The string(possible mongo id) you would like to check.
     * 
     * @returns true | false
     */
    
    try {
        // creating a new mongo id
        let validId = new mongoose.Types.ObjectId(id);
        return true;
    
    } catch (error) {
        return false;
    }
}

exports.validateMongoIdParam = (req, res, next) => {
    const { id } = req.params;
    
    if (!id) return res.status(400).json(generateDefaultResponseObject({
        success: false,
        message: "'id' required",
    }));

    if (!validateMongooseId(id)) return res.status(400).send(generateDefaultResponseObject({
        success: false,
        message: "Invalid id provided"
    }));

    next();
}
