const ProductService = require('../services').product;

module.exports = {
    async getAllProduct(req, res, next) {
        try {
            const data = await ProductService.findAllProduct();
            return res.status(200).json(data);
        } catch (error) {
            console.log("error in getAllProduct");
            next(error.message);
        }
    }
};