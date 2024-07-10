const mongoose= require("mongoose");
const User= require('../../models/User');
const Blogger= require("../../models/Blogger");
const Hackathon= require('../../models/Hackathon');
const dotenv= require("dotenv")
dotenv.config();

const PostHackathonController= async ()=>{
    try{
        const {name, mode, lastDateToApply, level,description, ideaSubmissionDate,maxTeamMembers,registerationUrl,problemStatement,prizes,organisedBy,...data}= req.body;
        const EventPoster="";
        //we are going to check is the all the required Fields are present or not
        const requiredFields= ['name','mode','lastDateToApply','level','description','ideaSubmissionDate','maxTeamMembers','registerationUrl','problemStatement','prizes','organisedBy'];
        const missingFields= requiredFields.filter((field)=>field==req.body[field]);
        if(missingFields.length){
          return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` })
      }
        // so we had used to get all the mandatort details here 
            const userToken= req.params;
            if (!userToken) {
                // here the token of the user is not find and the user need to login to post the events
                return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
              }     
              try{
                const decoded=await jwt.verify(userToken, process.env.USER_TOKEN);
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

                const newHackathon= new Hackathon({
                    postedBy: user.username,
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
                    organisedBy: organisedBy,
                    level: level,
                    ...data
                });
                // so here we had used to store the other data of the fest
                await newHackathon.save();
                // now we need to add the Fest to the user Endpoints also
                user.hackathonsPosted.push(newHackathon._id); // Push directly to existing array
                await user.save();
                return res.status(200).json({ message: "Fest added successfully!" });
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


const GetAllHackathonsController = async () => {
    try {
      const pageNo= req.params?.pageNo ?? 1;
      const skipLength= (pageNo-1)*10;
      // Fetch all hackathons (consider filtering and sorting if needed)
      const hackathons = await Hackathon.find({}).skip(skipLength).limit(10);
      if (!hackathons || hackathons.length == 0) {
        return res.status(404).json({ message: "No hackathons found" });
      }
  
      return res.status(200).json({ message: "Hackathons fetched successfully", "data": hackathons, "length": 10});
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };


const GetParticularHackathonController = async () => {
    try {
      const { hackathonId } = req.params;
      // Validate ID presence and format (optional)
      if (!hackathonId) {
        return res.status(400).json({ message: "Missing hackathon ID" });
      }
  
      // Efficiently fetch hackathon by ID using findById
      const hackathon = await Hackathon.findById(hackathonId);
  
      if (!hackathon) {
        return res.status(404).json({ message: "No hackathon found with that ID" });
      }
  
      return res.status(200).json({ message: "Hackathon details fetched successfully", "data": hackathon });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
const GetHackathonsByDateController = async () => {
    try {
      const pageNo= req.params?.pageNo ?? 1;
      const { dateOfPosting, lastDateToApply, both } = req.body;
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
      pipeline.push({$skip: skipLength});
       // Match all documents by default
       pipeline.push({$limit: 10});
      pipeline.push({ $sort: sortCriteria });
  
      // Fetch hackathons using aggregation pipeline
      const hackathons = await Hackathon.aggregate(pipeline);
  
      if (!hackathons || hackathons.length == 0) {
        return res.status(204).json({ message: "No hackathons found based on your criteria" });
      }
  
      return res.status(200).json({ message: "Hackathons fetched successfully", data: hackathons, length: 10});
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

const GetUserPrefHackathonsController= async(req,res,next)=>{
  try{
    const pageNo= req.params?.pageNo ?? 1;
    const skipLength= (pageNo-1)*10;
    const {name, entryFee,organisedBy, level, location, prizes, mode, techStackRequired,maxTeamMembers, organisationType  } = req.body;
  
    let filters = []; // Initialize an empty filters array

    // Build filters based on user preferences (include checks for null values)
    if (name) {
      filters.push({name});
    }
    if (organisedBy) {
      filters.push({ organisedBy });
    }
    if (level) {
      filters.push({ level });
    }
    if(prizes){
      filters.push({prizes});
    }
    if (location) {
      filters.push({ location }); // Assuming location is a string field
    }
    if (mode) {
      filters.push({ mode });
    }
    if(organisationType){
      filters.push({organisationType});
    }

    if (techStackRequired && techStackRequired.length > 0) {
      filters.push({ tags: { $in: techStackRequired } }); // Match projects with at least one tag from the list
  }
  if(entryFee){
    filters.push({entryFee: {$lt: entryFee}})
  }
  if(maxTeamMembers){
    filters.push({maxTeamMembers: {$lt: maxTeamMembers}});
  }
      // going to fetch the data based on the filters
      const findHackathons= await Hackathon.find({$and: filters}).skip(skipLength).limit(10);
      if(!findHackathons || findHackathons.length==0){
          return res.status(204).json({"message": "no Hackathons Find"})
      }
      return res.status(200).json({
          "message": "Hackathons fetched Succesfully",
          "projects": findHackathons
      });
  }
  catch(err){
      return res.status(500).json({
          "message": "Internal Server Errror"
      })
  }
}

  const DeleteHackathonController=async(req,res,next)=>{
    try{
      // going to delete the Project Details
      const {hackathonId, userToken}= req.params; // send the data in the form of the Bootcamp id
      if(!hackathonId){
        return res.status(401).json({"message": "Hackathon Id is missing"})
      }
      // we are going to change the Project Details
      if(!userToken){
          return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access 
      }
      const decoded= jwt.verify(userToken, process.env.USER_TOKEN);
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
      return res.status(400).json({ message: "Failed to remove Hackathon from your posted Hackathon" });
    }
    return res.status(200).json({ message: "Hackathon deleted successfully" });
  }
  catch(err){
      return res.status(500).json({"message": "Internal Server Error"});
  }
}

  const UpdateHacakathonController= async(req,res,next)=>{
    try{
      // going to delete the Project Details
      const {hackathonId, userToken}= req.params;
      const { updatedData}= req.body;
      if(!hackathonId){
          return res.status(401).json({"message": "Hackathon Id is missing"})
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
  const userHackathons = user.hackathonsPosted || [];
  const hackathonExists = userHackathons.some((hackathon) =>
  hackathon._id.toString() === hackathonId.toString()
);
if (!hackathonExists) {
  return res.status(404).json({ message: "Hackathon not found in your posted Hackathon" });
}
let updatedHackathon = await Hackathon.findByIdAndUpdate(hackathonId, updatedData, { new: true });
if (!updatedHackathon) {
  return res.status(500).json({ message: "Failed to update Hackathon" });
}
return res.status(200).json({ message: "Hackathon updated successfully", updatedProject: updatedProject });
  }
  catch(err){
      return res.status(500).json({"message": "Internal Server Error"});
  }
  }


const SavedHackathonsController = async (req, res, next) => {
  try {
      // here we are going to get the data that is saved by the user
      const userToken = req.params;
      if (!userToken) {
          return res.status(401).json({ message: "Unauthorized: Token not found" });
      }
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
          const savedHackathons = user.savedHackathons;
          const resultHackathons = [];
          for (const item of savedHackathons) {
              const hackathon = await Hackathon.findById(item._id);
              if (!hackathon) {
                  continue;
              } else {
                  resultHackathons.push(hackathon);
              }
          }
          return res.status(200).json({ message: "Saved Hackathons fetched successfully", resultHackathons });
  } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
  }
};

const SaveHackathonController= async(req,res,next)=>{
  try{
      // here we are going to define the route to save the Projects for the users
      const {hackathonId, userToken}= req.params;
      if(!hackathonId){
          return res.status(404).json({"message": "Hackathon id is missing"})
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
          user.savedHackathons.push(hackathonId);
          await user.save();
          return res.status(200).json({"message": "Hackathon saved Succesfully", data: user});
      }
      catch(err){
          return res.status(500).json({"message": "Internal Server Error"})
      }
  }
  catch(err){
      return res.status(500).json({"message": "Internal Server Error"})
  }
}


const GetRandomHackathonsContoller= async(req,res,next)=>{
  // here we are going to define the route to get any random No of the Hackathons
  try{
    const pageNo=req.params?.pageNo ?? 1;
    const userToken= req.params;
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
        const skipLength= (pageNo-1)*10;
        // here we are going to fetch the new no of the newLength of the data 
        const hackathons=await Hackathon.find({}).skip(skipLength).limit(20);
        if(!hackathons || hackathons.length==0){
            return res.status(401).json({"message": "No Hackathons Found"});
        }
        // so we used to find out the first 20 hackathons and now we need to return the 10 random Hackathons
        for (let i = hackathons.length - 1; i > 0; i--) {
          // Pick a random index
          const j = Math.floor(Math.random() * (i + 1));
      
          // Swap the current element with the random element
          [hackathons[i], hackathons[j]] = [hackathons[j], hackathons[i]];
        }
        const firstTenHackathons= hackathons.slice(0,10);
      
        return res.status(200).json({"message": "Hackathons Fetched Successfully", "data": firstTenHackathons, "length":10}); 
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
  PostHackathonController,
   GetAllHackathonsController,
   GetParticularHackathonController,
   GetHackathonsByDateController,
   DeleteHackathonController,

   UpdateHacakathonController,
   SavedHackathonsController,
   SaveHackathonController,
   GetUserPrefHackathonsController,
   GetRandomHackathonsContoller,
  };
