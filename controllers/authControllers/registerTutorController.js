// const mongoose= require("mongoose")
// const bcrypt= require("bcryptjs")
// const jwt= require("jsonwebtoken")
// const Tutor= require("../../models/Tutor")
// const {CustomError}= require("../../middleWare/error")
// const { passwordsetEmail } = require("../authEmailSenders/forgotPasswordEmailSender")
// const { TutorWelcome, loginTutorNotfyEmail, resetTutorEmail } = require("../authEmailSenders/TutorEmail")

// const loginTutorController= async (req,res)=>{
//     try{
//         let tutor;

//         if(req.body.email){
//             tutor= await Tutor.findOne({email: req.body.email})
//         }
//         else if(req.body.username){
//             tutor= await Tutor.findOne({username: req.body.username})
//         }
//         else{
//             return res.status(400).json({error: "Please provide the username or the email."});
//         }
//         if(!tutor){
//             // user does not found in the database
//             return  res.status(401).json({"messsage": "Invalid Credentials"})
//         }
//         if(!tutor.blocked){
//         const match= await bcrypt.compare(req.body.password, tutor.password )
//         if(!match){
//             return res.status(401).json({"message": "Invalid Password"}) // Use 401 for incorrect password
//         }
//         const {password, ...data}= tutor._doc;
//         const tutorToken= jwt.sign({_id: tutor._id}, "vinayTutor",{expiresIn: "3d"} )
//         res.cookie("tutorToken", tutorToken, {httpOnly: true}).status(200).json(data);

//         const date = new Date();
//         const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
//         const hours = date.getHours() % 12 || 12;
//         const minutes = date.getMinutes().toString().padStart(2, '0');
//         const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
//         const formattedTime = `${hours}:${minutes}:${ampm}`;
        
//         // going to define the email for the Tutor login notification
//         const emailSend=await loginTutorNotfyEmail(tutor.email, tutor.username,formattedDate, formattedTime, process.env.PASSWORD_RESET_URL);
//       if(emailSend){
//         console.log("email also send");
//       }
//       else{
//         console.log("email not send");
//       }
//     }
//     else{
//         return res.status(425).json({"message":"Your account is blocked"})
//       }
//     }
//     catch(err){
//         res.status(500).json({"message": "Internal Server Error"})
//     }
// }

// const registerTutorController= async(req, res)=> {
//       // we need to first check the email or the phone no first
//     try{
//         const {password, username, email}=req.body;
//         const existingTutor=  await Tutor.findOne({$or: [{username}, {email}]})
//         if(existingTutor){
//             return res.status(409).json({
//                 message: "Username or email already  exists"
//             })
//         }
//         if(username == undefined && email== undefined){
//             return res.status(430).json({"error": "Please provide the username and the email"})
//         } 
//         // going to create the tutor 
//         const saltRounds= 10;
//         const hashedPasword= await bcrypt.hash(username,saltRounds)
//         // creating the object of the new user
//         const newTutor= new Tutor({
//             ...req.body,
//             password: hashedPasword
//         });

//        await newTutor.save();
//        const passwordtoken = jwt.sign({ _id: newTutor._id },"vinayTutorResetPassword", { expiresIn: "1d" }); // Use env variable for secret
//         newTutor.passwordResetToken= passwordtoken;
//         await newTutor.save();

//         const passwordResetEmail= await passwordsetEmail(username,email,"www.google.com");
//         if(!passwordResetEmail){
//           return res.status(436).json({"message": "Unable to verify Email"})
//         }

//         const tutorToken= jwt.sign({_id: newTutor._id}, "vinayTutor", {expiresIn:"3d"})
//         res.cookie("tutorToken", tutorToken, {httpOnly: true}).status(201).json({"message": "Tutor Registered Successfuly"})
//         const welcomeTutor= await TutorWelcome(username,email, "www.google.com");
//         if(welcomeTutor){
//             console.log("welcome mail send to the user")
//           }
//           else{
//             console.log("welcome mail not send");
//           }
//     }
//     catch(err){
//         return res.status(500).json({"message": "Internal Server Error"})
//     }
// }

// const logoutTutorController= async(req, res)=> {
//     try{
//         if(!req.cookies.tutorToken){
//             // cookie is not present
//             return res.status(401).json({"message": "Tutor not logged in"})
//         }
//         res.clearCookie("tutorToken", {
//             httpOnly: true,
//             sameSite: "none",
//             secure: true
//         })

//         res.status(200).json({message: "Tutor Lgout Successfully"})
//     }
//     catch(err){
//         console.log(err);
//         res.status(500).json({ message: "Internal server error" }); // Generic error message
//     }
// }

