require('dotenv').config();
const express=require('express');
const cors=require('cors');
const app=express()

app.use(express.json());

const PORT = process.env.PORT || 8000;
console.log(`Server is running on port ${PORT}`);
console.log(`Database Connect sucessfully`);