async function checkHeroImages() {
    try {
        const res = await fetch('http://localhost:3001/api/content');
        const data = await res.json();

        console.log('Site Content from API:');
        console.log('Hero Images:', data.heroImages);
        console.log('Hero Title:', data.heroTitle);
        console.log('Hero Subtitle:', data.heroSubtitle);

        if (!data.heroImages || data.heroImages.length === 0) {
            console.log('\n❌ Sorun: heroImages boş veya yok!');
            console.log('Çözüm: İçerik Yönetimi sayfasında değişiklikleri kaydetmeyi deneyin.');
        } else {
            console.log(`\n✅ ${data.heroImages.length} adet banner resmi bulundu.`);
        }
    } catch (e) {
        console.error('API Hatası:', e.message);
    }
}

checkHeroImages();
