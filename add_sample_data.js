import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new sqlite3.Database(path.resolve(__dirname, 'server/database.sqlite'));

// Örnek Müşteriler
const sampleCustomers = [
    { name: 'Ahmet Yılmaz', email: 'ahmet@example.com', phone: '5551234567', password: 'password123', role: 'user' },
    { name: 'Ayşe Demir', email: 'ayse@example.com', phone: '5559876543', password: 'password123', role: 'user' },
    { name: 'Mehmet Kaya', email: 'mehmet@example.com', phone: '5555551234', password: 'password123', role: 'user' }
];

// Örnek Teklif Talepleri
const sampleQuotes = [
    {
        customerName: 'Ali Veli',
        companyName: 'Veli Tarım A.Ş.',
        email: 'ali@velitarim.com',
        phone: '5551112233',
        productName: 'Monokristal Solar Panel 450W',
        productSku: 'VUR-450W',
        message: '50 adet panel için fiyat teklifi istiyorum. Kurulum dahil mi?',
        status: 'new'
    },
    {
        customerName: 'Fatma Öztürk',
        companyName: 'Öztürk İnşaat',
        email: 'fatma@ozturk.com',
        phone: '5552223344',
        productName: 'Hybrid İnvertör 5kW',
        productSku: 'VUR-INV-5',
        message: 'Fabrikamız için 10 kW sistem kurulumu hakkında bilgi almak istiyorum.',
        status: 'pending'
    },
    {
        customerName: 'Hasan Çelik',
        companyName: null,
        email: 'hasan@gmail.com',
        phone: '5553334455',
        productName: 'Lityum Batarya 10kWh',
        productSku: 'VUR-BAT-10',
        message: 'Evim için batarya sistemi kurulumu',
        status: 'completed'
    }
];

// Örnek İletişim Mesajları
const sampleMessages = [
    {
        name: 'Zeynep Arslan',
        email: 'zeynep@example.com',
        phone: '5554445566',
        subject: 'Ürün Bilgisi',
        message: 'Güneş panellerinizin garantisi kaç yıl?',
        status: 'new'
    },
    {
        name: 'Burak Yıldız',
        email: 'burak@example.com',
        phone: '5556667788',
        subject: 'Kurulum Süresi',
        message: 'Ortalama kurulum süresi ne kadar sürer?',
        status: 'read'
    }
];

// Örnek İş Başvuruları
const sampleApplications = [
    {
        fullName: 'Deniz Aydın',
        email: 'deniz@example.com',
        phone: '5557778899',
        position: 'Elektrik Teknisyeni',
        coverLetter: 'Elektrik mühendisliği mezunuyum, 5 yıl tecrübem var.',
        linkedinUrl: 'https://linkedin.com/in/denizaydin',
        status: 'new'
    },
    {
        fullName: 'Can Özkan',
        email: 'can@example.com',
        phone: '5558889900',
        position: 'Satış Danışmanı',
        coverLetter: 'Enerji sektöründe 3 yıl satış deneyimim var.',
        linkedinUrl: 'https://linkedin.com/in/canozkan',
        status: 'reviewed'
    }
];

console.log('Örnek veriler ekleniyor...');

db.serialize(() => {
    // Müşteriler ekle
    sampleCustomers.forEach(customer => {
        const id = Math.random().toString(36).substr(2, 9);
        const joinDate = new Date().toLocaleDateString('tr-TR');
        db.run(
            `INSERT INTO customers (id, name, email, phone, password, role, status, joinDate, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, customer.name, customer.email, customer.phone, customer.password, customer.role, 'active', joinDate, `https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.name}`],
            (err) => {
                if (err) console.error('Müşteri eklenirken hata:', err.message);
                else console.log(`✓ Müşteri eklendi: ${customer.name}`);
            }
        );
    });

    // Teklif talepleri ekle
    sampleQuotes.forEach(quote => {
        const id = 'qt-' + Math.random().toString(36).substr(2, 6);
        const date = new Date().toISOString().split('T')[0];
        db.run(
            `INSERT INTO quotes (id, customerName, companyName, email, phone, productName, productSku, message, notes, date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, quote.customerName, quote.companyName, quote.email, quote.phone, quote.productName, quote.productSku, quote.message, '', date, quote.status],
            (err) => {
                if (err) console.error('Teklif eklenirken hata:', err.message);
                else console.log(`✓ Teklif eklendi: ${quote.customerName}`);
            }
        );
    });

    // İletişim mesajları ekle
    sampleMessages.forEach(msg => {
        const id = 'msg-' + Math.random().toString(36).substr(2, 9);
        const date = new Date().toISOString();
        db.run(
            `INSERT INTO contact_messages (id, name, email, phone, subject, message, date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, msg.name, msg.email, msg.phone, msg.subject, msg.message, date, msg.status],
            (err) => {
                if (err) console.error('Mesaj eklenirken hata:', err.message);
                else console.log(`✓ Mesaj eklendi: ${msg.name}`);
            }
        );
    });

    // İş başvuruları ekle
    sampleApplications.forEach(app => {
        const id = 'job-' + Math.random().toString(36).substr(2, 6);
        const date = new Date().toISOString().split('T')[0];
        db.run(
            `INSERT INTO job_applications (id, fullName, email, phone, position, coverLetter, linkedinUrl, date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, app.fullName, app.email, app.phone, app.position, app.coverLetter, app.linkedinUrl, date, app.status],
            (err) => {
                if (err) console.error('Başvuru eklenirken hata:', err.message);
                else console.log(`✓ Başvuru eklendi: ${app.fullName}`);
            }
        );
    });

    setTimeout(() => {
        console.log('\n✅ Tüm örnek veriler başarıyla eklendi!');
        console.log('Bu veriler siz silene kadar veritabanında kalacak.');
        db.close();
    }, 1000);
});
