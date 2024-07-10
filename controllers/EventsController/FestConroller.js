// here we are ggoin to define the endpoint to store teh data of the events and want to retrive the data o the different conditions
const mongoose = require("mongoose");
const Fest= require("../../models/Fest");
const User = require('../../models/User');
const Blogger= require("../../models/Blogger");
const dotenv= require('dotenv');
dotenv.config();

const PostFestController= async()=>{
    try{
        const {eventname, mode, lastDateToApply, description,queryContacts, registerationUrl,city,venue, ...data}= req.body;
        const EventPoster="";
        const requiredFields = ['designation', 'eventname', 'mode', 'lastDateToApply', 'description', 'queryContacts', 'registerationUrl','city','venue'];
        const missingFields = requiredFields.filter((field)=>field== req.body[field]);
        if (missingFields.length) {
          return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
        }
        // so we had used to get all the mandatort details here 
            const userToken= req.params;
            if (!userToken) {
                // here the token of the user is not find and the user need to login to post the events
                return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
              }     
              try{
                const decoded= jwt.verify(userToken, process.env.USER_TOKEN);
                const userId= decoded._id;
                // now we are going to find out the details of teh user here extra like is he a valid user or not
                const user=await User.findById(userId);
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
                    eventname: eventname,
                    mode: mode,
                    dateOfPosted: Date.now(),
                    lastDateToApply: lastDateToApply,
                    description: description,
                    queryContacts: queryContacts,
                    registerationUrl: registerationUrl,
                    city: city,
                    venue: venue,
                    ...data
                });
                // so here we had used to store the other data of the fest
                await newFest.save();
                // now we need to add the Fest to the user Endpoints also
                user.festPosted.push(newFest._id); // Push directly to existing array
                await user.save();
                return res.json({ message: "Fest added successfully!" });
              }  
              catch(err){
                console.log(err);
                return res.status(410).json({"message": "Internal Server error"})
              }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({"message": "Internal Server Error"})
    }
}

