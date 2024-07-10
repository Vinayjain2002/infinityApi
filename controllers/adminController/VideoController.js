const mongoose= require("mongoose")
const Admin=require("../../models/admin");
const Video = require("../../models/Videos");
const { VideoUploaderWelcome, DeletedVideo, BlockedVideo } = require("../authEmailSenders/VideoEmail");
const User= require("../../models/User")

const PostVideoController= async(req,res,next)=>{
    try{
        // we are gonna the controller for teh  post the video Controlle
        const adminToken = req.params;
        if (!adminToken) {
          return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
        }
    
          const decoded = jwt.verify(adminToken, process.env.ADMIN_TOKEN); // Replace "vinay" with your actual secret key
          const userId = decoded._id;
    
          // Fetch user data using findOne()
          const admin = await Admin.findById(userId);
          if (!admin) {
            return res.status(404).json({ message: "admin not found" }); // Use 404 for not found
          }
          else if(admin.deletedAdminAccount || !admin.approvedadmin || admin.deletedAdminAccount){
            return res.status(410).json({
              "message": "Your Are not allowed"
            })
          }

          //we need to define the logic of getting the url of the video and saving the url of the video in the admin Sections
          const videoUrl=",vmjb";
          const length=10;
          const  {tags,summary, description}= req.body;

        const video= new Video({
            url: videoUrl,
            ownerPlaced: userId,
            tags: tags,
            title: title,
            summary: summary,
            secription: description,
            length: length
        });
        await video.save();
        admin.addedVideo.pushed(video._id);
        // so we had also used to placed the id of the Video
        await admin.save();
        const welcomeuser= await VideoUploaderWelcome(admin.adminname,admin.adminemail);
        if(welcomeuser){
          console.log("welcome mail send to the user");
          return res.status(200).json({"message": "Video Uploaded Successfully"})
        }
        else{
          return res.status(201).json({"message": "Video Uploaded Successfully"})
        }
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"})
    }
}

const RemoveVideoController= async(req,res,next)=>{
    try{
        // we are going to delete the Video of the User
        const adminToken = req.params;
        const {videoId}= req.body;
        if(!videoId){
            return res.status(401).json({"message": "Video Url is not Present"})
        }
        if (!adminToken) {
          return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
        }
    
          const decoded = jwt.verify(adminToken, process.env.ADMIN_TOKEN); // Replace "vinay" with your actual secret key
          const userId = decoded._id;
    
          // Fetch user data using findOne()
          const admin = await Admin.findById(userId);
          if (!admin) {
            return res.status(404).json({ message: "admin not found" }); // Use 404 for not found
          }
          else if(admin.deletedAdminAccount || !admin.approvedadmin || admin.deletedAdminAccount){
            return res.status(410).json({
              "message": "Your Are not allowed"
            })
          }
          else if(!admin.videoAccess){
                return res.status(410).json({"message": "You are not allowed to access the Videos"})
          }
          
          //we need to define the logic of getting the url of the video and saving the url of the video in the admin Sections
         const video= await Video.findById(videoId);
        
         if(!video){
            return res.status(401).json({"message": "Video is not found"});
         }
         const deletedVideo = await Video.findByIdAndDelete(videoId);

         if (deletedVideo) {
            if(video.owner){
                let userId=video.owner;
                const user= await User.findById(userId);
                if(user){
                    let username=user.username;
                    let useremail= user.email;
                    const removedVideo= await DeletedVideo(video.title,username,useremail);
                    if(removedVideo){
                        return res.status(200).json({"message": "Video Delted Succesfully and Warminig send"});
                    }
                    else{
                        return res.status(200).json({"message": "Video Delted Succesfully, Warning not send"});
                    }
                }
                else{
                    return res.status(401).json({"message": "User not found but video deleted Successfully"});
                }
             }
            return res.status(200).json({"message": "Video Delted Succesfully"});
         } else {
            return res.status(405).json({"message": "Error while deleting the Video"})
         }        
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"})
    }
}

const BlockVideoController= async(req,res,next)=>{
    try{
        const adminToken = req.params;
        const {videoId}= req.body;
        if(!videoId){
            return res.status(401).json({"message": "Video Url is not Present"})
        }
        if (!adminToken) {
          return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
        }
    
          const decoded = jwt.verify(adminToken, process.env.ADMIN_TOKEN); // Replace "vinay" with your actual secret key
          const userId = decoded._id;
    
          // Fetch user data using findOne()
          const admin = await Admin.findById(userId);
          if (!admin) {
            return res.status(404).json({ message: "admin not found" }); // Use 404 for not found
          }
          else if(admin.deletedAdminAccount || !admin.approvedadmin || !admin.deletedAdminAccount){
            return res.status(410).json({
              "message": "Your Are not allowed"
            })
          }
          else if(!admin.videoAccess){
                return res.status(410).json({"message": "You are not allowed to access the Videos"})
          }
    
          const video= await Video.findById(videoId);
          if(!video){
            return res.status(404).json({"message": "Video is not found"});
          }
          if(video.videoBlocked){
            return res.status(202).json({"message":"Video is Already Blocked"});
          }

          video.videoBlocked= true;
          await video.save();
          if(video.owner){
            let userId=video.owner;
            const user= await User.findById(userId);
            if(user){
                let username=user.username;
                let useremail= user.email;
                const blockedVideo= await BlockedVideo(video.title,username,useremail);
                if(blockedVideo){
                    return res.status(200).json({"message": "Video Delted Succesfully and Warminig send"});
                }
                else{
                    return res.status(200).json({"message": "Video Delted Succesfully, Warning not send"});
                }
            }
            else{
                return res.status(401).json({"message": "User not found but video blocked"});
            }
         }
        return res.status(200).json({"message": "Video Blockef Succesfully"});
     }

    catch(err){
        return res.status(500).json({"message": "Internal Server Error"})
    }
}

module.exports= {PostVideoController, RemoveVideoController, BlockVideoController};