// const refetchTutorController= async(req,res,next)=>{
//     try{
//         const tutorToken= req.cookies.tutorToken;
//         if(!tutorToken){
//             return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
//         }
//         try {
//             const decoded = jwt.verify(tutorToken, "vinayTutor"); // Replace "vinay" with your actual secret key
//             const tutorId = decoded._id;
      
//             // Fetch user data using findOne()
//             const tutor = await Tutor.findOne({ _id: tutorId });
//             if (!tutor) {
//               return res.status(404).json({ message: "Tutor not found" }); // Use 404 for not found
//             }
//             else if(tutor.blocked){
//               return res.status(405).json({
//                 "message": "Your Account is blocked"
//               })
//             }
//             const {password, passwordResetToken,emailChangeToken,...data}= tutor._doc;
//             res.status(200).json(data);
//           } catch (err) {
//             console.error("Error verifying token or fetching user:", err); // Log specific error details for debugging
//             // Handle specific errors (e.g., token expiration, database errors)
//             if (err.name === 'JsonWebTokenError') {
//               return res.status(401).json({ message: "Unauthorized: Invalid token" });
//             } else if (err.name === 'CastError') {
//               return res.status(400).json({ message: "Invalid user ID" });
//             } else {
//               return res.status(500).json({ message: "Internal Server Error" }); // Generic error for unexpected issues
//             }
//           }
//         } catch (err) {
//           console.error("Unhandled error in refetchUserController:", err);
//           return res.status(500).json({ message: "Internal Server Error" }); // Generic error for unexpected issues at top level
//         }
// }


// const updateTutorProfileController= async (req,res,next)=>{
//     // here we are going to update the data related to the bio description, etc
//     try {
//         // Check for token presence
//         const tutorToken = req.cookies.tutorToken;
//         if (!tutorToken) {
//           return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
//         }
//         // Validate token using JWT verify
//         try {
//           const decoded = jwt.verify(tutorToken, "vinayTutor"); // Replace "vinay" with your actual secret key
//           const tutorId = decoded._id;
//           // Fetch user data using findOne()
//           const tutor= await Tutor.findOne({ _id: tutorId });
//           if (!tutor) {
//             return res.status(404).json({ message: "Tutor not found" }); // Use 404 for not found
//           }
//           else if(tutor.blocked){
//             return res.status(405).json({
//               "message": "Your Account is blocked"
//             })
//           }
//           // from here we are going to change the data of the user profile
//           const {name, socialMedia,mobileNo, bio, description,blogsLevel}= req.body;
//           // now we are going to update those data inside our database also
//           if(tutorName){
//             tutor.tutorName= tutorName
//           }
//           if(experience){
//             tutor.experience= experience
//           }
//           if(name){
//             tutor.name= name;
//           }
//           // if(socailMedia){
//           //   user.socialMedia.push
//           // }
//           if(mobileNo){
//             tutor.mobileNo= mobileNo;
//           }
//           if(bio){
//             tutor.bio= bio;
//           }
//           if(description){
//             tutor.description= description;
//           }
//           if(blogsLevel){
//             tutor.blogsLevel= blogsLevel;
//           }
//           tutor.save();
//           return res.status(200).json({"message": "Profile Updated Successfully"});
//         } catch (err) {
//           console.error("Error verifying token or fetching user:", err); // Log specific error details for debugging
//           // Handle specific errors (e.g., token expiration, database errors)
//           if (err.name === 'JsonWebTokenError') {
//             return res.status(401).json({ message: "Unauthorized: Invalid token" });
//           } else if (err.name === 'CastError') {
//             return res.status(400).json({ message: "Invalid user ID" });
//           } else {
//             return res.status(500).json({ message: "Internal Server Error" }); // Generic error for unexpected issues
//           }
//         }
//       } catch (err) {
//         console.error("Unhandled error in refetchUserController:", err);
//         return res.status(500).json({ message: "Internal Server Error" }); // Generic error for unexpected issues at top level
//       }
// }



// const updateTutorEmailGenerator= async(req,res,next)=>{
//     try {
//       const tutorToken= req.cookies.tutorToken;
//       if(!tutorToken){
//         return res.status(429).json({"message":"Token not found"})
//       }
//       console.log(tutorToken);
//       // Check for token presence
//      const loggedInTutor= await findLoggedInTutor(tutorToken);
//      console.log(loggedInTutor)
//       if(loggedInTutor.blocked){
//       return res.status(405).json({
//        "message": "Your Account is blocked"
//       });
//      }
//      else if(loggedInTutor){
//       const {email}= req.body;
//       if(!email){
//         return res.status(409).json({"message": "Please Enter the new email"})
//       }
//         // here we are going to check is the usr email is just same or different 
//         if(email==loggedInTutor.email){
//           return res.status(409).json({
//             "message": "Email is same"
//           })
//         }
  
