export const handleRequestCameraPermission = async (
    requestVideo=true, 
    requestAudio=true,
) => {
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        try {
            let userStream = await navigator.mediaDevices.getUserMedia({
                video: requestVideo,
                audio: requestAudio,
            });

            return userStream;
        } catch (error) {
            return {
                error: 'Please check your camera is enabled and reload to approve media permission request'
            }
        }
    }
    
    return {
        error: 'Your device does not have a camera'
    };
}
