const Product = require('../models').Product;

module.exports = {
    async findAllProduct() {
        return await Product.findAll();
    }
};