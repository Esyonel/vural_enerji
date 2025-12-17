import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import db from './db.js';
import { sanitizeInput, validateEmail, validatePhone, validateNumber, generateProductSEO } from './utils/security.js';

const app = express();
const PORT = 3001;

// Security Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" } // Allow images to be loaded
}));

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 1000, // Relaxed limit for development
    message: 'Çok fazla istek gönderildi, lütfen daha sonra tekrar deneyin.'
});
app.use('/api/', limiter);

app.use(cors({
    origin: '*', // Allow all origins for development to prevent CORS issues
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json({ limit: '10mb' })); // Limit payload size

// Input sanitization middleware
app.use((req, res, next) => {
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = sanitizeInput(req.body[key]);
            }
        });
    }
    next();
});

// Routes will go here
app.get('/', (req, res) => {
    res.send('Vural Enerji API Running');
});

// Products Routes
app.get('/api/products', (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        // Parse specs and stockStatus logic if needed
        const products = rows.map(p => ({
            ...p,
            specs: JSON.parse(p.specs || '[]'),
            images: JSON.parse(p.images || '[]'),
            // Re-calculate derived fields if necessary or store them
            stockStatus: p.stock <= 0 ? 'outstock' : p.stock < 10 ? 'lowstock' : 'instock'
        }));
        res.json(products);
    });
});

app.post('/api/products', (req, res) => {
    const { name, sku, category, price, stock, status, imageUrl, specs, isNew, isPremium, description, brand } = req.body;

    // Validation
    if (!name || !sku || !category) {
        return res.status(400).json({ error: 'Name, SKU, and category are required' });
    }

    if (!validateNumber(price, 0) || !validateNumber(stock, 0)) {
        return res.status(400).json({ error: 'Invalid price or stock value' });
    }

    const id = Math.random().toString(36).substr(2, 9);

    // Generate SEO metadata
    const seoData = generateProductSEO({ name, description, category, brand, images: imageUrl ? [imageUrl] : [] });

    db.run(`INSERT INTO products (id, name, sku, category, price, stock, status, imageUrl, specs, isNew, isPremium, seo_title, seo_description, seo_keywords, slug) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, name, sku, category, price, stock, status, imageUrl, JSON.stringify(specs), isNew ? 1 : 0, isPremium ? 1 : 0, seoData.title, seoData.description, seoData.keywords, seoData.slug],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id, ...req.body, seo: seoData });
        }
    );
});

// Categories Routes
app.get('/api/categories', (req, res) => {
    db.all("SELECT * FROM categories", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});


// Default Content Route
app.get('/api/content', (req, res) => {
    db.get("SELECT * FROM site_content WHERE id = 1", [], (err, row) => {
        if (err || !row) return res.json({});
        // Parse JSON fields
        const content = {
            ...row,
            heroImages: JSON.parse(row.heroImages || '[]'),
            news: JSON.parse(row.news || '[]'),
            features: JSON.parse(row.features || '[]'),
            partners: JSON.parse(row.partners || '[]'),
            socialLinks: JSON.parse(row.socialLinks || '[]')
        };
        res.json(content);
    });
});

app.put('/api/content', (req, res) => {
    const {
        heroTitle, heroSubtitle, heroButtonText, heroImages,
        aboutText, visionText, missionText,
        newsTitle, news, features,
        ctaTitle, ctaText, ctaImageUrl, ctaButtonText,
        partners, socialLinks,
        contactAddress, contactPhone, contactEmail
    } = req.body;

    db.run(`UPDATE site_content SET 
        heroTitle = ?, heroSubtitle = ?, heroButtonText = ?, heroImages = ?,
        aboutText = ?, visionText = ?, missionText = ?,
        newsTitle = ?, news = ?, features = ?,
        ctaTitle = ?, ctaText = ?, ctaImageUrl = ?, ctaButtonText = ?,
        partners = ?, socialLinks = ?,
        contactAddress = ?, contactPhone = ?, contactEmail = ?
        WHERE id = 1`,
        [
            heroTitle, heroSubtitle, heroButtonText, JSON.stringify(heroImages || []),
            aboutText, visionText, missionText,
            newsTitle, JSON.stringify(news || []), JSON.stringify(features || []),
            ctaTitle, ctaText, ctaImageUrl, ctaButtonText,
            JSON.stringify(partners || []), JSON.stringify(socialLinks || []),
            contactAddress, contactPhone, contactEmail
        ],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        }
    );
});

// --- JOB POSTINGS ROUTES ---
app.get('/api/jobs', (req, res) => {
    db.all("SELECT * FROM job_positions", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const jobs = rows.map(j => ({
            ...j,
            requirements: JSON.parse(j.requirements || '[]'),
            isActive: j.isActive === 1
        }));
        res.json(jobs);
    });
});

app.post('/api/jobs', (req, res) => {
    const { title, location, type, description, requirements } = req.body;
    const id = 'pos-' + Math.random().toString(36).substr(2, 9);
    const date = new Date().toISOString().split('T')[0];

    db.run(`INSERT INTO job_positions (id, title, location, type, description, requirements, isActive, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, title, location, type, description, JSON.stringify(requirements), 1, date],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id, ...req.body, isActive: true, date });
        }
    );
});

