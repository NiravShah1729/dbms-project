import oracledb from 'oracledb';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECTION_STRING,
};

async function syncSubmissions() {
  let conn;
  try {
    conn = await oracledb.getConnection(dbConfig);
    
    // 1. Add CF_SubmissionID to Submission table
    try {
        await conn.execute(`ALTER TABLE Submission ADD CF_SubmissionID NUMBER`);
        await conn.execute(`CREATE UNIQUE INDEX idx_cf_sub_id ON Submission(CF_SubmissionID)`);
    } catch (e: any) {
        if (e.errorNum !== 904 && e.errorNum !== 955) console.log('Notice:', e.message);
    }
    
    await conn.commit();
    console.log('Database updated for CF submission tracking.');
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

syncSubmissions();
