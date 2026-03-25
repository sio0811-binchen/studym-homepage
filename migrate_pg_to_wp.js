// migrate_pg_to_wp.js
require('dotenv').config();
const { Pool } = require('pg');

const WP_API = 'https://wordpress-production-63d7.up.railway.app/wp-json/wp/v2';
const WP_AUTH = 'Basic ' + Buffer.from('studym_admin:eriJ 9mXq pTln vnQ1 tewo GeRU').toString('base64');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

async function migrate() {
    try {
        console.log('Connecting to PostgreSQL to fetch old posts...');
        const result = await pool.query('SELECT * FROM blogs ORDER BY created_at ASC');
        const rows = result.rows;
        console.log(`Found ${rows.length} posts to migrate.`);

        // Fetch existing WP categories
        const catRes = await fetch(`${WP_API}/categories?per_page=100`);
        const catData = await catRes.json();
        const wpCategoryMap = {};
        catData.forEach(c => { wpCategoryMap[c.name] = c.id; });

        for (const row of rows) {
            console.log(`\nMigrating: [${row.title}]...`);

            // Handle category
            let catId = wpCategoryMap[row.category];
            if (!catId && row.category) {
                console.log(`Category "${row.category}" not found in WP. Creating...`);
                const createCatRes = await fetch(`${WP_API}/categories`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': WP_AUTH },
                    body: JSON.stringify({ name: row.category })
                });
                if (createCatRes.ok) {
                    const newCat = await createCatRes.json();
                    catId = newCat.id;
                    wpCategoryMap[row.category] = catId;
                } else {
                    console.error(`Failed to create category: ${row.category}`);
                }
            }

            // Map PG to WP REST API payload
            // Note: DB had content in Markdown. Since we switched to HTML, we should ideally convert, 
            // but WP can handle basic markdown if handled properly. However, for seamless transition, 
            // we will push the content. The frontend will render it as HTML (dangerouslySetInnerHTML).
            // Wait, old content was markdown and now frontend expects HTML. 
            // We need to convert Markdown to HTML!

            // Using a simple regex to convert Markdown to HTML for the old posts
            let htmlContent = row.content || '';

            // Basic Markdown to HTML conversion
            htmlContent = htmlContent
                .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                .replace(/^> (.*$)/gim, '<blockquote><p>$1</p></blockquote>')
                .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
                .replace(/\*(.*)\*/gim, '<em>$1</em>')
                .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />")
                .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
                .replace(/^\n$/gim, '<br />');

            // Convert plain paragraphs
            let paragraphs = htmlContent.split('\n\n');
            htmlContent = paragraphs.map(p => {
                p = p.trim();
                if (!p.startsWith('<h') && !p.startsWith('<blockquote') && !p.startsWith('<img') && !p.startsWith('<a') && p.length > 0) {
                    // It's a plain text paragraph or list, let WP handle it or wrap in <p>
                    return `<p>${p}</p>`;
                }
                return p;
            }).join('\n\n');

            const payload = {
                title: row.title,
                content: htmlContent,
                slug: row.slug,
                status: 'publish',
                categories: catId ? [catId] : [],
                date: row.created_at.toISOString(),
            };

            const wpRes = await fetch(`${WP_API}/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': WP_AUTH },
                body: JSON.stringify(payload)
            });

            if (wpRes.ok) {
                const wpPost = await wpRes.json();
                console.log(`✅ Success! WP Post ID: ${wpPost.id} - URL: ${wpPost.link}`);
            } else {
                const errorStr = await wpRes.text();
                // If it's a duplicate slug, WP will return 400. That's fine.
                console.error(`❌ Failed: HTTP ${wpRes.status} - ${errorStr}`);
            }
        }
    } catch (error) {
        console.error('Migration error:', error);
    } finally {
        await pool.end();
    }
}

migrate();
