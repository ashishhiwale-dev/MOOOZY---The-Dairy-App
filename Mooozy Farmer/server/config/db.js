const mongoose = require('mongoose')
const colors = require('colors')

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`Connected to Farmers DATABASE ${mongoose.connection.host}`.bgCyan.white);
    } catch (error) {
        console.log(`error in connection customer DB ${error}`.bgRed.white)
    }
};


module.exports =  connectDB;