import fs from 'fs';
import path from 'path';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

async function seedBlogs() {
    try {
        const jsonPath = path.join(__dirname, '../public/content/articles.json');
        if (!fs.existsSync(jsonPath)) {
            console.log('articles.json not found, skipping seed.');
            return;
        }

        const data = fs.readFileSync(jsonPath, 'utf8');
        const articles = JSON.parse(data);

        console.log(`Found ${articles.length} articles to seed.`);

        for (const article of articles) {
            const { title, slug, excerpt, content, author, date, readTime, category, tags, thumbnail } = article;

            // Check if already exists
            const check = await pool.query('SELECT id FROM blogs WHERE slug = $1', [slug]);
            if (check.rows.length > 0) {
                console.log(`Skipping existing article: ${slug}`);
                continue;
            }

            const tagsJson = JSON.stringify(tags || []);

            // Parse date (it is YYYY-MM-DD string)
            const createdAt = new Date(date);

            const query = `
                INSERT INTO blogs (title, slug, category, excerpt, content, author, read_time, tags, thumbnail, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            `;
            const values = [title, slug, category, excerpt, content, author, readTime, tagsJson, thumbnail, createdAt];

            await pool.query(query, values);
            console.log(`Inserted article: ${slug}`);
        }

        console.log('✅ Seeding completed successfully.');

    } catch (error) {
        console.error('❌ Seeding error:', error);
    } finally {
        await pool.end();
    }
}

seedBlogs();
