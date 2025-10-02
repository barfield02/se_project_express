# WTWR (What to Wear?): Back End

The back-end project is focused on creating a server for the WTWR application. You’ll gain a deeper understanding of how to work with databases, set up security and testing, and deploy web applications on a remote machine. The eventual goal is to create a server with an API and user authorization.

## About

WTWR is a web application that helps users decide what to wear based on weather conditions. Users can:

- View clothing items suitable for different weather types (hot, warm, cold)
- Add new clothing items to the database
- Like and unlike clothing items
- Manage user profiles
- Browse all users and clothing items

The application provides a RESTful API for managing users and clothing items with full CRUD operations.

## Technologies & Techniques Used

**Backend Technologies:**

- Node.js - JavaScript runtime environment
- Express.js - Web application framework
- MongoDB - NoSQL database
- Mongoose - MongoDB object modeling library

**Development Tools:**

- ESLint - Code linting with Airbnb style guide
- Prettier - Code formatting
- Nodemon - Development server with hot reload

**Key Techniques:**

- RESTful API design
- MongoDB schema design and validation
- Error handling and status codes
- Request/response middleware
- Database relationships (ObjectId references)
- URL validation using validator package

## Running the Project

`npm run start` — to launch the server

`npm run dev` — to launch the server with the hot reload feature

### Testing

Before committing your code, make sure you edit the file `sprint.txt` in the root folder. The file `sprint.txt` should contain the number of the sprint you're currently working on. For ex. 12
