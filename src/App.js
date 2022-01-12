const express = require("express");
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();

const Database = require('../schemas/Database');

// Listen to API routes.
app.get("/", (req, res) => {
    res.json("API is running.");
});

    // User Routes
// Find a specific user's data by their Firebase UUID.
app.get('/api/users/:uuid', (req, res) => {
    const { uuid } = req.params;

    Database.getUserById(uuid).then((user) => {
        if (user) {
            res.status(200).json({
                message: `User found successfully.`,
                data: user
            });
        } else {
            res.status(404).json({ error: `Could not find any matching users.` });
        }
    }).catch((err) => {
        res.status(500).json({ error: err });
    })

});

// Add new user data to the database.
app.post('/api/users', (req, res) => {
    if (!req.body.userData) {
        res.status(400).json({ error: `User data must be provided.` });
    }
    else {

        Database.addUser(req.body.userData).then((user) => {
            res.status(201).json({ message: `Successfully saved user data.`, data: user });
        }).catch((err) => {
            res.status(400).json({ error: err });
        });

    }
});

    // Follow Routes
app.get('/api/follows/user/:id', (req, res) => {
    const { id } = req.params;

    Database.findFollowsByUser(id).then((follows) => {
        res.status(200).json({ message: `Successfully found all user's followed by the user.`, data: follows });
    }).catch((err) => {
        res.status(500).json({ error: err });
    });
});

app.post('/api/follows', (req, res) => {
    if (!req.body.followData) {
        res.status(400).json({ error: `Follow data must be provided.` });
    } else {

        Database.addFollow(req.body.followData).then((follow) => {
            res.status(201).json({ message: `Successfully registered new user follow.`, data: follow });
        }).catch((err) => {
            res.status(400).json({ error: err });
        });

    }
});

// Connect to the database and start the server if successful.
const PORT = process.env.PORT || 8080;
var dbURL = process.env.MONGO_URL;

Database.connect(dbURL).then(() => {
    app.listen(PORT, () => {
        console.log("API is listening on port " + PORT);
    });
}).catch((err) => {
    console.log(`Could not start the API server.\n${err}`);
});