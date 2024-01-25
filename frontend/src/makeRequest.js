export async function makeRequest(endpoint, method, data) {
    const url = `http://localhost:8000${endpoint}`;
    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }
    const result = await response.json();
    console.log(response.status, result);
    return result;
}