import { currentBaseApiOrigin } from "../services/config";
import { PUBLIC_USER_DETAIL_KEY_IN_LOCAL_STORAGE, USER_DETAIL_KEY_IN_SESSION } from "./constants"
import { io } from "socket.io-client";

//export const socketInstance = io('/backend'); // prod //previous : io('/dowellproctoring-backend')
export const socketInstance = io(`${currentBaseApiOrigin}`); // local

export const getSavedUserFromSessionStorage = () => {
    try {
        const savedUser = JSON.parse(sessionStorage.getItem(USER_DETAIL_KEY_IN_SESSION));
        return savedUser;        
    } catch (error) {
        return null
    }
}

export const getSavedPublicUserFromLocalStorage = () => {
    try {
        const savedPublicUser = JSON.parse(localStorage.getItem(PUBLIC_USER_DETAIL_KEY_IN_LOCAL_STORAGE));
        return savedPublicUser;        
    } catch (error) {
        return null
    }
}

export const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

export const addHoursToDate = (date, hours) => {
    return new Date(new Date(date).setHours(date.getHours() + hours));
}

export const compressString = (str) => {
    if (!str) return '';
    let compressed = '';
    let count = 1;

    for (let i = 0; i < str.length; i++) {
        let char;
        if (Number(str[i])>=0) {
            char = "~" + str[i];
        } else {
            char = str[i];
        }
        if (char === str[i + 1]) {
            count++;
        } else {
            compressed += char + (count > 1 ? count : '');
            count = 1;
        }
        //console.log(compressed);
    }
    return compressed;
}
function checkDigits(str) {
    const digitPattern = /\d/;
    return digitPattern.test(str);
  }
export const decompressString = (compressedStr) => {
    let decompressed = '';
    let currentChar = '';
    let countStr = '';

    for (let i = 0; i < compressedStr.length; i++) {
        const char = compressedStr[i];
        if (char === '~') {
            let x= 1
            while (checkDigits(compressedStr[i + x])){
                decompressed +=compressedStr[i + x];
                x++;
            }

            //countStr += compressedStr[i + x];
            
            i++; // Skip the tilde
        } else if (!isNaN(char)) {
            countStr += char;
        } else {
            if (countStr) {
                decompressed += currentChar.repeat(Number(countStr)-1);
                countStr = '';
            }
            // Add the current character to the decompressed string
            decompressed += char;
            currentChar = char;
        }
    }

    // Append the remaining characters if any
    if (countStr) {
        decompressed += currentChar.repeat(Number(countStr));
    }
    
    return decompressed;
}