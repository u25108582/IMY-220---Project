const express = require("express");
const cors = require('cors');
const { MongoClient, ObjectId } = require("mongodb");

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
        const usersCollection = db.collection("users");
        const count = await postsCollection.countDocuments();

        if (count === 0) {
            const bob = await usersCollection.findOne({ username: "BobTheTomatoe" });
            const vsauce = await usersCollection.findOne({ username: "Vsause" });
            const spaceLover = await usersCollection.findOne({ username: "SpaceLover23" });

            await postsCollection.insertMany([
                {
                    Title: "Classic song",
                    Author: "BobTheTomatoe",
                    Images: [],
                    Tags: ["RickRoll", "Music", "Interesting Facts"],
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
                    Tags: ["Philosophy", "Chair", "yes"],
                    Likes: 649000,
                    Comments: [
                        { username: "SomePerson", comment: "I think so" }
                    ]
                },
                {
                    Title: "New space Walkpapers?",
                    Author: "SpaceLover23",
                    Images: [],
                    Tags: ["Earth", "Space", "Cool"],
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

app.post("/posts", async (req, res) => {
    try {
        const { Title, Author, Images, Image, Tags } = req.body;
        const postImages = Images || Image;

        if (!Title || !Author || !postImages) {
            return res.status(400).json({ 
                error: "Title, Author, and Image(s) are required" 
            });
        }
        
        const postsCollection = db.collection("posts");

        const newPost = {
            Title,
            Author,
            Images: Array.isArray(postImages) ? postImages : [postImages],
            Tags: Array.isArray(Tags) ? Tags : (Tags ? [Tags] : []),
            Likes: 0,
            Comments: [],
            Posted: new Date()
        };

        const result = await postsCollection.insertOne(newPost);
        console.log("Created post");

        await postsCollection.findOne({ _id: result.insertedId });

        return res.status(201).json({
            message: "Created Post",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Failed to create post",
            details: error.message
        });
    }
});

app.get("/users", async (req, res) => {
    try {
        const usersCollection = db.collection("users");
        const count = await usersCollection.countDocuments();

        if (count === 0) {
            await usersCollection.insertMany([
                {
                    username: "BobTheTomatoe",
                    password: "password123",
                    about: "I love classic songs and singing.",
                    socials: { twitter: "@bobtomat", github: "bobtomato" },
                    profilePhoto: "",
                    email: "bob@example.com",
                    gender: "male"
                },
                {
                    username: "Vsause",
                    password: "password123",
                    about: "Or do I?",
                    socials: { youtube: "vsauce" },
                    profilePhoto: "",
                    email: "vsauce@example.com",
                    gender: "male"
                },
                {
                    username: "SpaceLover23",
                    password: "password123",
                    about: "Looking at the stars all day.",
                    socials: { instagram: "@spacelover" },
                    profilePhoto: "",
                    email: "space@example.com",
                    gender: "male"
                }
            ]);
        }

        const users = await usersCollection.find({}).toArray();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Unable to retrieve users"
        });
    }
});

app.get("/user/:id", async (req, res) => {
    try {
        const username = req.params.username;
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // const { password, ...other } = user;

        return res.status(200).json(user);2
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Failed to retrieve user profile",
            details: error.message
        });
    }
});

app.get("/post/:id", async (req, res) => {
    try {
        const postId = req.params.id;

        if (!ObjectId.isValid(postId)) {
            return res.status(400).json({ error: "Invalid post ID format" });
        }

        const postsCollection = db.collection("posts");
        const post = await postsCollection.findOne({ _id: new ObjectId(postId) });

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        return res.status(200).json(post);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Failed to retrieve post",
            details: error.message
        });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { userOrEmail, password } = req.body;

        if (!userOrEmail || !password) {
            return res.status(400).json({ 
                error: "Username/Email and Password are required"
            });
        }

        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({
            $or: [{ username: userOrEmail }, { email: userOrEmail }]
        });

        if (!user || user.password !== password) {
            console.log("Incorrect login details");
            return res.status(401).json({
                error: "Invalid login details"
            });
        }

        console.log("import { useState, useEffect } from 'react';:", user.username);
        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
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
            email
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

app.delete("/post/:id", async (req, res) => {
    try {
        const postId = req.params.id;

        if (!ObjectId.isValid(postId)) {
            return res.status(400).json({ error: "Invalid post ID format" });
        }

        const postsCollection = db.collection("posts");
        const result = await postsCollection.deleteOne({ _id: new ObjectId(postId) });

        if (result.deletedCount == 0) {
            return res.status(404).json({ error: "Post not found" });
        }

        console.log("Deleted post");
        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Could not delete post",
            details: error.message
        });
    }
});

app.delete("/user/:id", async (req, res) => {
    try {
        const userId = req.params.id;

        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID format" });
        }

        const usersCollection = db.collection("users");
        const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        console.log("Deleted user");
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Failed to delete user",
            details: error.message
        });
    }
});

app.delete("/other/reset", async (req, res) => {
    try {
        const usersCollection = db.collection("users");
        const postsCollection = db.collection("posts");

        const userDeleteResult = await usersCollection.deleteMany({});
        const postDeleteResult = await postsCollection.deleteMany({});

        console.log(`Reset triggered: Deleted ${userDeleteResult.deletedCount} users and ${postDeleteResult.deletedCount} posts.`);

        return res.status(200).json({
            message: "Database reset successful. All users and posts have been deleted.",
            deletedUsersCount: userDeleteResult.deletedCount,
            deletedPostsCount: postDeleteResult.deletedCount
        });
    } catch (error) {
        console.error("Error resetting database:", error);
        return res.status(500).json({
            error: "Failed to reset database",
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