const mongoose= require("mongoose")
const dotenv= require("dotenv")
dotenv.config();

const connectDb= async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("connected")
    }
    catch(err){
        console.log("err while connecting to the database")
    }
}
module.exports= connectDb;