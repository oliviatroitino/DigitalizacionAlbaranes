require("dotenv").config();
const { Readable } = require('stream');

const pinataSDK = require('@pinata/sdk');
const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_API_KEY);

function bufferToStream(buffer) {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
}

const uploadToPinataSDK = async (fileBuffer, fileName) => {
    try {   
        const fileStream = bufferToStream(fileBuffer);

        const options = {
            pinataMetadata: {
                name: fileName
            },
            pinataOptions: {
                cidVersion: 1
            }
        };
        const result = await pinata.pinFileToIPFS(fileStream, options);
        return result;
    } catch (error) {
        console.error('Error subiendo archivo a Pinata:', error);
        throw error;
    }
};

module.exports = {uploadToPinataSDK}

