import json
import urllib.parse
import httpx
from pathlib import Path

# Load cookies
cache = Path('C:/Users/sio08/.notebooklm-mcp-cli/auth.json')
data = json.loads(cache.read_text())

cookies = httpx.Cookies()
for k, v in data['cookies'].items():
    cookies.set(k, v, domain='.google.com')
    cookies.set(k, v, domain='.googleusercontent.com')

# First fetch homepage to get fresh CSRF and SID
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
}

with httpx.Client(cookies=cookies, headers=headers, follow_redirects=True, timeout=15.0) as client:
    r = client.get('https://notebooklm.google.com/')
    
import re
csrf_match = re.search(r'"SNlM0e":"([^"]+)"', r.text)
sid_match = re.search(r'"FdrFJe":"([^"]+)"', r.text)
bl_match = re.search(r'"cfb2h":"([^"]+)"', r.text)

csrf = csrf_match.group(1) if csrf_match else ""
sid = sid_match.group(1) if sid_match else ""
bl = bl_match.group(1) if bl_match else "boq_labs-tailwind-frontend_20260108.06_p0"

print(f"Fresh CSRF: {csrf[:15]}...")
print(f"Fresh SID: {sid}")
print(f"Fresh BL: {bl}")

# Now build batchexecute for wXbhsf (List Notebooks)
rpc_id = "wXbhsf"
params_json = json.dumps([None, None, None, None, None, None, None], separators=(',', ':'))
f_req = [[[rpc_id, params_json, None, "generic"]]]
f_req_json = json.dumps(f_req, separators=(',', ':'))

body_parts = [f"f.req={urllib.parse.quote(f_req_json, safe='')}"]
if csrf:
    body_parts.append(f"at={urllib.parse.quote(csrf, safe='')}")
body = "&".join(body_parts) + "&"

url_params = {
    "rpcids": rpc_id,
    "source-path": "/",
    "bl": bl,
    "hl": "en",
    "rt": "c",
    "f.sid": sid
}
url = f"https://notebooklm.google.com/_/LabsTailwindUi/data/batchexecute?{urllib.parse.urlencode(url_params)}"

rpc_headers = {
    'User-Agent': headers['User-Agent'],
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    "Origin": "https://notebooklm.google.com",
    "Referer": "https://notebooklm.google.com/",
    "X-Same-Domain": "1",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
}

with httpx.Client(cookies=cookies, headers=rpc_headers, timeout=15.0) as client:
    resp = client.post(url, content=body)
    print(f"RPC Status: {resp.status_code}")
    print("RPC Response Preview:")
    print(resp.text[:500])
