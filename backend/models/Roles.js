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
    permissions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Permission'
        }
    ]
});

roleSchema.index({ name: 1 });

module.exports = mongoose.model('Role', roleSchema);