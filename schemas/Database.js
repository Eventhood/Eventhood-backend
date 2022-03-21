const mongoose = require('mongoose');
const { Schema } = mongoose;

// SRS 5.2.1.1 - 'Users' Collection
let userSchema = new Schema({
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  accountHandle: {
    type: String,
    required: true,
  },
  photoURL: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  creationTime: {
    type: Date,
    required: true,
  },
  isAdministrator: {
    type: Boolean,
    required: false,
    default: false,
  },
});

// SRS 5.2.1.2 - 'Follows' Collection
let followsSchema = new Schema({
  followedBy: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Users',
  },
  following: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Users',
  },
  dateFollowed: {
    type: Date,
    required: false,
    default: Date.now(),
  },
});

// SRS 5.2.1.3 - 'Ratings' Collection
let ratingsSchema = new Schema({
  userRated: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Users',
  },
  ratedBy: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Users',
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  dateRated: {
    type: Date,
    required: false,
    default: Date.now(),
  },
});

// SRS 5.2.1.4 - 'ContactRequests' Collection
let contactRequestsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Users',
  },
  topic: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'ContactTopics',
  },
  message: {
    type: String,
    required: true,
  },
  requestDate: {
    type: Date,
    required: false,
    default: Date.now(),
  },
  requestOpen: {
    type: Boolean,
    required: false,
    default: true,
  },
  handlingStaff: {
    claimed: {
      type: Boolean,
      required: false,
      default: false,
    },
    name: {
      type: String,
      required: false,
      default: null,
    },
    email: {
      type: String,
      required: false,
      default: null,
    },
  },
});

// SRS 5.2.1.5 - 'ContactTopics' Collection
let contactTopicsSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

// SRS 5.2.1.6 - 'Events' Collection
let eventsSchema = new Schema({
  host: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Users',
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    lat: {
      type: Number,
      required: true,
    },
    lon: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true
    }
  },
  category: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'EventCategories',
  },
  maxParticipants: {
    type: Number,
    required: false,
    min: 0,
    default: 0,
  },
  description: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
});

// SRS 5.1.2.7 - 'EventCategories' Collection
let eventCategoriesSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  header: {
    type: String,
    required: true,
  },
});

// SRS 5.1.2.8 - 'EventReports' Collection
let eventReportsSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Events',
  },
  reportedBy: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Users',
  },
  topic: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'ReportTopics',
  },
  reason: {
    type: String,
    required: true,
  },
  handled: {
    type: Boolean,
    required: false,
    default: false,
  },
  reportDate: {
    type: Date,
    required: false,
    default: Date.now(),
  },
});

// SRS 5.1.2.9 - 'ReportTopics' Collection
let reportTopicsSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

// SRS 5.1.2.10 - 'FAQTopics' Collection
let FAQTopicsSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

// SRS 5.1.2.11 - 'FAQQuestions' Collection
let FAQQuestionsSchema = new Schema({
  topic: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'FAQTopics',
  },
  question: {
    type: String,
    required: true,
    unique: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

// SRS 5.1.2.12 - 'EventRegistrations' Collection
let eventRegistrationsSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Events',
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Users',
  },
  registered: {
    type: Date,
    required: false,
    default: Date.now(),
  },
});

/*

    Variable definitions

    All of the variables here are directly used for
    making queries to the Mongo database.

*/

let Users;
let Follows;
let Ratings;
let ContactRequests;
let ContactTopics;
let Events;
let EventCategories;
let EventReports;
let ReportTopics;
let FAQTopics;
let FAQQuestions;
let EventRegistrations;

/*

    Functions which are used to handle connecting to and querying the Mongo database.
    
    Any functions added here should have a corresponding
    function definition comment above it.

*/

/**
 * Establish a connection with the Mongo database using the provided connection string, and create and assign all schema models.
 *
 * @param {String} conString The MongoDB Connection URL as a string.
 * @returns {Promise<null>} A resolvable promise indicating success or failure to connect.
 */
