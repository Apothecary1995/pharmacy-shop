// config/db.config.js
require('dotenv').config();


const isProduction = process.env.NODE_ENV === 'production'; 

module.exports = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_NAME,
 
  dialect: isProduction ? "postgres" : "mysql",
  
  
  dialectOptions: isProduction ? {
    ssl: {
      require: true, 
      rejectUnauthorized: false 
    }
  } : {}, 

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};