const routes = [
  {
    type: 'User',
    method: 'POST',
    route: '/api/users',
    expectedHeader: 'The following should be provided as the request body.',
    expected: `
    {
      "userData": {
        "uuid": String,
        "displayName": String,
        "accountHandle": String,
        "photoURL": String,
        "email": String,
        "creationTime": Date,
        "isAdministrator": Boolean?
      }
    }`,
    resultHeader: 'Returns the newly-saved Firebase user object.',
    result: `
    {
      "message": String?,
      "error": String?,
      "data": {
        "_id": ObjectId,
        "uuid": String,
        "displayName": String,
        "accountHandle": String,
        "photoURL": String,
        "email": String,
        "creationTime": Date,
        "isAdministrator": Boolean
      }
    }`,
  },
  {
    type: 'User',
    method: 'GET',
    route: '/api/users/:uuid',
    expectedHeader: 'Provide the following data to the API.',
    expected: `:uuid - The Firebase user id property of the target user.`,
    resultHeader: 'Returns the resultant user details by their Firebase uuid.',
    result: `
    {
      "message": String?,
      "error": String?,
      "data": {
        "_id": ObjectId,
        "uuid": String,
        "displayName": String,
        "accountHandle": String,
        "photoURL": String,
        "email": String,
        "creationTime": Date,
        "isAdministrator": Boolean
      }
    }`,
  },
  {
    type: 'User',
    method: 'GET',
    route: '/api/users',
    expectedHeader: "This route doesn't require any input.",
    expected: ``,
    resultHeader: 'Returns a list of all users.',
    result: `
    {
      "message": String?,
      "error": String?,
      "data": [
        {
          "_id": ObjectId,
          "uuid": String,
          "displayName": String,
          "accountHandle": String,
          "photoURL": String,
          "email": String,
          "creationTime": Date,
          "isAdministrator": Boolean
        }
      ]
    }`,
  },
  {
    type: 'User',
    method: 'PUT',
    route: '/api/users/:id',
    expectedHeader: 'Provide the following data to the API.',
    expected: `
    :id - The user's MongoDB ObjectId.

    {
      "userData": {
        "displayName": String?,
        "accountHandle": String?,
        "photoURL": String?,
        "email": String?,
        "creationTime": Date?,
        "isAdministrator": Boolean?
      }
    }`,
    resultHeader: 'Returns the updated user object.',
    result: `
    {
      "message": String?,
      "error": String?,
      "data": {
        "_id": ObjectId,
        "uuid": String,
        "displayName": String,
        "accountHandle": String,
        "photoURL": String,
        "email": String,
        "creationTime": Date,
        "isAdministrator": Boolean
      }
    }`,
  },
  {
    type: 'Follow',
    method: 'POST',
    route: '/api/follows',
    expectedHeader: 'Provide the following data to the API.',
    expected: `
    {
      "followedBy": ObjectId,
      "following": ObjectId
    }`,
    resultHeader: 'Returns the new follow relationship object.',
    result: `
    {
      "message": String?,
      "error": String?,
      "data": {
        "_id": ObjectId,
        "followedBy": ObjectId,
        "following": ObjectId,
        "dateFollowed": Date
      }
    }`,
  },
  {
    type: 'Follow',
    method: 'GET',
    route: '/api/follows/following/:id',
    expectedHeader: 'Provide the following data to the API.',
    expected: `:id - The MongoDB ObjectId of the user that you want to get a following list for.`,
    resultHeader: 'Returns an array of all users that the target user is currently following.',
    result: `
    {
      "message": String?,
      "error": String?,
      "data": [
        {
          "_id": ObjectId,
          "dateFollowed": Date,
          "following": {
            "displayName": String,
            "accountHandle": String,
            "photoURL": String
          }
        }
      ]
    }`,
  },
  {
    type: 'Follow',
    method: 'GET',
    route: '/api/follows/followers/:id',
    expectedHeader: 'Provide the following data to the API.',
    expected: `:id - The MongoDB ObjectId of the user that you want to get a followers list for.`,
    resultHeader: 'Returns an array of all users that are following the target user.',
    result: `
    {
      "message": String?,
      "error": String?,
      "data": [
        {
          "_id": ObjectId,
          "dateFollowed": Date,
          "followedBy": {
            "displayName": String,
            "accountHandle": String,
            "photoURL": String
          }
        }
      ]
    }`,
  },
  {
    type: 'Follow',
    method: 'DELETE',
    route: '/api/follows/:id',
    expectedHeader: 'Provide the following data to the API.',
    expected: `:id - The MongoDB ObjectId of the follow relationship that you want to remove.`,
    resultHeader: 'Returns a message indicating success or failure.',
    result: `
    {
      "message": String?,
      "error": String?
    }`,
  },
  {
    type: 'Rating',
    method: 'POST',
    route: '/api/ratings',
    expectedHeader: 'Provide the following data to the API.',
    expected: `
    {
      "ratingData": {
        "userRated": ObjectId,
        "ratedBy": ObjectId,
        "rating": Number
      }
    }`,
    resultHeader: 'Returns the newly-saved rating object.',
    result: `
    {
      "message": String?,
      "error": String?,
      "data": {
        "_id": ObjectId,
        "userRated": ObjectId,
        "ratedBy": ObjectId,
        "rating": Number
      }
    }`,
  },
  {
    type: 'Rating',
    method: 'GET',
    route: '/api/ratings/:id',
    expectedHeader: 'Provide the following data to the API.',
    expected: `:id - The MongoDB ObjectId of the user you want to get a list of all received ratings for.`,
    resultHeader: 'Returns an array of populated rating objects for the target user.',
    result: `
    {
      "message": String?,
      "error": String?,
      "data": [
        {
          "_id": ObjectId,
          "ratedBy": {
            "displayName": String,
            "accountHandle": String,
            "photoURL": String
          },
          "rating": Number,
          "dateRated": Date
        }
      ]
    }`,
  },
  {
    type: 'Rating',
    method: 'DELETE',
    route: '/api/ratings/:id',
    expectedHeader: 'Provide the following data to the API.',
    expected: `:id - The MongoDB ObjectId of the rating that you want to remove.`,
    resultHeader: 'Returns a message indiciating success or failure.',
    result: `
    {
      "message": String?,
      "error": String?
    }`,
  },
  {
    type: 'Contact Request',
    method: 'POST',
    route: '/api/contactrequests',
    expectedHeader: 'Provide the following data to the API.',
    expected: `
    {
      "contactRequestData": {
        "user": ObjectId,
        "topic": ObjectId,
        "message": String
      }
    }`,
    resultHeader: 'Returns the newly-created Contact Request object.',
    result: `
    {
      "message": String?,
      "error": String?,
      "data": {
        "_id": ObjectId,
        "user": ObjectId,
        "topic": ObjectId,
        "message": String,
        "requestDate": Date,
        "requestOpen": Boolean,
        "handlingStaff": {
          "claimed": Boolean,
          "name": String?,
          "email": String?
        }
      }
    }`,
  },
  {
    type: 'Contact Request',
    method: 'GET',
    route: '/api/contactrequests',
    expectedHeader: 'This route does not require any input.',
    expected: ``,
    resultHeader: 'Returns an array of all Contact Requests.',
    result: `
    {
      "message": String?,
      "error": String?,
      "data": [
        {
          "_id": ObjectId,
          "user": {
            "displayName": String,
            "accountHandle": String,
            "photoURL": String
          },
          "topic": {
            "name": String
          },
          "message": String,
          "requestDate": Date,
          "requestOpen": Boolean,
          "handlingStaff": {
            "claimed": Boolean,
            "name": String?,
            "email": String?
          }
        }
      ]
    }`,
  },
  {
    type: 'Contact Request',
    method: 'GET',
    route: '/api/contactrequests/single/:id',
    expectedHeader: 'Provide the following data to the API.',
    expected: `:id - The MongoDB ObjectId of the target contact request.`,
    resultHeader: 'Returns the Contact Request with the matching ObjectId.',
    result: `
    {
      "message": String?,
      "error": String?,
      "data": {
        "_id": ObjectId,
        "user": {
          "displayName": String,
          "accountHandle": String,
          "photoURL": String
        },
        "topic": {
          "name": String
        },
        "message": String,
        "requestDate": Date,
        "requestOpen": Boolean,
        "handlingStaff": {
          "claimed": Boolean,
          "name": String?,
          "email": String?
        }
      }
    }`,
  },
  {
    type: 'Contact Request',
    method: 'GET',
    route: '/api/contactrequests/user/:id',
    expectedHeader: 'Provide the following data to the API.',
    expected: `:id - The MongoDB ObjectId for the target user.`,
    resultHeader: 'Returns an array of all Contact Requests submitted by the target user.',
    result: `
    {
      "message": String?,
      "error": String?,
      "data": [
        {
          "_id": ObjectId,
          "user": {
            "displayName": String,
            "accountHandle": String,
            "photoURL": String
          },
          "topic": {
            "name": String
          },
          "message": String,
          "requestDate": Date,
          "requestOpen": Boolean,
          "handlingStaff": {
            "claimed": Boolean,
            "name": String?,
            "email": String?
          }
        }
      ]
    }`,
  },
  {
    type: 'Contact Request Topic',
    method: 'POST',
    route: '/api/supporttopics',
    expectedHeader: 'Provide the following data to the API.',
    expected: `
    {
      "topicData": {
        "name": String
      }
    }`,
    resultHeader: 'Returns the newly-created Contact Request Topic object.',
    result: `
    {
      "message": String?,
      "error": String?,
      "data": {
        "_id": ObjectId,
        "name": String
      }
    }`,
  },
  {
    type: 'Contact Request Topic',
    method: 'GET',
    route: '/api/supporttopics',
    expectedHeader: 'This route does not require any input.',
    expected: ``,
    resultHeader: 'Returns an array of all Contact Request Topics.',
    result: `
    {
      "message": String?,
      "error": String?,
      "data": [
        {
          "_id": ObjectId,
          "name": String
        }
      ]
    }`,
  },
  {
    type: 'Contact Request Topic',
    method: 'GET',
    route: '/api/supporttopics/:id',
    expectedHeader: 'Provide the following data to the API.',
    expected: `:id - The MongoDB ObjectId of the target Contact Request Topic.`,
    resultHeader: 'Returns the Contact Request Topic object matching the provided id.',
    result: `
    {
      "message": String?,
      "error": String?,
      "data": {
        "_id": ObjectId,
        "name": String
      }
    }`,
  },
  {
    type: 'Event',
    method: 'POST',
    route: '/api/events',
    expectedHeader: 'Provide the following data to the API.',
    expected: `
    {
      "eventData": {
        "host": ObjectId,
        "name": String,
        "location": String,
        "category": ObjectId,
        "maxParticipants": Number?,
        "description": String,
        "startTime": Date
      }
    }`,
    resultHeader: 'Returns the newly-saved Event object.',
    result: `
    {
      "message": String?,
      "error": String?,
      "data": {
        "_id": ObjectId,
        "host": ObjectId,
        "name": String,
        "location": {
          "lat": Number,
          "lon": Number,
          "address": String
        },
        "category": ObjectId,
        "maxParticipants": Number,
        "description": String,
        "startTime": Date
      }
    }`,
  },
  {
    type: 'Event',
    method: 'GET',
    route: '/api/events',
    expectedHeader: 'This route does not require any input.',
    expected: ``,
    resultHeader: 'Returns an array of all events.',
    result: `
    {
      "message": String?,
      "error": String?,
      "data": [
        {
          "_id": ObjectId,
          "host": {
            "accountHandle": String
          },
          "name": String,
          "location": {
            "lat": Number,
            "lon": Number,
            "address": String
          },
          "category": {
            "name": String,
            "header": String
          },
          "maxParticipants": Number,
          "description": String,
          "startTime": Date
        }
      ]
    }`,
  },
  {
    type: 'Event',
    method: 'GET',
    route: '/api/events/single/:id',
    expectedHeader: 'Provide the following data to the API.',
    expected: `:id - The MongoDB ObjectId of the target Event.`,
    resultHeader: 'Returns the target event.',
    result: `
    {
      "message": String?,
      "error": String?,
      "data": {
        "_id": ObjectId,
        "host": {
          "accountHandle": String
        },
        "name": String,
        "location": {
          "lat": Number,
          "lon": Number,
          "address": String
        },
        "category": {
          "name": String,
          "header": String
        },
        "maxParticipants": Number,
        "description": String,
        "startTime": Date
      }
    }`,
  },
  {
    type: 'Event',
    method: 'GET',
    route: '/api/events/user/:id',
    expectedHeader: 'Provide the following data to the API.',
    expected: `:id - The MongoDB ObjectId of the event's host user.`,
    resultHeader: 'Returns an array of all events hosted by the target user.',
    result: `
    {
      "message": String?,
      "error": String?,
      "data": [
        {
          "_id": ObjectId,
          "host": {
            "accountHandle": String
          },
          "name": String,
          "location": {
            "lat": Number,
            "lon": Number,
            "address": String
          },
          "category": {
            "name": String,
            "header": String
          },
          "maxParticipants": Number,
          "description": String,
          "startTime": Date
        }
      ]
    }`,
  },
  {
    type: 'Event',
    method: 'PUT',
    route: '/api/events/:id',
    expectedHeader: 'Provide the following data to the API.',
    expected: `:id - The MongoDB ObjectId of the target event.`,
    resultHeader: 'Returns the updated Event object.',
    result: `
    {
      "message": String?,
      "error": String?,
      "data": {
        "_id": ObjectId,
        "host": ObjectId,
        "name": String,
        "location": {
          "lat": Number,
          "lon": Number,
          "address": String
        },
        "category": ObjectId,
        "maxParticipants": Number,
        "description": String,
        "startTime": Date
      }
    }`,
  },
  {
    type: 'Event',
    method: 'DELETE',
    route: '/api/events/:id',
    expectedHeader: 'Provide the following data to the API.',
    expected: `:id - The MongoDB ObjectId of the target event.`,
    resultHeader: `Returns a success or error message.`,
    result: `
    {
      "message": String?,
      "error": String?
    }`,
  },
  {
    type: 'Event Category',
    method: 'POST',
    route: '/api/eventcategories',
    expectedHeader: 'Provide the following data to the API.',
    expected: `
    {
      "categoryData": {
        "name": String,
        "header": String
      }
    }`,
    resultHeader: 'Returns the newly-saved Event Category object.',
    result: `
    {
      "message": String?,
      "error": String?,
      "data": {
        "_id": ObjectId,
        "name": String,
        "header": String
      }
    }`,
  },
  {
    type: 'Event Category',
    method: 'GET',
    route: '/api/eventcategories',
    expectedHeader: 'This route does not require any input.',
    expected: ``,
    resultHeader: 'Returns an array of all Event Categories.',
    result: `
    {
      "message": String?,
      "error": String?,
      "data": [
        {
          "_id": ObjectId,
          "name": String,
          "header": String
        }
      ]
    }`,
  },
  {
    type: 'Event Category',
    method: 'GET',
    route: '/api/eventcategories/:id',
    expectedHeader: 'Provide the following data to the API.',
    expected: `:id - The MongoDB ObjectId of the target event category.`,
    resultHeader: 'Returns the target Event Category object.',
    result: `
    {
      "message": String?,
      "error": String?,
      "data": {
        "_id": ObjectId,
        "name": String,
        "header": String
      }
    }`,
  },
  {
    type: 'Event Report',
    method: 'POST',
    route: '/api/eventreports',
    expectedHeader: 'Provide the following data to the API.',
    expected: `
    {
      "reportData": {
        "event": ObjectId,
        "reportedBy": ObjectId,
        "topic": ObjectId,
        "reason": String
      }
    }`,
    resultHeader: 'Returns the newly-created Event Report object.',
    result: `
    {
      "message": String?,
      "error": String?,
      "data": {
        "_id": ObjectId,
        "event": ObjectId,
        "reportedBy": ObjectId,
        "topic": ObjectId,
        "reason": String,
        "handled": Boolean,
        "reportDate": Date
      }
    }`,
  },
  {
    type: 'Event Report',
    method: 'GET',
    route: '/api/eventreports',
    expectedHeader: 'This route does not require any input.',
    expected: ``,
    resultHeader: 'Returns an array of all event reports.',
    result: `
    {
      "message": String?,
      "error": String?,
      "data": [
        {
          "_id": ObjectId,
          "event": {
            "host": ObjectId,
            "name": String,
            "location": {
              "lat": Number,
              "lon": Number
            },
            "category": ObjectId,
            "maxParticipants": Number,
            "description": String,
            "startTime": Date
          },
          "reportedBy": {
            "_id": ObjectId,
            "displayName": String,
            "accountHandle": String,
            "photoURL": String,
            "email": String
          },
          "topic": {
            "name": String
          },
          "reason": String,
          "handled": Boolean,
          "reportDate": Date
        }
      ]
    }`,
  },
  {
    type: 'Event Report Topic',
    method: 'POST',
    route: '/api/reporttopics',
    expectedHeader: 'Provide the following data to the API.',
    expected: `
    {
      "topicData": {
        "name": String
      }
    }`,
    resultHeader: 'Returns the newly-saved Event Report Topic object.',
    result: `
    {
      "message": String?,
      "error": String?,
      "data": {
        "_id": ObjectId,
        "name": String
      }
    }`,
  },
  {
    type: 'Event Report Topic',
    method: 'GET',
    route: '/api/reporttopics',
    expectedHeader: 'This route does not require any input.',
    expected: ``,
    resultHeader: 'Returns an array of all event report topics.',
    result: `
    {
      "message": String?,
      "error": String?,
      "data": [
        {
          "_id": ObjectId,
          "name": String
        }
      ]
    }`,
  },
  {
    type: 'Event Registration',
    method: 'POST',
    route: '/api/eventregistrations',
    expectedHeader: 'Provide the following data to the API.',
    expected: `
    {
      "registrationData": {
        "event": ObjectId,
        "user": ObjectId
      }
    }`,
    resultHeader: 'Returns the newly-created Event Registration object.',
    result: `
    {
      "message": String?,
      "error": String?,
      "data": {
        "_id": ObjectId,
        "event": ObjectId,
        "user": ObjectId,
        "registered": Date
      }
    }`,
  },
  {
    type: 'Event Registration',
    method: 'GET',
    route: '/api/eventregistrations/:id',
    expectedHeader: 'Provide the following data to the API.',
    expected: `:id - The MongoDB ObjectId of the event registration.`,
    resultHeader: 'Returns the matching Event Registration object.',
    result: `
    {
      "message": String?,
      "error": String?,
      "data": {
        "_id": ObjectId
        "event": {
          "_id": ObjectId,
          "name": String,
          "startTime": Date,
          "host": {
            "displayName": String
          }
        },
        "user": {
          "_id": ObjectId,
          "displayName": String,
          "email": String
        },
        "registered": Date
      }
    }`,
  },
  {
    type: 'Event Registration',
    method: 'GET',
    route: '/api/eventregistrations/user/:id',
    expectedHeader: 'Provide the following data to the API.',
    expected: `:id - The MongoDB ObjectId of the user.`,
    resultHeader: 'Returns an array of all event registrations belonging to the provided user.',
    result: `
    {
      "message": String?,
      "error": String?,
      "data": [
        {
          "_id": ObjectId,
          "event": {
            "name": String,
            "startTime": Date
          },
          "user": ObjectId,
          "registered": Date
        }
      ]
    }`,
  },
  {
    type: 'Event Registration',
    method: 'DELETE',
    route: '/api/eventregistrations/:id',
    expectedHeader: 'Provide the following data to the API.',
    expected: `:id - The MongoDB ObjectId of the event registration to be deleted.`,
    resultHeader: 'Returns a confirmation or error message.',
    result: `
    {
      "message": String?,
      "error": String?
    }`,
  },
];