const GetAllFestsController = async () => {
    try {
      const pageNo= req.params?.pageNo ?? 1;
      const skipLength= (pageNo-1)*10;
      // Fetch all fests (consider filtering and sorting if needed)
      const allFests = await Fest.find({}).skip(skipLength).limit(10);
      const length= allFests.length;
      if (!allFests || allFests.length === 0) {
        return res.status(404).json({ message: "No fests found" });
      }
  
      return res.status(200).json({ message: "Successfully fetched all fests", data: allFests,length: length});
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
const GetFestsByLocationController = async () => {
    try {
      const { location } = req.body;
      const pageNo= req.params?.pageNo ?? 1;
      const skipLength= (pageNo-1)*10;
      // Validate location presence and format (optional)
      if (!location) {
        return res.status(400).json({ message: "Missing location parameter" });
      }
  
      // Fetch fests based on location (consider case-insensitive search)
      const allFests = await Fest.find({ location: { $regex: new RegExp(location, 'i') } }).skip(skipLength).limit(10); // Case-insensitive search
      if (!allFests || allFests.length === 0) {
        return res.status(204).json({ message: "No fests found in that location" });
      }
      return res.status(200).json({ message: "Fests found successfully", data: allFests });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };



  const GetParticularFestController = async (req,res,next) => {
    try {
      const { festId } = req.params; // Assuming ID is passed in request params
  
      // Validate ID presence and format (optional)
      if (!festId || !mongoose.Types.ObjectId.isValid(festId)) {
        return res.status(400).json({ message: "Invalid Fest ID" });
      }
  
      const fest = await Fest.findById(festId);
      if (!fest) {
        return res.status(404).json({ message: "Fest not found" });
      }
  
      return res.status(200).json({ message: "Fest details fetched successfully", data: fest });
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
  

const GetFestsByDateController = async () => {
    try {
      const { dateOfPosting, lastDateToApply, both } = req.body;
      const pageNo= req.params?.pageNo ?? 1;
      const skipLength= (pageNo-1)*10;
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
  
      pipeline.push({ $match: {} });
      pipeline.push({$skip: skipLength}); // Match all documents by default
      pipeline.push({$limit: 10});
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


const GetUserPreferenceFestsController = async () => {
    try {
      const {postedBy,eventname,mode ,city, entryFee, lastDateToApply, hashtags,organisedUnder, organiser } = req.body;
      const {pageNo}= req.params?.pageNo ?? 1;
      let filters = []; // Initialize an empty filters array
  
      // Build filters based on user preferences
      if(postedBy){
        filters.push({postedBy});
      }
      if(eventname){
        filters.push({eventname});
      }
      if(mode){
        filters.push({mode});
      }
      if (city) {
        filters.push({ city });
      }
      if (organisedUnder) {
        filters.push({ organisedUnder });
      }
      if (organiser) {
        filters.push({ organiser });
      }

      if(entryFee){
        filters.push({ entryFee: { $lte: entryFee} }); // Match projects with at least one tag from the list
      }
      if(lastDateToApply){
        filters.push({ lastDateToApply: { $lte: lastDateToApply} }); // Match projects with at least one tag from the list
      }
      if(hashtags){
        filters.push({hashtags: {$in: hashtags} })
      }
      const skipLength= (pageNo-1)*10;
      // Fetch fests based on filters (use $and operator for multiple filters)
      const findFests = await Fest.find({ $and: filters }).skip(skipLength).limit(10); // Combine filters using $and operator
  
      if (!findFests || findFests.length == 0) {
        return res.status(204).json({ message: "No fests found matching your preferences" });
      }
  
      return res.status(200).json({ message: "Fests fetched successfully", data: findFests });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };


  
  const DeleteFestController= async()=>{
    try{
      // going to delete the Project Details
      const {festId, userToken}= req.params; // send the data in the form of the Bootcamp id
      if(!festId){
        return res.status(401).json({"message": "Fest Id is missing"})
      }
      // we are going to change the Project Details
      if(!userToken){
          return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access 
      }
      const decoded= jwt.verify(userToken, process.env.USER_TOKEN);
      const userId= decoded._id;
              // now we are going to find out the details of teh user here extra like is he a valid user or not
      const user=await User.findById(userId);
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
  const userFests = user.festPosted || [];
  const festIndex = userFests.findIndex((fest) => fest.toString() === festId); // Find project index

    if (festIndex === -1) {
      return res.status(404).json({ message: "Fest not found in your Fests" });
    }

    // 6. Delete Project (Core Functionality)
    const deletedFest = await Fest.findByIdAndDelete(festId); // Assuming `YourModel` represents the project collection

    if (!deletedFest) {
      return res.status(500).json({ message: "Failed to delete Fest" });
    }

    // 7. Update User's Projects (Efficient Update with Pull Operator)
    const updatedUser = await User.findByIdAndUpdate(userId, { $pull: { festPosted: festId} }, { new: true }); // Efficient update with `pull`
    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to remove fest from your posted Fests" });
    }
    return res.status(200).json({ message: "Fest deleted successfully" });
  }
  catch(err){
      return res.status(500).json({"message": "Internal Server Error"});
  }
  }

  const UpdateFestController= async(req,res,next)=>{
    try{
      // going to delete the Project Details
      const {festId, userToken}= req.params;
      const {updatedFestData}= req.body;

      if(!festId){
          return res.status(401).json({"message": "Fest Id is missing"})
      }
      // we are going to change the Project Details
      if(!userToken){
          return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access 
      }
      const decoded= jwt.verify(userToken,process.env.USER_TOKEN);
      const userId= decoded._id;
              // now we are going to find out the details of teh user here extra like is he a valid user or not
      const user=await User.findById(userId);
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
  const userFests = user.festPosted || [];
  const festExists = userFests.findIndex((fest) => fest.toString() === festId); // Find project index

  if (!festExists) {
    return res.status(404).json({ message: "Fest not found in your uploaded Fest" });
  }
  let updatedFest = await Fest.findByIdAndUpdate(festId, updatedFestData, { new: true });
  if (!updatedFest) {
    return res.status(500).json({ message: "Failed to update Fest" });
  }
    return res.status(200).json({ message: "Fest deleted successfully" });
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"});
    }
  }


  const SavedFestController = async (req, res, next) => {
    try {
        // here we are going to get the data that is saved by the user
        const userToken = req.params;
        if (!userToken) {
            return res.status(401).json({ message: "Unauthorized: Token not found" });
        }
        try {
            // we are going to find out the details of the user
            const decoded = jwt.verify(userToken, process.env.USER_TOKEN);
            const userId = decoded._id;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            } else if (user.blocked) {
                return res.status(405).json({ message: "Your Account is blocked" });
            }
  
            // now we are going to get the details of the user's Saved Projects
            const savedFest = user.savedFest;
            const resultFest = [];
            for (const item of savedFest) {
                const fest = await Fest.findById(item._id);
                if (!fest) {
                    continue;
                } else {
                    resultFest.push(fest);
                }
            }
            return res.status(200).json({ message: "Saved Fest fetched successfully", resultFest});
  
        } catch (err) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  const SaveFestController= async(req,res,next)=>{
    try{
        // here we are going to define the route to save the Projects for the users
        const {festId, userToken}= req.params;
        if(!festId){
            return res.status(404).json({"message": "Fest id is missing"})
        }
        if(!userToken){
            return res.status(401).json({ message: "Unauthorized: Token not found" });
        }
        try{
            const decoded = jwt.verify(userToken, process.env.USER_TOKEN);
            const userId = decoded._id;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            } else if (user.blocked) {
                return res.status(405).json({ message: "Your Account is blocked" });
            }
            // we are going to define the code to save the project in the user profile
            user.savedFest.push(festId);
            await user.save();
            return res.status(200).json({"message": "Fesr saved Succesfully", data: user});
        }
        catch(err){
            return res.status(500).json({"message": "Internal Server Error"})
        }
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"})
    }
  }
  
const GetRandomFestsContoller= async(req,res,next)=>{
    // here we are going to define the route to get any random No of the Hackathons
    try{
      const {pageNo}= req.params?.pageNo ?? 1;
          const skipLength= (pageNo-1)*20;
          // here we are going to fetch the new no of the newLength of the data 
          const fest=await Fest.find({}).skip(skipLength).limit(20);
          if(!fest || fest.length==0){
              return res.status(401).json({"message": "No Fest Found"});
          }
          // so we used to find out the first 20 hackathons and now we need to return the 10 random Hackathons
          for (let i = fest.length - 1; i > 0; i--) {
            // Pick a random index
            const j = Math.floor(Math.random() * (i + 1));
        
            // Swap the current element with the random element
            [fest[i], fest[j]] = [fest[j], fest[i]];
          }
          const firstTenFest= fest.slice(0,10);
        
          return res.status(200).json({"message": "Fests Fetched Successfully", data: firstTenFest, length:10}); 
        }
      catch(err){
          return res.status(500).json({"message": "Internal Server Error"})
      }
}
  
  

module.exports= {
  PostFestController,
  GetAllFestsController,
  GetUserPreferenceFestsController,
  DeleteFestController,
  UpdateFestController,
  GetParticularFestController,
  SaveFestController,
  SavedFestController
  ,GetFestsByDateController,
   GetFestsByLocationController,
    GetRandomFestsContoller
// need to be defined
  };