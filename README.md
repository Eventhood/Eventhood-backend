# The Neighborhood Backend API
!["Developed With" Card](https://img.shields.io/badge/Developed%20With-Visual%20Studio%20Code,%20Express,%20MongoDB%20&%20Heroku-blue?style=for-the-badge&logo=VisualStudio)

[!["Documentation" Card](https://img.shields.io/badge/Documentation-74%25%20Complete-red?style=for-the-badge&logo=Wikipedia)](https://the-neighborhood-dev.herokuapp.com/documentation)

Our backend API is at the heart of all connections between our platform's mobile application and our backend systems. The API allows the mobile application to make requests and receive data from our Mongo database without having to establish a direct connection to the database itself. Not only does this mean that our mobile application can be simplified behind-the-scenes by not having to run the database queries itself (this also allows us to use the API from other platforms / features which could come in the future), but we are also able to take extra steps to secure and protect the data of both our platform and it's users.

## Documentation
We have recently changed our approach to documenting our API! The initial plan was to make use of this repo's wiki pages and keep it built right into the repository itself, however we found that the process was edging towards becoming too convoluted and provided way more features than we needed. It also wasn't possible to organize the way we wanted. In response to those challenges, we have now shifted our approach to implementing a route in the API which will display a [full documentation page for each and every route available](https://the-neighborhood-dev.herokuapp.com/documentation)! Much like before, the documentation will provide a thorough outline of each route and make it clear what data it expects to receive, and what data you can expect to receive back, in a simple and straightforward way.

The documentation is currently 74% complete.

## Branches
All changes should first be pushed to the 'dev' branch of this repo and [thoroughly tested](https://the-neighborhood-dev.herokuapp.com/) before any changes are pulled into the 'main' repository. Once changes have been tested and are ready to be merged, a pull request can be made and approved which will integrate the changes with the existing production-ready version of the API in the 'main' branch.
