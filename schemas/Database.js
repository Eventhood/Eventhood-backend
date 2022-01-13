const res = require('express/lib/response');
const mongoose = require('mongoose');
const { Schema } = mongoose;

// SRS 5.2.1.1 - 'Users' Collection
let userSchema = new Schema({
    uuid: {
        type: String,
        required: true,
        unique: true
    },
    displayName: {
        type: String,
        required: true
    },
    accountHandle: {
        type: String,
        required: true
    },
    photoURL: {
        type: String,
        required: true
    },
    creationTime: {
        type: Date,
        required: true
    },
    isAdministrator: {
        type: Boolean,
        required: false,
        default: false
    }
});

// SRS 5.2.1.2 - 'Follows' Collection
let followsSchema = new Schema({
    followedBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    following: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    dateFollowed: {
        type: Date,
        required: false,
        default: Date.now()
    }
});

// SRS 5.2.1.3 - 'Ratings' Collection
let ratingsSchema = new Schema({
    userRated: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    ratedBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    dateRated: {
        type: Date,
        required: false,
        default: Date.now()
    }
});

// SRS 5.2.1.4 - 'ContactRequests' Collection
let contactRequestsSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    topic: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'ContactTopics'
    },
    message: {
        type: String,
        required: true
    },
    requestDate: {
        type: Date,
        required: false,
        default: Date.now()
    }
});

// SRS 5.2.1.5 - 'ContactTopics' Collection
let contactTopicsSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

// SRS 5.2.1.6 - 'Events' Collection
let eventsSchema = new Schema({
    host: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'EventCategories'
    },
    maxParticipants: {
        type: Number,
        required: false,
        min: 0,
        default: 0
    },
    description: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    }
});

// SRS 5.1.2.7 - 'EventCategories' Collection
let eventCategoriesSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

// SRS 5.1.2.8 - 'EventReports' Collection
let eventReportsSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Events'
    },
    reportedBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    topic: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'ReportTopics'
    },
    reason: {
        type: String,
        required: true
    }
});

// SRS 5.1.2.9 - 'ReportTopics' Collection
let reportTopicsSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

// SRS 5.1.2.10 - 'FAQTopics' Collection
let FAQTopicsSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

// SRS 5.1.2.11 - 'FAQQuestions' Collection
let FAQQuestionsSchema = new Schema({
    topic: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'FAQTopics'
    },
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
});

// SRS 5.1.2.12 - 'EventRegistrations' Collection
let eventRegistrationsSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Events'
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    registered: {
        type: Date,
        required: false,
        default: Date.now()
    }
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

        let db = mongoose.createConnection(conString, { useUnifiedTopology: true, useNewUrlParser: true });

        db.on('error', err => {
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
        })

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
 * creationTime: Date,
 * isAdministrator: Boolean
 * }>} The user document which matches the provided UUID, if Promise resolution is successful.
 */
module.exports.getUserById = (targetUuid) => {
    
    return new Promise((resolve, reject) => {
        
        Users.findOne({ uuid: targetUuid }).exec().then((user) => {
            resolve(user);
        }).catch((err) => {
            reject(err);
        });

    });

};

// Follow Functions
/**
 * Get all of the follows where the user with the specified Mongo id matches the "followedBy" property.
 * 
 * @param {String} userId The MongoDB _id of the user.
 * @returns {Promise<[{ _id: ObjectId, followedBy: Object, following: Object, dateFollowed: Date }]>} An array of follows added by the specified user, if the Promise resolution is successful.
 */
module.exports.findFollowingByUser = (userId) => {

    return new Promise((resolve, reject) => {

        Follows.find({ followedBy: userId }, ['following', 'dateFollowed']).sort('dateFollowed').populate('following', [ 'displayName', 'accountHandle', 'photoURL' ]).exec().then((follows) => {
            resolve(follows);
        }).catch((err) => {
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

        Follows.find({ following: userId }, [ 'followedBy', 'dateFollowed' ]).sort('dateFollowed').populate('followedBy', [ 'displayName', 'accountHandle', 'photoURL' ]).exec().then((followers) => {
            resolve(followers);
        }).catch(err => {
            reject(err);
        });

    });

}

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

        newFollow = new Follows(followData);
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
        Follows.deleteOne({ _id: followId }).exec().then((data) => {
            resolve(`Successfully unfollowed the user.`);
        }).catch((err) => {
            reject(err);
        });
    });

}

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
        newRating.save(err => {
            if (err) {
                reject(err);
            }
            else {
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

        Ratings.find({ userRated: userId }, [ 'ratedBy', 'rating', 'dateRated' ]).sort('dateRated').populate('ratedBy', [ 'displayName', 'accountHandle', 'photoURL' ]).exec().then((ratings) => {
            resolve(ratings);
        }).catch((err) => {
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

        Ratings.deleteOne({ _id: ratingId }).exec().then(() => {
            resolve(`The rating was successfully removed.`);
        }).catch((err) => {
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
        newCR.save(err => {
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

        ContactRequests.findOne({ _id: requestId }).exec().then((contactReq) => {
            resolve(contactReq);
        }).catch(err => {
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

        ContactRequests.find({}).sort('requestDate').populate('user', [ 'displayName', 'accountHandle', 'photoURL' ]).populate('topic').exec().then((requests) => {
            resolve(requests);
        }).catch(err => {
            reject(err);
        });

    });

};

/**
 * Find all contact requests submitted by the user with the provided Mongo ObjectId (_id).
 * 
 * @param {String} userId The Mongo ObjectId (_id) of the target user.
 * @returns {Promise<[{ _id: mongoose.Schema.Types.ObjectId, user: Object, topic: Object, message: String, requestDate: Date }]>} An array of all contact requests where the user has an id matching the one provided, if Promise resolution is successful.
 */
module.exports.findContactRequestsByUser = (userId) => {

    return new Promise((resolve, reject) => {

        ContactRequests.find({ user: userId }).sort('requestDate').populate('user', [ 'displayName', 'accountHandle', 'photoURL' ]).populate('topic').exec().then((requests) => {
            resolve(requests);
        }).catch(err => {
            reject(err);
        });

    });

}

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
        newTopic.save(err => {
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

        ContactTopics.findOne({ _id: topicId }).exec().then((topic) => {
            resolve(topic);
        }).catch(err => {
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

        ContactTopics.find({}).sort('name').exec().then(topics => {
            resolve(topics);
        }).catch(err => {
            reject(err);
        });

    });

};

// Event Functions
// Event Category Functions
// Event Report Functions
// Report Topic Functions
// FAQ Topic Functions
// FAQ Question Functions
// Event Registration Functions