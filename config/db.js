const mongoose = require('mongoose');

const connectDB = async()=>{
    try{
          await mongoose.connect(process.env.MONGO_URL);
          console.log(`Connected to Mongodb Database ${mongoose.connection.host}`.bgMagenta.white)
    }catch(err){
        console.log(`MONGO Connect Error`.bgRed.white);
    }
}

module.exports = connectDB;