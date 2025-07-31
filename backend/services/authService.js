// Logic nghiệp vụ cho xác thực
const User = require('../models/User');

exports.login = async (userName, password) => {
    const user = await User.findOne({ userName, password });
    return user;
};

exports.changePassword = async (userId, newPassword) => {
    const user = await User.findById(userId);
    if (!user) return null;
    user.password = newPassword;
    await user.save();
    return user;
};
