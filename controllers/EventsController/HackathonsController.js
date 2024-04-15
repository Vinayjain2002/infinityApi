const mongoose= require("mongoose");
const User= require('../../models/User');
const Blogger= require("../../models/Blogger");
const Hackathon= require('../../models/postHackathon');


const PostHackathonController= async ()=>{
    try{
        const {postedBy,name, mode, lastDateToApply, description, ideaSubmissionDate,maxTeamMembers,registerationUrl,problemStatement,prizes,organisedBy,...data}= req.body;
        const EventPoster="";
        // so we had used to get all the mandatort details here 
        if(designation=="User"){
            const usertoken= req.cookies.usertoken;
            if (!usertoken) {
                // here the token of the user is not find and the user need to login to post the events
                return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
              }     
              try{
                const decoded= jwt.verify(usertoken, "vinay");
                const userId= decoded._id;
                // now we are going to find out the details of teh user here extra like is he a valid user or not
                const user= User.findOne({_id: userId});
                if(!user){
                    // so the user id not found
                    return res.status(404).json({ message: "User not found" }); // Use 404 for not found
                }
                else if(user.blocked){
                    // so the user is blocked so he is uable to post a event
                    return res.status(405).json({
                        "message": "Your Account is blocked"
                      });
                }
                // we are going to store the data entered by the user and going to create a new object of the fest and storeing teh data 

                const newHackathon= new Hackathon({
                    postedBy: user.name,
                    name: name,
                    ideaSubmissionDate: ideaSubmissionDate,
                    maxTeamMembers: maxTeamMembers,
                    designation: "User",
                    eventname: eventname,
                    mode: mode,
                    dateOfPosted: Date.now(),
                    lastDateToApply: lastDateToApply,
                    description: description,
                    problemStatement: problemStatement,
                    registerationUrl: registerationUrl,
                    prizes: prizes,
                    ...data
                });
                // so here we had used to store the other data of the fest
                await newHackathon.save();
                // now we need to add the Fest to the user Endpoints also
                user.hackathonsPosted.push(newHackathon._id); // Push directly to existing array
                await user.save();
                res.json({ message: "Fest added successfully!" });
              }  
              catch(err){
                console.log(err);
                return res.status(410).json({"message": "Internal Server error"})
              }
         }
        else if(designation== "Blogger"){
            // so we need to retrieve the token of the Blogger here
            const bloggertoken= req.cookies.bloggertoken;
            if(!bloggertoken){
                return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
            }
            try{
                // we are going to create find the blogger for the prpose of the posting the hackathons
                const decoded= jwt.verify(bloggertoken,"vinayBlogger");
                const bloggerId= decoded._id;
                const blogger= Blogger.findOne({_id: bloggerId});
                if(!blogger){
                    return res.status(404).json({ message: "Blogger not found" }); // Use 404 for not found
                }
                else if(blogger.blocked){
                    return res.status(405).json({
                        "message": "Your Account is blocked"
                      });
                }
                // so we did used to get the details of the blogger
                const newHackathon= new Hackathon({
                    postedBy: user.name,
                    name: name,
                    ideaSubmissionDate: ideaSubmissionDate,
                    maxTeamMembers: maxTeamMembers,
                    designation: "User",
                    eventname: eventname,
                    mode: mode,
                    dateOfPosted: Date.now(),
                    lastDateToApply: lastDateToApply,
                    description: description,
                    problemStatement: problemStatement,
                    registerationUrl: registerationUrl,
                    prizes: prizes,
                    ...data
                });
                // so here we had used to store the other data of the fest
                await newHackathon.save();
                blogger.hackathonsPosted.push(newHackathon._id);
                await blogger.save();
            }
            catch(err){
                console.log("Error while getting the data of the Blogger to post thte hackathons");
                return res.status(500).json({"message": "Internal Server Error"});
            }
        }
        else{
            return res.status(500).json({"message":"Internal Server Error"})
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({"message": "Internal Server Error"});
    }
}


const getAllHackathonsController = async () => {
    try {
      // Fetch all hackathons (consider filtering and sorting if needed)
      const hackathons = await Hackathon.find({});
  
      if (!hackathons || hackathons.length === 0) {
        return res.status(204).json({ message: "No hackathons found" });
      }
  
      return res.status(200).json({ message: "Hackathons fetched successfully", data: hackathons });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
const getParticularHackathonController = async () => {
    try {
      const { id } = req.params;
      // Validate ID presence and format (optional)
      if (!id) {
        return res.status(400).json({ message: "Missing hackathon ID" });
      }
  
      // Efficiently fetch hackathon by ID using findById
      const hackathon = await Hackathon.findById(id);
  
      if (!hackathon) {
        return res.status(404).json({ message: "No hackathon found with that ID" });
      }
  
      return res.status(200).json({ message: "Hackathon details fetched successfully", data: hackathon });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
const getHackathonsByDateController = async () => {
    try {const mongoose= require("mongoose");
    const express= require("express")
    const router= express.Router();
    
      const { dateOfPosting, lastDateToApply, both } = req.body;
  
      let pipeline = []; // Initialize empty pipeline
      let sortCriteria = {}; // Initialize empty sort criteria
  
      // Validate and build pipeline based on request parameters
      if (dateOfPosting) {
        sortCriteria = { dateOfPosting: -1 }; // Sort by dateOfPosting descending
      } else if (lastDateToApply) {
        sortCriteria = { lastDateToApply: 1 }; // Sort by lastDateToApply ascending
      } else if (both) {
        // Handle both criteria: sort by lastDateToApply ascending, then dateOfPosting descending
        sortCriteria = { lastDateToApply: 1, dateOfPosting: -1 };
      } else {
        return res.status(400).json({ message: "Invalid request parameters. Specify dateOfPosting, lastDateToApply, or both." });
      }
  
      pipeline.push({ $match: {} }); // Match all documents by default
      pipeline.push({ $sort: sortCriteria });
  
      // Fetch hackathons using aggregation pipeline
      const hackathons = await Hackathon.aggregate(pipeline);
  
      if (!hackathons || hackathons.length === 0) {
        return res.status(204).json({ message: "No hackathons found based on your criteria" });
      }
  
      return res.status(200).json({ message: "Hackathons fetched successfully", data: hackathons });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
const getUserPreferenceHackathonsController = async () => {
    try {
      const { postedBy, organisedBy, level, location, prizes, mode, techStackRequired } = req.body;
  
      let filters = []; // Initialize an empty filters array
  
      // Build filters based on user preferences (include checks for null values)
      if (postedBy) {
        filters.push({ postedBy });
      }
      if (organisedBy) {
        filters.push({ organisedBy });
      }
      if (level) {
        filters.push({ level });
      }
      if (location) {
        filters.push({ location }); // Assuming location is a string field
      }
      if (mode) {
        filters.push({ mode });
      }
      if (techStackRequired) {
        filters.push({ techStackRequired }); // Assuming techStackRequired is an array
      }
  
      // Handle prizes (consider different approaches based on data type)
      if (prizes !== undefined) {
        // Option 2: Range or minimum prize value (if prizes is a number)
        // filters.push({ prizes: { $gte: minimumPrize } });
      }
  
      // Match all documents by default if no filters are provided
      const pipeline = filters.length === 0 ? [{ $match: {} }] : [{ $match: { $and: filters } }];
  
      // Sort by deadline ascending and dateOfPosting descending (optional)
      pipeline.push({
        $sort: {
          lastDateToApply: 1, // Assuming lastDateToApply represents deadline
          dateOfPosting: -1,
        },
      });
  
      // Fetch hackathons using aggregation pipeline
      const hackathons = await Hackathon.aggregate(pipeline);
  
      if (!hackathons || hackathons.length === 0) {
        return res.status(204).json({ message: "No hackathons found matching your preferences" });
      }
  
      return res.status(200).json({ message: "Hackathons fetched successfully", data: hackathons });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  const deleteHackathonController=async(req,res,next)=>{
    try{
      // going to delete the Project Details
      const {hackathonId}= req.params; // send the data in the form of the Bootcamp id
      if(!hackathonId){
        return res.status(401).json({"message": "Hackathon Id is missing"})
      }
      // we are going to change the Project Details
      const usertoken= req.cookies.usertoken;
      if(!usertoken){
          return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access 
      }
      const decoded= jwt.verify(usertoken, "vinay");
      const userId= decoded._id;
              // now we are going to find out the details of teh user here extra like is he a valid user or not
      const user= User.findById(userId);
      if(!user){
                  // so the user id not found
          return res.status(404).json({ message: "User not found" }); // Use 404 for not found
      }
      else if(user.blocked){
                  // so the user is blocked so he is uable to post a event
          return res.status(405).json({
              "message": "Your Account is blocked"
              });
      }
  const userHackathons = user.hackathonsPosted || [];
  const hackathonIndex = userHackathons.findIndex((hackathon) => hackathon.toString() === hackathonId); // Find project index

    if (hackathonIndex === -1) {
      return res.status(404).json({ message: "Hackathon not found in your Hackathon" });
    }

    // 6. Delete Project (Core Functionality)
    const deletedHackathon = await Hackathon.findByIdAndDelete(hackathonId); // Assuming `YourModel` represents the project collection

    if (!deletedHackathon) {
      return res.status(500).json({ message: "Failed to delete Hackathon" });
    }

    // 7. Update User's Projects (Efficient Update with Pull Operator)
    const updatedUser = await User.findByIdAndUpdate(userId, { $pull: {hackathonsPosted: hackathonId} }, { new: true }); // Efficient update with `pull`
    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to remove Hackathon from your posted Hackathon" });
    }
    return res.status(200).json({ message: "Hackathon deleted successfully" });
  }
  catch(err){
      return res.status(500).json({"message": "Internal Server Error"});
  }
  }

  const updateHacakathonController= async(req,res,next)=>{
    try{
      // going to delete the Project Details
      const {hackathonId}= req.params;
      if(!hackathonId){
          return res.status(401).json({"message": "Hackathon Id is missing"})
      }
      // we are going to change the Project Details
      const usertoken= req.cookies.usertoken;
      if(!usertoken){
          return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access 
      }
      const decoded= jwt.verify(usertoken, "vinay");
      const userId= decoded._id;
              // now we are going to find out the details of teh user here extra like is he a valid user or not
      const user= User.findById(userId);
      if(!user){
                  // so the user id not found
          return res.status(404).json({ message: "User not found" }); // Use 404 for not found
      }
      else if(user.blocked){
                  // so the user is blocked so he is uable to post a event
          return res.status(405).json({
              "message": "Your Account is blocked"
              });
      }
  const userHackathons = user.hackathonsPosted || [];
  const hackathonIndex = userHackathons.findIndex((hackathon) => hackathon.toString() === hackathonId); // Find project index

    if (hackathonIndex === -1) {
      return res.status(404).json({ message: "Hackathon not found in your uploaded Hackathon" });
    }

    // 6. Delete Project (Core Functionality)
    const deletedHackathon = await Hackathon.findByIdAndDelete(hackathonIndex); // Assuming `YourModel` represents the project collection

    if (!deletedHackathon) {
      return res.status(500).json({ message: "Failed to delete Hackathon" });
    }

    // 7. Update User's Projects (Efficient Update with Pull Operator)
    const updatedUser = await User.findByIdAndUpdate(userId, { $pull: {hackathonsPosted: hackathonId } }, { new: true }); // Efficient update with `pull`
    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to remove hackathon from your Bootcamps" });
    }
    return res.status(200).json({ message: "Hackathon deleted successfully" });
  }
  catch(err){
      return res.status(500).json({"message": "Internal Server Error"});
  }
  }

module.exports= {PostHackathonController,
   getAllHackathonsController,
   getParticularHackathonController,
   getHackathonsByDateController,
   getUserPreferenceHackathonsController,
   deleteHackathonController,
   updateHacakathonController
  };
