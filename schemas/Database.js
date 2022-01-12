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
    }
});

// SRS 5.2.1.5 - 'ContactTopics' Collection
let contactTopicsSchema = new Schema({
    name: {
        type: String,
        required: true
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
 * 
 * @param {String} userId The MongoDB _id of the user.
 * @returns {Promise<[{ _id: ObjectId, followedBy: Object, following: Object, dateFollowed: Date }]>} An array of follows added by the specified user, if the Promise resolution is successful.
 */
module.exports.findFollowsByUser = (userId) => {

    return new Promise((resolve, reject) => {

        Follows.find({ followedBy: userId }).sort('dateFollowed').populate('following').exec().then((follows) => {
            resolve(follows);
        }).catch((err) => {
            reject(err);
        });

    });

};

/**
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

// Rating Functions
// Contact Request Functions
// Contact Topic Functions
// Event Functions
// Event Category Functions
// Event Report Functions
// Report Topic Functions
// FAQ Topic Functions
// FAQ Question Functions
// Event Registration Functions