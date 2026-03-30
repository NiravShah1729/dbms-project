import { executePool } from './server/src/config/db';
import fs from 'fs';
import path from 'path';

async function applyLogic() {
  const sqlPath = path.join(__dirname, 'database', 'programming_logic.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  const blocks = sql.split(/\n\s*\/\s*\n/);

  for (let block of blocks) {
    const cleanBlock = block.trim();
    if (!cleanBlock) continue;

    console.log('Executing block...');
    try {
      await executePool(cleanBlock);
      console.log('Success');
    } catch (err: any) {
      console.error('Error executing block:', err.message);
    }
  }
  process.exit();
}

applyLogic();
