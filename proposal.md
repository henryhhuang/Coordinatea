# Project Proposal - Team DapperKats
 
## Team Members
- Justin Tran
- Henry (Xiao Hang) Huang
 
## Coordinate (App name)
Coordinate is a travel blog and trip planning web application. The goal of this project is to create a web application that makes it easy for people to plan trips, share traveling experiences, discover attractions around the world, and log their memories. 
Users will be able to upload a “journey” into their profile, which is just a collection of dates. For each date in a journey, users can create a detailed description of that day's activities, upload images/videos, and add a location. Other users are able to view, comment, and like journeys, and follow (subscribe) to another user to receive updates on another user’s activities. Users can delete their own comments, and journey owners can delete their own journeys and comments on their journey. ( TRAVEL BLOG PART )

Users will also be given tools to help plan future trips. Using integration with a map API, the web application will be able to provide users an easy mechanism to find local attractions. Users will be able to search by location, or use an interactive map to discover new hotspots to visit on their trips. Users can also discover new travel destinations by browsing journeys on their feed, and clicking on the location tagged in a journey to find other journeys for the same location. ( TRIP PLANNING PART)

Possible other features that Coordinate will provide is an interactive map on a user’s own profile that provides a timeline of countries/locations that a user has visited. Clicking on a country that you have visited will display all journeys you posted from that location. Users may be able to create shareable links so that they can share their journeys with friends/family.

## Key features for Beta version
- Integration with a map API to be determined (mapbox, google maps)
- Database and S3 setup to store user data / media
- Basic Interactions for testing
   - Basic searching and filtering for users/content/locations
   - User management:
       - Users can sign up for an account using their email
       - Users should be able to sign-in,
   - Journey creation / deletion
       - Allow users to upload an image
       - Allow users to add an address
   - Reading a journey
    - Browsing through a feed of journeys
       - Viewing journey content
       - Viewing journey address from a map
       - Viewing images retrieved from S3

## Additional Features for Final version
- User registration and authentication through Google
- Liking and commenting on a journey
- Following users and receiving notifications from followed users
- Browse through a feed of followed users
- More advanced searching and filtering
- (POSSIBLE) Interactive map to display travel history
- (POSSIBLE) Create shareable links to journeys
 
## Techonology Stack
- Frontend
   - React
   - MaterialUI
- API
   - NodeJs
   - GraphQl (Apollo)
- Backend
   - NodeJs
   - MongoDB
   - S3
- Deployment
   - We intend to deploy our web application onto a virtual machine but this may be subject to change in the future
 
## Technical Challenges
- Integrating and utilizing a mapping API
- Setting up S3 and integrating with our backend for image uploads
- Setting up an effective Mongo database with its according models and structures
- Creating a clean and modularized frontend for the UI
- Setting up user authentication and signup using other platforms like Google or Facebook
