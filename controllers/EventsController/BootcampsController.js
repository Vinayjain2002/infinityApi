// here we are going to define the code of the Bootcamps

const mongoose= require("mongoose");
const User= require('../../models/User');
const Blogger= require("../../models/Blogger");
const  Bootcamp= require("../../models/BootCamp");


const postBootCampController= async ()=>{
    try{
        const {postedBy,name, mode, lastDateToApply, description,registerationUrl,prizes,tutor,queryContacts,...data}= req.body;
        // checking all teh required fields are present or not
        const requiredFields = ['postedBy', 'name', 'mode', 'lastDateToApply', 'description'];
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
                const decoded=await jwt.verify(usertoken, "vinay");
                const userId= decoded._id;
                // now we are going to find out the details of teh user here extra like is he a valid user or not
                const user= await User.findOne({_id: userId});
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
                const newBootCamp = new Bootcamp({
                    postedBy: user.name,
                    name,
                    designation: "User",
                    mode,
                    dateOfPosted: Date.now(),
                    lastDateToApply,
                    description,
                    tutor,
                    queryContacts,
                    registerationUrl,
                    prizes,
                    ...data
                  });
                // so here we had used to store the other data of the fest
                await newBootCamp();
                // now we need to add the Fest to the user Endpoints also
                user.festPosted.push(newBootCamp._id); // Push directly to existing array
                await user.save();
                res.json({ message: "BootCamp added successfully!" });
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
                const newBootCamp= new Bootcamp({
                    postedBy: blogger.name,
                    name: name,
                    designation: "Blogger",
                    mode: mode,
                    dateOfPosted: Date.now(),
                    lastDateToApply: lastDateToApply,
                    description: description,
                    tutor: tutor,
                    queryContacts: queryContacts,
                    registerationUrl: registerationUrl,
                    prizes: prizes
                });
                // so here we had used to store the other data of the fest
                await newBootCamp.save();
                blogger.bootCampPosted.push(newBootCamp._id);
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

const getAllBootcampsController = async () => {
    try {
      // Fetch all bootcamps with optional filtering and sorting
      const bootcamps = await Bootcamp.find({}); // Find all by default
  
      if (!bootcamps || bootcamps.length === 0) {
        return res.status(204).json({ message: "No bootcamps found" });
      }
  
      return res.status(200).json({ message: "Bootcamps fetched successfully", data: bootcamps });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

  const getParticularBootcampController = async () => {
    try {
      const { id } = req.params; // Assuming ID is passed in request params
  
      // Validate ID presence and format (optional)
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid bootcamp ID" });
      }
  
      const bootcamp = await Bootcamp.findById(id);
      if (!bootcamp) {
        return res.status(404).json({ message: "Bootcamp not found" });
      }
  
      return res.status(200).json({ message: "Bootcamp details fetched successfully", data: bootcamp });
    } catch (err) {
      console.error(err);
      // Handle specific errors (optional)
      if (err.name === 'CastError') {
        return res.status(400).json({ message: "Invalid bootcamp ID format" });
      }
      // Fallback for other errors
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  const getBootCampsByDateController = async () => {
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
  
      // Fetch bootcamps using aggregation pipeline
      const bootcamps = await Bootcamp.aggregate(pipeline);
  
      if (!bootcamps || bootcamps.length === 0) {
        return res.status(204).json({ message: "No bootcamps found" });
      }
  
      return res.status(200).json({ message: "Bootcamps fetched successfully", data: bootcamps });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  // here we are going to define the code of the Bootcamp Controllers
  const userPreferenceBootcampController = async () => {
    try {
      const { postedBy, organisedBy, level, location, prizes, mode, techStackRequired } = req.body;
  
      let pipeline = [
        { $match: {} } // Match all documents by default
      ];
  
      const filters = []; // Initialize an empty filters array
  
      // Build match stage filters based on user preferences
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
        filters.push({ location });
      }
      if (prizes) {
        // Assuming prizes is a boolean field indicating presence of prizes
        filters.push({ prizes });
      }
      if (mode) {
        filters.push({ mode });
      }
      if (techStackRequired) {
        filters.push({ techStackRequired });
      }
  
      // Include filters only if there are any user preferences
      if (filters.length > 0) {
        pipeline.push({ $match: { $and: filters } }); // Combine filters using $and operator
      }
  
      // Add sorting stage (optional)
      pipeline.push({
        $sort: {
          lastDateToApply: 1, // Sort by application deadline ascending
          dateOfPosting: -1 // Sort by posting date descending (optional)
        }
      });
  
      // Fetch bootcamps using aggregation pipeline
      const bootcamps = await Bootcamp.aggregate(pipeline);
  
      if (!bootcamps || bootcamps.length === 0) {
        return res.status(204).json({ message: "No bootcamps found matching your preferences" });
      }
  
      return res.status(200).json({ message: "Bootcamps fetched successfully", data: bootcamps });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  const deleteBootCampController= async(req,res,next)=>{
    try{
      // going to delete the Project Details
      const {bootcampId}= req.params; // send the data in the form of the Bootcamp id
      if(!bootcampId){
        return res.status(401).json({"message": "Bootcamp Id is missing"})
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
  const userBootcamps = user.bootCampPosted || [];
  const bootcampIndex = userBootcamps.findIndex((bootcamp) => bootcamp.toString() === bootcampId); // Find project index

    if (bootcampIndex === -1) {
      return res.status(404).json({ message: "Bootcamp not found in your BootCamps" });
    }

    // 6. Delete Project (Core Functionality)
    const deletedBootcamp = await Bootcamp.findByIdAndDelete(bootcampId); // Assuming `YourModel` represents the project collection

    if (!deletedBootcamp) {
      return res.status(500).json({ message: "Failed to delete Bootcamp" });
    }

    // 7. Update User's Projects (Efficient Update with Pull Operator)
    const updatedUser = await User.findByIdAndUpdate(userId, { $pull: { bootCampPosted: bootcampId} }, { new: true }); // Efficient update with `pull`
    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to remove Bootcamp from your posted Bootcamps" });
    }
    return res.status(200).json({ message: "Bootcamp deleted successfully" });
  }
  catch(err){
      return res.status(500).json({"message": "Internal Server Error"});
  }
  }

  const updateBootCampController = async(req,res,next)=>{
    try{
      // going to delete the Project Details
      const {bootcampId}= req.params;
      if(!bootcampId){
          return res.status(401).json({"message": "Bootcamp Id is missing"})
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
  const userBootcamps = user.bootCampPosted || [];
  const bootcampIndex = userBootcamps.findIndex((bootcamp) => bootcamp.toString() === bootcampId); // Find project index

    if (bootcampIndex === -1) {
      return res.status(404).json({ message: "Bootcamp not found in your uploaded Bootcamps" });
    }

    // 6. Delete Project (Core Functionality)
    const deletedBootcamp = await Bootcamp.findByIdAndDelete(bootcampId); // Assuming `YourModel` represents the project collection

    if (!deletedBootcamp) {
      return res.status(500).json({ message: "Failed to delete Bootcamp" });
    }

    // 7. Update User's Projects (Efficient Update with Pull Operator)
    const updatedUser = await User.findByIdAndUpdate(userId, { $pull: {bootCampPosted: bootcampId } }, { new: true }); // Efficient update with `pull`
    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to remove bootcamp from your Bootcamps" });
    }
    return res.status(200).json({ message: "Bootcamp deleted successfully" });
  }
  catch(err){
      return res.status(500).json({"message": "Internal Server Error"});
  }
  }


  module.exports= {updateBootCampController,
    deleteBootCampController,
    userPreferenceBootcampController,
    getBootCampsByDateController,
    getParticularBootcampController
    ,getAllBootcampsController,
    postBootCampController};