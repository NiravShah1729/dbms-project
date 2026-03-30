const oracledb = require('oracledb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function run() {
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER || 'system',
      password: process.env.ORACLE_PASSWORD || 'password',
      connectString: process.env.ORACLE_CONNECTION_STRING || 'localhost:1521/XEPDB1'
    });

    console.log('Successfully connected to Oracle Database');

    const sqlPath = path.join(__dirname, 'database', 'programming_logic.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Splitting blocks by '/' at the end of a line
    const blocks = sqlContent.split(/\n\s*\/\s*\n?/g);

    for (let block of blocks) {
      const cleanBlock = block.trim();
      if (!cleanBlock) continue;

      console.log('Executing block:\n', cleanBlock.substring(0, 100) + '...');
      try {
        await connection.execute(cleanBlock);
        console.log('SUCCESS\n');
      } catch (err) {
        console.error('ERROR executing block:', err.message);
      }
    }

    await connection.commit();
  } catch (err) {
    console.error('Connection error:', err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

run();
