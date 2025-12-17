
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001/api';

async function testSecurity() {
    console.log('--- Starting Security Tests ---');

    // 1. Test Rate Limiting
    console.log('\n[TEST 1] Testing Rate Limiting...');
    let blocked = false;
    for (let i = 0; i < 110; i++) {
        try {
            const res = await fetch(`${BASE_URL}/products`);
            if (res.status === 429) {
                console.log(`✅ Request ${i + 1} Blocked (429 Too Many Requests)`);
                blocked = true;
                break;
            }
        } catch (e) {
            console.error(`Request ${i} failed:`, e.message);
        }
    }
    if (!blocked) console.log('❌ Rate Limiting FAILED: Did not block after 100 requests.');

    // 2. Test SQL Injection (Basic)
    console.log('\n[TEST 2] Testing SQL Injection on Auth...');
    try {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: "' OR '1'='1", password: "' OR '1'='1" })
        });
        const data = await res.json();

        if (data.success) {
            console.log('❌ SQL Injection FAILED: Bypass successful!');
        } else {
            console.log('✅ SQL Injection BLOCKED: Auth failed as expected.');
        }
    } catch (e) {
        console.log('✅ SQL Injection Handled (Error):', e.message);
    }

    console.log('\n--- Security Tests Completed ---');
}

testSecurity();
