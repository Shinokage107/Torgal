require("dotenv").config();
const mysql = require("mysql2/promise");
const util = require("util");

module.exports = {
  check: check,
  get: get,
  getRowBy: getRowBy,
  createThread: createThread,
  createInterval: createInterval,
  deleteInterval: deleteInterval,
};

const pool = mysql.createPool({
  host: process.env.DB_URL,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
});

async function query(operation) {
  const conn = await pool.getConnection();
  var result = await conn.query(operation);
  conn.release();
  return Promise.resolve(result[0]);
}

async function check(table, column, value) {
  result = await query(`SELECT ${column} FROM ${table} WHERE ${column} = ${value}`);
  return result.length > 0 ? true : false;
}

async function get(table, select, where, value) {
  result = await query(`SELECT ${select} FROM ${table} WHERE ${where} = ${value}`);
  return result.length > 0 ? result[0] : false;
}

async function getRowBy(table, by, value) {
  result = await query(`SELECT * FROM ${table} WHERE ${by} = ${value}`);
  return result.length > 0 ? result[0] : false;
}

///// OnThemeInterval

async function createInterval(channel_id, interval_id) {
  result = await query(
    `INSERT INTO themeOnInterval_tbl (channel_id, interval_id) VALUES ("${channel_id}", ${interval_id}) ON DUPLICATE KEY UPDATE interval_id=${interval_id}`
  );
}

async function createThread(channel_id, thread_id) {
  result = await query(
    `INSERT INTO themeOnInterval_tbl (channel_id, currentThread_id) VALUES ("${channel_id}", ${thread_id}) ON DUPLICATE KEY UPDATE currentThread_id=${thread_id}`
  );
}

async function deleteInterval(channel_id) {
  result = await query(`DELETE FROM themeOnInterval_tbl WHERE channel_id="${channel_id}"`);
}

module.exports.query = query;
