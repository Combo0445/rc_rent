import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "Rc Rent",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const query = async (sql, params = []) => {
  const [rows] = await pool.query(sql, params);
  return rows;
};

export const callProcedure = async (procName, params = []) => {
  const placeholders = params.map(() => "?").join(",");
  const sql = `CALL ${procName}(${placeholders})`;
  const [resultSets] = await pool.query(sql, params);
  return resultSets[0] || [];
};

export default pool;
