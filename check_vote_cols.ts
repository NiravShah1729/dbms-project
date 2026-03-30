import oracledb from 'oracledb';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECTION_STRING,
};

async function checkVoteColumns() {
  let conn;
  try {
    conn = await oracledb.getConnection(dbConfig);
    const sql = `
      SELECT column_name 
      FROM all_tab_columns 
      WHERE table_name = 'VOTE' 
      ORDER BY column_name
    `;
    const result = await conn.execute(sql);
    console.log(JSON.stringify(result.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

checkVoteColumns();
