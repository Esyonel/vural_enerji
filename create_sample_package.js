import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new sqlite3.Database(path.resolve(__dirname, 'server/database.sqlite'));

console.log('Örnek solar paket oluşturuluyor...\n');

// Önce ürün ID'lerini al
db.all("SELECT id, name, price FROM products LIMIT 5", [], (err, products) => {
    if (err || products.length === 0) {
        console.log('Ürünler bulunamadı!');
        db.close();
        return;
    }

    const packageId = 'pkg-sample-1000';
    const packageData = {
        id: packageId,
        name: 'Ev Tipi 1000 TL Fatura Paketi',
        description: 'Aylık 800-1200 TL elektrik faturası olan evler için ideal paket. Tam bağımsızlık sağlar.',
        minBill: 800,
        maxBill: 1200,
        systemPower: '5 kW',
        totalPrice: 85000,
        installationCost: 10000,
        imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        savings: '~12.000 TL/yıl',
        paybackPeriod: '~8 yıl',
        status: 'active',
        createdDate: new Date().toISOString().split('T')[0]
    };

    db.run(`INSERT OR REPLACE INTO solar_packages (
        id, name, description, minBill, maxBill, systemPower,
        totalPrice, installationCost, imageUrl, savings,
        paybackPeriod, status, createdDate
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [packageData.id, packageData.name, packageData.description,
        packageData.minBill, packageData.maxBill, packageData.systemPower,
        packageData.totalPrice, packageData.installationCost, packageData.imageUrl,
        packageData.savings, packageData.paybackPeriod, packageData.status,
        packageData.createdDate],
        function (err) {
            if (err) {
                console.error('Paket eklenirken hata:', err.message);
                db.close();
                return;
            }

            console.log('✓ Paket oluşturuldu:', packageData.name);

            // Pakete ürünler ekle
            db.run("DELETE FROM package_products WHERE packageId = ?", [packageId], () => {
                const packageProducts = [
                    { productId: products[0].id, quantity: 10 },
                    { productId: products[1].id, quantity: 1 },
                    { productId: products[2].id, quantity: 1 }
                ];

                packageProducts.forEach((pp, idx) => {
                    const ppId = 'pp-sample-' + idx;
                    db.run(`INSERT INTO package_products (id, packageId, productId, quantity) VALUES (?, ?, ?, ?)`,
                        [ppId, packageId, pp.productId, pp.quantity],
                        (err) => {
                            if (!err) {
                                const product = products.find(p => p.id === pp.productId);
                                console.log(`  ✓ ${pp.quantity}x ${product.name}`);
                            }
                        }
                    );
                });

                setTimeout(() => {
                    console.log('\n✅ Örnek solar paket başarıyla oluşturuldu!');
                    console.log('Admin panelde "Solar Paketler" menüsünden görüntüleyebilirsiniz.');
                    db.close();
                }, 500);
            });
        }
    );
});
