const {CustomError} = require("../../middleWare/error")
const mongoose= require("mongoose")
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const jwt= require("jsonwebtoken")
const Blogger= require("../../models/Blogger")
 
const registerBloggerController= async( req,res)=> {
      // we need to first check the email or the phone no first

    try{
        const {password, username, email}= req.body;

        // we are going to find out the existing users
        const existingUser= await Blogger.findOne({$or: [{username}, {email}]})
        if(existingUser){
            return res.status(409).json({
                message: "Username or email already exists"
            })
        };
        // so the user does not exists and need to be created
        const saltRounds= 10;
        const hashedPasword= await bcrypt.hash(password, saltRounds)
        const newBlogger= new Blogger({
            ...req.body,
            password: hashedPasword
        });
        newBlogger.save()

        const token= jwt.sign({_id: newBlogger._id}, "vinay",{expiresIn: "3d"})
        res.cookie("token", token,{httpOnly: true}).status(201).json({"message": "User Registered Successfuly"});
    }
    catch(err){
        res.status(500).json({message: "Internal Server Error"})
    }
};

const refetchBloggerController= async(req,res)=> {
    try{
        const token= req.cookies.token;
        if(!token){
            return  new CustomError("Cookie not found", 405)
        }
       jwt.verify(token, "vinay", {}, async(err,data)=>{
        if(err){
            return  new CustomError("Cookie not Found", 405)
        }
        try{
            const id= data._id;
            const blogger= Blogger.findOne({_id: id});
            const {password, ...data}= blogger._doc;
            res.status(200).json(data)
        }
        catch(err){
            return new CustomError("Internal Server Error", 500);
        }
       })
    }
    catch(err){
        return new CustomError("Internal Server Error", 500);
    }
}

const loginBloggerController= async(req,res)=>{
    try{
        let user;

        if(req.body.email){
            user= await Blogger.findOne({email: req.body.email})
        }
        else if(req.body.username){
            user= await Blogger.findOne({username: req.body.username})
        }
        else{
            return res.status(400).json({error: "Please provide the username or the email."});
        }
        if(!user){
            // user does not found in the database
            return  new CustomError("Invalid Credentials", 401)
        }

        const match= await bcrypt.compare(req.body.password, user.password )
        if(!match){
            return  new CustomError("Invalid Credentials", 401)
        }
        const {password, ...data}= user._doc;
        const token= jwt.sign({_id: user._id}, "vinay",{expiresIn: "3d"} )
        res.cookie("token", token, {httpOnly: true}).status(200).json(data)
    }
    catch(err){
        res.status(500).json({"message": "Internal Server Error"})
    }
}

const logoutBloggerController = async(req, res)=>{
    try{
        if(!req.cookies.token){
            // cookie is not present
            return res.status(401).json({"message": "User not logged in"})
        }

        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "none",
            secure: true
        })

        res.status(200).json({message: "Internal Server eror"})
    }
    catch(err){
        res.status(500).json({ message: "Internal server error" }); // Generic error message
    }
}

const updateBloggerProfileController= async (req,res,next)=>{
    // here we are going to update the data related to the bio description, etc

}

const updateBloggerPhoneController = async(req,res,next)=>{

}



const updateBloggerEmailController= async(req, res,next)=>{

}

const updateBloggerPictureController = async(req, res,next)=>{
    // here we are going to define the code for the pictures ie the profile picture and the cover pictures

}

const updateBloggerUsernameController= async(req, res,next)=>{

}

const aviableBloggerUsernames = async(req, res, next)=>{

}

const forgotBloggerPassword= async(req,res,next)=>{

}

const resetBloggerPassword = async(req,res,next)=>{

}
module.exports= {
    registerBloggerController, 
    refetchBloggerController, 
    loginBloggerController,
     logoutBloggerController,
    updateBloggerPhoneController,
    updateBloggerEmailController,
     updateBloggerProfileController,
       updateBloggerPictureController, 
    updateBloggerUsernameController,
    aviableBloggerUsernames,
    forgotBloggerPassword,
    resetBloggerPassword
};