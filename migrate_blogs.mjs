import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'https://study-manager-production-826b.up.railway.app/api/blog/';
const ADMIN_SECRET = 'studym001!';

async function migrate() {
    try {
        const dataPath = path.join(__dirname, 'public', 'content', 'articles.json');
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const articles = JSON.parse(rawData);

        console.log(`Found ${articles.length} legacy articles to migrate.`);

        for (const article of articles) {
            const payload = {
                title: article.title,
                slug: article.slug,
                category: article.category,
                excerpt: article.excerpt,
                content: article.content,
                author: article.author || 'Study M 교육연구소',
                read_time: article.readTime,
                tags: article.tags,
                thumbnail: article.thumbnail,
                date: article.date
            };

            process.stdout.write(`Migrating "${payload.title}"... `);
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-secret': ADMIN_SECRET
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const resData = await response.json();
                console.log(`Success (ID: ${resData.data.id})`);
            } else {
                const errText = await response.text();
                try {
                    const errData = JSON.parse(errText);
                    if (errData.error === '이미 존재하는 URL 슬러그입니다.') {
                        console.log(`Skipped (Already exists)`);
                    } else {
                        console.log(`Failed:`, errData);
                    }
                } catch (parseError) {
                    console.log(`Failed with status ${response.status}: ${errText}`);
                }
            }
            // Add a small delay
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        console.log('Migration Complete!');
    } catch (e) {
        console.error('\nFatal Error Migration:', e);
    }
}

migrate();
