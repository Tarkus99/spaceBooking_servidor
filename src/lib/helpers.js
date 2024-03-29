const helpers = {};
const bcrypt = require('bcryptjs');

helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

helpers.matchPassword = async (password, saved) => {
    try {
        return await bcrypt.compare(password, saved);
    } catch (error) {
        console.log(error);
    }
}

module.exports = helpers;