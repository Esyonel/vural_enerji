
async function testAddCustomer() {
    try {
        const res = await fetch('http://localhost:3001/api/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Admin',
                email: 'testadmin@vuralenerji.com',
                password: 'password123',
                role: 'admin',
                phone: '5551234567'
            })
        });

        if (res.status === 404) {
            console.log("Endpoint not found (404). Server needs restart.");
        } else if (res.ok) {
            const data = await res.json();
            console.log("Success:", data);
        } else {
            console.log("Error:", res.status, await res.text());
        }
    } catch (e) {
        console.error("Connection failed:", e.message);
    }
}

testAddCustomer();
