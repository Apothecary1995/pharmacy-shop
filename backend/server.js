const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require('dotenv').config();

const app = express();



const allowedOrigins = [
    'http://localhost:3000', 
    'https://pharmacy-shop-whss.onrender.com', 
    'https://pharmacy-shopv.netlify.app' 
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

app.use(cors(corsOptions));



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'images'))); 

const db = require("./models");
db.sequelize.sync()
  .then(() => {
    console.log("Database synced successfully.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to EDD Pharmacy API V2!" });
});
require("./routes/auth.routes")(app);
require("./routes/drug.routes")(app);
require("./routes/order.routes")(app);
require("./routes/prescription.routes")(app);


const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});