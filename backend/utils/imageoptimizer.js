exports.compressString = (str) => {
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
exports.decompressString = (compressedStr) => {
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

