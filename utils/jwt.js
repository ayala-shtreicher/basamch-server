const jwt = require("jsonwebtoken");
/**
 * 
 * @param {object} payload 
 * @returns {string}
 * 
 */
const jwtSecret= '123@@';
exports.generateToken = (payload) => {
    try {
        const token = jwt.sign({ ...payload },jwtSecret , { expiresIn: '2h' });
        return token;
    } catch (error) {
        throw Error(error.message);
    }
};

/**
 * 
 * @param {string} token 
 * @returns {object}
 */

exports.decodeToken = (token) => {
    try {
        const payload = jwt.verify(token, jwtSecret); //vs decode
        return payload;
    } catch (error) {
        throw Error(error.message);
    }
};