app.put('/api/jobs/:id', (req, res) => {
    const { title, location, type, description, requirements, isActive } = req.body;
    db.run(`UPDATE job_positions SET title = ?, location = ?, type = ?, description = ?, requirements = ?, isActive = ? WHERE id = ?`,
        [title, location, type, description, JSON.stringify(requirements), isActive ? 1 : 0, req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        }
    );
});

app.delete('/api/jobs/:id', (req, res) => {
    db.run("DELETE FROM job_positions WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// --- JOB APPLICATIONS ROUTES ---
app.get('/api/applications', (req, res) => {
    db.all("SELECT * FROM job_applications", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/applications', (req, res) => {
    const { fullName, email, phone, position, coverLetter, linkedinUrl } = req.body;
    const id = 'job-' + Math.random().toString(36).substr(2, 6);
    const date = new Date().toISOString().split('T')[0];

    db.run(`INSERT INTO job_applications (id, fullName, email, phone, position, coverLetter, linkedinUrl, date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, fullName, email, phone, position, coverLetter, linkedinUrl, date, 'new'],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, id });
        }
    );
});

app.put('/api/applications/:id/status', (req, res) => {
    const { status } = req.body;
    db.run("UPDATE job_applications SET status = ? WHERE id = ?", [status, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// --- CONTACT MESSAGES ROUTES ---
app.get('/api/messages', (req, res) => {
    db.all("SELECT * FROM contact_messages ORDER BY date DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/messages', (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    const id = 'msg-' + Math.random().toString(36).substr(2, 9);
    const date = new Date().toISOString();

    db.run(`INSERT INTO contact_messages (id, name, email, phone, subject, message, date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, name, email, phone, subject, message, date, 'new'],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, id });
        }
    );
});

app.put('/api/messages/:id/status', (req, res) => {
    const { status } = req.body;
    db.run("UPDATE contact_messages SET status = ? WHERE id = ?", [status, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.delete('/api/messages/:id', (req, res) => {
    db.run("DELETE FROM contact_messages WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// --- BLOG POSTS ROUTES ---
app.get('/api/blog', (req, res) => {
    const sql = `
        SELECT b.*, 
        (SELECT json_group_array(json_object(
            'id', c.id, 
            'postId', c.postId, 
            'userId', c.userId, 
            'userName', c.userName, 
            'userAvatar', c.userAvatar, 
            'content', c.content, 
            'date', c.date, 
            'status', c.status
        )) FROM comments c WHERE c.postId = b.id) as comments 
        FROM blog_posts b
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const posts = rows.map(p => ({
            ...p,
            tags: JSON.parse(p.tags || '[]'),
            comments: JSON.parse(p.comments || '[]')
        }));
        res.json(posts);
    });
});

app.post('/api/blog', (req, res) => {
    const { title, excerpt, content, author, imageUrl, category, tags } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const id = Math.random().toString(36).substr(2, 9);
    const date = new Date().toLocaleDateString('tr-TR');

    db.run(`INSERT INTO blog_posts (id, title, excerpt, content, author, date, imageUrl, slug, category, tags, likes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, title, excerpt, content, author, date, imageUrl, slug, category, JSON.stringify(tags), 0],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, id, slug, date });
        }
    );
});

app.put('/api/blog/:id', (req, res) => {
    const { title, excerpt, content, imageUrl, category, tags } = req.body;
    db.run(`UPDATE blog_posts SET title = ?, excerpt = ?, content = ?, imageUrl = ?, category = ?, tags = ? WHERE id = ?`,
        [title, excerpt, content, imageUrl, category, JSON.stringify(tags), req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        }
    );
});

app.delete('/api/blog/:id', (req, res) => {
    db.run("DELETE FROM blog_posts WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        // Also delete comments
        db.run("DELETE FROM comments WHERE postId = ?", [req.params.id]);
        res.json({ success: true });
    });
});

app.post('/api/blog/:id/comments', (req, res) => {
    const { userId, userName, userAvatar, content } = req.body;
    const commentId = 'c' + Math.random().toString(36).substr(2, 9);
    const date = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

    db.run(`INSERT INTO comments (id, postId, userId, userName, userAvatar, content, date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [commentId, req.params.id, userId, userName, userAvatar, content, date, 'approved'],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, id: commentId, date });
        }
    );
});

app.delete('/api/blog/:postId/comments/:commentId', (req, res) => {
    db.run("DELETE FROM comments WHERE id = ?", [req.params.commentId], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.post('/api/blog/:id/like', (req, res) => {
    db.run("UPDATE blog_posts SET likes = likes + 1 WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// --- MEDIA ROUTES ---
app.get('/api/media', (req, res) => {
    db.all("SELECT * FROM media_items ORDER BY date DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/media', (req, res) => {
    const { url, name, type } = req.body;
    const id = 'media-' + Math.random().toString(36).substr(2, 9);
    const date = new Date().toISOString();

    db.run(`INSERT INTO media_items (id, url, name, type, date) VALUES (?, ?, ?, ?, ?)`,
        [id, url, name, type, date],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, id, date });
        }
    );
});

app.delete('/api/media/:id', (req, res) => {
    db.run("DELETE FROM media_items WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// --- AUTH ROUTES ---
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT * FROM customers WHERE email = ? AND password = ?", [email, password], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.json({ success: false, message: 'Geçersiz e-posta veya şifre.' });
        res.json({ success: true, user: row });
    });
});

app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    const joinDate = new Date().toLocaleDateString('tr-TR');

    // Check if user exists
    db.get("SELECT * FROM customers WHERE email = ?", [email], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) return res.json({ success: false, message: 'Bu e-posta adresi zaten kayıtlı.' });

        db.run(`INSERT INTO customers (id, name, email, password, role, status, joinDate, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, name, email, password, 'user', 'active', joinDate, `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`],
            function (err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ success: true });
            }
        );
    });
});

