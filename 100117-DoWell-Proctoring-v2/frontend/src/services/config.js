import axios from 'axios';


// different API base URLs
const loginBaseUrl = 'https://100014.pythonanywhere.com/api/';
const clientAdminBaseUrl = 'https://100093.pythonanywhere.com/api/';
const currentBaseApiOrigin = 'http://localhost:5000'; // local
//const currentBaseApiOrigin = 'https://www.dowellproctoring.uxlivinglab.online'; // prod


// CONFIG FOR PEERJS (TO USE LOCALLY: comment 17-20 and uncomment 12-15)
// // Local environment usage
const peerServerPort = 9000;
const peerServerHost = 'localhost';
const peerServerPath = '/myapp';

// Default values for production environment
// const peerServerPort = 9000;
// const peerServerHost = 'dowellproctoring.uxlivinglab.online';
// const peerServerPath = '/peer/myapp'; //previous : '/dowellproctoring/peer/myapp'


// creating separate axios instances for each API interaction
const loginAxiosInstance = axios.create({
    baseURL: loginBaseUrl,
    withCredentials: true,
})

const clientAdminAxiosInstance = axios.create({
    baseURL: clientAdminBaseUrl,
    withCredentials: true,
})

const defaultAxiosInstance = axios.create({
    baseURL: `${currentBaseApiOrigin}/api/v1`, // local usage
    //baseURL: `${currentBaseApiOrigin}/backend/api/v1/`, // production usage //previous:`${currentBaseApiOrigin}/dowellproctoring-backend/api/v1/`
    withCredentials: true,
})


export {
    loginAxiosInstance,
    clientAdminAxiosInstance,
    defaultAxiosInstance,
    currentBaseApiOrigin,
    peerServerHost,
    peerServerPort,
    peerServerPath,
}
