// here we are ggoin to define the endpoint to store teh data of the events and want to retrive the data o the different conditions
const mongoose = require("mongoose");
const Events= require("../../models/Events");
const Fest= require("../../models/Fest");
const User = require('../../models/User');
const Blogger= require("../../models/Blogger");

const PostFest= async()=>{
    try{
        const {postedBy,designation,eventname, mode, lastDateToApply, description,queryContacts, registerationUrl, ...data}= req.body;
        const EventPoster="";
        const requiredFields = ['postedBy', 'designation', 'eventname', 'mode', 'lastDateToApply', 'description'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length) {
          return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
        }
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
                // we are going to store the data entered by the user and going to create a new object of the fest and storeing teh data 

                const newFest= new Fest({
                    postedBy: user.name,
                    designation: "User",
                    eventname: eventname,
                    mode: mode,
                    dateOfPosted: Date.now(),
                    lastDateToApply: lastDateToApply,
                    description: description,
                    queryContacts: queryContacts,
                    registerationUrl: registerationUrl,
                    ...data
                });
                // so here we had used to store the other data of the fest
                await newFest.save();
                // now we need to add the Fest to the user Endpoints also
                user.festPosted.push(newFest._id); // Push directly to existing array
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
                const newFest= new Fest({
                    postedBy: user.name,
                    designation: "User",
                    eventname: eventname,
                    mode: mode,
                    dateOfPosted: Date.now(),
                    lastDateToApply: lastDateToApply,
                    description: description,
                    queryContacts: queryContacts,
                    registerationUrl: registerationUrl,
                    ...data
                });
                await newFest.save();
                blogger.festsPosted.push(newFest._id);
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
    }
}

const getAllFests = async () => {
    try {
      // Fetch all fests (consider filtering and sorting if needed)
      const allFests = await Fest.find({});
  
      if (!allFests || allFests.length === 0) {
        return res.status(204).json({ message: "No fests found" });
      }
  
      return res.status(200).json({ message: "Successfully fetched all fests", data: allFests });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
const getFestsByLocation = async () => {
    try {
      const { location } = req.body;
  
      // Validate location presence and format (optional)
      if (!location) {
        return res.status(400).json({ message: "Missing location parameter" });
      }
  
      // Fetch fests based on location (consider case-insensitive search)
      const allFests = await Fest.find({ location: { $regex: new RegExp(location, 'i') } }); // Case-insensitive search
  
      if (!allFests || allFests.length === 0) {
        return res.status(204).json({ message: "No fests found in that location" });
      }
  
      return res.status(200).json({ message: "Fests found successfully", data: allFests });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

const getFestsByDate = async () => {
    try {
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
  
      // Fetch fests using aggregation pipeline
      const fests = await Fest.aggregate(pipeline);
  
      if (!fests || fests.length === 0) {
        return res.status(204).json({ message: "No fests found based on your criteria" });
      }
  
      return res.status(200).json({ message: "Fests fetched successfully", data: fests });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
const getUserPreferenceFests = async () => {
    try {
      const { city, entryFee, lastDateToApply, organisedUnder, organiser } = req.body;
  
      let filters = []; // Initialize an empty filters array
  
      // Build filters based on user preferences
      if (city) {
        filters.push({ city });
      }
      if (entryFee) {
        filters.push({ entryFee }); // Assuming entryFee is a boolean field indicating presence of entry fee
      }
      if (lastDateToApply) {
        filters.push({ lastDateToApply });
      }
      if (organisedUnder) {
        filters.push({ organisedUnder });
      }
      if (organiser) {
        filters.push({ organiser });
      }
  
      // Fetch fests based on filters (use $and operator for multiple filters)
      const findFests = await Fest.find({ $and: filters }); // Combine filters using $and operator
  
      if (!findFests || findFests.length === 0) {
        return res.status(204).json({ message: "No fests found matching your preferences" });
      }
  
      return res.status(200).json({ message: "Fests fetched successfully", data: findFests });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

const getFestById = async () => {
    try {
      const { id } = req.body;
  
      // Validate ID presence and format (optional)
      if (!id) {
        return res.status(400).json({ message: "Missing fest ID" });
      }
  
      // Fetch the specific fest using findById
      const festDetail = await Fest.findById(id);
  
      if (!festDetail) {
        return res.status(404).json({ message: "No fest found with that ID" });
      }
  
      return res.status(200).json({ message: "Fest details fetched successfully", data: festDetail });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

module.exports= {PostFest,getAllFests,getFestById,getFestsByDate, getFestsByLocation,getUserPreferenceFests };