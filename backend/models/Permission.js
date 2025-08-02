// Schema và Model cho quyền hạn

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const permissionSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    description: {
        type: String,
        minlength: 3,
        maxlength: 250  
    }
});

permissionSchema.index({ name: 1 });

module.exports = mongoose.model('Permission', permissionSchema);