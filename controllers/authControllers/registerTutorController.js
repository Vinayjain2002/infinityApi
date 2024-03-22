const mongoose= require("mongoose")
const bcrypt= require("bcryptjs")
const jwt= require("jsonwebtoken")
const Tutor= require("../../models/Tutor")
const {CustomError}= require("../../middleWare/error")

const loginTutorController= async (req,res)=>{
    let tutor;
    if(req.body.email){
        tutor= await Tutor.findOne({email: req.body.email})
    }
    else if(req.body.username){
        tutor= Tutor.findOne({username: req.body.username})
    }
    else{
        res.status(400).json({
            error: "Please provide the username or the email"
        });
    }
    //going to find out the user
    if(!tutor){
        return res.status(401).json({
            "message": "Invalid Credentials"
        })
    }
    const match= await bcrypt.compare(req.body.password, tutor.password)
    if(!match){
        return res.status(428).json({"message": "Invalid Password Credentials"})
    }
    const {password,...data}= tutor._doc;
    const token= h=jwt.sign({_id: tutor._id}, "vinay",{expiresIn: "3d"})
    res.cookie("token", token, {httpOnly: true}).status(201).json({"message": "Tutor login Successfully", data: data})
}

const registerTutorController= async(req, res)=> {
      // we need to first check the email or the phone no first
    try{
        const {password, username, email}=req.body;
        const existingTutor=  await Tutor.findOne({$or: [{username}, {email}]})
        if(existingTutor){
            return res.status(409).json({
                message: "Username or email already  exists"
            })
        }
        // going to create the tutor 
        const saltRounds= 10;
        const hashedPasword= await bcrypt.hash(password,saltRounds)

        // creating the object of the new user
        const newTutor= new Tutor({
            ...req.body,
            password: hashedPasword
        });

        newTutor.save()
        const token= jwt.sign({_id: newTutor._id}, "vinay", {expiresIn:"3d"})
        res.cookie("token", token, {httpOnly: true}).status(201).json({"message": "Tutor Registered Successfuly"})
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"})
    }
}

const logoutTutorController= async(req, res)=> {
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

const refetchTutorController= async(req,res,next)=>{
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
            const tutor= Tutor.findOne({_id: id});
            const {password, ...data}= tutor._doc;
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

const updateTutorProfileController= async(req, res,next)=>{
   
}

const updateTutorPhoneController= async(req, res,next)=>{

}

const updateTutorEmailController= async(req, res, next)=>{

}

const updateTutorUsernameController= async(req, res,next)=>{

}

const updateTutorPictureController= async(req,res,next)=>{

}

const aviableTutorController = async(req,res,next)=>{

}

const forgotTutorPassword= async(req, res,next)=>{

}

const resetTutorPassword= async(req,res,next)=>{

}

module.exports= {
    loginTutorController,
    logoutTutorController,
     registerTutorController,
     refetchTutorController,
     aviableTutorController,
     updateTutorProfileController,
     updateTutorPictureController,
     updateTutorEmailController,
     updateTutorPhoneController,
     updateTutorUsernameController,
     resetTutorPassword,
     forgotTutorPassword,
    };