app.get('/api/customers', (req, res) => {
    db.all("SELECT * FROM customers", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/customers', (req, res) => {
    const { name, email, password, role, phone } = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    const joinDate = new Date().toLocaleDateString('tr-TR');
    const userRole = role || 'user';
    const status = 'active';

    // Check if user exists
    db.get("SELECT * FROM customers WHERE email = ?", [email], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) return res.json({ success: false, message: 'Bu e-posta adresi zaten kayıtlı.' });

        db.run(`INSERT INTO customers (id, name, email, password, role, status, joinDate, avatar, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, name, email, password, userRole, status, joinDate, `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`, phone || ''],
            function (err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ success: true, id, role: userRole });
            }
        );
    });
});


// --- PROJECTS ROUTES ---
app.get('/api/projects', (req, res) => {
    db.all("SELECT * FROM projects", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const projects = rows.map(p => ({
            ...p,
            coordinates: JSON.parse(p.coordinates || '{}'),
            stats: JSON.parse(p.stats || '{}')
        }));
        res.json(projects);
    });
});

app.post('/api/projects', (req, res) => {
    const { title, location, coordinates, capacity, date, imageUrl, description, stats } = req.body;
    const id = Math.random().toString(36).substr(2, 9);

    db.run(`INSERT INTO projects (id, title, location, coordinates, capacity, date, imageUrl, description, stats) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, title, location, JSON.stringify(coordinates), capacity, date, imageUrl, description, JSON.stringify(stats)],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, id });
        }
    );
});

app.put('/api/projects/:id', (req, res) => {
    const { title, location, coordinates, capacity, date, imageUrl, description, stats } = req.body;
    db.run(`UPDATE projects SET title = ?, location = ?, coordinates = ?, capacity = ?, date = ?, imageUrl = ?, description = ?, stats = ? WHERE id = ?`,
        [title, location, JSON.stringify(coordinates), capacity, date, imageUrl, description, JSON.stringify(stats), req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        }
    );
});

