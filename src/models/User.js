const pool = require("../config/db");

const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'user',
      location GEOMETRY(Point, 4326),
      preferred_categories TEXT[],
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
  await pool.query(query);
};

const createUser = async (
  name,
  email,
  hashedPassword,
  role,
  location,
  preferredCategories
) => {
  const query = `
    INSERT INTO users (name, email, password, role, location, preferred_categories)
    VALUES ($1, $2, $3, $4, ST_GeomFromText($5, 4326), $6) RETURNING *`;
  const values = [
    name,
    email,
    hashedPassword,
    role,
    `POINT(${location.lng} ${location.lat})`,
    preferredCategories,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1";
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

const findUserById = async (id) => {
  const query = "SELECT * FROM users WHERE id = $1";
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

const updateUser = async (id, { latitude, longitude, preferredCategories }) => {
  const query = `
    UPDATE users 
    SET location = ST_GeomFromText($1, 4326), preferred_categories = $2
    WHERE id = $3 RETURNING *`;
  const values = [`POINT(${longitude} ${latitude})`, preferredCategories, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

module.exports = {
  createUserTable,
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
};
