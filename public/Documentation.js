const routes = [
  {
    type: "User",
    method: "POST",
    route: "/api/users",
    expectedHeader: "The following should be provided as the request body.",
    expected: `
    {
      "userData": {
        "uuid": String,
        "displayName": String,
        "accountHandle": String,
        "photoURL": String,
        "creationTime": Date,
        "isAdministrator": Boolean?
      }
    }`,
    resultHeader: "Returns the newly-saved Firebase user object.",
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
        "creationTime": Date,
        "isAdministrator": Boolean
      }
    }`
  },
  {
    type: "User",
    method: "GET",
    route: "/api/users/:uuid",
    expectedHeader: "Provide the following data to the API.",
    expected: `:uuid - The Firebase user id property of the target user.`,
    resultHeader: "Returns the resultant user details by their Firebase uuid.",
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
        "creationTime": Date,
        "isAdministrator": Boolean
      }
    }`
  },
  {
    type: "User",
    method: "GET",
    route: "/api/users",
    expectedHeader: "This route doesn't require any input.",
    expected: ``,
    resultHeader: "Returns a list of all users.",
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
          "creationTime": Date,
          "isAdministrator": Boolean
        }
      ]
    }`
  },
  {
    type: "User",
    method: "PUT",
    route: "/api/users/:id",
    expectedHeader: "Provide the following data to the API.",
    expected: `
    :id - The user's MongoDB ObjectId.

    {
      "userData": {
        "displayName": String?,
        "accountHandle": String?,
        "photoURL": String?,
        "creationTime": Date?,
        "isAdministrator": Boolean?
      }
    }`,
    resultHeader: "Returns the updated user object.",
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
        "creationTime": Date,
        "isAdministrator": Boolean
      }
    }`
  },
  {
    type: "Follow",
    method: "POST",
    route: "/api/follows",
    expectedHeader: "Provide the following data to the API.",
    expected: `
    {
      "followedBy": ObjectId,
      "following": ObjectId
    }`,
    resultHeader: "Returns the new follow relationship object.",
    result: `
    {
      "message": String?,
      "error": String?,
      "data": {
        "followedBy": ObjectId,
        "following": ObjectId,
        "dateFollowed": Date
      }
    }`
  },
  {
    type: "Follow",
    method: "GET",
    route: "/api/follows/following/:id",
    expectedHeader: "Provide the following data to the API.",
    expected: `:id - The MongoDB ObjectId of the user that you want to get a following list for.`,
    resultHeader: "Returns an array of all users that the target user is currently following.",
    result: `
    {
      "message": String?,
      "error": String?,
      "data": [
        {
          "dateFollowed": Date,
          "following": {
            "displayName": String,
            "accountHandle": String,
            "photoURL": String
          }
        }
      ]
    }`
  },
  {
    type: "Follow",
    method: "GET",
    route: "/api/follows/followers/:id",
    expectedHeader: "Provide the following data to the API.",
    expected: `:id - The MongoDB ObjectId of the user that you want to get a followers list for.`,
    resultHeader: "Returns an array of all users that are following the target user.",
    result: `
    {
      "message": String?,
      "error": String?,
      "data": [
        {
          "dateFollowed": Date,
          "followedBy": {
            "displayName": String,
            "accountHandle": String,
            "photoURL": String
          }
        }
      ]
    }`
  },
  {
    type: "Follow",
    method: "DELETE",
    route: "/api/follows/:id",
    expectedHeader: "Provide the following data to the API.",
    expected: `:id - The MongoDB ObjectId of the follow relationship that you want to remove.`,
    resultHeader: "Returns a message indicating success or failure.",
    result: `
    {
      "message": String?,
      "error": String?
    }`
  },
  {
    type: "Rating",
    method: "POST",
    route: "/api/ratings",
    expectedHeader: "Provide the following data to the API.",
    expected: `
    {
      "ratingData": {
        "userRated": ObjectId,
        "ratedBy": ObjectId,
        "rating": Number
      }
    }`,
    resultHeader: "Returns the newly-saved rating object.",
    result: `
    {
      "message": String?,
      "error": String?,
      "data": {
        "userRated": ObjectId,
        "ratedBy": ObjectId,
        "rating": Number
      }
    }`
  },
  {
    type: "Rating",
    method: "GET",
    route: "/api/ratings/:id",
    expectedHeader: "Provide the following data to the API.",
    expected: `:id - The MongoDB ObjectId of the user you want to get a list of all received ratings for.`,
    resultHeader: "Returns an array of populated rating objects for the target user.",
    result: `
    {
      "message": String?,
      "error": String?,
      "data": [
        {
          "ratedBy": {
            "displayName": String,
            "accountHandle": String,
            "photoURL": String
          },
          "rating": Number,
          "dateRated": Date
        }
      ]
    }`
  },
  {
    type: "Rating",
    method: "DELETE",
    route: "/api/ratings/:id",
    expectedHeader: "Provide the following data to the API.",
    expected: `:id - The MongoDB ObjectId of the rating that you want to remove.`,
    resultHeader: "Returns a message indiciating success or failure.",
    result: `
    {
      "message": String?,
      "error": String?
    }`
  }
]

