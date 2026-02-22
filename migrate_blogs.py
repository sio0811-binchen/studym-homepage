import json
import urllib.request
import urllib.error
import time
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
import urllib.error
import time

API_URL = 'https://www.studym.co.kr/api/blog/'
ADMIN_SECRET = 'studym001!'
JSON_FILE = 'public/content/articles.json'

def migrate():
    with open(JSON_FILE, 'r', encoding='utf-8') as f:
        articles = json.load(f)

    print(f"Found {len(articles)} legacy articles to migrate.")

    for article in articles:
        payload = {
            "title": article.get("title"),
            "slug": article.get("slug"),
            "category": article.get("category"),
            "excerpt": article.get("excerpt"),
            "content": article.get("content"),
            "author": article.get("author", "Study M 교육연구소"),
            "read_time": article.get("readTime"),
            "tags": article.get("tags", []),
            "thumbnail": article.get("thumbnail"),
            "date": article.get("date")
        }

        req = urllib.request.Request(API_URL, method='POST')
        req.add_header('Content-Type', 'application/json')
        req.add_header('x-admin-secret', ADMIN_SECRET)
        data = json.dumps(payload).encode('utf-8')

        print(f"Migrating \"{payload['title']}\"... ", end='', flush=True)

        try:
            with urllib.request.urlopen(req, data=data, context=ctx) as response:
                res_data = json.loads(response.read().decode('utf-8'))
                print(f"Success (ID: {res_data.get('data', {}).get('id')})")
        except urllib.error.HTTPError as e:
            err_text = e.read().decode('utf-8')
            try:
                err_data = json.loads(err_text)
                if err_data.get("error") == "이미 존재하는 URL 슬러그입니다.":
                    print("Skipped (Already exists)")
                else:
                    print(f"Failed: {err_data}")
            except Exception:
                print(f"Failed with status {e.code}: {err_text}")
        except Exception as e:
            print(f"Error: {e}")

        time.sleep(0.5)

    print("Migration Complete!")

if __name__ == '__main__':
    migrate()
