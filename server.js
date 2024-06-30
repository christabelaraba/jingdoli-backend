const express = require("express");
const bodyParser = require('body-parser');
const product_route = require("./src/routes/product_route");
const db = require("./src/models");
const port = 3000;
const app = express();

app.use(bodyParser.json());

//app.use("/api", product_route);
app.use('/api', product_route);
// Sync database
db.sequelize.sync().then(() => {
    console.log('Database synchronized');
}).catch(err => {
    console.error('Error synchronizing database:', err);
});
app.listen(port, () => {
    console.log(`Server has been started on localhost:${port}`);
});