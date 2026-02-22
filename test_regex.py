import json
import httpx
import re
from pathlib import Path

cache = Path('C:/Users/sio08/.notebooklm-mcp-cli/auth.json')
data = json.loads(cache.read_text())
cookies = httpx.Cookies()
for k, v in data['cookies'].items():
    cookies.set(k, v, domain='.google.com')

headers = {'User-Agent': data.get('user_agent', 'Mozilla/5.0')}

r = httpx.get('https://notebooklm.google.com/', cookies=cookies, headers=headers)
print("Regex FdrFJe match:", re.search(r'"FdrFJe":"([^"]+)"', r.text))
print("Regex f.sid match:", re.search(r'f\.sid=(\d+)', r.text))

# Let's save a piece of HTML to see if boq_labs is actually the session_id
with open('debug_html.txt', 'w', encoding='utf-8') as f:
    f.write(r.text)

print("HTML saved to debug_html.txt")
