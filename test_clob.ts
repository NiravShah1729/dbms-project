import oracledb from 'oracledb';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECTION_STRING,
};

oracledb.fetchAsString = [oracledb.CLOB];

async function testFetch() {
  let conn;
  try {
    conn = await oracledb.getConnection(dbConfig);
    // Find any question
    const res = await conn.execute('SELECT * FROM Question FETCH NEXT 1 ROWS ONLY', [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

testFetch();