var tablePtr = null;
var tableNav = null;

window.onload = () => {
  console.log(`${routes.length} Routes Documented`);
  tablePtr = document.getElementById('documentation-body');
  tableNav = document.getElementById('table-nav');

  document.getElementById('topButton').style.display = 'none';

  if (tablePtr) {
    let currentType = '';
    routes.forEach((r) => {
      let row = document.createElement('tr');

      if (currentType != r.type) {
        currentType = r.type;
        let markerRow = document.createElement('tr');
        let markerCol = document.createElement('td');
        markerCol.colSpan = '5';
        markerCol.className = 'text-muted fs-3';
        markerCol.style.fontWeight = 500;
        markerCol.innerText = `${r.type} Routes`;

        markerRow.id = r.type;
        markerRow.insertAdjacentElement('beforeend', markerCol);
        tablePtr.insertAdjacentElement('beforeend', markerRow);

        let navItem = document.createElement('li');
        let navLink = document.createElement('a');
        navLink.href = `#${r.type}`;
        navLink.innerText = `❯ ${r.type} Routes`;
        navLink.className = 'navLink';

        navItem.insertAdjacentElement('beforeend', navLink);
        tableNav.insertAdjacentElement('beforeend', navItem);
      }

      let typeCol = document.createElement('td');
      typeCol.innerText = r.type;
      typeCol.className = 'text-center';

      let methodCol = document.createElement('td');
      let methodSpan = document.createElement('span');
      methodSpan.className = 'badge rounded-pill';
      switch (r.method) {
        case 'POST':
          methodSpan.classList.add('bg-success');
          break;
        case 'GET':
          methodSpan.classList.add('bg-primary');
          break;
        case 'DELETE':
          methodSpan.classList.add('bg-danger');
          break;
        default:
          methodSpan.classList.add('bg-warning');
          methodSpan.classList.add('text-dark');
          break;
      }
      methodSpan.innerText = r.method;
      methodCol.insertAdjacentElement('beforeend', methodSpan);
      methodCol.className = 'text-center';

      let routeCol = document.createElement('td');
      routeCol.innerText = r.route;
      routeCol.className = 'text-center';

      let expectedCol = document.createElement('td');
      let expectedHeader = document.createElement('p');
      expectedHeader.innerText = r.expectedHeader;
      let expectedBody = document.createElement('code');
      expectedBody.style.whiteSpace = 'pre-wrap';
      expectedBody.innerText = r.expected;
      expectedCol.insertAdjacentElement('beforeend', expectedHeader);
      expectedCol.insertAdjacentElement('beforeend', expectedBody);
      expectedCol.style.verticalAlign = 'top';

      let resultCol = document.createElement('td');
      let resultHeader = document.createElement('p');
      resultHeader.innerText = r.resultHeader;
      let resultBody = document.createElement('code');
      resultBody.style.whiteSpace = 'pre-wrap';
      resultBody.innerText = r.result;
      resultCol.insertAdjacentElement('beforeend', resultHeader);
      resultCol.insertAdjacentElement('beforeend', resultBody);
      resultCol.style.verticalAlign = 'top';

      row.insertAdjacentElement('beforeend', typeCol);
      row.insertAdjacentElement('beforeend', methodCol);
      row.insertAdjacentElement('beforeend', routeCol);
      row.insertAdjacentElement('beforeend', expectedCol);
      row.insertAdjacentElement('beforeend', resultCol);

      tablePtr.insertAdjacentElement('beforeend', row);
    });
  } else {
    console.log(`There was a problem finding the table.`);
  }
};

window.onscroll = (scroll) => {
  if (window.scrollY > document.getElementById('routes-table').offsetTop) {
    document.getElementById('topButton').style.display = 'block';
  } else {
    document.getElementById('topButton').style.display = 'none';
  }
};

function handleToTopClick() {
  window.scrollTo(0, 0);
}
