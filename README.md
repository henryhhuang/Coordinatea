# Coordinatea
## Project URL
[coordinatea.me](https://coordinatea.me/)
https://coordinatea.me/
## Project Video URL
[YouTube Video Demo](https://youtu.be/AYIulx-DKog)
https://youtu.be/AYIulx-DKog
## Project Description
Coordinate(a) is a travel blog and trip planning web application. The web application makes it easy for users to share their travel experiences, look for trip ideas, or plan their next trip with suggestions provided by the web app and other users' input. Users are able to create an account on the web app and create what we call journeys, which is a collection of locations on specific dates. Users can add location markers by using an interactive app, and add text and images to populate the marker with some information. If the creator has allowed it, other users can add their suggestions by placing suggestion markers for a specific location in the journey. Users can view other users' journeys and leave comments saying what they think.
 
There are two types of journeys that a user can create, Past and Plan. Past journeys are exactly as they sound, they're just journeys showcasing a trip that you already went on. Planned journeys are journeys in the future, they behave similarly to a Past journey except that when placing a location on your journey the web app provides suggestions of common tourist attractions around the area.
 
On a user's profile, they can customize and change their account information, and manage all their created journeys and comments. Other users can view all a user's published journeys and comments on their profiles, and if a user is particularly interesting other users can follow them to get easy access to their content on the 'Following' page.
## Development
 
For the core technologies that we are using in the web app, we decided to use the MERNG tech stack (MongoDB, Express, React, Node.js, GraphQL).
 
For the frontend side of things, the app was built using React with hooks and Material UI components. For our map integration we utilized Mapbox, more specifically third party libraries in mapbox-gl and react-map-gl to build our interactive map. In addition, we used OpenTripMaps API to retrieve and display popular tourist attractions around an area.
 
The communication with the backend is done mostly with graphql queries and mutations, with some REST endpoints for sign-in/sign-up and image upload as discussed on the piazza forum. The application makes use of the third party platform Apollo GraphQL.
 
The backend is an Apollo Server object with a regular Express server that we have worked with throughout the semester applied as a middleware to the Apollo Server. The front end uses Apollo Client to send messages along with context (includes session and cookie data) to the backend, and listens back for responses from the graphql backend. Client side graphql queries and mutations make use of hooks provided by Apollo Client, which listen for changes or events to invoke a query/mutation.
 
We used MongoDB as our database for storing most of the data that the application uses, with the exception of the upload image files stored directly onto our DigitalOcean droplet. We connect to our mongodb database using third-party library mongoose, and all schemas for data are defined in the backend as SchemaModels.
Authentication and user management is done through saving user sessions to cookies as seen in lecture using the express-session library. Cookies are stored on the user's end and contain session information that is authenticated server side. The session information is used to ensure users are authenticated, and is also used to identify users for authorization checks.
Cookies are secured through httpOnly and secure flags in the production environment and CORS policy are specific domains (proxy server and deployed server domain names) and not wild-cards.
 
## Deployment
Our app is deployed using Docker through our CI/CD pipeline on a digital ocean droplet. Our pipeline rebuilds the frontend and backend image whenever any code changes occur and pushes it to the github container repository. The github action then connects to our droplet through ssh and runs the docker-compose file to pull any changes and rerun the container. In our docker-compose file, we have volumes mounted in our backend to read configurations and save images directly onto the droplet instead of the container. Additionally, it also runs an nginx-proxy to handle request redirections and a nginx-proxy-acme container to handle our SSL certificates.
## Maintenance
Our web app has sentry.io set up for the nodejs backend and the react front end as two seperate projects. Sentry is initialised on the index.js (backend) and App.js file (frontend). Both Sentry instances listen for any errors that occur and logs these errors as issues in the project. We receive email notifications every so often whenever an error is detected, in which case we can view the logs of the failure output and mark the issue as resolved if we deem it not necessary to fix.
## Challenges
1. The whole deployment process was challenging. Some noticeable challenges were configuring our virtual machine on Digital Ocean, deploying with docker and setting up CI/CD pipelines
2. Another challenge was security. We found it difficult understanding how CORS worked with our backend and graphql server and configuring our app to use HTTPS. Also, the documentation on allowing CORS to work with Apollo was lacking.
3. Integrating our web application with a 3rd-Party map API and creating the features for our interactive map. Mapbox-gl does not have many interactive features built in, so we had to build them from scratch.
## Contributions
 
Xiao Hang (Henry) Huang
- Planning and design
- Set up the front-end react project
- Created many graphql endpoints
- Created some mongodb schemas
- Created the interactive map
- Created the journeys, markers and image upload features
- Created suggestions from OpenTripsMap API
- Set up CI / CD pipelines
- Set up NGINX proxy services
- Deployment
- Testing and bug fixes
- Documentation and project survey
 
Justin James Tran
- Planning and design
- Set up graphql backend along with many graphql endpoints
- Set up Apollo server and client
- Set up the mongodb database and some schemas
- Created user authentication features
- Created profile, comments, follow, landing pages, misc. pages
- Deployement and setup for DigitalOcean
- Enabled Sentry.io
- Testing and bug fixes
- Documentation and project survey
- Video
# One more thing?
Thanks for the great semester! This project was challenging but we learned a lot :)
