import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const sqlite3 = require('sqlite3').verbose();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initTables();
    }
});

function initTables() {
    db.serialize(() => {
        // ... (rest of the table creation code is fine, just updated imports)

        // Products
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT,
            sku TEXT,
            category TEXT,
            price REAL,
            stock INTEGER,
            status TEXT,
            imageUrl TEXT,
            specs TEXT,
            isNew INTEGER,
            isPremium INTEGER,
            images TEXT
        )`);

        // Categories
        db.run(`CREATE TABLE IF NOT EXISTS categories (
            id TEXT PRIMARY KEY,
            name TEXT,
            slug TEXT
        )`);

        // Site Content
        db.run(`CREATE TABLE IF NOT EXISTS site_content (
            id INTEGER PRIMARY KEY,
            heroTitle TEXT,
            heroSubtitle TEXT,
            heroButtonText TEXT,
            heroImages TEXT,
            aboutText TEXT,
            visionText TEXT,
            missionText TEXT,
            newsTitle TEXT,
            news TEXT,
            contactAddress TEXT,
            contactPhone TEXT,
            contactEmail TEXT,
            features TEXT,
            ctaTitle TEXT,
            ctaText TEXT,
            ctaImageUrl TEXT,
            ctaButtonText TEXT,
            partners TEXT,
            socialLinks TEXT
        )`);

        // Job Positions
        db.run(`CREATE TABLE IF NOT EXISTS job_positions (
            id TEXT PRIMARY KEY,
            title TEXT,
            location TEXT,
            type TEXT,
            description TEXT,
            requirements TEXT,
            isActive INTEGER,
            date TEXT
        )`);

        // Job Applications
        db.run(`CREATE TABLE IF NOT EXISTS job_applications (
            id TEXT PRIMARY KEY,
            fullName TEXT,
            email TEXT,
            phone TEXT,
            position TEXT,
            coverLetter TEXT,
            linkedinUrl TEXT,
            date TEXT,
            status TEXT
        )`);

        // Contact Messages
        db.run(`CREATE TABLE IF NOT EXISTS contact_messages (
            id TEXT PRIMARY KEY,
            name TEXT,
            email TEXT,
            phone TEXT,
            subject TEXT,
            message TEXT,
            date TEXT,
            status TEXT
        )`);

        // Blog Posts
        db.run(`CREATE TABLE IF NOT EXISTS blog_posts (
            id TEXT PRIMARY KEY,
            title TEXT,
            excerpt TEXT,
            content TEXT,
            author TEXT,
            date TEXT,
            imageUrl TEXT,
            slug TEXT,
            category TEXT,
            tags TEXT,
            likes INTEGER
        )`);

        // Comments
        db.run(`CREATE TABLE IF NOT EXISTS comments (
            id TEXT PRIMARY KEY,
            postId TEXT,
            userId TEXT,
            userName TEXT,
            userAvatar TEXT,
            content TEXT,
            date TEXT,
            status TEXT
        )`);

        // Media Items
        db.run(`CREATE TABLE IF NOT EXISTS media_items (
            id TEXT PRIMARY KEY,
            url TEXT,
            name TEXT,
            type TEXT,
            date TEXT
        )`);

        // Customers
        db.run(`CREATE TABLE IF NOT EXISTS customers (
            id TEXT PRIMARY KEY,
            name TEXT,
            email TEXT,
            phone TEXT,
            password TEXT,
            role TEXT,
            status TEXT,
            joinDate TEXT,
            avatar TEXT
        )`);

        // Projects
        db.run(`CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            title TEXT,
            location TEXT,
            coordinates TEXT,
            capacity TEXT,
            date TEXT,
            imageUrl TEXT,
            description TEXT,
            stats TEXT
        )`);

        // Quotes (Teklif)
        db.run(`CREATE TABLE IF NOT EXISTS quotes (
            id TEXT PRIMARY KEY,
            customerName TEXT,
            companyName TEXT,
            email TEXT,
            phone TEXT,
            productName TEXT,
            productSku TEXT,
            message TEXT,
            notes TEXT,
            date TEXT,
            status TEXT
        )`);

        // Seed initial data if empty
        db.get("SELECT count(*) as count FROM categories", (err, row) => {
            if (row.count === 0) {
                console.log("Seeding initial data...");
                seedData();
            }
        });

        // Solar Packages
        db.run(`CREATE TABLE IF NOT EXISTS solar_packages (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            minBill REAL NOT NULL,
            maxBill REAL NOT NULL,
            systemPower TEXT,
            totalPrice REAL NOT NULL,
            installationCost REAL,
            imageUrl TEXT,
            savings TEXT,
            paybackPeriod TEXT,
            status TEXT DEFAULT 'active',
            createdDate TEXT
        )`);

        // Package Products Junction Table
        db.run(`CREATE TABLE IF NOT EXISTS package_products (
            id TEXT PRIMARY KEY,
            packageId TEXT NOT NULL,
            productId TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            FOREIGN KEY (packageId) REFERENCES solar_packages(id),
            FOREIGN KEY (productId) REFERENCES products(id)
        )`);
    });
}

function seedData() {
    console.log("Starting data seeding...");

    // Clear existing data (optional, but good for reset)
    db.run("DELETE FROM categories");
    db.run("DELETE FROM products");
    db.run("DELETE FROM projects");
    db.run("DELETE FROM blog_posts");
    db.run("DELETE FROM site_content");

    // Categories
    const categories = [
        { id: '1', name: 'Güneş Panelleri', slug: 'solar' },
        { id: '2', name: 'İnvertörler', slug: 'inverter' },
        { id: '3', name: 'Batarya Sistemleri', slug: 'battery' }
    ];

    categories.forEach(c => {
        db.run(`INSERT INTO categories (id, name, slug) VALUES (?, ?, ?)`, [c.id, c.name, c.slug]);
    });

    // Products
    const products = [
        {
            id: 'p1', name: 'Monokristal Solar Panel 450W', sku: 'VUR-450W', category: '1', price: 0, stock: 100, status: 'active',
            imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            specs: JSON.stringify({ power: '450W', efficiency: '21%' }), isNew: 1, isPremium: 0
        },
        {
            id: 'p2', name: 'Hybrid İnvertör 5kW', sku: 'VUR-INV-5', category: '2', price: 0, stock: 50, status: 'active',
            imageUrl: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            specs: JSON.stringify({ power: '5kW', type: 'Hybrid' }), isNew: 1, isPremium: 1
        },
        {
            id: 'p3', name: 'Lityum Batarya 10kWh', sku: 'VUR-BAT-10', category: '3', price: 0, stock: 20, status: 'active',
            imageUrl: 'https://plus.unsplash.com/premium_photo-1679917152960-b9e43b214150?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            specs: JSON.stringify({ capacity: '10kWh', voltage: '48V' }), isNew: 0, isPremium: 1
        },
        {
            id: 'p4', name: 'Polikristal Panel 330W', sku: 'VUR-330W', category: '1', price: 0, stock: 200, status: 'active',
            imageUrl: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            specs: JSON.stringify({ power: '330W' }), isNew: 0, isPremium: 0
        }
    ];

    products.forEach(p => {
        db.run(`INSERT INTO products (id, name, sku, category, price, stock, status, imageUrl, specs, isNew, isPremium) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [p.id, p.name, p.sku, p.category, p.price, p.stock, p.status, p.imageUrl, p.specs, p.isNew, p.isPremium]);
    });

    // Projects
    const projects = [
        {
            id: 'proj1', title: 'Osmaniye OSB GES', location: 'Osmaniye, Türkiye',
            coordinates: JSON.stringify({ lat: 37.0746, lng: 36.2467 }),
            capacity: '1.2 MW', date: '2023-05-15',
            imageUrl: 'https://images.unsplash.com/photo-1545208639-654db90ff927?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            description: 'Organize Sanayi Bölgesi çatı üzeri güneş enerjisi santrali projemiz.',
            stats: JSON.stringify({ panels: '2400', power: '1.2 MW', area: '5000 m2' })
        },
        {
            id: 'proj2', title: 'Adana Tarımsal Sulama', location: 'Adana, Türkiye',
            coordinates: JSON.stringify({ lat: 36.9914, lng: 35.3308 }),
            capacity: '450 kW', date: '2023-08-20',
            imageUrl: 'https://images.unsplash.com/photo-1594818379496-da1e345b0ded?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            description: 'Tarımsal sulama sistemleri için off-grid güneş enerjisi çözümü.',
            stats: JSON.stringify({ panels: '900', power: '450 kW', area: '2000 m2' })
        },
        {
            id: 'proj3', title: 'Gaziantep Konut Projesi', location: 'Gaziantep, Türkiye',
            coordinates: JSON.stringify({ lat: 37.0662, lng: 37.3833 }),
            capacity: '25 kW', date: '2023-11-10',
            imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            description: 'Müstakil villa projesi için hibrit sistem kurulumu.',
            stats: JSON.stringify({ panels: '50', power: '25 kW', area: '150 m2' })
        }
    ];

    projects.forEach(p => {
        db.run(`INSERT INTO projects (id, title, location, coordinates, capacity, date, imageUrl, description, stats) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [p.id, p.title, p.location, p.coordinates, p.capacity, p.date, p.imageUrl, p.description, p.stats]);
    });

    // Blog Posts
    const blogPosts = [
        {
            id: 'blog1', title: 'Güneş Enerjisinde Yeni Teknolojiler', excerpt: 'Verimliliği %30 artıran yeni panel teknolojileri hakkında bilmeniz gerekenler.',
            content: 'Güneş enerjisi sektörü her geçen gün gelişiyor...', author: 'Ahmet Yılmaz', date: '2023-12-01',
            imageUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee7e8e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            slug: 'gunes-enerjisinde-yeni-teknolojiler', category: 'Teknoloji', tags: JSON.stringify(['teknoloji', 'verimlilik']), likes: 15
        },
        {
            id: 'blog2', title: 'Tarımsal Sulamada GES Avantajları', excerpt: 'Çiftçilerimiz için elektrik maliyetlerini sıfırlayan çözümler.',
            content: 'Tarımsal sulama maliyetleri artarken güneş enerjisi kurtarıcı oluyor...', author: 'Mehmet Demir', date: '2023-11-20',
            imageUrl: 'https://images.unsplash.com/photo-1625246333195-58f2164438d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            slug: 'tarimsal-sulamada-ges', category: 'Tarım', tags: JSON.stringify(['tarım', 'ekonomi']), likes: 23
        }
    ];

    blogPosts.forEach(b => {
        db.run(`INSERT INTO blog_posts (id, title, excerpt, content, author, date, imageUrl, slug, category, tags, likes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [b.id, b.title, b.excerpt, b.content, b.author, b.date, b.imageUrl, b.slug, b.category, b.tags, b.likes]);
    });

    // Create default site content row
    db.run(`INSERT INTO site_content (id, heroTitle) VALUES (1, 'Vural Enerji')`);

    // Create Admin User
    const adminId = 'admin-id';
    db.run(`DELETE FROM customers WHERE email = 'admin@vuralenerji.com'`);
    db.run(`INSERT INTO customers (id, name, email, password, role, status, joinDate, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [adminId, 'Vural Admin', 'admin@vuralenerji.com', 'admin', 'admin', 'active', '2023-01-01', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'],
        (err) => {
            if (!err) console.log("Admin user created");
        }
    );
    console.log("Data seeding completed.");
}

export default db;
