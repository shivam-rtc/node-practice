require("dotenv").config();
const cors = require('cors');
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
require("./db/db");

// routes
const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes')

//middleware
app.use(express.json());
app.use(cors());
//use user routes
app.use('/', userRoutes)
app.use('/', postRoutes)


app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
 });



