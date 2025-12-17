async function testLogin() {
    try {
        const res = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@vuralenerji.com',
                password: 'admin'
            })
        });

        const data = await res.json();
        console.log("Login Response:", JSON.stringify(data, null, 2));

        if (data.success && data.user) {
            console.log("\n✅ GİRİŞ BAŞARILI!");
            console.log("Kullanıcı Rolü:", data.user.role);
        } else {
            console.log("\n❌ GİRİŞ BAŞARISIZ!");
            console.log("Mesaj:", data.message);
        }
    } catch (e) {
        console.error("❌ Bağlantı Hatası:", e.message);
    }
}

testLogin();
