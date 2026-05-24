const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Project = require('./models/Project'); // Import our project blueprint

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ROUTE 1: Fetch all projects from the database
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: "Server error fetching projects", error: error.message });
    }
});

// ROUTE 2: Quick helper route to inject a sample project directly into MongoDB
app.post('/api/projects/seed', async (req, res) => {
    try {
        const sampleProject = new Project({
            title: "My Full-Stack Portfolio",
            description: "A professional portfolio built to showcase development projects and skills.",
            techStack: ["MongoDB", "Express.js", "React", "Node.js"],
            liveLink: "https://myportfolio.vercel.app",
            githubLink: "https://github.com/balakumaran9407/portfolio"
        });

        const savedProject = await sampleProject.save();
        res.status(201).json({ message: "Sample project successfully added!", data: savedProject });
    } catch (error) {
        res.status(500).json({ message: "Error seeding database", error: error.message });
    }
});

// ROUTE 3: Add a new project from user input
app.post('/api/projects', async (req, res) => {
    try {
        const { title, description, techStack, liveLink, githubLink } = req.body;
        const newProject = new Project({
            title,
            description,
            techStack,
            liveLink,
            githubLink
        });

        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (error) {
        res.status(500).json({ message: "Error adding project", error: error.message });
    }
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas');
        app.listen(PORT, () => {
            console.log(`Server is running smoothly on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });