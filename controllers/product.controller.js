const ProductService = require('../services').product;

module.exports = {
    async getAllProduct(req, res) {
        try {
            const data = await ProductService.findAllProduct();
            return res.status(200).json(data);
        } catch (error) {
            console.error(error);
            return res.status(500).send("Internal Server Error");
        }
    }
};