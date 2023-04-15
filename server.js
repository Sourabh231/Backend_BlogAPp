const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const colors = require('colors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

 

//env config
dotenv.config();

//routes import
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');

//mongodb connection
connectDB();

//rest objects
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'))//when url click it will show in console.{network request will show}

//routes
app.get('/',(req,res)=>{
    res.status(200).send({
        message:'sourabh dudhale'
    })
    
})

app.use('/api/v1/user',userRoutes);
app.use('/api/v1/blog',blogRoutes);

//port 
const PORT = process.env.PORT || 8080;

//listen

app.listen(PORT,()=>{
    console.log(`server is running on ${process.env.DEV_MODE} port no ${PORT}`.bgCyan.white);
})