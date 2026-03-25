// delete_wp_blogs.js
const WP_API = 'https://wordpress-production-63d7.up.railway.app/wp-json/wp/v2';
const WP_AUTH = 'Basic ' + Buffer.from('studym_admin:eriJ 9mXq pTln vnQ1 tewo GeRU').toString('base64');

const postIds = [39, 11, 10, 6];

async function deletePosts() {
    for (const id of postIds) {
        console.log(`Deleting post ID: ${id}...`);
        const res = await fetch(`${WP_API}/posts/${id}?force=true`, {
            method: 'DELETE',
            headers: {
                'Authorization': WP_AUTH
            }
        });

        if (res.ok) {
            console.log(`✅ Successfully deleted post ID: ${id}`);
        } else {
            const err = await res.text();
            console.error(`❌ Failed to delete post ID: ${id}. Status: ${res.status}. Error: ${err}`);
        }
    }
}

deletePosts();
