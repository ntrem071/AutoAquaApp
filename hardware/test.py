import http.client

print('start')
conn = http.client.HTTPConnection("174.94.60.115", 8000, timeout=5)
conn.request("GET", "/")
response = conn.getresponse()
print(response.read().decode())