var tablePtr = null;
var tableNav = null;

window.onload = () => {
  
  tablePtr = document.getElementById("documentation-body");
  tableNav = document.getElementById("table-nav");

  document.getElementById("topButton").style.display = "none";

  if (tablePtr) {

    let currentType = "";
    routes.forEach(r => {
      let row = document.createElement("tr");

      if (currentType != r.type) {
        currentType = r.type;
        let markerRow = document.createElement("tr");
        let markerCol = document.createElement("td");
        markerCol.colSpan = "5";
        markerCol.className = "text-muted fs-3";
        markerCol.style.fontWeight = 500;
        markerCol.innerText = `${r.type} Routes`;

        markerRow.id = r.type;
        markerRow.insertAdjacentElement("beforeend", markerCol);
        tablePtr.insertAdjacentElement("beforeend", markerRow);

        let navItem = document.createElement("li");
        let navLink = document.createElement("a");
        navLink.href=`#${r.type}`;
        navLink.innerText = `❯ ${r.type} Routes`;
        navLink.className = "navLink";

        navItem.insertAdjacentElement("beforeend", navLink);
        tableNav.insertAdjacentElement("beforeend", navItem);
      }

      let typeCol = document.createElement("td");
      typeCol.innerText = r.type;
      typeCol.className = "text-center";

      let methodCol = document.createElement("td");
      let methodSpan = document.createElement("span");
      methodSpan.className = "badge rounded-pill";
      switch(r.method) {
        case "POST":
          methodSpan.classList.add("bg-success");
          break;
        case "GET":
          methodSpan.classList.add("bg-primary");
          break;
        case "DELETE":
          methodSpan.classList.add("bg-danger");
          break;
        default:
          methodSpan.classList.add("bg-warning");
          methodSpan.classList.add("text-dark")
          break;
      }
      methodSpan.innerText = r.method;
      methodCol.insertAdjacentElement("beforeend", methodSpan);
      methodCol.className = "text-center";

      let routeCol = document.createElement("td");
      routeCol.innerText = r.route;
      routeCol.className = "text-center";

      let expectedCol = document.createElement("td");
      let expectedHeader = document.createElement("p");
      expectedHeader.innerText = r.expectedHeader;
      let expectedBody = document.createElement("code");
      expectedBody.style.whiteSpace = "pre-wrap";
      expectedBody.innerText = r.expected;
      expectedCol.insertAdjacentElement("beforeend", expectedHeader);
      expectedCol.insertAdjacentElement("beforeend", expectedBody);
      expectedCol.style.verticalAlign = "top";

      let resultCol = document.createElement("td");
      let resultHeader = document.createElement("p");
      resultHeader.innerText = r.resultHeader;
      let resultBody = document.createElement("code");
      resultBody.style.whiteSpace = "pre-wrap";
      resultBody.innerText = r.result;
      resultCol.insertAdjacentElement("beforeend", resultHeader);
      resultCol.insertAdjacentElement("beforeend", resultBody);
      resultCol.style.verticalAlign = "top";

      row.insertAdjacentElement("beforeend", typeCol);
      row.insertAdjacentElement("beforeend", methodCol);
      row.insertAdjacentElement("beforeend", routeCol);
      row.insertAdjacentElement("beforeend", expectedCol);
      row.insertAdjacentElement("beforeend", resultCol);

      tablePtr.insertAdjacentElement("beforeend", row);
    });

  } else { console.log(`There was a problem finding the table.`); }

}

window.onscroll = scroll => {
  if (window.scrollY > document.getElementById("routes-table").offsetTop) {
    document.getElementById("topButton").style.display = "block";
  } else {
    document.getElementById("topButton").style.display = "none";
  }
}

function handleToTopClick() {
  window.scrollTo(0, 0);
}
