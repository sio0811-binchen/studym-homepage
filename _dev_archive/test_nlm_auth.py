import json
import httpx
from pathlib import Path

cache = Path('C:/Users/sio08/.notebooklm-mcp-cli/auth.json')
data = json.loads(cache.read_text())
cookies = httpx.Cookies()
for k, v in data['cookies'].items():
    cookies.set(k, v, domain='.google.com')

headers = {
    'User-Agent': data.get('user_agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36'),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
}

print(f"Testing with {len(data['cookies'])} cookies...")

with httpx.Client(cookies=cookies, headers=headers, follow_redirects=True, timeout=15.0) as client:
    r = client.get('https://notebooklm.google.com/')
    print(f'Status: {r.status_code}')
    print(f'Final URL: {r.url}')
    if 'accounts.google.com' in str(r.url):
        print('Redirected to login! Cookies are rejected by Google.')
    else:
        print('Successfully loaded NotebookLM page!')
        
        # Try to find CSRF token
        import re
        match = re.search(r'"SNlM0e":"([^"]+)"', r.text)
        if match:
            print(f'Found CSRF: {match.group(1)[:15]}...')
        else:
            print('Could not find CSRF token on page.')
