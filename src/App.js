const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fetch = require('node-fetch');

const sendgrid = require('@sendgrid/mail');
const adminSDK = require("firebase-admin/app");
const { getAuth } = require('firebase-admin/auth');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.engine('html', require('ejs').renderFile);
app.set("views", path.join(__dirname, "../public"));

dotenv.config();

const sdkCreds = JSON.parse(process.env.FIREBASE_ADMIN_STUFF);

adminSDK.initializeApp({
  credential: adminSDK.cert(sdkCreds)
});

const Database = require('../schemas/Database');

const geocodingAPIURL = process.env.GEOCODE_API;

// Listen to API routes.
app.get('/', (req, res) => {
  res.json('API is running.');
});

app.get('/documentation', (req, res) => {
  res.render('documentation.html');
});

// User Routes
// Add new user data to the database.
app.post('/api/users', (req, res) => {
  
  if (!req.body.userData) {
    res.status(400).json({ error: `User data must be provided.` });
  } else {
    Database.addUser(req.body.userData)
      .then((user) => {

        const message = {
          from: {
            email: "eventhoodapp@gmail.com"
          },
          personalizations: [
            {
              to: [
                {
                  email: `${req.body.userData.email}`
                }
              ],
              dynamic_template_data: {
                username: `${req.body.userData.displayName}`
              }
            }
          ],
          template_id: 'd-13981076ca2a4681a3df228f95f04347'
        };

        sendgrid.send(message).then(() => {

        }).catch((err) => {
          console.log(err);
        });

        res.status(201).json({ message: `Successfully saved user data.`, data: user });
      })
      .catch((err) => {
        res.status(400).json({ error: err });
      });
  }
});

// Find a specific user's data by their Firebase UUID.
app.get('/api/users/:uuid', (req, res) => {
  
  // Authentication Route for Security
  // idToken comes from the client app
  const receivedAuth = req.headers.authorization;
  const token = receivedAuth?.split(' ')[1];

  getAuth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      const uid = decodedToken.uid;
      
      const { uuid } = req.params;

      if(uid == uuid)
      {
        Database.getUserById(uuid)
        .then((user) => {
          if (user) {
            res.status(200).json({
              message: `User found successfully.`,
              data: user,
            });
          } else {
            res.status(404).json({ error: `Could not find any matching users.` });
          }
        })
        .catch((err) => {
          res.status(500).json({ error: err });
        });
      }
      else{
        res.status(401).json({error: "Unauthenticated User, access denied"})
      }
    })
    .catch((err) => {
      // Handle error
      res.status(401).json({error: err});
    });

  // const { uuid } = req.params;

  // Database.getUserById(uuid)
  //   .then((user) => {
  //     if (user) {
  //       res.status(200).json({
  //         message: `User found successfully.`,
  //         data: user,
  //       });
  //     } else {
  //       res.status(404).json({ error: `Could not find any matching users.` });
  //     }
  //   })
  //   .catch((err) => {
  //     res.status(500).json({ error: err });
  //   });
});

// Get all users.
app.get('/api/users', (req, res) => {

  Database.getUsers()
    .then((users) => {
      if (users.length > 0) {
        res.status(200).json({ message: `Successfully retrieved all users.`, data: users });
      } else {
        res.status(404).json({ message: `There are currently no registered users.` });
      }
    })
    .catch((err) => res.status(500).json({ error: err }));
});

// Update user.
app.put('/api/users/:id', (req, res) => {

  const { id } = req.params;
  
  if (!req.body.userData) { res.status(400).json({ error: `User data must be provided.` }); }
  else {
    Database.updateUser(id, req.body.userData).then(uUser => {
      res.status(200).json({ message: `The user has been successfully updated.`, data: uUser });
    }).catch((err) => {
      res.status(500).json({ error: err });
    });
  }
});

// Follow Routes
// Register a new follow between two users in the Mongo database.
app.post('/api/follows', (req, res) => {

  const receivedAuth = req.headers.authorization;
  const token = receivedAuth?.split(' ')[1];

  // idToken comes from the client app
  getAuth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      const uid = decodedToken.uid;
      
      //Compare the user that is following towards the uid from decodedToken
      if (!req.body.followData) {
        res.status(400).json({ error: `Follow data must be provided.` });
      } else {
        if(req.body.followData.followedBy.uuid == uid)
        {
        Database.addFollow(req.body.followData)
          .then((follow) => {
            res.status(201).json({ message: `Successfully registered new user follow.`, data: follow });
          })
          .catch((err) => {
            res.status(400).json({ error: err });
          });
        }
        else
        {
          res.status(401).json({error: "Permissions do not meet required access for functionality. Please contact support."})
        }
      }
  })
  .catch((err) => {
    // Handle error
    res.status(401).json({error: err});
  });
});