app.delete('/api/projects/:id', (req, res) => {
    db.run("DELETE FROM projects WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// --- QUOTES (TEKLIF) ROUTES ---
app.get('/api/quotes', (req, res) => {
    db.all("SELECT * FROM quotes ORDER BY date DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/quotes', (req, res) => {
    const { customerName, companyName, email, phone, productName, productSku, message, notes } = req.body;
    const id = 'qt-' + Math.random().toString(36).substr(2, 6);
    const date = new Date().toISOString().split('T')[0];

    db.run(`INSERT INTO quotes (id, customerName, companyName, email, phone, productName, productSku, message, notes, date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, customerName, companyName, email, phone, productName, productSku, message, notes, date, 'new'],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, id });
        }
    );
});

app.put('/api/quotes/:id/status', (req, res) => {
    const { status } = req.body;
    db.run("UPDATE quotes SET status = ? WHERE id = ?", [status, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.delete('/api/quotes/:id', (req, res) => {
    db.run("DELETE FROM quotes WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// --- NEWSLETTER ROUTE ---
app.post('/api/newsletter', (req, res) => {
    const { email } = req.body;
    // simulating database insert
    console.log(`New newsletter subscription: ${email}`);
    res.json({ success: true, message: 'Bültenimize başarıyla abone oldunuz.' });
});

// --- SOLAR PACKAGES ROUTES ---
app.get('/api/solar-packages', (req, res) => {
    const { status } = req.query;
    let query = "SELECT * FROM solar_packages";
    const params = [];

    if (status) {
        query += " WHERE status = ?";
        params.push(status);
    }

    query += " ORDER BY minBill ASC";

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/solar-packages/:id', (req, res) => {
    const { id } = req.params;

    db.get("SELECT * FROM solar_packages WHERE id = ?", [id], (err, pkg) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!pkg) return res.status(404).json({ error: 'Package not found' });

        db.all(`
            SELECT pp.*, p.name as productName, p.price as unitPrice, p.imageUrl
            FROM package_products pp
            JOIN products p ON pp.productId = p.id
            WHERE pp.packageId = ?
        `, [id], (err, products) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ ...pkg, products });
        });
    });
});

app.post('/api/solar-packages', (req, res) => {
    const {
        name, description, minBill, maxBill, systemPower,
        totalPrice, installationCost, imageUrl, savings,
        paybackPeriod, status, products
    } = req.body;

    const id = 'pkg-' + Math.random().toString(36).substr(2, 9);
    const createdDate = new Date().toISOString().split('T')[0];

    db.run(`INSERT INTO solar_packages (
        id, name, description, minBill, maxBill, systemPower,
        totalPrice, installationCost, imageUrl, savings,
        paybackPeriod, status, createdDate
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, name, description, minBill, maxBill, systemPower,
            totalPrice, installationCost || 0, imageUrl, savings,
            paybackPeriod, status || 'active', createdDate],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });

            if (products && products.length > 0) {
                const stmt = db.prepare(`INSERT INTO package_products (id, packageId, productId, quantity) VALUES (?, ?, ?, ?)`);
                products.forEach(p => {
                    const ppId = 'pp-' + Math.random().toString(36).substr(2, 9);
                    stmt.run([ppId, id, p.productId, p.quantity]);
                });
                stmt.finalize();
            }

            res.json({ success: true, id });
        }
    );
});

app.put('/api/solar-packages/:id', (req, res) => {
    const { id } = req.params;
    const {
        name, description, minBill, maxBill, systemPower,
        totalPrice, installationCost, imageUrl, savings,
        paybackPeriod, status, products
    } = req.body;

    db.run(`UPDATE solar_packages SET 
        name = ?, description = ?, minBill = ?, maxBill = ?, systemPower = ?,
        totalPrice = ?, installationCost = ?, imageUrl = ?, savings = ?,
        paybackPeriod = ?, status = ?
        WHERE id = ?`,
        [name, description, minBill, maxBill, systemPower,
            totalPrice, installationCost, imageUrl, savings,
            paybackPeriod, status, id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });

            if (products) {
                db.run("DELETE FROM package_products WHERE packageId = ?", [id], (err) => {
                    if (err) return res.status(500).json({ error: err.message });

                    if (products.length > 0) {
                        const stmt = db.prepare(`INSERT INTO package_products (id, packageId, productId, quantity) VALUES (?, ?, ?, ?)`);
                        products.forEach(p => {
                            const ppId = 'pp-' + Math.random().toString(36).substr(2, 9);
                            stmt.run([ppId, id, p.productId, p.quantity]);
                        });
                        stmt.finalize();
                    }
                });
            }

            res.json({ success: true });
        }
    );
});

app.delete('/api/solar-packages/:id', (req, res) => {
    const { id } = req.params;

    db.run("DELETE FROM package_products WHERE packageId = ?", [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        db.run("DELETE FROM solar_packages WHERE id = ?", [id], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
    });
});

app.get('/api/solar-packages/recommend/:billAmount', (req, res) => {
    const billAmount = parseFloat(req.params.billAmount);

    db.get(`SELECT * FROM solar_packages 
            WHERE minBill <= ? AND maxBill >= ? AND status = 'active'
            ORDER BY ABS((minBill + maxBill) / 2 - ?) ASC
            LIMIT 1`,
        [billAmount, billAmount, billAmount],
        (err, pkg) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!pkg) return res.json({ success: false, message: 'No suitable package found' });

            db.all(`
                SELECT pp.*, p.name as productName, p.price as unitPrice, p.imageUrl
                FROM package_products pp
                JOIN products p ON pp.productId = p.id
                WHERE pp.packageId = ?
            `, [pkg.id], (err, products) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ success: true, package: { ...pkg, products } });
            });
        }
    );
});

if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

export default app;
