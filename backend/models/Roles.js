    // Schema và Model cho vai trò

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 50
    },
    description: {
        type: String,
        minlength: 3,
        maxlength: 50
    },
    performance: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Permission'  // Tham chiếu đến model 'Permission'
        }
    ]
});

// Tạo index cho trường 'name' để tối ưu hóa truy vấn tìm kiếm vai trò theo tên
roleSchema.index({ name: 1 });

module.exports = mongoose.model('Role', roleSchema);