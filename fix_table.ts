import oracledb from 'oracledb';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECTION_STRING,
};

async function fixTable() {
  let conn;
  try {
    conn = await oracledb.getConnection(dbConfig);
    const sql = `ALTER TABLE Question ADD IsVerified NUMBER(1) DEFAULT 1 CHECK (IsVerified IN (0, 1))`;
    await conn.execute(sql);
    await conn.commit();
    console.log('Successfully added IsVerified to Question table.');
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

fixTable();
