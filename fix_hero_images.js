import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new sqlite3.Database(path.resolve(__dirname, 'server/database.sqlite'));

console.log('Hero banner resimlerini veritabanına ekliyorum...\n');

const heroImages = [
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
];

db.run(
    `UPDATE site_content SET heroImages = ? WHERE id = 1`,
    [JSON.stringify(heroImages)],
    function (err) {
        if (err) {
            console.error('Hata:', err.message);
        } else {
            console.log('✅ Hero banner resimleri başarıyla eklendi!');
            console.log(`   ${heroImages.length} adet resim kaydedildi.`);
            console.log('\nŞimdi ana sayfayı yenileyin (F5) - banner slider çalışacak!');
        }
        db.close();
    }
);
