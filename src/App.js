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

    // Follow Routes
// Register a new follow between two users in the Mongo database.
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

// Get all users followed by the user with the provided Mongo ObjectId (_id).
app.get('/api/follows/following/:id', (req, res) => {
    const { id } = req.params;

    Database.findFollowingByUser(id).then((follows) => {
        res.status(200).json({ message: `Successfully found all user's followed by the user.`, data: follows });
    }).catch((err) => {
        res.status(500).json({ error: err });
    });
});

// Get all users which are following the user with the provided Mongo ObjectId (_id).
app.get('/api/follows/followers/:id', (req, res) => {
    const { id } = req.params;

    Database.findFollowersByUser(id).then((followers) => {
        res.status(200).json({ message: `Successfully found all user's followers.`, data: followers });
    }).catch((err) => {
        res.status(500).json({ error: err });
    });
});

// Remove an existing follow relationship.
app.delete('/api/follows/:id', (req, res) =>{
    const { id } = req.params;

    Database.removeFollow(id).then((data) => {
        res.status(200).json({ message: data });
    }).catch((err) => {
        res.status(500).json({ error: err });
    });
});

    // Rating Routes
// Add a rating to the database.
app.post('/api/ratings', (req, res) => {

    if (!req.body.ratingData) { res.status(400).json({ error: `Rating data must be provided.` }); }
    else {

        Database.addRating(req.body.ratingData).then((rating) => {

            res.status(200).json({ message: `The rating was added successfully.`, data: rating });

        }).catch(err => {
            res.status(500).json({ error: err });
        });

    }

});

// Find ratings by user.
app.get('/api/ratings/:id', (req, res) => {
    const { id } = req.params;

    Database.getUserRatings(id).then((ratings) => {

        res.status(200).json({ message: `Successfully found all ratings for the specified user.`, data: ratings });

    }).catch(err => {
        res.status(500).json({ error: err });
    });
});

// Remove a rating with the specified id.
app.delete('/api/ratings/:id', (req, res) => {
    const { id } = req.params;

    Database.removeRating(id).then((msg) => {
        res.status(200).json({ message: msg });
    }).catch((err) => {
        res.status(500).json({ error: err });
    });
});

    // Contact Request Routes
// Add a contact request to the database.
app.post('/api/contactrequests', (req, res) => {

    if (!req.body.contactRequestData) { res.status(400).json({ error: `Contact request data must be provided.` }); }
    else {

        Database.addContactRequest(req.body.contactRequestData).then((requestData) => {
            res.status(201).json({ message: `The contact request was sent successfully.`, data: requestData });
        }).catch(err => {
            res.status(500).json({ error: err });
        });

    }

});

// Get all contact requests.
app.get('/api/contactrequests', (req, res) => {
    Database.getAllContactRequests().then((requests) => {
        res.status(200).json({ message: `Successfully retrieved all contact requests.`, data: requests });
    }).catch((err) => {
        res.status(500).json({ error: err });
    });
});

// Find a contact request by it's ObjectId (_id).
app.get('/api/contactrequests/:id', (req, res) => {

    const { id } = req.params;

    Database.findContactRequestById(id).then((request) => {
        res.status(200).json({ message: `The requested contact request was found.`, data: request });
    }).catch(err => {
        res.status(500).json({ error: err });
    });

});

    // Contact Request Topic Routes
// Add a new contact request topic to the database.
app.post('/api/contactrequests/topics', (req, res) => {
    if (!req.body.topicData) {
        res.status(400).json({ error: `Topic data must be provided.` });
    } else {
        Database.addContactTopic(req.body.topicData).then((topic) => {
            res.status(201).json({ message: `Saved the provided topic successfully.`, data: topic });
        }).catch(err => {
            res.status(500).json({ error: err });
        });
    }
});

// Get all contact requests in the database.
app.get('/api/contactrequests/topics', (req, res) => {
    Database.getAllContactTopics().then((topics) => {
        if (topics.length > 0) {
            res.status(200).json({ message: `Successfully retrieved all contact request topics.`, data: topics });
        } else {
            res.status(404).json({ message: `There are currently no contact request topics stored in the database.` });
        }
    }).catch(err => {
        res.status(500).json({ error: err });
    });
});

// Find a single contact request topic in the database by id.
app.get('/api/contactrequests/topics/:id', (req, res) => {
    const { id } = req.params;

    Database.findContactTopicById(id).then((topic) => {
        if (topic) { res.status(200).json({ message: `Successfully retrieved the requested contact request topic.`, data: topic }) }
        else {
            res.status(404).json({ message: `The requested contact request topic could not be found.` });
        }
    }).catch((err) => {
        res.status(500).json({ error: err });
    });
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