const express= require('express')
const dotenv= require('dotenv')
const Video = require('../../models/Videos')
const jwt= require('jsonwebtoken')
const User= require('../../models/User')
dotenv.config()

const UploadVideoController= async(req,res,next)=>{
    try{
        const userToken= req.params;
        const {title, url, tags, ...data}= req.body;
        if(!title || !url || !tags){
            return res.status(401).json({"message": "All the credentials are not defined"})
        }
        if(!userToken){
            return res.status(401).json({"message": "Please Login"})
        }
        //going to deode the token
        const decoded= jwt.verify(userToken, process.env.USER_TOKEN)
        if(!decoded){
            return res.status(401).json({"message": "Invalid Token"})
        }
        const userId= decoded._id;
        const user= await User.findOneById(userId)
        if(!user){
            return res.status(404).json({'message': "User not found"})
        }
        if(user.blocked){
            return res.status(410).json({"message": "Your account is blocked"})
        }
        const video= new Video({
            tags:tags,
            title: title,
            url: url,
            owner: userId,
            ...data
        })
        await video.save()
        return res.status(200).json({'message': "All the video Saved Successfully"})
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"})
    }
}

const DeleteVideoController=async(req,res,next)=>{
    try{
        // we are gonna to define the code to delete the user Uploaded Video
        const {userToken, videoId}= req.params;
        if(!userToken || !videoId){
            return res.status(401).json({"message": "Please Define all the Credentials"})
        }
        //going to deode the token
        const decoded= jwt.verify(userToken, process.env.USER_TOKEN)
        if(!decoded){
            return res.status(401).json({"message": "Invalid Token"})
        }
        const userId= decoded._id;
        const user= await User.findOneById(userId)
        if(!user){
            return res.status(404).json({'message': "User not found"})
        }
        if(user.blocked){
            return res.status(410).json({"message": "Your account is blocked"})
        }
        // checking is the video uploaded by the user or not
        const videoDetails= await Video.findOne({$and: [{owner: userId}, {_id: videoId}]})
        if(!videoDetails){
            return res.status(404).json({"message":"Video not found"})
        }
        const deleteVideo= await Video.findOneAndDelete({_id: videoId});
        if(!deleteVideo){
            return res.status(400).json({"message": "Error while deleting the video"})
        }
        return res.status(200).json({"message": "Video Deleted Successfully"})
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"})
    }
}

const EditVideoController=async(req,res,next)=>{
   try{
            const {userToken, videoId}= req.params;
            if(!userToken || !videoId){
                return res.status(401).json({'message': "Please define all the Credentials"})
            }
            const decoded= jwt.verify(userToken, process.env.USER_TOKEN)
            if(!decoded){
                return res.status(401).json({"message": "Invalid Token"})
            }
            const userId= decoded._id;
            const user= await User.findOneById(userId)
            if(!user){
                return res.status(404).json({'message': "User not found"})
            }
            if(user.blocked){
                return res.status(410).json({"message": "Your account is blocked"})
            }
            const {owner, ownerPlaced,...updatedData}= req.body;
            if(!updatedData){
                return res.status(401).json({"message": "Please Provide the updated Data"})
        }
        // going to update the data
        const updatedVideo = await Video.findOneAndUpdate(
            {
                $and: [{ owner: userId }, { _id: videoId }]
            },
            {
                $set: updatedData
            },
            { new: true }
        );
        if(!updatedData){
            return res.status(400).json({"message": "Error while Updating the data"})
        }
        return res.status(200).json({'message': "Data Updated Successfully"})
        
   }
   catch(err){
        return res.status(500).json({'message': "Internal Server Error"})
   }
}

const AllUserUploadedVideoController=async(req,res,next)=>{
    try{
        const {userToken}= req.params;
        if(!userToken){
            return res.status(401).json({"message": "Login"})
        }
        const decoded= jwt.verify(userToken, process.env.USER_TOKEN)
            if(!decoded){
                return res.status(401).json({"message": "Invalid Token"})
            }
            const userId= decoded._id;
            const user= await User.findOneById(userId)
            if(!user){
                return res.status(404).json({'message': "User not found"})
            }
            if(user.blocked){
                return res.status(410).json({"message": "Your account is blocked"})
            }
        const allVideo= await Video.find({owner: userId});
        if(!allVideo || allVideo.length==0){
            return res.status(404).json({"message": "No video Find"})
        }
        return res.status(200).json({"message": "All the userUploaded Video find Successfully"})
    }
    catch(err){
        return res.status(500).json({'message': "Internal Server Error"})
    }
}

module.exports= {
    UploadVideoController,
    DeleteVideoController,
    EditVideoController,
    AllUserUploadedVideoController
}