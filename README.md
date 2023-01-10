# Coordinatea

Coordinatea is a travel blog and trip planning web application, previously deployed on coordinatea.me. A video demo of the website can be found [here](https://youtu.be/AYIulx-DKog)

## Development Stack
- React.js
- JavaScript
- GraphQL
- Express
- Node.js
- MongoDb

## Web App Features

- Integration with Mapbox to create an interactive map for planning/blogging trips which includes
    - searching locations
    - dropping location markers
    - dropping user created suggestions
    - map transistions between markers
    - mapping of markers with its corresponding user added content
- Integration with OpenTripsAPI to generate tourist attractions within a certain distance from locations
- User profile to manage journeys, comments and followings

## Technical Features
- CI/CD pipeline on github to automatically deploy the web application
    - Pipeline rebuilds the frontend and/or backend image whenever according changes occur and pushes to github's container repository. The pipeline then connects to our VM via ssh and runs the updated container
- HTTPS and security
    - Runs the nginx-proxy and nginx-proxy-acme containers to handle request redirections and SSL certificates respectively
    - Secured authentication cookies with httpOnly, secure, maxAge settings and restricted CORS to proxy servers and specific domains
- Sentry.io
    - Initialized sentry.io on both the frontend and backend to periodically send email notifications whenever an error is detected