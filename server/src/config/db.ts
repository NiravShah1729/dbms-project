import oracledb from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();

// Oracle Instant Client setup (if needed on local Windows)
// oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_21_12' });

const dbConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECTION_STRING,
};

export async function getConnection() {
  return await oracledb.getConnection(dbConfig);
}

export async function executePool<T>(
  sql: string,
  binds: oracledb.BindParameters = {},
  options: oracledb.ExecuteOptions = { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true }
) {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute<T>(sql, binds, options);
    return result;
  } catch (err) {
    console.error('DB Execution Error:', err);
    throw err;
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error('DB Connection Close Error:', err);
      }
    }
  }
}
