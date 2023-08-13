const express =  require('express')
const cookieParser = require('cookie-parser')
const cors =  require('cors')
const mongoose =  require('mongoose')
const app = express()
const mongoDB = require('./db');
app.use(express.json());
require('dotenv').config();
app.use(express.urlencoded({extended:true}))
app.use(cors());
app.use(cookieParser())

const displayData = require('./routes/displayData')
app.use('/api/v1',displayData)
const userRoutes = require('./routes/user')
app.use('/api/v1',userRoutes)

mongoDB();

app.get("/",(req,res)=>{
    res.send("Hello World!");
})

app.listen(5000,()=>{
    console.log(`Listening on ${5000}`);
})
