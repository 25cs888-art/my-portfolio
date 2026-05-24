// backend/models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    techStack: {
        type: [String], // Array of strings, e.g., ["React", "Node.js", "MongoDB"]
        required: true
    },
    liveLink: {
        type: String,
        default: ""
    },
    githubLink: {
        type: String,
        default: ""
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('Project', projectSchema);