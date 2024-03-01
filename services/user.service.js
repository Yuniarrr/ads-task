const userRepository = require('../repositories').users;

module.exports = {
    async updateUser(req, res) {
        console.log('Updating user');

        const { name } = req.body;
        let photo_profile;

        if (req.file) {
            const file = req.file;
            photo_profile = `uploads/${file.originalname}`;
        }

        const { id } = req.user;

        await userRepository.updateUser({ id: id }, {
            name,
            photo_profile,
        });
    },

    async findUserById(id) {
        const user = await userRepository.findUserById(id);

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }
}