const express = require("express");
const cors = require('cors');
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3000;

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017";
let db;

async function connectDB() {
    const client = new MongoClient(mongoURI);

    await client.connect();
    db = client.db("photoshare");
    
    console.log("Connected to MongoDB");
}

app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ message: "endpoints working" });
});

app.get("/posts", async (req, res) => {
    try {
        const postsCollection = db.collection("posts");
        const count = await postsCollection.countDocuments();

        if (count == 0) {
            await postsCollection.insertMany([
                {
                    Title: "Classic song",
                    Author: "BobTheTomatoe",
                    Images: [],
                    Tags: ["#RickRoll", "#Music", "#Interesting Facts"],
                    Likes: 2500,
                    Comments: [
                        { username: "ThatsMyBoy", comment: "Thats interesting" },
                        { username: "FatherHelp", comment: "I got rickrolled D:" }
                    ]
                },
                {
                    Title: "Do Chairs exist?",
                    Author: "Vsause",
                    Images: [],
                    Tags: ["#Philosophy", "#Chair", "#yes"],
                    Likes: 649000,
                    Comments: [
                        { username: "SomePerson", comment: "I think so" }
                    ]
                },
                {
                    Title: "New space Walkpapers?",
                    Author: "SpaceLover23",
                    Images: [],
                    Tags: ["#Earth", "#Space", "#Cool"],
                    Likes: 87,
                    Comments: []
                }
            ]);
        }

        const posts = await postsCollection.find({}).toArray();
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Unable to retrieve posts"
        });
    }
});

app.post("/login", async (req, res) => {
    try {
        const identifier = req.body.username || req.body.email || req.body.usernameOrEmail;
        const { password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ 
                error: "Username/Email and Password are required"
            });
        }

        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({
            $or: [{ username: identifier }, { email: identifier }]
        });

        if (!user || user.password !== password) {
            console.log("Incorrect login details");
            return res.status(401).json({
                error: "Invalid login details"
            });
        }

        console.log("Logging in user:", user.username);
        return res.status(200).json({
            message: "Login successful",
            user: {
                username: user.username,
                email: user.email,
                about: user.about || "",
                socials: user.socials || {},
                profilePhoto: user.profilePhoto || "",
                gender: user.gender || ""
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Failed to login"
        });
    }
});

app.post("/signup", async (req, res) => {
    try {
        const { username, password, about, socials, profilePhoto, email } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ 
                error: "Username, Email, and Password are required"
            });
        }

        const usersCollection = db.collection("users");

        const exists = await usersCollection.findOne({ username });
        if (exists) {
            return res.status(409).json({ error: "Username already exists" });
        }

        exists = await usersCollection.findOne({ email });
        if (exists) {
            return res.status(409).json({ error: "Email already registered" });
        }

        const newUser = {
            username,
            password,
            about: about || "",
            socials: socials || {},
            profilePhoto: profilePhoto || "",
            email,
            createdAt: new Date()
        };

        const result = await usersCollection.insertOne(newUser);
        console.log("Created account ");

        return res.status(201).json({ 
            message: "Created Account successfully" 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Could not create account",
            details: error.message
        });
    }
});


connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running: http://localhost:${PORT}`);
        });
    }).catch((error) => {
        console.error("Unable to connect to MongoDB:", error);
    });