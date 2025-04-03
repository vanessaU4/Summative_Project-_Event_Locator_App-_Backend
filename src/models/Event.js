const pool = require("../config/db");

const createEventTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      event_date TIMESTAMP,
      location GEOMETRY(Point, 4326),
      category VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
  await pool.query(query);
};

const createEvent = async (
  name,
  description,
  eventDate,
  location,
  category
) => {
  const query = `
    INSERT INTO events (name, description, event_date, location, category)
    VALUES ($1, $2, $3, ST_GeomFromText($4, 4326), $5) RETURNING *`;
  const values = [
    name,
    description,
    eventDate,
    `POINT(${location.lng} ${location.lat})`,
    category,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const findEventById = async (id) => {
  const query = "SELECT * FROM events WHERE id = $1";
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

const updateEvent = async (
  id,
  { name, description, eventDate, location, category }
) => {
  const query = `
    UPDATE events 
    SET name = $1, description = $2, event_date = $3, location = ST_GeomFromText($4, 4326), category = $5
    WHERE id = $6 RETURNING *`;
  const values = [
    name,
    description,
    eventDate,
    `POINT(${location.lng} ${location.lat})`,
    category,
    id,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const deleteEvent = async (id) => {
  const query = "DELETE FROM events WHERE id = $1 RETURNING *";
  const result = await pool.query(query, [id]);
  return result.rows[0];
};



module.exports = {
  createEventTable,
  createEvent,
  findEventById,
  updateEvent,
  deleteEvent,
  
};
