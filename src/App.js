const express = require("express");
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();

const Database = require('../schemas/Database');

const geocodingAPIURL = process.env.GEOCODE_API

// Listen to API routes.
app.get("/", (req, res) => {
    res.json("API is running.");
});

app.get('/documentation', (req, res) => {
    res.sendFile(path.resolve(__dirname, './documentation.html'));
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
        if (follows.length > 0) {
            res.status(200).json({ message: `Successfully found all user's followed by the user.`, data: follows });
        } else {
            res.status(404).json({ message: `The specified user is not following any other users.` });
        }
    }).catch((err) => {
        res.status(500).json({ error: err });
    });
});

// Get all users which are following the user with the provided Mongo ObjectId (_id).
app.get('/api/follows/followers/:id', (req, res) => {
    const { id } = req.params;

    Database.findFollowersByUser(id).then((followers) => {
        if (followers.length > 0) {
            res.status(200).json({ message: `Successfully found all user's followers.`, data: followers });
        } else {
            res.status(404).json({ message: `The specified user has no followers.` });
        }
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
app.get('/api/contactrequests/single/:id', (req, res) => {

    const { id } = req.params;

    Database.findContactRequestById(id).then((request) => {
        res.status(200).json({ message: `The requested contact request was found.`, data: request });
    }).catch(err => {
        res.status(500).json({ error: err });
    });

});

// Find all contact requests submitted by a specific user.
app.get('/api/contactrequests/user/:id', (req, res) => {
    const { id } = req.params;

    Database.findContactRequestsByUser(id).then((requests) => {
        if (requests.length > 0) {
            res.status(200).json({ message: `Successfully found all support requests made by the specified user.`, data: requests });
        } else {
            res.status(404).json({ message: `The specified user has not made any support requests.` });
        }
    }).catch(err => {
        res.status(500).json({ error: err });
    });
});

    // Contact Request Topic Routes
// Add a new contact request topic to the database.
app.post('/api/supporttopics', (req, res) => {
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
app.get('/api/supporttopics', (req, res) => {
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
app.get('/api/supporttopics/:id', (req, res) => {
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

    // Event Routes
// Add an event to the database.
app.post('/api/events', (req, res) => {

    if (!req.body.eventData) { res.status(400).json({ error: `Event data must be provided.` }); }
    else {

        let event = req.body.eventData;

        // Take string location, plug it into geocoding api
        fetch(`${geocodingAPIURL}${event.location.replace(' ', '+')}`, { method: "GET" }).then((data) => {
            console.log(`Data: ${JSON.stringify(data)}`);
            return data.json();
        }).then((locationData) => {
            console.log(`LOCATION DATA: ${JSON.stringify(locationData.results[0])}`);
            // Check to make sure that the location is valid (has all of the basic fields).
            if (locationData.results[0].locations[0].street === "" && locationData.results[0].locations[0].adminArea6 === "" && locationData.results[0].locations[0].adminArea5 === "" && locationData.results[0].locations[0].adminArea4 !== "" && locationData.results[0].locations[0].adminArea3 === "") {

                res.status(400).json({ error: `The location provided could not be found.` });

            }
            else {
                // Store geocoding result to variable
                let lData = {
                    lat: locationData.results[0].locations[0].latLng.lat,
                    lon: locationData.results[0].locations[0].latLng.lng
                }

                // Update eventData location to have the lat and long
                event.location = lData;

                // Pass the updated eventData to the addEvent function.
                Database.addEvent(event).then(savedEvent => {
                    res.status(201).json({ message: `The event was successfully registered.`, data: savedEvent });
                }).catch((err) => {
                    res.status(500).json({ error: err });
                });
            }

        }).catch((err) => {
            console.log(`ERROR: ${err}`);
            res.status(500).json({ error: err });
        });

    }

});

// Get all events from the database.
app.get('/api/events', (req, res) => {

    Database.getAllEvents().then((events) => {
        if (events.length > 0) {
            res.status(200).json({ message: `Successfully found all events.`, data: events });
        } else { res.status(404).json({ message: `There are no events currently in the database.` }); }
    }).catch((err) => { res.status(500).json({ error: err }); });

});

// Get event by event ObjectId (_id).
app.get('/api/events/single/:id', (req, res) => {
    const { id } = req.params;

    Database.getSingleEventbyEventID(id).then((event) => {

        res.status(200).json({ message: `Successfully found the requested event.`, data: event });

    }).catch(err => { res.status(500).json({ error: err }); });
});

// Get all events by host ObjectId (_id).
app.get('/api/events/user/:id', (req, res) => {

    const { id } = req.params;

    Database.getAllEventsbyUserID(id).then((events) => {
        if (events.length > 0) {
            res.status(200).json({ message: `Successfully found all events hosted by the specified user.`, data: events });
        } else {
            res.status(404).json({ message: `The specified user has no hosted events.` });
        }
    }).catch(err => {
        res.status(500).json({ error: err });
    });

});

    // EventCategory Routes
// Add an event category to the database.
app.post('/api/eventcategories', (req, res) => {
    if (!req.body.categoryData) { res.status(400).json({ error: `Category data must be provided.` }); }
    else {
        Database.createEventCategory(req.body.categoryData).then((category) => {
            res.status(201).json({ message: `The event category was successfully saved.`, data: category });

        }).catch((err) => { res.status(500).json({ error: err }); });

    }
});

// Get all event categories from the database.
app.get('/api/eventcategories', (req, res) => {
    
    Database.getAllEventCategories().then((categories) => {
        if (categories.length > 0) {
            res.status(200).json({ message: `Successfully got all event categories.`, data: categories });
        } else {
            res.status(404).json({ message: `There are currently no saved event categories.` });
        }
    }).catch(err => { res.status(500).json({ error: err }); });

});

// Get a single event category by it's ObjectId (_id).
app.get('/api/eventcategories/:id', (req, res) => {

    const { id } = req.params;

    Database.getEventCategoryById(id).then((category) => {
        res.status(200).json({ message: `Successfully retrieved the requested event category.`, data: category });
    }).catch((err) => { res.status(500).json({ error: err  }); });

});

    // Event Report Routes
// Save a new event report into the database.
app.post('/api/eventreports', (req, res) => {
    if (!req.body.reportData) {
        res.status(400).json({ error: `Report data must be provided.` });
    } else {

        Database.addEventReport(req.body.reportData).then((report) => {
            res.status(201).json({ message: `Successfully saved the provided report.`, data: report });
        }).catch((err) => {
            res.status(500).json({ error: err });
        });

    }
});

// Get all event reports
app.get('/api/eventreports', (req, res) => {
    Database.getEventReports().then((reports) => {
        if (reports.length > 0) {
            res.status(200).json({ message: `Successfully retrieved all event reports.`, data: reports });
        } else {
            res.status(404).json({ message: `There are currently no event reports.` });
        }
    }).catch(err => { res.status(500).json({ error: err }); });
});

    // Event Report Topic Routes
// Add a new event report topic to the database.
app.post('/api/reporttopics', (req, res) => {
    if (!req.body.topicData) { res.status(400).json({ error: `Report topic data must be provided.` }); }
    else {
        Database.addReportTopic(req.body.topicData).then((topic) => {
            res.status(201).json({ message: `The report topic was successfully saved.`, data: topic });
        }).catch((err) => {
            res.status(500).json({ message: err });
        });
    }
});

// Get all event report topics in the database.
app.get('/api/reporttopics', (req, res) => {
    Database.getReportTopics().then((topics) => {
        if (topics.length > 0) {
            res.status(200).json({ message: `Successfully retrieved all report topics.`, data: topics });
        }
        else {
            res.status(404).json({ message: `There are currently no report topics saved in the database.` });
        }
    })
})

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