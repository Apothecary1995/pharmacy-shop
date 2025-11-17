
CREATE DATABASE IF NOT EXISTS edd_pharmacy_v2 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE edd_pharmacy_v2;


CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    `role` ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS drugs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    imageUrl VARCHAR(255),
    requiresPrescription BOOLEAN NOT NULL DEFAULT false,
    stock INT NOT NULL DEFAULT 0,
    usageInfo TEXT,
    sideEffects TEXT,
    category VARCHAR(100),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS prescriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    imageUrl VARCHAR(255) NOT NULL,
    `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    prescriptionId INT NULL,
    totalPrice DECIMAL(10, 2) NOT NULL,
    `status` ENUM('pending_approval', 'verified', 'shipped', 'cancelled', 'completed') NOT NULL DEFAULT 'pending_approval',
    
    shippingAddress TEXT NOT NULL,
    paymentMethod VARCHAR(50) NOT NULL,
    paymentStatus ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',

    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (prescriptionId) REFERENCES prescriptions(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL,
    drugId INT NOT NULL,
    quantity INT NOT NULL,
    pricePerUnit DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (drugId) REFERENCES drugs(id) ON DELETE CASCADE
);

INSERT INTO drugs 
  (name, description, price, imageUrl, requiresPrescription, stock, usageInfo, sideEffects, category, createdAt, updatedAt)
VALUES
(
  'Aspirin 100mg', 
  'Pain reliever and fever reducer.', 
  '15.50', 
  '/images/aspirin.jpg', 
  false, 
  1000, 
  'Take 1-2 tablets with water every 4-6 hours.', 
  'Stomach upset, heartburn.', 
  'Pain Relief', 
  NOW(), 
  NOW()
),
(
  'Amoxicillin 500mg', 
  'Antibiotic for bacterial infections.', 
  '45.75', 
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
  '32.00', 
  '/images/vitamin-c.jpg', 
  false, 
  800, 
  'Take one tablet daily with food.', 
  'May cause stomach upset at high doses.', 
  'Vitamins', 
  NOW(), 
  NOW()
);


INSERT INTO users (username, email, password_hash, `role`, createdAt, updatedAt)
VALUES (
  'admin', 
  'admin@eddpharmacy.com', 
  '$2a$08$nQ7iYIQ5jSdJPFXNYicAuuccjweCpAiT/j9Bmovs/m5/FsuMn69ti', 
  'admin',
  NOW(),
  NOW()
);