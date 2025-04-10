// pack 16
// join 180k
// 15 shifting charge


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

// get all routes
const allRoutes=require('./App/index')


app.use(cors());
app.use(express.json());
app.use(allRoutes);

// home routes
app.get('/', async (req, res) => {
        try {
                // You can optionally check DB connection here
                return res.status(200).json({ status: true, msg: "Database connected successfully" });
        } catch (error) {
                return res.status(500).json({ status: false, msg: "Failed to connect to database", error: error.message });
        }
})


const PORT = process.env.PORT || 8000;
// console.log(`Server is running on port ${PORT}`);
// console.log(`Database Connect sucessfully`);

mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
                console.log(`Server is running on port ${PORT}`);
                console.log(`Database Connect sucessfully`);
                app.listen(`${PORT}`);
        })






