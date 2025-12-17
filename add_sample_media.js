import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new sqlite3.Database(path.resolve(__dirname, 'server/database.sqlite'));

console.log('Medya kütüphanesine örnek resimler ekleniyor...\n');

const sampleMedia = [
    {
        url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        name: 'Güneş Panelleri - Çatı Üzeri',
        type: 'image'
    },
    {
        url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        name: 'Ev Güneş Enerjisi Sistemi',
        type: 'image'
    },
    {
        url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        name: 'Güneş Enerjisi Santrali',
        type: 'image'
    },
    {
        url: 'https://images.unsplash.com/photo-1545208639-654db90ff927?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        name: 'Endüstriyel GES Projesi',
        type: 'image'
    },
    {
        url: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        name: 'Modern Solar Panel',
        type: 'image'
    },
    {
        url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        name: 'Güneş ve Doğa',
        type: 'image'
    }
];

db.serialize(() => {
    sampleMedia.forEach(media => {
        const id = 'media-' + Math.random().toString(36).substr(2, 9);
        const date = new Date().toISOString();

        db.run(
            `INSERT INTO media_items (id, url, name, type, date) VALUES (?, ?, ?, ?, ?)`,
            [id, media.url, media.name, media.type, date],
            (err) => {
                if (err && !err.message.includes('UNIQUE')) {
                    console.error('Medya eklenirken hata:', err.message);
                } else if (!err) {
                    console.log(`✓ Medya eklendi: ${media.name}`);
                }
            }
        );
    });

    setTimeout(() => {
        console.log('\n✅ Medya kütüphanesine örnek resimler eklendi!');
        console.log('Artık İçerik Yönetimi > Ana Banner bölümünde "Medya Kütüphanesinden Seç" butonunu kullanabilirsiniz.');
        db.close();
    }, 1000);
});
