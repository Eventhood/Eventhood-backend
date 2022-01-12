# The Neighborhood Backend API
!["Developed With" Card](https://img.shields.io/badge/Developed%20With-Visual%20Studio%20Code,%20Express,%20MongoDB%20&%20Heroku-blue?style=for-the-badge&logo=VisualStudio)
[!["Documentation" Card](https://img.shields.io/badge/Documentation-Not%20Started%20%280%25%29-red?style=for-the-badge)](https://github.com/Eventhood/Eventhood-backend/wiki)

Our backend API is at the heart of all connections between our platform's mobile application and our backend systems. The API allows the mobile application to make requests and receive data from our Mongo database without having to establish a direct connection to the database itself. Not only does this mean that our mobile application can be simplified behind-the-scenes by not having to directly connect to the database itself, but we are also able to take extra steps to secure and protect the data of both our platform and it's users.

## Documentation
We have every intention of fully documenting our API through the use of [this repo's wiki pages](https://github.com/Eventhood/Eventhood-backend/wiki) to make the process of integrating this API into our mobile app, and any other future 'Neighborhood' features, much smoother and easier. The documentation will provide a thorough outline of each and every route, so that it can be easily understood exactly what must be provided to them, and exactly what type of data to expect in return.

The documentation has currently not been started, but our progress will be updated regularly via the documentation card above.

## Branches
All changes should first be pushed to the 'dev' branch of this repo and [thoroughly tested](https://the-neighborhood-dev.herokuapp.com/) before any changes are pulled into the 'main' repository. Once changes have been tested and are ready to be merged, a pull request can be made and approved which will integrate the changes with the existing production-ready version of the API in the 'main' branch.