import httpx
import string
import random

client = httpx.Client(base_url="http://localhost:8000")

r = client.post("/login", json={"username": "user1", "password": "pw1"})
print(r.status_code, r.text, client.cookies)

randHash = ''.join(random.choice(string.hexdigits) for _ in range(32))
r = client.post("/insert", json={"hash": randHash, "categoryName": "Demo"})
print(r.status_code, r.text)

r = client.post("/update", json={"hash": "hash1", "categoryName": "Song"}) # Ubuntu
print(r.status_code, r.text)

r = client.post("/select", json={"name": "m", "description": "and", "and": True})
print(r.status_code, r.text)

r = client.post("/select", json={"name": "EDM", "description": "emotional", "and": False})
print(r.status_code, r.text)

r = client.get("/projection")
print(r.status_code, r.text)

r = client.post("/projection", json={"table": "tags", "columns": ["name", "description"]})
print(r.status_code, r.text)

r = client.post("/join", json={"tagDescription": "and"})
print(r.status_code, r.text)

r = client.get("/aggregationGroup")
print(r.status_code, r.text)

r = client.get("/aggregationHaving")
print(r.status_code, r.text)

r = client.get("/aggregationNested")
print(r.status_code, r.text)

r = client.get("/division")
print(r.status_code, r.text)

# r = client.post("/delete")
# print(r.status_code, r.text)

client.close()
