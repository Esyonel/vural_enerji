import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new sqlite3.Database(path.resolve(__dirname, 'server/database.sqlite'));

console.log('Ana sayfa için örnek veriler ekleniyor...\n');

db.serialize(() => {
    // Mevcut ürünleri güncelle (fiyat ekle)
    db.run(`UPDATE products SET price = 2500 WHERE sku = 'VUR-450W'`);
    db.run(`UPDATE products SET price = 15000 WHERE sku = 'VUR-INV-5'`);
    db.run(`UPDATE products SET price = 45000 WHERE sku = 'VUR-BAT-10'`);
    db.run(`UPDATE products SET price = 1800 WHERE sku = 'VUR-330W'`);
    console.log('✓ Ürün fiyatları güncellendi');

    // Daha fazla ürün ekle
    const additionalProducts = [
        {
            id: 'p5',
            name: 'Bifacial Panel 550W',
            sku: 'VUR-550W-BF',
            category: '1',
            price: 3200,
            stock: 80,
            status: 'active',
            imageUrl: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            specs: JSON.stringify({ power: '550W', efficiency: '22.5%', type: 'Bifacial' }),
            isNew: 1,
            isPremium: 1
        },
        {
            id: 'p6',
            name: 'On-Grid İnvertör 10kW',
            sku: 'VUR-INV-10',
            category: '2',
            price: 25000,
            stock: 30,
            status: 'active',
            imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            specs: JSON.stringify({ power: '10kW', type: 'On-Grid', efficiency: '98%' }),
            isNew: 0,
            isPremium: 1
        },
        {
            id: 'p7',
            name: 'Güneş Paneli Montaj Sistemi',
            sku: 'VUR-MOUNT-01',
            category: '1',
            price: 850,
            stock: 150,
            status: 'active',
            imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            specs: JSON.stringify({ material: 'Alüminyum', capacity: '20 Panel' }),
            isNew: 0,
            isPremium: 0
        },
        {
            id: 'p8',
            name: 'Lityum Batarya 5kWh',
            sku: 'VUR-BAT-5',
            category: '3',
            price: 28000,
            stock: 25,
            status: 'active',
            imageUrl: 'https://images.unsplash.com/photo-1626908013351-800ddd734b8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            specs: JSON.stringify({ capacity: '5kWh', voltage: '48V', cycles: '6000+' }),
            isNew: 1,
            isPremium: 0
        }
    ];

    additionalProducts.forEach(p => {
        db.run(
            `INSERT INTO products (id, name, sku, category, price, stock, status, imageUrl, specs, isNew, isPremium) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [p.id, p.name, p.sku, p.category, p.price, p.stock, p.status, p.imageUrl, p.specs, p.isNew, p.isPremium],
            (err) => {
                if (err && !err.message.includes('UNIQUE')) {
                    console.error('Ürün eklenirken hata:', err.message);
                } else if (!err) {
                    console.log(`✓ Ürün eklendi: ${p.name}`);
                }
            }
        );
    });

    // Site içeriğini güncelle
    setTimeout(() => {
        db.run(`UPDATE site_content SET 
            heroTitle = 'Güneş Enerjisi ile Geleceğe Yatırım Yapın',
            heroSubtitle = 'Vural Enerji olarak, sürdürülebilir enerji çözümleriyle işletmenizi ve evinizi güçlendiriyoruz.',
            heroButtonText = 'Hemen Başlayın',
            aboutText = 'Vural Enerji, 2015 yılından bu yana güneş enerjisi sistemleri konusunda uzmanlaşmış, yenilikçi çözümler sunan bir firmadır. Müşteri memnuniyetini ön planda tutarak, kaliteli ürünler ve profesyonel hizmet anlayışıyla sektörde öncü konumdayız.',
            visionText = 'Türkiye''nin her köşesinde temiz ve sürdürülebilir enerji kullanımını yaygınlaştırmak, enerji bağımsızlığına katkıda bulunmak.',
            missionText = 'En son teknoloji güneş enerjisi sistemleriyle müşterilerimize ekonomik ve çevre dostu çözümler sunmak, uzman kadromuzla kesintisiz destek sağlamak.',
            ctaTitle = 'Güneş Enerjisine Geçiş Zamanı!',
            ctaText = 'Elektrik faturalarınızı %80''e varan oranlarda azaltın. Ücretsiz keşif ve fiyat teklifi için hemen iletişime geçin.',
            ctaButtonText = 'Ücretsiz Teklif Alın',
            ctaImageUrl = 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
            WHERE id = 1`,
            (err) => {
                if (err) console.error('Site içeriği güncellenirken hata:', err.message);
                else console.log('✓ Site içeriği güncellendi');
            }
        );

        // Daha fazla blog yazısı ekle
        const blogPosts = [
            {
                id: 'blog3',
                title: '2024 Güneş Enerjisi Teşvikleri',
                excerpt: 'Devlet destekleri ve vergi avantajları hakkında bilmeniz gerekenler.',
                content: 'Güneş enerjisi sistemleri için 2024 yılında sunulan teşvikler ve destekler...',
                author: 'Vural Enerji',
                imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                slug: '2024-gunes-enerjisi-tesvikleri',
                category: 'Ekonomi',
                tags: JSON.stringify(['teşvik', 'destek', 'ekonomi']),
                likes: 42
            },
            {
                id: 'blog4',
                title: 'Evlerde Güneş Enerjisi Kullanımı',
                excerpt: 'Evinizde güneş enerjisi sistemi kurmanın avantajları ve maliyetleri.',
                content: 'Evlerde güneş enerjisi sistemi kurulumu hakkında detaylı bilgiler...',
                author: 'Ahmet Yılmaz',
                imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                slug: 'evlerde-gunes-enerjisi',
                category: 'Konut',
                tags: JSON.stringify(['ev', 'tasarruf', 'kurulum']),
                likes: 67
            },
            {
                id: 'blog5',
                title: 'Güneş Paneli Bakım Rehberi',
                excerpt: 'Güneş panellerinizin uzun ömürlü olması için bakım ipuçları.',
                content: 'Güneş panellerinin düzenli bakımı verimliliği artırır...',
                author: 'Mehmet Demir',
                imageUrl: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                slug: 'gunes-paneli-bakim',
                category: 'Bakım',
                tags: JSON.stringify(['bakım', 'verimlilik', 'ipuçları']),
                likes: 38
            }
        ];

        blogPosts.forEach(b => {
            const date = new Date().toLocaleDateString('tr-TR');
            db.run(
                `INSERT INTO blog_posts (id, title, excerpt, content, author, date, imageUrl, slug, category, tags, likes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [b.id, b.title, b.excerpt, b.content, b.author, date, b.imageUrl, b.slug, b.category, b.tags, b.likes],
                (err) => {
                    if (err && !err.message.includes('UNIQUE')) {
                        console.error('Blog yazısı eklenirken hata:', err.message);
                    } else if (!err) {
                        console.log(`✓ Blog yazısı eklendi: ${b.title}`);
                    }
                }
            );
        });

        // Daha fazla proje ekle
        const additionalProjects = [
            {
                id: 'proj4',
                title: 'Mersin Sera GES',
                location: 'Mersin, Türkiye',
                coordinates: JSON.stringify({ lat: 36.8121, lng: 34.6415 }),
                capacity: '300 kW',
                date: '2024-01-15',
                imageUrl: 'https://images.unsplash.com/photo-1625246333195-58f2164438d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Modern sera tesisi için özel tasarlanmış güneş enerjisi sistemi.',
                stats: JSON.stringify({ panels: '600', power: '300 kW', area: '1200 m2' })
            },
            {
                id: 'proj5',
                title: 'Ankara Ofis Binası',
                location: 'Ankara, Türkiye',
                coordinates: JSON.stringify({ lat: 39.9334, lng: 32.8597 }),
                capacity: '150 kW',
                date: '2023-12-20',
                imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Çok katlı ofis binası çatı üzeri güneş enerjisi santrali.',
                stats: JSON.stringify({ panels: '300', power: '150 kW', area: '600 m2' })
            }
        ];

        additionalProjects.forEach(p => {
            db.run(
                `INSERT INTO projects (id, title, location, coordinates, capacity, date, imageUrl, description, stats) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [p.id, p.title, p.location, p.coordinates, p.capacity, p.date, p.imageUrl, p.description, p.stats],
                (err) => {
                    if (err && !err.message.includes('UNIQUE')) {
                        console.error('Proje eklenirken hata:', err.message);
                    } else if (!err) {
                        console.log(`✓ Proje eklendi: ${p.title}`);
                    }
                }
            );
        });

        setTimeout(() => {
            console.log('\n✅ Ana sayfa için tüm örnek veriler eklendi!');
            console.log('Şimdi ana sayfayı yenileyerek değişiklikleri görebilirsiniz.');
            db.close();
        }, 1000);
    }, 500);
});
