import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function fixThumbnails() {
    try {
        const result = await pool.query(`UPDATE blogs SET thumbnail = NULL WHERE thumbnail LIKE '%placehold.co%'`);
        console.log(`Successfully updated ${result.rowCount} rows. Removed placehold.co thumbnails.`);
    } catch (err) {
        console.error('Error fixing thumbnails:', err);
    } finally {
        await pool.end();
    }
}

fixThumbnails();
