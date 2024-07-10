const express= require('express')
const Video= require('../../models/Videos')
const dotenv= require('dotenv')
dotenv.config();

const AllVideoController= async(req,res,next)=>{
    try{
        const pageNo= req.params?.pageNo ??1;
        const skipLength= (pageNo-1)*10;
        const allVideo= Video.find({}).skip(skipLength).limit(skipLength)
        if(!allVideo || allVideo.length==0){
            return res.status(404).json({"message": "No Video Found"})
        }
        return res.status(200).json({"message": "All the videos had been found", "data": allVideos})
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"})
    }
}

const ParticularUserVideoController=async(req,res,next)=>{
    try{
        const {videoId}= req.params;
        if(!videoId){
            return res.status(401).json({'message': "Please define the videoId"})
        }
        const video= await Video.findOneById(videoId);
        if(!video){
            return res.status(404).json({"message": "No video data found"})
        }
        return res.status(200).json({"message": "Video details found successfully"})
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"})
    }
}

const LatestUploadedVideoController=async(req,res,next)=>{
    try{
        //we are gonna to find out the latest uploaded Videos
        const pageNo= req.params?.pageNo ?? 1;
        const skipLength= (pageNo-1)*10;
        const latestVideos = await Video.find({})
                                        .sort({ createdAt: -1 }) // Sort by recently created
                                        .skip(skipLength)
                                        .limit(pageSize)
        if(!latestVideos || latestVideos.length==0){
            return res.status(404).json({"message": "Error while finding the data of the Latest videos"})
        }
        return res.status(200).json({"message": "All the latest Video find successfully", "data": latestVideos})
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"})
    }
}

const FindVideoByTagsController = async (req, res, next) => {
    try {
        // Assuming 'pageNo' is a query parameter and not a URL parameter
        const pageNo = parseInt(req.query.pageNo) || 1;
        const skipLength = (pageNo - 1) * 10;
        const { tags } = req.body;

        // Validate that 'tags' is an array
        if (!Array.isArray(tags)) {
            return res.status(400).json({ "message": "Tags should be an array" });
        }

        // Query the database for videos with the given tags
        // This is a pseudo-code, replace it with your actual database query method
        const videos = await Video.find({ 
            tags: { $in: tags }
        }).skip(skipLength).limit(10);

        // Send the response with the found videos
        res.status(200).json(videos);
    } catch (err) {
        console.error(err); // It's good practice to log the error
        return res.status(500).json({ "message": "Internal Server Error" });
    }
}


module.exports= {
    AllVideoController,
    ParticularUserVideoController,
    LatestUploadedVideoController,
    FindVideoByTagsController
}