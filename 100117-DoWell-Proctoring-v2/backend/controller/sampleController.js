const { SampleModel, validateSampleData } = require("../models/sampleModel");
const { generateDefaultResponseObject } = require("../utils/defaultResponseObject");

exports.get_all_samples = async (req, res) => {
    try {
        const allSamples = await SampleModel.find({});
        
        return res.status(200).json(generateDefaultResponseObject({
            success: true,
            message: 'Successfully fetched all samples',
            data: allSamples,
        }));

    } catch (error) {
        return res.status(500).json(generateDefaultResponseObject({
            success: false,
            message: 'Failed to retrieve samples',
            error: error,
        }))
    }
}

exports.get_single_sample = async (req, res) => {
    const { id } = req.params;

    try {
        const foundSample = await SampleModel.findById(id);

        if (!foundSample) return res.status(404).json(generateDefaultResponseObject({
            success: false,
            message: 'Sample not found',
        }));

        return res.status(200).json(generateDefaultResponseObject({
            success: true,
            message: 'Successfully fetched single sample',
            data: foundSample,
        }));
    } catch (error) {
        return res.status(500).json(generateDefaultResponseObject({
            success: false,
            message: 'Failed to retrieve single sample',
            error: error,
        }))
    }
}

exports.create_new_sample = async (req, res) => {
    const { error, value } = validateSampleData(req.body);
    if (error) return res.status(400).json(generateDefaultResponseObject({
        success: false,
        message: error.details[0].message,
    }));

    try {
        const existingSampleWithEmail = await SampleModel.findOne({ email: value.email });

        if (existingSampleWithEmail) return res.status(409).json(generateDefaultResponseObject({
            success: false,
            message: 'Sample with passed email already exists',
        }));

    } catch (error) {
        return res.status(500).json(generateDefaultResponseObject({
            success: false,
            message: 'Failed to create new sample',
            error: error,
        }))
    }

    const newSample = new SampleModel(value);

    try {
        await newSample.save();

        return res.status(201).json(generateDefaultResponseObject({
            success: true,
            message: 'Successfully created new sample.',
            data: newSample,
        }));

    } catch (error) {
        return res.status(500).json(generateDefaultResponseObject({
            success: false,
            message: 'Failed to create new sample',
            error: error,
        }))
    }
}

exports.update_sample = async (req, res) => {
    const { id } = req.params;
    const { error, value } = validateSampleData(req.body, true);

    if (error) return res.status(400).json(generateDefaultResponseObject({
        success: false,
        message: error.details[0].message,
    }));

    try {
        const updatedSample = await SampleModel.findByIdAndUpdate(id, value, { new: true });
        
        if (!updatedSample) return res.status(404).json(generateDefaultResponseObject({
            success: false,
            message: 'Sample with passed id does not exist',
        }));

        return res.status(200).json(generateDefaultResponseObject({
            success: true,
            message: 'Successfully updated sample.',
            data: updatedSample,
        }));

    } catch (error) {
        return res.status(500).json(generateDefaultResponseObject({
            success: false,
            message: 'Failed to update sample',
            error: error,
        }))
    }   
}

exports.delete_sample = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedSample = await SampleModel.findByIdAndDelete(id);

        if (!deletedSample) return res.status(404).json(generateDefaultResponseObject({
            success: false,
            message: 'Sample with passed id does not exist',
        }));

        return res.status(200).json(generateDefaultResponseObject({
            success: true,
            message: 'Successfully deleted sample.',
        }));

    } catch (error) {
        return res.status(500).json(generateDefaultResponseObject({
            success: false,
            message: 'Failed to delete sample',
            error: error,
        }))
    }
}