module.exports.connect = (conString) => {
  return new Promise((resolve, reject) => {
    let db = mongoose.createConnection(conString, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    db.on('error', (err) => {
      reject(err);
    });

    db.once('open', () => {
      Users = db.model('Users', userSchema);
      Follows = db.model('Follows', followsSchema);
      Ratings = db.model('Ratings', ratingsSchema);
      ContactRequests = db.model('ContactRequests', contactRequestsSchema);
      ContactTopics = db.model('ContactTopics', contactTopicsSchema);
      Events = db.model('Events', eventsSchema);
      EventCategories = db.model('EventCategories', eventCategoriesSchema);
      EventReports = db.model('EventReports', eventReportsSchema);
      ReportTopics = db.model('ReportTopics', reportTopicsSchema);
      FAQTopics = db.model('FAQTopics', FAQTopicsSchema);
      FAQQuestions = db.model('FAQQuestions', FAQQuestionsSchema);
      EventRegistrations = db.model('EventRegistrations', eventRegistrationsSchema);

      resolve();
    });
  });
};

// User Functions
/**
 * Add a new user to the Mongo database, using the provided user data.
 *
 * @param {{
 *  uuid: String,
 * displayName: String,
 * accountHandle: String,
 * photoURL: String,
 * email: String,
 * creationTime: Date,
 * isAdministrator: Boolean
 * }} userData The data to be saved as a new user in the Mongo database.
 * @returns {Promise} The newly created MongoDB user document if Promise resolution is successful.
 */
module.exports.addUser = (userData) => {
  return new Promise((resolve, reject) => {
    let newUser = new Users(userData);
    newUser.save((err) => {
      if (err) {
        if (err.code == 11000) {
          reject(`A user with that data already exists.`);
        } else {
          reject(`There was an error saving the user.`);
        }
      } else {
        resolve(newUser);
      }
    });
  });
};

/**
 * Get a single user by their Firebase UUID.
 *
 * @param {String} targetUuid The UUID of the desired user.
 * @returns {Promise<{
 *  _id: ObjectId,
 * uuid: String,
 * displayName: String,
 * accountHandle: String,
 * photoURL: String,
 * email: String,
 * creationTime: Date,
 * isAdministrator: Boolean
 * }>} The user document which matches the provided UUID, if Promise resolution is successful.
 */
module.exports.getUserById = (targetUuid) => {
  return new Promise((resolve, reject) => {
    Users.findOne({ uuid: targetUuid })
      .exec()
      .then((user) => {
        resolve(user);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.getUserByObjectId = (uoid) => {
  return new Promise((resolve, reject) => {
    Users.findOne({ _id: uoid }).exec().then((user) => {
      resolve(user);
    }).catch((err) => { reject(err); });
  });
}

// Get all users
module.exports.getUsers = () => {
  return new Promise((resolve, reject) => {
    Users.find({}, ['displayName', 'accountHandle'])
      .sort('accountHandle')
      .exec()
      .then((users) => {
        resolve(users);
      })
      .catch((err) => reject(err));
  });
};

// Update the user.
module.exports.updateUser = (userId, userData) => {
  return new Promise((resolve, reject) => {
    Users.updateOne({ $or: [ { '_id': userId }, { 'uuid': userId } ] }, { $set: userData }).exec().then((updatedUser) => {
      resolve(updatedUser);
    }).catch((err) => reject(err));
  });
}

// Follow Functions
/**
 * Get all of the follows where the user with the specified Mongo id matches the "followedBy" property.
 *
 * @param {String} userId The MongoDB _id of the user.
 * @returns {Promise<[{ _id: ObjectId, followedBy: Object, following: Object, dateFollowed: Date }]>} An array of follows added by the specified user, if the Promise resolution is successful.
 */
module.exports.findFollowingByUser = (userId) => {
  return new Promise((resolve, reject) => {
    Follows.find({ followedBy: userId }, ['following', 'dateFollowed'])
      .sort('dateFollowed')
      .populate('following', ['displayName', 'accountHandle', 'photoURL'])
      .exec()
      .then((follows) => {
        resolve(follows);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get all of the follows where the user with the specified Mongo id matches the "following" property.
 *
 * @param {String} userId The MongoDB ObjectId (_id) of the user.
 * @returns {Promise<[{ followedBy: Object, dateFollowed: Date }]>} An array of follows containing the user who followed the specified id, and the date the follow was registered, if the Promise resolution is successful.
 */
module.exports.findFollowersByUser = (userId) => {
  return new Promise((resolve, reject) => {
    Follows.find({ following: userId }, ['followedBy', 'dateFollowed'])
      .sort('dateFollowed')
      .populate('followedBy', ['displayName', 'accountHandle', 'photoURL'])
      .exec()
      .then((followers) => {
        resolve(followers);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Add a new follow relationship to the Mongo database using the provided follow data.
 *
 * @param {{
 * followedBy: mongoose.Schema.Types.ObjectId,
 * following: mongoose.Schema.Types.ObjectId,
 * dateFollowed: Date}} followData The data to be added to the Mongo database for the newly registered follow.
 * @returns {Promise<any>} The newly created follow document, if the Promise resolution is successful.
 */
module.exports.addFollow = (followData) => {
  return new Promise((resolve, reject) => {
    const newFollow = new Follows(followData);
    newFollow.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(newFollow);
      }
    });
  });
};

/**
 * Remove the follow from the Mongo database with the specified Mongo id.
 *
 * @param {String} followId The _id of the follow document to be removed.
 * @returns {Promise<String>} A success message if the Promise resolution is successful.
 */

module.exports.removeFollow = (followId) => {
  return new Promise((resolve, reject) => {
    Follows.deleteOne({ _id: followId })
      .exec()
      .then(() => {
        resolve(`Successfully unfollowed the user.`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// Rating Functions
/**
 * Add the provided rating to the Mongo database.
 *
 * @param {{
 *  userRated: mongoose.Schema.Types.ObjectId,
 *  ratedBy: mongoose.Schema.Types.ObjectId,
 *  rating: Number
 * }} ratingData The rating data to be saved in the Mongo database.
 * @returns {Promise<any>} The newly saved rating from the Mongo database, if the Promise resolution is successful.
 */
module.exports.addRating = (ratingData) => {
  return new Promise((resolve, reject) => {
    let newRating = new Ratings(ratingData);
    newRating.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(newRating);
      }
    });
  });
};

/**
 * Get all of the ratings given to the user with a specified Mongo id.
 *
 * @param {String} userId The MongoDB ObjectId (_id) of the rated user.
 * @returns {Promise<{ ratedBy: Object, rating: Number, dateRated: Date }>} An array of ratings given to the user with the provided id.
 */
module.exports.getUserRatings = (userId) => {
  return new Promise((resolve, reject) => {
    Ratings.find({ userRated: userId }, ['ratedBy', 'rating', 'dateRated'])
      .sort('dateRated')
      .populate('ratedBy', ['displayName', 'accountHandle', 'photoURL'])
      .exec()
      .then((ratings) => {
        resolve(ratings);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Remove the rating with the specified Mongo id from the database.
 *
 * @param {String} ratingId The Mongo ObjectId (_id) of the target rating.
 * @returns {Promise<String>} Success message, if the Promise resolution is successful.
 */
module.exports.removeRating = (ratingId) => {
  return new Promise((resolve, reject) => {
    Ratings.deleteOne({ _id: ratingId })
      .exec()
      .then(() => {
        resolve(`The rating was successfully removed.`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// Contact Request Functions
/**
 * Using the provided contact request data, save a new contact request to the Mongo database.
 *
 * @param {{
 *  user: mongoose.Schema.Types.ObjectId,
 *  topic: mongoose.Schema.Types.ObjectId,
 *  message: String
 * }} contactRequestData The object to be saved as the new contact request.
 * @returns {Promise<any>} The newly created Mongo ContactRequest document, if the Promise resolution is successful.
 */
module.exports.addContactRequest = (contactRequestData) => {
  return new Promise((resolve, reject) => {
    let newCR = new ContactRequests(contactRequestData);
    newCR.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(newCR);
      }
    });
  });
};

/**
 * Find a single ContactRequest in the Mongo database based on it's ObjectId property.
 *
 * @param {String} requestId The Mongo ObjectId (_id) of the ContactRequest.
 * @returns {Promise<{ _id: mongoose.Schema.Types.ObjectId, user: Object, topic: Object, message: String, requestDate: Date }>} The requested ContactRequest document, if the Promise resolution is successful.
 */
module.exports.findContactRequestById = (requestId) => {
  return new Promise((resolve, reject) => {
    ContactRequests.findOne({ _id: requestId })
      .populate('user', ['displayName', 'accountHandle', 'photoURL'])
      .populate('topic')
      .exec()
      .then((contactReq) => {
        resolve(contactReq);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get an array of all requests currently in the database.
 *
 * @returns {Promise<[{ _id: mongoose.Schema.Types.ObjectId, user: Object, topic: Object, message: String, requestDate: Date }]>} An array of all ContactRequest documents in the collection, if the Promise resolution is successful.
 */
module.exports.getAllContactRequests = () => {
  return new Promise((resolve, reject) => {
    ContactRequests.find({})
      .sort('requestDate')
      .populate('user', ['displayName', 'accountHandle', 'photoURL'])
      .populate('topic')
      .exec()
      .then((requests) => {
        resolve(requests);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Find all contact requests submitted by the user with the provided Mongo ObjectId (_id).
 *
 * @param {String} userId The Mongo ObjectId (_id) of the target user.
 * @param {Boolean} includeClosed If closed requests should be included.
 * @param {Boolean} includeClaimed If already claimed requests should be included.
 * @returns {Promise<[{ _id: mongoose.Schema.Types.ObjectId, user: Object, topic: Object, message: String, requestDate: Date }]>} An array of all contact requests where the user has an id matching the one provided, if Promise resolution is successful.
 */
module.exports.findContactRequestsByUser = (userId, includeClosed, includeClaimed) => {
  return new Promise((resolve, reject) => {
    let queryFilter = { user: userId };

    if (includeClaimed) { queryFilter.handlingStaff = {}; queryFilter.handlingStaff.claimed = includeClaimed }
    if (includeClosed) { queryFilter.requestOpen = includeClosed }

    ContactRequests.find(queryFilter)
      .sort('requestDate')
      .populate('user', ['displayName', 'accountHandle', 'photoURL'])
      .populate('topic')
      .exec()
      .then((requests) => {
        resolve(requests);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// Contact Topic Functions
/**
 * Save the provided topic data into the Mongo database as a Contact Request topic.
 *
 * @param {{
 *  name: String
 * }} topicData The data to be saved as the contact request topic.
 * @returns {Promise<{ _id: mongoose.Schema.Types.ObjectId, name: String }>} The newly created contact request topic, if Promise resolution is successful.
 */
module.exports.addContactTopic = (topicData) => {
  return new Promise((resolve, reject) => {
    let newTopic = new ContactTopics(topicData);
    newTopic.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(newTopic);
      }
    });
  });
};

/**
 * Find a single contact request topic using its Mongo ObjectId (_id).
 *
 * @param {String} topicId
 * @returns {Promise<{ _id: mongoose.Schema.Types.ObjectId, name: String }>}
 */
module.exports.findContactTopicById = (topicId) => {
  return new Promise((resolve, reject) => {
    ContactTopics.findOne({ _id: topicId })
      .exec()
      .then((topic) => {
        resolve(topic);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get all of the contact request topics in the Mongo database.
 *
 * @returns {Promise<[{ _id: mongoose.Schema.Types.ObjectId, name: String }]>} An array of all contact topics in the Mongo database, if the Promise resolution is successful.
 */
module.exports.getAllContactTopics = () => {
  return new Promise((resolve, reject) => {
    ContactTopics.find({})
      .sort('name')
      .exec()
      .then((topics) => {
        resolve(topics);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// Event Functions:

// Return all events
/**
 * Get all of the events in the Mongo Database
 *
 * @returns {Promise<[{ _id: mongoose.Schema.Types.ObjectId, host: Object, name: String,
 *                  location: String, category: Object, maxParticipants: Number, description: String, startTime: Date }]>}
 *      An array of all Events in the Mongo database, if the Promise resolution is successful.
 */
module.exports.getAllEvents = () => {
  return new Promise((resolve, reject) => {
    Events.find({})
      .sort('name')
      .populate('category')
      .populate('host', ['accountHandle'])
      .exec()
      .then((events) => {
        resolve(events);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// Return all events based on UserID
module.exports.getAllEventsbyUserID = (userID) => {
  return new Promise((resolve, reject) => {
    Events.find({ host: userID })
      .sort('name')
      .populate('category')
      .populate('host', ['accountHandle'])
      .exec()
      .then((events) => {
        resolve(events);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// Get Single Event based on EventId (Event: _id) - Event Details basically
module.exports.getSingleEventbyEventID = (eventID) => {
  return new Promise((resolve, reject) => {
    Events.findOne({ _id: eventID })
      .populate('category')
      .populate('host', ['accountHandle', 'photoURL'])
      .exec()
      .then((events) => {
        resolve(events);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// Create event
module.exports.addEvent = (eventData) => {
  return new Promise((resolve, reject) => {
    let newEvent = new Events(eventData);
    newEvent.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(newEvent);
      }
    });
  });
};

// Update event
module.exports.updateEvent = (eventID, eventData) => {
  //Only host should be able to update their own Event
  return new Promise((resolve, reject) => {
    Events.updateOne({ _id: eventID }, { $set: eventData })
      .exec()
      .then((updatedEvent) => {
        resolve(updatedEvent);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// Delete event
module.exports.deleteEvent = (eventID) => {
  return new Promise((resolve, reject) => {
    Events.deleteOne({ _id: eventID })
      .exec()
      .then(() => {
        resolve(`The event has been successfully removed.`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
//----------------------------------------------------------------------------------

// Event Category Functions - CUD (get all, create, update, delete)
/**
 * Save the provided event category data into the Mongo database.
 *
 * @param {{
 *  name: String
 * }} categoryData The category data to be saved to the database.
 * @returns {Promise<{
 *  _id: import('mongoose').ObjectId,
 *  name: String
 * }>} The Mongo document that was saved to the database, if the Promise resolution was successful.
 */
module.exports.createEventCategory = (categoryData) => {
  return new Promise((resolve, reject) => {
    let category = new EventCategories(categoryData);
    category.save((err) => {
      if (err) {
        if (err.code === 11000) {
          reject(`There is already a category with that name.`);
        } else {
          reject(`There was a problem saving the category.`);
        }
      } else {
        resolve(category);
      }
    });
  });
};

/**
 * Find a specific event category by it's Mongo ObjectId (_id).
 *
 * @param {String} categoryId The ObjectId of the desired EventCategory document.
 * @returns { Promise<{
 *  _id: import('mongoose').ObjectId,
 *  name: String,
 *  header: String
 * }> } The Mongo document for the EventCategory, if Promise resolution is successful.
 */
module.exports.getEventCategoryById = (categoryId) => {
  return new Promise((resolve, reject) => {
    EventCategories.findOne({ _id: categoryId })
      .exec()
      .then((category) => {
        resolve(category);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Get all of the currently-existing EventCategories in the Mongo database.
 *
 * @returns { Promise<[{ _id: import('mongoose').ObjectId, name: String, header: String }] } An array of all existing EventCategory documents, if Promise resolution is successful.
 */
module.exports.getAllEventCategories = () => {
  return new Promise((resolve, reject) => {
    EventCategories.find({})
      .sort('name')
      .exec()
      .then((categories) => {
        resolve(categories);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// Event Report Functions
// Create a new Event Report
module.exports.addEventReport = (reportData) => {
  return new Promise((resolve, reject) => {
    let report = new EventReports(reportData);
    report.save((err) => {
      if (err) {
        reject(`There was a problem saving the report.`);
      } else {
        resolve(report);
      }
    });
  });
};

// Get all event reports
module.exports.getEventReports = () => {
  return new Promise((resolve, reject) => {
    EventReports.find({})
      .sort('reportDate')
      .populate('event')
      .populate('reportedBy', ['displayName', 'accountHandle', 'photoURL', 'email'])
      .populate('topic')
      .exec()
      .then((reports) => {
        resolve(reports);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// Get all unhandled event reports.
// Get all handled event reports.
// Get all reports based on user.
// Get all reports based on event.

// Report Topic Functions
module.exports.addReportTopic = (topicData) => {
  return new Promise((resolve, reject) => {
    let topic = new ReportTopics(topicData);
    topic.save((err) => {
      if (err) {
        if (err.code === 11000) {
          reject(`There is already a report topic with this name.`);
        } else {
          reject(`There was a problem saving the report topic provided.`);
        }
      } else {
        resolve(topic);
      }
    });
  });
};

module.exports.getReportTopics = () => {
  return new Promise((resolve, reject) => {
    ReportTopics.find({})
      .sort('name')
      .exec()
      .then((topics) => {
        resolve(topics);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// FAQ Topic Functions
module.exports.getFAQTopics = () => {
  return new Promise((resolve, reject) => {
    FAQTopics.find({})
      .sort('name')
      .exec()
      .then((faqTopics) => {
        resolve(faqTopics);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.addFAQTopics = (newFAQTopic) => {
  return new Promise((resolve, reject) => {
    let addFAQTopic = new FAQTopics(newFAQTopic);
    addFAQTopic.save((err) => {
      if (err) {
        if (err.code == 11000) {
          reject(`The FAQ Topic already exists.`);
        } else {
          reject(`There was an error saving the FAQ Topic.`);
        }
      } else {
        resolve(addFAQTopic);
      }
    });
  });
};

module.exports.deleteFAQTopics = (FAQTopicID) => {
  return new Promise((resolve, reject) => {
    FAQTopics.deleteOne({ _id: FAQTopicID })
      .exec()
      .then(() => {
        resolve(`The FAQ Topic has been succesfully removed.`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
// FAQ Question Functions

module.exports.getAllFAQQuestions = () => {
  return new Promise((resolve, reject) => {
    FAQQuestions.find({})
      .sort('question')
      .populate('topic')
      .exec()
      .then((AllFAQQuestions) => {
        resolve(AllFAQQuestions);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.addFAQQuestion = (newFAQQuestion) => {
  return new Promise((resolve, reject) => {
    let addNewFAQQuestion = FAQQuestions(newFAQQuestion);
    addNewFAQQuestion.save((err) => {
      if (err) {
        if (err.code == 11000) {
          reject(`The FAQ Question already exists.`);
        } else {
          reject(`There was an error saving the FAQ Question.`);
        }
      } else {
        resolve(addNewFAQQuestion);
      }
    });
  });
};

module.exports.updateFAQQuestion = (FAQQuestionID, newFAQQuestion) => {
  return new Promise((resolve, reject) => {
    FAQQuestions.updateOne({ _id: FAQQuestionID }, { $set: newFAQQuestion })
      .exec()
      .then((updateFAQQuestion) => {
        resolve(updateFAQQuestion);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.deleteFAQQuestion = (FAQQuestionID) => {
  return new Promise((resolve, reject) => {
    FAQQuestions.deleteOne({ _id: FAQQuestionID })
      .exec()
      .then(() => {
        resolve(`The FAQ Question has been removed.`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.getFAQQuestionByTopic = (topicID) => {
  return new Promise((resolve, reject) => {
    FAQQuestions.find({ topic: topicID })
      .populate('topic')
      .exec()
      .then((q) => {
        resolve(q);
      })
      .catch((err) => reject(err));
  });
};

// Event Registration Functions

//Get all events that user has registered for
module.exports.getAllUserRegisteredEvents = (uID) => {
  return new Promise((resolve, reject) => {
    EventRegistrations.find({ user: uID })
      .exec()
      .then((registeredEvents) => {
        resolve(registeredEvents);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

//Register User to an event
module.exports.addEventRegistration = (registrationData) => {
  return new Promise((resolve, reject) => {
    let registration = new EventRegistrations(registrationData);
    registration.save((err) => {
      if (err) {
        reject(`There was a problem saving the event registration.`);
      } else {
        resolve(registration);
      }
    });
  });
};

// Get an event registration by id.
module.exports.getEventRegistrationById = (eRId) => {
  return new Promise((resolve, reject) => {
    EventRegistrations.findOne({ _id: eRId }).populate({ path: "event", select: "name startTime host", populate: { path: 'host', select: 'displayName' } }).populate('user', [ 'displayName', 'email' ]).exec().then((registration) => {
      resolve(registration);
    }).catch(err => reject(err));
  });
}

//Remove User from an Event
module.exports.deleteEventRegistration = (registrationId) => {
  return new Promise((resolve, reject) => {
    EventRegistrations.deleteOne({ _id: registrationId })
      .exec()
      .then(() => {
        resolve(`Successfully removed the event registration.`);
      })
      .catch(() => {
        reject(`There was a problem removing the registration. Please try again.`);
      });
  });
};

// Count event registrations by event.
module.exports.countEventRegistrationsByEvent = async eId => {
  return await EventRegistrations.countDocuments({ event: eId }).exec();
}