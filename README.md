# Event-Locator-App-Backend

## 📌 Overview
This is a **Node.js backend** for an event locator app, featuring:
- User authentication (JWT)
- Event management (CRUD)
- Location-based search (MongoDB Geospatial Queries)
- Notifications (Redis + BullMQ)
- Multilingual Support (i18n)
- Unit Testing (Jest + Supertest)

## 🚀 Installation
1. Clone the repo:
   ```sh
   git clone https://github.com/vanessaU4/Summative_Project-_Event_Locator_App-_Backend.git

2. Install dependecies 
       npm install

3. Create an .env file with these included:
   MONGO_URI=mongodb:your root
   JWT_SECRET=your_secret_key

4. Connect both MongoDB and Redis: 
   redis-server
   mongodb

5. Run the server: 
   npm run dev

  // N.B: You should see that MongoDB has connected and is running, if not, make sure your node_modules are in .gitignore just in case you, and check your .env too.

6. To Run tests:

   npm test

        // API Endpoints
Auth Routes: 
   POST /api/auth/signup → Register a user
   POST /api/auth/login → Login a user

Event Routes: 
   POST /api/events → Create an event
   GET /api/events → Get all events
   GET /api/events/search?longitude=XX&latitude=YY&maxDistance=5000 → Search events by location
   GET /api/events/filter?category=music → Filter events by category
   PUT /api/events/:id → Update an event
   DELETE /api/events/:id → Delete an event

N.B.: Always ensure that the MongoDB schema is indexed properly in your event schema file- This is cardinal for geospatial queries

N.B: Of course, test your API calls in Postman or curL just so you're tracking your CRUD operations.