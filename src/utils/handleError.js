const loggerStream = require('./handleLogger');

const handleHttpError = (res, message, code = 403) => {

    if (code >= 500 && code < 600) {
        const formatted = `[${code}] ${message}`;
        loggerStream.write(formatted);
    }

    res.status(code).send(message);
};

module.exports = { handleHttpError };