//         // so the mails are not same and we are going to send a email with a token to the user
//         const emailtoken = jwt.sign({ _id:loggedInTutor._id },"vinayResetEmail", { expiresIn: "1d" }); // Use env variable for secret
//         loggedInTutor.emailChangeToken= emailtoken;
//         await loggedInTutor.save();
//         // going to send the email to the user for the email reset. url contains username, newEmail, token
//         const resetEmail= await resetTutorEmail(email,loggedInTutor.username,"www.google.com");
//         if(resetEmail){
//           return res.status(200).json({"message": "Email sent to new Email"})
//         }
//         else{
//           return res.status(489).json({"message": "Error while Updating Email"})
//         }
//      }
//      else{
//       return res.status(409).json({"message": "Internal Server Error, login again"});
//      }
//     } catch (err) {
//       console.error("Unhandled error in refetchUserController:", err);
//       return res.status(500).json({ message: "Internal Server Error" }); // Generic error for unexpected issues at top level
//     }
//   }
  
//   const updateTutorEmailController= async(req, res,next)=>{
//        // here we are going to send the verification email to the user with the otp
//        try {
//           // Check for token presence
//           const { email, emailChangeToken}= req.body;
//           if (!emailChangeToken) {
//             return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
//           }
//           if(!email){
//             return res.status(469).json({"message": "PLease provide the new Email"})
//           }
      
//           // Validate token using JWT verify
//           try {
//             const decoded = jwt.verify(emailChangeToken, "vinayResetEmail"); // Replace "vinay" with your actual secret key
//             const tutorId = decoded._id;
      
//             // Fetch user data using findOne()
//             const tutor = await Tutor.findOne({ _id: tutorId });
//             if (!tutor) {
//               return res.status(404).json({ message: "Tutor not found" }); // Use 404 for not found
//             }
//             else if(tutor.blocked){
//               return res.status(405).json({
//                 "message": "Your Account is blocked"
//               })
//             }
//             // so we had verified the newemail
//             tutor.email= email;
//             tutor.emailChangeToken="";
//             tutor.save();
//             return res.status(200).json("Email Updates Successfully")
//           } catch (err) {
//             console.error("Error verifying token or fetching user:", err); // Log specific error details for debugging
//             // Handle specific errors (e.g., token expiration, database errors)
//             if (err.name === 'JsonWebTokenError') {
//               return res.status(401).json({ message: "Unauthorized: Invalid token" });
//             } else if (err.name === 'CastError') {
//               return res.status(400).json({ message: "Invalid user ID" });
//             } else {
//               return res.status(500).json({ message: "Internal Server Error" }); // Generic error for unexpected issues
//             }
//           }
//         } catch (err) {
//           console.error("Unhandled error in refetchUserController:", err);
//           return res.status(500).json({ message: "Internal Server Error" }); // Generic error for unexpected issues at top level
//         }
//   }
  
//   const updateTutorPictureController = async(req, res,next)=>{
//       // here we are going to define the code for the pictures ie the profile picture and the cover pictures
  
//   }
  
//   const updateTutorUsernameController= async(req, res,next)=>{
//       try {
//           // Check for token presence
//           const loggedInTutor= await findLoggedInTutor();
//           if(loggedInTutor){
//             const {username}= req.body;
//             // here we are going to check weather the username is aviable or not
//             const existingTutor= Tutor.findOne({username});
//             if(existingTutor){
//               return res.status(493).json({"message": "Username Already Exists"});
//             }
//             loggedInTutor.username= username;
//             loggedInTutor.save();
//             res.status(200).json({"message": "Username Updated Succesfully"});
//           }else{
//             return;
//           }
//         } catch (err) {
//           console.error("Unhandled error in refetchUserController:", err);
//           return res.status(500).json({ message: "Internal Server Error" }); // Generic error for unexpected issues at top level
//         }
//   }
  
//   const aviableTutorUsernames = async(req, res, next)=>{
  
//   }
  
//   const resetTutorPassword = async(req,res,next)=>{
//   // here we are going to send the forgot password to the users email 
//    try {
//     // 1. Validate User Input
//     const { email, username } = req.body;
  
//     if (!email && !username) {
//       return res.status(429).json({ error: "Please provide either email or username." });
//     }
  
//     // 2. Find User Based on Email or Username
//     let tutor;
//     if (email) {
//       tutor = await Tutor.findOne({ email });
//     } else {
//       tutor = await Tutor.findOne({ username });
//     }
//     if (!tutor) {
//       return res.status(404).json({ message: "No user found." });
//     }
  
//     const passwordtoken = jwt.sign({ _id: tutor._id },"vinayTutorResetPassword", { expiresIn: "1d" }); // Use env variable for secret
//     tutor.passwordResetToken= passwordtoken;
//     await tutor.save();
  
