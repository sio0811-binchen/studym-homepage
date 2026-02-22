import json
import httpx
import re

auth_file = r"C:\Users\sio08\.notebooklm-mcp-cli\auth.json"

with open(auth_file, "r") as f:
    data = json.load(f)

cookies_data = data.get("cookies", {})
user_agent = data.get("user_agent", "")

cookies = httpx.Cookies()
# Assuming flat dict format from auth.json
for name, value in cookies_data.items():
    cookies.set(name, value, domain=".google.com")
    cookies.set(name, value, domain=".googleusercontent.com")

headers = {
    "User-Agent": user_agent or "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "sec-ch-ua": '"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
}

if user_agent:
    match = re.search(r"Chrome/(\d+)", user_agent)
    if match:
        version = match.group(1)
        headers["sec-ch-ua"] = f'"Google Chrome";v="{version}", "Chromium";v="{version}", "Not A(Brand";v="24"'

with httpx.Client(cookies=cookies, headers=headers, follow_redirects=True, timeout=15.0) as client:
    response = client.get("https://notebooklm.google.com/")
    print(f"Final URL: {response.url}")
    print(f"Status Code: {response.status_code}")
    
    html = response.text
    csrf_match = re.search(r'"SNlM0e":"([^"]+)"', html)
    if csrf_match:
        print(f"CSRF Token Found: {csrf_match.group(1)[:10]}...")
    else:
        print("CSRF Token NOT FOUND.")
