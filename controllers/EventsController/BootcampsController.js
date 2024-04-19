// here we are going to define the code of the Bootcamps

const mongoose= require("mongoose");
const User= require('../../models/User');
const Blogger= require("../../models/Blogger");
const  Bootcamp= require("../../models/BootCamp");


const postBootCampController= async ()=>{
    try{
        const {name, mode, lastDateToApply, dateOfEvent,entryFee,description,registerationUrl,organiser,prizes,tutor,queryContacts,...data}= req.body;
        // checking all teh required fields are present or not
        const requiredFields = ['postedBy', 'name', 'mode', 'lastDateToApply', 'description','dateOfEvent','entryFee','registerationUrl','organiser', 'prizes','tutor','queryContacts'];
        const missingFields = requiredFields.filter((field)=> field == req.body[field]);
        if (missingFields.length) {
            return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
        }
        // so we had used to get all the mandatort details here 
            const usertoken= req.cookies.usertoken;
            if (!usertoken) {
                // here the token of the user is not find and the user need to login to post the events
                return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
              }     
              try{
                const decoded=await jwt.verify(usertoken, "vinay");
                const userId= decoded._id;
                // now we are going to find out the details of teh user here extra like is he a valid user or not
                const user= await User.findById(userId);
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
                    name: name,
                    mode:mode,
                    dateOfPosted: Date.now(),
                    lastDateToApply: lastDateToApply,
                    description: description,
                    registerationUrl: registerationUrl,
                    organiser: organiser,
                    tutor: tutor,
                    queryContacts:queryContacts,
                    prizes: prizes,
                    ...data
                  });
                // so here we had used to store the other data of the fest
                await newBootCamp.save();
                // now we need to add the Fest to the user Endpoints also
                user.festPosted.push(newBootCamp._id); // Push directly to existing array
                await user.save();
                return res.json({ message: "BootCamp added successfully!" });
              }  
              catch(err){
                console.log(err);
                return res.status(410).json({"message": "Internal Server error"})
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
      const length=bootcamps.length;
      if (!bootcamps || bootcamps.length === 0) {
        return res.status(204).json({ message: "No bootcamps found" });
      }
  
      return res.status(200).json({ message: "Bootcamps fetched successfully", data: bootcamps });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };


 const getLimitBootcampsController= async(req,res,next)=>{
    try{
      // here we are going to define the route to save the Projects for the users
      const usertoken= req.cookies.usertoken;
      if(!usertoken){
          return res.status(401).json({ message: "Unauthorized: Token not found" });
      }
      try{
          const decoded = jwt.verify(usertoken, "vinay");
          const userId = decoded._id;
          const user = await User.findById(userId);
          if (!user) {
              return res.status(404).json({ message: "User not found" });
          } else if (user.blocked) {
              return res.status(405).json({ message: "Your Account is blocked" });
          }
          // we are going to define teh code to retrive the data from the api
          const bootcamps= await Bootcamp.find({}).limit(10);
          if(!bootcamps&& bootcamps.length==0){
              return res.status(401).json({"message": "No Bootcamps Found"});
          }        
          return res.status(200).json({"message": "Bootcamps Fetched Successfully", data: bootcamps, length: 10}); 
      }
      catch(err){
          return res.status(500).json({"message": "Internal Server Error"})
      }
  }
  catch(err){
      return res.status(500).json({"message": "Internal Server Error"})
  }
} 


const getNextBootcampsController = async(req,res,next)=>{
  try{
      const usertoken= req.cookies.usertoken;
      const {pageNo}= req.params;
      if(!pageNo){
          return res.status(404).json({"message":"Page not is not find"});
      }
      if(!usertoken){
          return res.status(401).json({ message: "Unauthorized: Token not found" });
      }
      try{
          const decoded = jwt.verify(usertoken, "vinay");
          const userId = decoded._id;
          const user = await User.findById(userId);
          if (!user) {
              return res.status(404).json({ message: "User not found" });
          } else if (user.blocked) {
              return res.status(405).json({ message: "Your Account is blocked" });
          }
          const skipLength= (pageNo-1)*10;
          // here we are going to fetch the new no of the newLength of the data 
          const bootcamps=await Bootcamp.find({}).skip(skipLength).limit(10);
          if(!bootcamps && bootcamps.length==0){
              return res.status(401).json({"message": "No Bootcamps Found"});
          }
          return res.status(200).json({"message": "Bootcamos Fetched Successfully", data: bootcamps, length:10}); 
      }
      catch(err){
          return res.status(500).json({"message": "Internal Server Error"})
      }
  }
  catch(err){
      return res.status(500).json({"message": "Internal Server Error"})
  }
}  
  

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
      pipeline.push({$limit: 10});
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

  

