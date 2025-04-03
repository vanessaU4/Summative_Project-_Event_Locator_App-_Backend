const {
    createEvent,
    findEventById,
    updateEvent,
    deleteEvent,
    
  } = require("../models/Event");
  const pool = require("../config/db");
  
  const createNewEvent = async (req, res) => {
    const { name, description, eventDate, location, category } = req.body;
  
    if (!name || !description || !eventDate || !location || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      const event = await createEvent(
        name,
        description,
        eventDate,
        location,
        category
      );
      res.status(201).json({ message: "Event created", event });
    } catch (error) {
      res.status(500).json({ message: "Error creating event", error });
    }
  };
  
  const getEvent = async (req, res) => {
    const { id } = req.params;
  
    try {
      const event = await findEventById(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.status(200).json({ event });
    } catch (error) {
      res.status(500).json({ message: "Error fetching event", error });
    }
  };
  
  const updateEventDetails = async (req, res) => {
    const { id } = req.params;
    const { name, description, eventDate, location, category } = req.body;
  
    try {
      const updatedEvent = await updateEvent(id, {
        name,
        description,
        eventDate,
        location,
        category,
      });
      res.status(200).json({ message: "Event updated", updatedEvent });
    } catch (error) {
      res.status(500).json({ message: "Error updating event", error });
    }
  };
  
  const deleteEventById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedEvent = await deleteEvent(id);
      res.status(200).json({ message: "Event deleted", deletedEvent });
    } catch (error) {
      res.status(500).json({ message: "Error deleting event", error });
    }
  };
  
  const getAllEvents = async (req, res) => {
    const { category } = req.query; 
  
    try {
      let eventsQuery = "SELECT * FROM events";
      let values = [];
  
      if (category) {
        eventsQuery += " WHERE category = $1";
        values.push(category); 
      }
  
      const events = await pool.query(eventsQuery, values);
      res.status(200).json({ events: events.rows });
    } catch (error) {
      console.error("Error fetching events:", error);
      res
        .status(500)
        .json({ message: "Error fetching events", error: error.message });
    }
  };
  
  
  
  module.exports = {
    createNewEvent,
    getEvent,
    updateEventDetails,
    deleteEventById,
    getAllEvents,
  };
  