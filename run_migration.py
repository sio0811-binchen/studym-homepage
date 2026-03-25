import requests
import time

URL = "https://www.studym.co.kr/api/migrate-now"
MAX_RETRIES = 30 # 5 minutes max

print(f"Waiting for Railway deployment and running migration at {URL}")
for i in range(MAX_RETRIES):
    try:
        print(f"[{i+1}/{MAX_RETRIES}] Pinging {URL}...")
        res = requests.get(URL, timeout=60)
        if res.status_code == 200:
            data = res.json()
            if data.get("message") == "Migration completed":
                print("✅ Migration Successful!")
                print(f"Migrated {data.get('migratedCount')} out of {data.get('totalFound')} posts.")
                for log in data.get("logs", []):
                    print("  " + log)
                break
        print(f"❌ Not ready yet (HTTP {res.status_code}). Retrying in 10s...")
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}. Retrying in 10s...")
    
    time.sleep(10)
else:
    print("Migration script timed out.")
