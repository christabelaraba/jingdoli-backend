const express = require("express");
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const product_route = require("./src/routes/product_route");
const admin_routes = require("./src/routes/admin_routes");

const db = require("./src/models");



const port = process.env.PORT;
const app = express();
// Use the CORS middleware
app.use(cors());
app.use(bodyParser.json());

//app.use("/api", product_route);
app.use('/api', product_route);
app.use('/api/admin', admin_routes); 



// Sync database
db.sequelize.sync().then(() => {
    console.log('Database synchronized');
}).catch(err => {
    console.error('Error synchronizing database:', err);
});
app.listen(port, () => {
    console.log(`Server has been started on localhost:${port}`);
});