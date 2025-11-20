-- PostgreSQL'de CREATE DATABASE, bağlantıdan önce ayrı çalıştırılmalıdır.

-- 1. Özel ENUM Tiplerini Oluşturma
CREATE TYPE user_role AS ENUM ('customer', 'admin');
CREATE TYPE prescription_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE order_status AS ENUM ('pending_approval', 'verified', 'shipped', 'cancelled', 'completed');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed');


-- 2. USERS Tablosu
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY, 
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    "role" user_role NOT NULL DEFAULT 'customer', 
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP 
);


-- 3. DRUGS Tablosu
CREATE TABLE IF NOT EXISTS drugs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    requires_prescription BOOLEAN NOT NULL DEFAULT false,
    stock INTEGER NOT NULL DEFAULT 0, 
    usage_info TEXT,
    side_effects TEXT,
    category VARCHAR(100),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- 4. PRESCRIPTIONS Tablosu
CREATE TABLE IF NOT EXISTS prescriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    status prescription_status NOT NULL DEFAULT 'pending', 
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- 5. ORDERS Tablosu
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    prescription_id INTEGER NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status order_status NOT NULL DEFAULT 'pending_approval', 
    shipping_address TEXT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status payment_status NOT NULL DEFAULT 'pending', 
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE SET NULL
);

-- 6. ORDER_ITEMS Tablosu
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    drug_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price_per_unit DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (drug_id) REFERENCES drugs(id) ON DELETE CASCADE
);

-- 7. Veri Ekleme (INSERT Statements)
INSERT INTO drugs 
    (name, description, price, image_url, requires_prescription, stock, usage_info, side_effects, category, created_at, updated_at)
VALUES
(
    'Aspirin 100mg', 
    'Pain reliever and fever reducer.', 
    15.50, 
    '/images/aspirin.jpg', 
    false, 
    1000, 
    'Take 1-2 tablets with water every 4-6 hours.', 
    'Stomach upset, heartburn.', 
    'Pain Relief', 
    NOW(), 
    NOW()
),
(        //sender şifrem
    'Amoxicillin 500mg', 
    'Antibiotic for bacterial infections.', 
    45.75, 
    '/images/antibiotic.jpg', 
    true, 
    500, 
    'Take one capsule every 8 hours as directed by your doctor.', 
    'Nausea, rash, diarrhea.', 
    'Antibiotics', 
    NOW(), 
    NOW()
),
(
    'Vitamin C 1000mg', 
    'Immune system support.', 
    32.00, 
    '/images/vitamin-c.jpg', 
    false, 
    800, 
    'Take one tablet daily with food.', 
    'May cause stomach upset at high doses.', 
    'Vitamins', 
    NOW(), 
    NOW()
);


INSERT INTO users (username, email, password_hash, "role", created_at, updated_at)
VALUES (
    'admin', 
    'admin@eddpharmacy.com', 
    '$2a$08$nQ7iYIQ5jSdJPFXNYicAuuccjweCpAiT/j9Bmovs/m5/FsuMn69ti', 
    'admin',
    NOW(),
    NOW()
);