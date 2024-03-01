const auth = require('./auth.service');
const user = require('./user.service');
const product = require('./product.service');
const fileService = require('./upload-file.service');

module.exports = {
    auth,
    user,
    product,
    fileService,
};
