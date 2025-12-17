async function testAllEndpoints() {
    const endpoints = [
        'http://localhost:3001/api/products',
        'http://localhost:3001/api/categories',
        'http://localhost:3001/api/content',
        'http://localhost:3001/api/customers',
        'http://localhost:3001/api/projects',
        'http://localhost:3001/api/quotes',
        'http://localhost:3001/api/blog',
        'http://localhost:3001/api/jobs',
        'http://localhost:3001/api/applications',
        'http://localhost:3001/api/messages',
        'http://localhost:3001/api/media'
    ];

    console.log('Testing all API endpoints...\n');

    for (const endpoint of endpoints) {
        try {
            const res = await fetch(endpoint);
            const data = await res.json();
            const name = endpoint.split('/').pop();

            if (res.ok) {
                const count = Array.isArray(data) ? data.length : 'N/A';
                console.log(`✓ ${name}: ${res.status} (${count} items)`);
            } else {
                console.log(`✗ ${name}: ${res.status} - ${data.error || 'Unknown error'}`);
            }
        } catch (e) {
            const name = endpoint.split('/').pop();
            console.log(`✗ ${name}: Connection failed - ${e.message}`);
        }
    }
}

testAllEndpoints();
