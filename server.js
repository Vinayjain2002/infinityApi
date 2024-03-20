const express= require("express")
const cookieParser= require("cookie-parser")
const dotenv= require('dotenv')
const {errorHandling}= require("./middleWare/error");
const connectDb = require("./database/db");
const authRouter= require('./routers/auth');
                
const app= express();
dotenv.config();
app.use(express.json())
app.use(errorHandling);
app.use(cookieParser())
express.static("src")

app.use("/api/techifyMe/auth", authRouter);
connectDb();

app.listen(process.env.PORT, ()=>{
    console.log("Server is listening")
});
