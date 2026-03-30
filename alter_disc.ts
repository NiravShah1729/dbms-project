import oracledb from 'oracledb';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECTION_STRING,
};

async function alterTable() {
  let conn;
  try {
    conn = await oracledb.getConnection(dbConfig);
    const sql = `ALTER TABLE Discussion ADD ParentID NUMBER`;
    await conn.execute(sql);
    
    const fkSql = `ALTER TABLE Discussion ADD CONSTRAINT fk_disc_parent FOREIGN KEY (ParentID) REFERENCES Discussion(DiscussionID) ON DELETE CASCADE`;
    await conn.execute(fkSql);
    
    await conn.commit();
    console.log('Successfully added ParentID column and FK constraint to Discussion table.');
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

alterTable();