//     // 5. Send Password Reset Email (replace with your email sending logic)
//     const mailResult=await passwordsetEmail(tutor.username,tutor.email, "www.google.com") // Assuming sendPasswordResetEmail function exists
//     if(mailResult){
//       return res.status(200).json({ message: "Password reset email sent successfully." });
//     }
//     else{
//       return res.status(430).json({"message": "Some erro while sending the email"})
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "An error occurred. Please try again later." });
//   }
//   }
  
//   const findTutorByPrefixNameController = async( req, res,next)=>{
//     try {
//       const {username} = req.body;  // Adjust based on how you pass the prefix
//       console.log(username)
//       const tutor = await Tutor.find({
//         username: { $regex: `^${username}`, $options: 'i' }
//       });
  
//       if (!tutor.length) {
//         return res.json({ message: 'No Tutors found' });
//       }
//       return res.status(200).json({"message": "Tutors found","data": tutor}); // Send the list of matching tutors
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   }
  
//   const findAllTutorsController = async (req, res, next) => {
//     try {
//       const tutors= await Tutor.find();
//       const tutorCount = tutors.length; // More efficient way to get the count
  
//       return res.status(200).json({
//         "message": "Fetched all tutors",
//         "no of Tutors": tutorCount,
//         "data": tutors
//       });
//     } catch (err) {
//       console.error(err); // Log the error for debugging
//       return res.status(500).json({
//         "error": "Internal Server Error"
//       });
//     }
//   };
  
  
//   const updateTutorPasswordController=async(req, res,next)=>{
//       try {
//         // Check for token presence
//         const {password, passwordResetToken}= req.body;
//         if (!passwordResetToken) {
//           return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
//         }
//         if(!password){
//           return res.status(404).json({"message": "Please provide the new Password"})
//         }
    
//         // Validate token using JWT verify
//         try {
//           const decoded = jwt.verify(passwordResetToken, "vinayTutorResetPassword"); // Replace "vinay" with your actual secret key
//           const tutorId = decoded._id;
    
//           // Fetch user data using findOne()
//           const tutor= await Tutor.findOne({ _id: tutorId });
//           if (!tutor) {
//             return res.status(404).json({ message: "Tutor not found" }); // Use 404 for not found
//           }
//           else if(tutor.blocked){
//             return res.status(405).json({
//               "message": "Your Account is blocked"
//             })
//           }
//           // so we had verified the newemail
//           tutor.password= password;
//           tutor.passwordResetToken="";
//           tutor.save();
//           return res.status(200).json("Password Updated Successfully")
//         } catch (err) {
//           console.error("Error verifying token or fetching user:", err); // Log specific error details for debugging
//           // Handle specific errors (e.g., token expiration, database errors)
//           if (err.name === 'JsonWebTokenError') {
//             return res.status(401).json({ message: "Unauthorized: Invalid token" });
//           } else if (err.name === 'CastError') {
//             return res.status(400).json({ message: "Invalid user ID" });
//           } else {
//             return res.status(500).json({ message: "Internal Server Error" }); // Generic error for unexpected issues
//           }
//         }
//       } catch (err) {
//         console.error("Unhandled error in refetchUserController:", err);
//         return res.status(500).json({ message: "Internal Server Error" }); // Generic error for unexpected issues at top level
//       }
//     }
  
  
//     const findLoggedInTutor= async(tutorToken)=>{
//       console.log(tutorToken);
//         if (!tutorToken) {
//            return null;
//         }
//         // Validate token using JWT verify
//         try {
//           const decoded = jwt.verify(tutorToken, "vinayTutor"); // Replace "vinay" with your actual secret key
//           const tutorId = decoded._id;
    
//           // Fetch user data using findOne()
//           const tutor = await Tutor.findOne({ _id: tutorId });
//           if (!tutor) {
//              return null;
//           }
//           return tutor;
//         } catch (err) {
//           console.error("Error verifying token or fetching user:", err); // Log specific error details for debugging
//           // Handle specific errors (e.g., token expiration, database errors)
//           if (err.name === 'JsonWebTokenError') {
//              res.status(401).json({ message: "Unauthorized: Invalid token" });
//              return null;
//           } else if (err.name === 'CastError') {
//              res.status(400).json({ message: "Invalid user ID" });
//              return null;
//           } else {
//              res.status(500).json({ message: "Internal Server Error" }); // Generic error for unexpected issues
//              return null;
//           }
//         }
//     }
    
// module.exports= {
//     loginTutorController,
//     logoutTutorController,
//      registerTutorController,
//      refetchTutorController,

//      updateTutorProfileController,
//      updateTutorPictureController,
//      updateTutorEmailController,
//      updateTutorUsernameController,

//      resetTutorPassword,
//      updateTutorPasswordController,
//      findAllTutorsController,
//      findTutorByPrefixNameController,
//      updateTutorEmailGenerator
//     };
