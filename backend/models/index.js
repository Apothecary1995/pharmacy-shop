// models/index.js (Ana Bağlantı)
const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
let sequelize;

// Render'da DATABASE_URL var mı diye kontrol et
if (process.env.DATABASE_URL) {
    // Canlı: DATABASE_URL, PostgreSQL ve SSL kullan
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        pool: { ...dbConfig.pool }
    });
} else {
    // Yerel: Eski dbConfig yapısını kullan (MySQL)
    sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        pool: { ...dbConfig.pool }
    });
}
// ... (Modeller ve ilişkiler bu kısmın altında devam eder)
// ...