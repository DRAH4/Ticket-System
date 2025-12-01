// db.js
const mysql = require('mysql2/promise');

// Database Config File
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',               
  password: 'ServerPass#4', 
  database: 'ticket_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