// Get all users followed by the user with the provided Mongo ObjectId (_id).
app.get('/api/follows/following/:id', (req, res) => {
  const { id } = req.params;

  Database.findFollowingByUser(id)
    .then((follows) => {
      if (follows.length > 0) {
        res
          .status(200)
          .json({ message: `Successfully found all user's followed by the user.`, data: follows });
      } else {
        res.status(404).json({ message: `The specified user is not following any other users.` });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// Get all users which are following the user with the provided Mongo ObjectId (_id).
app.get('/api/follows/followers/:id', (req, res) => {

  const { id } = req.params;

  Database.findFollowersByUser(id)
    .then((followers) => {
      if (followers.length > 0) {
        res
          .status(200)
          .json({ message: `Successfully found all user's followers.`, data: followers });
      } else {
        res.status(404).json({ message: `The specified user has no followers.` });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// Remove an existing follow relationship.
app.delete('/api/follows/:id', (req, res) => {
  const { id } = req.params;

  Database.removeFollow(id)
    .then((data) => {
      res.status(200).json({ message: data });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// Rating Routes
// Add a rating to the database.
app.post('/api/ratings', (req, res) => {
  if (!req.body.ratingData) {
    res.status(400).json({ error: `Rating data must be provided.` });
  } else {
    Database.addRating(req.body.ratingData)
      .then((rating) => {
        res.status(200).json({ message: `The rating was added successfully.`, data: rating });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
});

// Find ratings by user.
app.get('/api/ratings/:id', (req, res) => {
  const { id } = req.params;

  Database.getUserRatings(id)
    .then((ratings) => {
      res
        .status(200)
        .json({ message: `Successfully found all ratings for the specified user.`, data: ratings });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// Remove a rating with the specified id.
app.delete('/api/ratings/:id', (req, res) => {
  const { id } = req.params;

  Database.removeRating(id)
    .then((msg) => {
      res.status(200).json({ message: msg });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// Contact Request Routes
// Add a contact request to the database.
app.post('/api/contactrequests', (req, res) => {
  if (!req.body.contactRequestData) {
    res.status(400).json({ error: `Contact request data must be provided.` });
  } else {
    Database.addContactRequest(req.body.contactRequestData)
      .then((requestData) => {
        Database.getUserByObjectId(req.body.contactRequestData.user).then((u) => {
          
          const message = {
            from: {
              email: "eventhoodapp@gmail.com"
            },
            personalizations: [
              {
                to: [
                  {
                    email: `${u.email}`
                  }
                ],
                dynamic_template_data: {
                  username: `${u.displayName}`,
                  requestId: `${requestData._id}`
                }
              }
            ],
            template_id: 'd-f123a0fb5ffd4ca39c7a231cf5daa4a3'
          };

          sendgrid.send(message).then(() => {
          }).catch(err => console.log(err));

        }).catch(err => console.log(err));
        
        res.status(201).json({ message: `The contact request was sent successfully.`, data: requestData });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
});

// Get all contact requests.
app.get('/api/contactrequests', (req, res) => {
  Database.getAllContactRequests()
    .then((requests) => {
      res
        .status(200)
        .json({ message: `Successfully retrieved all contact requests.`, data: requests });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// Find a contact request by it's ObjectId (_id).
app.get('/api/contactrequests/single/:id', (req, res) => {
  const { id } = req.params;

  Database.findContactRequestById(id)
    .then((request) => {
      res.status(200).json({ message: `The requested contact request was found.`, data: request });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// Find all contact requests submitted by a specific user.
app.get('/api/contactrequests/user/:id', (req, res) => {
  const { id } = req.params;
  const { includeClosed, includeClaimed } = req.query;

  Database.findContactRequestsByUser(id, includeClosed, includeClaimed)
    .then((requests) => {
      if (requests.length > 0) {
        res.status(200).json({
          message: `Successfully found all support requests made by the specified user.`,
          data: requests,
        });
      } else {
        res.status(404).json({ message: `The specified user has not made any support requests.` });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// Contact Request Topic Routes
// Add a new contact request topic to the database.
app.post('/api/supporttopics', (req, res) => {
  if (!req.body.topicData) {
    res.status(400).json({ error: `Topic data must be provided.` });
  } else {
    Database.addContactTopic(req.body.topicData)
      .then((topic) => {
        res.status(201).json({ message: `Saved the provided topic successfully.`, data: topic });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
});

// Get all contact requests in the database.
app.get('/api/supporttopics', (req, res) => {
  Database.getAllContactTopics()
    .then((topics) => {
      if (topics.length > 0) {
        res
          .status(200)
          .json({ message: `Successfully retrieved all contact request topics.`, data: topics });
      } else {
        res.status(404).json({
          message: `There are currently no contact request topics stored in the database.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// Find a single contact request topic in the database by id.
app.get('/api/supporttopics/:id', (req, res) => {
  const { id } = req.params;

  Database.findContactTopicById(id)
    .then((topic) => {
      if (topic) {
        res.status(200).json({
          message: `Successfully retrieved the requested contact request topic.`,
          data: topic,
        });
      } else {
        res
          .status(404)
          .json({ message: `The requested contact request topic could not be found.` });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// Event Routes
// Add an event to the database.
app.post('/api/events', (req, res) => {
  if (!req.body.eventData) {
    res.status(400).json({ error: `Event data must be provided.` });
  } else {
    let event = req.body.eventData;

    // Take string location, plug it into geocoding api
    fetch(`${geocodingAPIURL}${event.location.replace(' ', '%20')}`, { method: 'GET' })
      .then((data) => {
        return data.json();
      })
      .then((locationData) => {
        // Check to make sure that the location is valid (has all of the basic fields).
        let lData = {
          lat: locationData.features[0].properties.lat,
          lon: locationData.features[0].properties.lon,
          address: locationData.features[0].properties.formatted
        };

        // Update eventData location to have the lat and long
        event.location = lData;

        // Pass the updated eventData to the addEvent function.
        Database.addEvent(event)
          .then((savedEvent) => {
            res
              .status(201)
              .json({ message: `The event was successfully registered.`, data: savedEvent });
          })
          .catch((err) => {
            res.status(500).json({ error: err });
          });
      })
      .catch((err) => {
        console.log(`ERROR: ${err}`);
        res.status(500).json({ error: err });
      });
  }
});

// Get all events from the database.
app.get('/api/events', (req, res) => {
  Database.getAllEvents()
    .then((events) => {
      if (events.length > 0) {
        res.status(200).json({ message: `Successfully found all events.`, data: events });
      } else {
        res.status(404).json({ message: `There are no events currently in the database.` });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// Get event by event ObjectId (_id).
app.get('/api/events/single/:id', async (req, res) => {
  const { id } = req.params;

  Database.getSingleEventbyEventID(id)
    .then(async (event) => {
      let d;
      
      if (event.maxParticipants >= 1) {
        d = {
          ...event,
          currentlyRegistered: await Database.countEventRegistrationsByEvent(id)
        };
      } else {
        d = event;
      }

      res.status(200).json({ message: `Successfully found the requested event.`, data: d });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// Get all events by host ObjectId (_id).
app.get('/api/events/user/:id', (req, res) => {
  const { id } = req.params;

  Database.getAllEventsbyUserID(id)
    .then((events) => {
      if (events.length > 0) {
        res.status(200).json({
          message: `Successfully found all events hosted by the specified user.`,
          data: events,
        });
      } else {
        res.status(404).json({ message: `The specified user has no hosted events.` });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// Update the target event with the provided changes.
app.put('/api/events/:id', (req, res) => {
  const { id } = req.params;
  
  if (!req.body.eventData) { res.status(400).json({ error: `You must provide event data to update.` }); }
  else {

      //Adding in new event for update 
      let event = req.body.eventData;

      // Take new string location, plug it into geocoding api
      // Replace any spaces with %20 for api 
      if (event.location) {
        fetch(`${geocodingAPIURL}${event.location.replace(' ', '%20')}`, { method: 'GET' })
        .then((data) => {
          return data.json();
        })
          .then((locationData) => {
            // Check to make sure that the location is valid (has all of the basic fields).
            let lData = {
              lat: locationData.features[0].properties.lat,
              lon: locationData.features[0].properties.lon,
              address: locationData.features[0].properties.formatted
            };
    
            // Update eventData location to have the lat and long
            event.location = lData;
    
            //Pass the new updated event data to the updateEvent function
            Database.updateEvent(id, event)
              .then((updatedEvent) => {
              res.status(200).json({ message: `The event has been successfully updated.`, data: updatedEvent });
            }).catch(err => res.status(500).json({ error: err }));
        })
        .catch((err) => {
          console.log(`ERROR: ${err}`);
          res.status(500).json({ error: err });
        });
      } else {
        //Pass the new updated event data to the updateEvent function
        Database.updateEvent(id, event)
          .then((updatedEvent) => {
          res.status(200).json({ message: `The event has been successfully updated.`, data: updatedEvent });
        }).catch(err => res.status(500).json({ error: err }));
      }
  }
});

// Remove the target event.
app.delete('/api/events/:id', (req, res) => {
  const { id } = req.params;

  Database.deleteEvent(id).then(() => {
    res.status(200).json({ message: `The event has been successfully deleted.` });
  }).catch(err => res.status(500).json({ error: err }));
});

// EventCategory Routes
// Add an event category to the database.
app.post('/api/eventcategories', (req, res) => {
  if (!req.body.categoryData) {
    res.status(400).json({ error: `Category data must be provided.` });
  } else {
    Database.createEventCategory(req.body.categoryData)
      .then((category) => {
        res
          .status(201)
          .json({ message: `The event category was successfully saved.`, data: category });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
});

// Get all event categories from the database.
app.get('/api/eventcategories', (req, res) => {
  Database.getAllEventCategories()
    .then((categories) => {
      if (categories.length > 0) {
        res
          .status(200)
          .json({ message: `Successfully got all event categories.`, data: categories });
      } else {
        res.status(404).json({ message: `There are currently no saved event categories.` });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// Get a single event category by it's ObjectId (_id).
app.get('/api/eventcategories/:id', (req, res) => {
  const { id } = req.params;

  Database.getEventCategoryById(id)
    .then((category) => {
      res
        .status(200)
        .json({ message: `Successfully retrieved the requested event category.`, data: category });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// Event Report Routes
// Save a new event report into the database.
app.post('/api/eventreports', (req, res) => {
  if (!req.body.reportData) {
    res.status(400).json({ error: `Report data must be provided.` });
  } else {
    Database.addEventReport(req.body.reportData)
      .then((report) => {
        
        Database.getUserByObjectId(req.body.reportData.reportedBy).then((user) => {

          const message = {
            from: {
              email: "eventhoodapp@gmail.com"
            },
            personalizations: [
              {
                to: [
                  {
                    email: `${user.email}`
                  }
                ],
                dynamic_template_data: {
                  username: `${user.displayName}`
                }
              }
            ],
            template_id: 'd-1858fd6c28f949c2a833ef773bcdfa6d'
          };
  
          sendgrid.send(message).then(() => {
          }).catch((err) => {
            console.log(err);
          });

        }).catch(err => console.log(err));

        res.status(201).json({ message: `Successfully saved the provided report.`, data: report });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
});

// Get all event reports
app.get('/api/eventreports', (req, res) => {
  Database.getEventReports()
    .then((reports) => {
      if (reports.length > 0) {
        res
          .status(200)
          .json({ message: `Successfully retrieved all event reports.`, data: reports });
      } else {
        res.status(404).json({ message: `There are currently no event reports.` });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// Event Report Topic Routes
// Add a new event report topic to the database.
app.post('/api/reporttopics', (req, res) => {
  if (!req.body.topicData) {
    res.status(400).json({ error: `Report topic data must be provided.` });
  } else {
    Database.addReportTopic(req.body.topicData)
      .then((topic) => {
        res.status(201).json({ message: `The report topic was successfully saved.`, data: topic });
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  }
});

// Get all event report topics in the database.
app.get('/api/reporttopics', (req, res) => {
  Database.getReportTopics().then((topics) => {
    if (topics.length > 0) {
      res.status(200).json({ message: `Successfully retrieved all report topics.`, data: topics });
    } else {
      res
        .status(404)
        .json({ message: `There are currently no report topics saved in the database.` });
    }
  });
});

// Event Registration Routes
// Create a new event registration.
app.post('/api/eventregistrations', (req, res) => {
  if (!req.body.registrationData) {
    res.status(400).json({ error: `Event registration data must be provided.` });
  } else {
    Database.addEventRegistration(req.body.registrationData)
      .then((registration) => {

        Database.getEventRegistrationById(registration._id).then((registration) => {

          const message = {
            from: {
              email: "eventhoodapp@gmail.com"
            },
            personalizations: [
              {
                to: [
                  {
                    email: `${registration.user.email}`
                  }
                ],
                dynamic_template_data: {
                  username: `${registration.user.displayName}`,
                  eventHost: `${registration.event.host.displayName}`,
                  eventName: `${registration.event.name}`,
                  eventDate: `${registration.event.startTime}`
                }
              }
            ],
            template_id: 'd-ca6ce57e20fd4ea196981a56716951f4'
          };
  
          sendgrid.send(message).then(() => {
          }).catch((err) => {
            console.log(err);
          });

        }).catch(err => console.log(err));

        res.status(201).json({ message: `Successfull saved the event registration.`, data: registration });
      })
      .catch((err) => res.status(500).json({ error: err }));
  }
});

app.get("/api/eventregistrations/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: "You must include a registration id." });
  }

  Database.getEventRegistrationById(id).then((registration) => {
    res.status(200).json({ reg: registration });
  }).catch(err => res.status(500).json({ error: err }));
});

// Get all event registrations by user.
app.get('/api/eventregistrations/user/:id', (req, res) => {
  const { id } = req.params;

  Database.getAllUserRegisteredEvents(id)
    .then((registrations) => {
      if (registrations.length > 0) {
        res.status(200).json({
          message: `Successfully found all registered events for the provided user.`,
          data: registrations,
        });
      } else {
        res.status(404).json({ message: `The provided user has not registered for any events.` });
      }
    })
    .catch((err) => res.status(500).json({ error: err }));
});

// Get all event registrations by event.

//-----FAQ Topics------
// Get all FAQ Topic Route
app.get('/api/FAQTopics', (req, res) => {
  Database.getFAQTopics().then((FAQtopics) => {
    if (FAQtopics.length > 0) {
      res.status(200).json({ message: `Successfully retrieved all FAQ topics.`, data: FAQtopics });
    } else {
      res.status(404).json({ message: `There are currently no FAQ topics saved in the database.` });
    }
  });
});
// Add all FAQ Topic Route
app.post('/api/FAQTopics', (req, res) => {
  if (!req.body.faqTopicData) {
    res.status(400).json({ error: `FAQ topic data must be provided.` });
  } else {
    Database.addFAQTopics(req.body.faqTopicData)
      .then((FAQtopic) => {
        res.status(201).json({ message: `Successfull saved the new FAQ Topic.`, data: FAQtopic });
      })
      .catch((err) => res.status(500).json({ error: err }));
  }
});
// Delete all FAQ Topic Route
app.delete('/api/FAQTopics/:id', (req, res) => {
  const { id } = req.params;

  Database.deleteFAQTopics(id)
    .then((data) => {
      res.status(200).json({ message: data });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

//-----FAQ Questions------
// Get All FAQ Questiosn
app.get('/api/FAQQuestions', (req, res) => {
  Database.getAllFAQQuestions().then((FAQQuestions) => {
    if (FAQQuestions.length > 0) {
      res
        .status(200)
        .json({ message: `Successfully retrieved all FAQ Questions.`, data: FAQQuestions });
    } else {
      res
        .status(404)
        .json({ message: `There are currently no FAQ Questions saved in the database.` });
    }
  });
});

// Get FAQ Question by topic
app.get('/api/FAQQuestions/:id', (req, res) => {
  const { id } = req.params;

  Database.getFAQQuestionByTopic(id)
    .then((questions) => {
      if (questions.length > 0) {
        res.status(200).json({
          message: `Successfully retrieved all questions for the provided topic.`,
          data: questions,
        });
      } else {
        res
          .status(404)
          .json({ message: `There are currently no questions available for the selected topic.` });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// Add FAQ Question
app.post('/api/FAQQuestions', (req, res) => {
  if (!req.body.faqQuestionData) {
    res.status(400).json({ error: `FAQ Question data must be provided.` });
  } else {
    Database.addFAQQuestion(req.body.faqQuestionData)
      .then((FAQQuestions) => {
        res
          .status(201)
          .json({ message: `Successfully saved the new FAQ Question.`, data: FAQQuestions });
      })
      .catch((err) => res.status(500).json({ error: err }));
  }
});
// Update FAQ Question
app.post('/api/FAQQuestions/update/:id', (req, res) => {
  if (!req.body.faqQuestionData) {
    res.status(400).json({ error: `Updated FAQ Question data must be provided.` });
  } else {
    Database.updateFAQQuestion(req.body.faqQuestionData)
      .then((FAQQuestions) => {
        res
          .status(201)
          .json({ message: `Successfully updated the new FAQ Question.`, data: FAQQuestions });
      })
      .catch((err) => res.status(500).json({ error: err }));
  }
});

// Delete FAQ Question
app.delete('/api/FAQQuestions/:id', (req, res) => {
  const { id } = req.params;
  Database.deleteFAQQuestion(id)
    .then((data) => {
      res.status(200).json({ message: data });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// Connect to the database and start the server if successful.
const PORT = process.env.PORT || 8080;
var dbURL = process.env.MONGO_URL;

Database.connect(dbURL)
  .then(() => {
    app.listen(PORT, () => {
      sendgrid.setApiKey(process.env.SENDGRID_KEY);
      console.log('API is listening on port ' + PORT);
    });
  })
  .catch((err) => {
    console.log(`Could not start the API server.\n${err}`);
  });
