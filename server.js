const express= require("express")
const cookieParser= require("cookie-parser")
const cors= require("cors");
const dotenv= require('dotenv')
const {errorHandling}= require("./middleWare/error");
const connectDb = require("./database/db");
const authRouter= require('./routers/auth');
const createAdminRouter= require("./routers/admin/createAdmin");
const projectRoute= require("./routers/Projects/projects")

const app= express();
// going to create a Socketio server
dotenv.config();
app.use(express.json())
app.use(errorHandling);
app.use(cookieParser())
app.use(cors());
app.use("/api/infinity/auth", authRouter);
app.use("/api/infinity/",createAdminRouter);
app.use("/api/infinity/project", projectRoute);
// this is the function to get connected with the database
connectDb();
// We are going to connect with the socket io server also

app.listen(3000, ()=>{
    console.log("Server is listening")
});
