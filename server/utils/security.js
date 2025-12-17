// Security and Validation Utilities
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;

    // Remove potential XSS attacks
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .trim();
};

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateNumber = (num, min = 0, max = Infinity) => {
    const parsed = parseFloat(num);
    return !isNaN(parsed) && parsed >= min && parsed <= max;
};

// Generate SEO-friendly slug
export const generateSlug = (text) => {
    const turkishMap = {
        'ç': 'c', 'Ç': 'C',
        'ğ': 'g', 'Ğ': 'G',
        'ı': 'i', 'İ': 'I',
        'ö': 'o', 'Ö': 'O',
        'ş': 's', 'Ş': 'S',
        'ü': 'u', 'Ü': 'U'
    };

    return text
        .split('')
        .map(char => turkishMap[char] || char)
        .join('')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

// Generate SEO metadata for products
export const generateProductSEO = (product) => {
    const title = `${product.name} - Vural Enerji`;
    const description = product.description
        ? `${product.description.substring(0, 155)}...`
        : `${product.name} ürününü Vural Enerji'den satın alın. Kaliteli güneş enerjisi çözümleri.`;

    const keywords = [
        product.name,
        product.category,
        'güneş enerjisi',
        'solar panel',
        'yenilenebilir enerji',
        product.brand
    ].filter(Boolean).join(', ');

    return {
        title,
        description,
        keywords,
        slug: generateSlug(product.name),
        ogTitle: title,
        ogDescription: description,
        ogImage: product.images && product.images[0] ? product.images[0] : '/default-product.jpg'
    };
};

// SQL Injection Prevention - Parameterized query helper
export const safeQuery = (db, query, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// Rate limiting configuration
export const createRateLimiter = (windowMs, max, message) => {
    return {
        windowMs,
        max,
        message,
        standardHeaders: true,
        legacyHeaders: false,
    };
};
