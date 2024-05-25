exports.generateDefaultResponseObject = ({ 
    success=false,
    message='',
    data=null,
    error=null,
}) => {
    return {
        success: success,
        message: message,
        data: data,
        error: error,
    }
}

exports.ResponseObject = ({ 
    success=false,
    message='',
    data=null,
    error=null,
}, status) => {
    return status.json({
        success: success,
        message: message,
        data: data,
        error: error,
    })
}