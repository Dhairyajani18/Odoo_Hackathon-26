const User = require('../models/user');

const userController = {
    createUser: async (req, res) => {
        try {
            const { name, email, password, role } = req.body;
            const newUser = await User.create(name, email, password, role);
            res.status(201).json({ success: true, data: newUser });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    getUserById: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) return res.status(404).json({ success: false, message: 'User not found' });
            res.status(200).json({ success: true, data: user });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};

module.exports = userController;