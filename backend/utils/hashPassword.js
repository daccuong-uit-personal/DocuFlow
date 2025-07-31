// Hàm mã hóa mật khẩu

const bcrypt = require('bcryptjs');
//Băm
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}
//So sánh mật khẩu đã băm và mật khẩu nhập vào
const comparePassword = async (input, hashed) => {
    return await bcrypt.compare(input, hashed);
}

module.exports = { hashPassword, comparePassword };