const getNextBootcampsByDateController= async(req,res,next)=>{
  // here we are going to get the nextProjects Uploaded By the Date
  try {
    const { dateOfPosting, lastDateToApply, both } = req.body;
    const {pageNo}= req.params;
    if(!pageNo){
        return res.status(404).json({"message": "Internal Server Error"});
    }
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
    pipeline.push({ $skip: skipLength});
    pipeline.push({$limit: 10});
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
}

  // here we are going to define the code of the Bootcamp Controllers
  const userPreferenceBootcampController = async () => {
    try {
      const { postedBy, name,organisedBy,dateOfEvent,level, lastDateToApply, entryFee,hashTags,location,certificationProvided, prerequisite, prizes, mode, techStack } = req.body;
      let pipeline = [
        { $match: {} } // Match all documents by default
      ];
  
      const filters = []; // Initialize an empty filters array
  
      // Build match stage filters based on user preferences
      if (postedBy) {
        filters.push({ postedBy });
      }
      if(name){
        filters.push({name});
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
      if(certificationProvided){
        filters.push({certificationProvided});
      }
      if (mode) {
        filters.push({ mode });
      }
     
      if (dateOfEvent) {
        filters.push({ dateOfEvent: { $lte: dateOfEvent} }); // Match projects with at least one tag from the list
    } 
    if(lastDateToApply){
      filters.push({ lastDateToApply: { $lte: lastDateToApply} }); // Match projects with at least one tag from the list

    }
    if(entryFee){
        filters.push({entryFee: {$lte: entryFee}});
    }
    if(techStack){
      filters.push({techStack: {$in: techStack}})
    }
    if(prerequisite){
      filters.push({prerequisite: {$in: prerequisite}})
    }
    if(hashTags){
      filters.push({hashTags: {$in: hashTags}})
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



const getNextUserPrefBootcampsController= async(req,res,next)=>{
  try{
    const { postedBy, name,organisedBy,dateOfEvent,level, lastDateToApply, entryFee,hashTags,location,certificationProvided, prerequisite, prizes, mode, techStack } = req.body;
    const {pageNo}= req.params;
    let pipeline = [
      { $match: {} } // Match all documents by default
    ];

    const filters = []; // Initialize an empty filters array

    // Build match stage filters based on user preferences
    if (postedBy) {
      filters.push({ postedBy });
    }
    if(name){
      filters.push({name});
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
    if(certificationProvided){
      filters.push({certificationProvided});
    }
    if (mode) {
      filters.push({ mode });
    }
   
    if (dateOfEvent) {
      filters.push({ dateOfEvent: { $lte: dateOfEvent} }); // Match projects with at least one tag from the list
  } 
  if(lastDateToApply){
    filters.push({ lastDateToApply: { $lte: lastDateToApply} }); // Match projects with at least one tag from the list

  }
  if(entryFee){
      filters.push({entryFee: {$lte: entryFee}});
  }
  if(techStack){
    filters.push({techStack: {$in: techStack}})
  }
  if(prerequisite){
    filters.push({prerequisite: {$in: prerequisite}})
  }
  if(hashTags){
    filters.push({hashTags: {$in: hashTags}})
  }
    // Include filters only if there are any user preferences
    if (filters.length > 0) {
      pipeline.push({ $match: { $and: filters } }); // Combine filters using $and operator
    }
      // going to fetch the data based on the filters
      const skipLength= (pageNo-1)*10;
      // Add sorting stage (optional)
      const findBootcamp= await Bootcamp.find({$and: filters}).skip(skipLength).limit(10);
      if(!findBootcamp || findBootcamp.length===0){
          return res.status(204).json({"message": "no Bootcamps Find"})
      }
      return res.status(200).json({
          message: "Bootcamps fetched Succesfully",
          projects: findBootcamp
      });
  }
  catch(err){
      return res.status(500).json({
          "message": "Internal Server Errror"
      })
  }
}


  
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
      const { updatedData}= req.body;

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
  const userBootcamps = user.bootCampPosted || [];
  const bootcampExists = userBootcamps.some((bootcamp) => bootcamp._id.toString() === bootcampId.toString()); // Find project index

    if (!bootcampExists) {
      return res.status(404).json({ message: "Bootcamp not found in your uploaded Bootcamps" });
    }
    let updatedBootcamp = await Bootcamp.findByIdAndUpdate(bootcampId, updatedData, { new: true });
    if (!updatedBootcamp) {
      return res.status(500).json({ message: "Failed to update Boocamp" });
    }
    // 6. Delete Project (Core Functionality)
    return res.status(200).json({ message: "Bootcamp Updated successfully" });
  }
  catch(err){
      return res.status(500).json({"message": "Internal Server Error"});
  }
  }


  const savedBootcampController = async (req, res, next) => {
    try {
        // here we are going to get the data that is saved by the user
        const usertoken = req.cookies.usertoken;
        if (!usertoken) {
            return res.status(401).json({ message: "Unauthorized: Token not found" });
        }
        try {
            // we are going to find out the details of the user
            const decoded = jwt.verify(usertoken, "vinay");
            const userId = decoded._id;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            } else if (user.blocked) {
                return res.status(405).json({ message: "Your Account is blocked" });
            }
  
            // now we are going to get the details of the user's Saved Projects
            const savedBootcamps = user.savedBootcamp;
            const resultBootcamps = [];
            for (const item of savedBootcamps) {
                const bootcamp = await Bootcamp.findById(item._id);
                if (!bootcamp) {
                    continue;
                } else {
                    resultBootcamps.push(bootcamp);
                }
            }
            return res.status(200).json({ message: "Saved Bootcamps fetched successfully", resultBootcamps });
  
        } catch (err) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  const saveBootcampController= async(req,res,next)=>{
    try{
        // here we are going to define the route to save the Projects for the users
        const {bootcampId}= req.body;
        if(!bootcampId){
            return res.status(404).json({"message": "Bootcamp id is missing"})
        }
        const usertoken= req.cookies.usertoken;
        if(!usertoken){
            return res.status(401).json({ message: "Unauthorized: Token not found" });
        }
        try{
            const decoded = jwt.verify(usertoken, "vinay");
            const userId = decoded._id;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            } else if (user.blocked) {
                return res.status(405).json({ message: "Your Account is blocked" });
            }
            // we are going to define the code to save the project in the user profile
            user.savedBootcamp.push(bootcampId);
            await user.save();
            return res.status(200).json({"message": "Bootcamp saved Succesfully", data: user});
        }
        catch(err){
            return res.status(500).json({"message": "Internal Server Error"})
        }
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"})
    }
  }
  
  const getRandomBootcampsContoller= async(req,res,next)=>{
    // here we are going to define the route to get any random No of the Hackathons
    try{
      const usertoken= req.cookies.usertoken;
      if(!usertoken){
          return res.status(401).json({ message: "Unauthorized: Token not found" });
      }
      try{
          const decoded = jwt.verify(usertoken, "vinay");
          const userId = decoded._id;
          const user = await User.findById(userId);
          if (!user) {
              return res.status(404).json({ message: "User not found" });
          } else if (user.blocked) {
              return res.status(405).json({ message: "Your Account is blocked" });
          }
          // here we are going to fetch the new no of the newLength of the data 
          const bootcamps=await Bootcamp.find({}).limit(20);
          if(!bootcamps && bootcamps.length==0){
              return res.status(401).json({"message": "No Bootcamps Found"});
          }
          // so we used to find out the first 20 hackathons and now we need to return the 10 random Hackathons
          for (let i = bootcamps.length - 1; i > 0; i--) {
            // Pick a random index
            const j = Math.floor(Math.random() * (i + 1));
        
            // Swap the current element with the random element
            [bootcamps[i], bootcamps[j]] = [bootcamps[j], bootcamps[i]];
          }
          const firstTenBootcamps= bootcamps.slice(0,10);
        
          return res.status(200).json({"message": "Bootcamps Fetched Successfully", data: firstTenBootcamps, length:10}); 
      }
      catch(err){
          return res.status(500).json({"message": "Internal Server Error"})
      }
  }
  catch(err){
      return res.status(500).json({"message": "Internal Server Error"})
  }
  }
  
  
  const getNextRandomBootcampsContoller= async(req,res,next)=>{
    // here we are going to define the route to get any random No of the Hackathons
    try{
      const {pageNo}=req.params;
      const usertoken= req.cookies.usertoken;
      if(!usertoken){
          return res.status(401).json({ message: "Unauthorized: Token not found" });
      }
      try{
          const decoded = jwt.verify(usertoken, "vinay");
          const userId = decoded._id;
          const user = await User.findById(userId);
          if (!user) {
              return res.status(404).json({ message: "User not found" });
          } else if (user.blocked) {
              return res.status(405).json({ message: "Your Account is blocked" });
          }
          const skipLength= (pageNo-1)*10;
          // here we are going to fetch the new no of the newLength of the data 
          const bootcamps=await Bootcamp.find({}).skip(skipLength).limit(20);
          if(!bootcamps && bootcamps.length==0){
              return res.status(401).json({"message": "No Bootcamps Found"});
          }
          // so we used to find out the first 20 hackathons and now we need to return the 10 random Hackathons
          for (let i = bootcamps.length - 1; i > 0; i--) {
            // Pick a random index
            const j = Math.floor(Math.random() * (i + 1));
        
            // Swap the current element with the random element
            [bootcamps[i], bootcamps[j]] = [bootcamps[j], bootcamps[i]];
          }
          const firstTenBootcamps= bootcamps.slice(0,10);
        
          return res.status(200).json({"message": "Bootcams Fetched Successfully", data: firstTenBootcamps, length:10}); 
      }
      catch(err){
          return res.status(500).json({"message": "Internal Server Error"})
      }
  }
  catch(err){
      return res.status(500).json({"message": "Internal Server Error"})
  }
  }
  
  module.exports= {
    postBootCampController,
    getAllBootcampsController,
    getParticularBootcampController,
    getBootCampsByDateController,
    userPreferenceBootcampController,
    deleteBootCampController,
    
    updateBootCampController,
    getLimitBootcampsController,
    getNextBootcampsController,

    getNextBootcampsByDateController,
    getNextUserPrefBootcampsController,
    savedBootcampController,
    saveBootcampController,

    getRandomBootcampsContoller,
    getNextRandomBootcampsContoller
}