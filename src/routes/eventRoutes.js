const express = require("express");
const {
  createNewEvent,
  getEvent,
  updateEventDetails,
  deleteEventById,
  getAllEvents,
} = require("../controllers/EventController");
const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateUser, createNewEvent);
router.get("/:id", getEvent);
router.put("/:id", authenticateUser, updateEventDetails);
router.delete("/:id", authenticateUser, deleteEventById);


router.get("/", getAllEvents);

module.exports = router;
