const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes");
const { createUserTable } = require("./src/models/User");
const { createEventTable } = require("./src/models/Event");
const eventRoutes = require("./src/routes/eventRoutes"); 
const app = express();

// Load environment variables
dotenv.config();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes); 

// Start server
const port = process.env.PORT || 5000;
app.listen(port, async () => {
  console.log(`Server running on port ${port}`);
    await createUserTable(); 
    await createEventTable();
});
