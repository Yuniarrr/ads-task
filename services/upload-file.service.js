const fs = require('fs');
const path = require('path');

module.exports = {
    async getFile(req, res) {
        const { filename } = req.params;
        const filePath = path.join(__dirname, '..', 'uploads', filename);

        if (fs.existsSync(filePath)) {
            return res.sendFile(filePath);
        } else {
            return res.status(404).send('File not found');
        }
    }
}