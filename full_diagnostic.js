async function fullDiagnostic() {
    console.log('=== FULL DIAGNOSTIC TEST ===\n');

    // Test 1: Backend connectivity
    console.log('1. Testing Backend Connection...');
    try {
        const res = await fetch('http://localhost:3001/api/content');
        console.log(`   ✓ Backend responding: ${res.status}`);
        const data = await res.json();
        console.log(`   Hero Images count: ${data.heroImages?.length || 0}`);
    } catch (e) {
        console.log(`   ✗ Backend error: ${e.message}`);
    }

    // Test 2: Customers endpoint
    console.log('\n2. Testing Customers Endpoint...');
    try {
        const res = await fetch('http://localhost:3001/api/customers');
        const data = await res.json();
        console.log(`   ✓ Customers loaded: ${data.length} users`);
    } catch (e) {
        console.log(`   ✗ Customers error: ${e.message}`);
    }

    // Test 3: Products endpoint
    console.log('\n3. Testing Products Endpoint...');
    try {
        const res = await fetch('http://localhost:3001/api/products');
        const data = await res.json();
        console.log(`   ✓ Products loaded: ${data.length} items`);
        if (data.length > 0) {
            console.log(`   First product specs type: ${typeof data[0].specs}`);
            console.log(`   First product specs: ${JSON.stringify(data[0].specs)}`);
        }
    } catch (e) {
        console.log(`   ✗ Products error: ${e.message}`);
    }

    console.log('\n=== DIAGNOSTIC COMPLETE ===');
}

fullDiagnostic();
