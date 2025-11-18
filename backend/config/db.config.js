// config/db.config.js
require('dotenv').config();

// Bu dosyayı, Sequelize'ın doğrudan DATABASE_URL'yi kullanmasını sağlayacak 
// şekilde basitleştiriyoruz.
// Localde çalışmak için bu ayarları kullanmaya devam edebiliriz.

module.exports = {
  // Render bu değişkeni otomatik olarak 'production' olarak tanımlar.
  isProduction: process.env.NODE_ENV === 'production',

  // Local/Geliştirme Ortamı Ayarları
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_NAME,
  
  // Eğer production (Render) ise, varsayılan olarak PostgreSQL kullanırız.
  // Localde (development) ise .env dosyanızdaki ayar (büyük ihtimalle mysql) kullanılır.
  dialect: process.env.DB_DIALECT || 'postgres', // DB_DIALECT .env'de tanımlı değilse postgres kullanır

  // Diğer ayarlar...
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};