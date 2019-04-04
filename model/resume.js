const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resumeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    experience: [
        {
            position: {
                type: String,
                required: true
            },
            company: {
                type: String,
                required: true
            },
            from: {
                type: String,
                require: true
            },
            to: {
                type: String,
                require: true
            },
            description: {
                type: String,
            },
        }
    ],
    skills: {
        type: [String],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = resumes = mongoose.model('resume', resumeSchema);