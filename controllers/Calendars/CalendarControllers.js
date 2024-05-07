// here we are going to define the controllers of the Calendars

const mongoose= require("mongoose")
const Calendar= require('../../models/Calender')
const User= require("../../models/User")
const dotenv= require("dotenv")
const jwt= require("jsonwebtoken")
dotenv.config();

const PostEventsController=async (req,res,next)=>{
    try{
        const usertoken = req.cookies.usertoken;
        const {name, startDate, endDate,category, summary,...data}= req.body;
        if (!usertoken) {
          return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
        }
        // Validate token using JWT verif        
        const decoded = jwt.verify(usertoken, process.env.USER_TOKEN); // Replace "vinay" with your actual secret key
        const userId = decoded._id;

          // Fetch user data using findOne()
          const user = await User.findById(userId);
          if (!user) {
            return res.status(404).json({ message: "User not found" }); // Use 404 for not found
          }
          else if(user.blocked){
            return res.status(405).json({
              "message": "Your Account is blocked"
            })
          }
        // here we are going to define the date controllers
        if(!userId && !name && !startDate && !endDate && !category && !summary){
          return res.status(401).json({"message": "All Entry are not found"})
      }
      const calendar= new Calendar({
            userId: userId,
            name: name,
            startDate: startDate,
            endDate: endDate,
            category: category,
            summary: summary,
            ...data
        });
        await calendar.save();
        return res.status(200).json({
            "message": "Event Added to the Calendar",
            data: calendar
        });
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"})
    }
}

const GetAllEventsController= async ()=>{
    try{
      const pageNo= req.params?.pageNo ?? 1;
      const skipLength= (pageNo-1)*10;
        const usertoken = req.cookies.usertoken;
        if (!usertoken) {
          return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
        }
    
        // Validate token using JWT verify
          const decoded = jwt.verify(usertoken, process.env.USER_TOKEN); // Replace "vinay" with your actual secret key
          const userId = decoded._id;
    
          // Fetch user data using findOne()
          const user = await User.findById(userId);
          if (!user) {
            return res.status(404).json({ message: "User not found" }); // Use 404 for not found
          }
          else if(user.blocked){
            return res.status(405).json({
              "message": "Your Account is blocked"
            })
          }

        // we are going to fetch all the events of the user
        const events=await Calendar.find({userId: userId}).skip(skipLength).limit(10);
        if(!events && events.length){
            return res.status(404).json({"message": "No events are found"})
        }
        return res.status(200).json({"message": "All the events fetched Successfully", data: events})

    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"})
    }
}

const GetEventsByDateController=async ()=>{
    try{
        const usertoken = req.cookies.usertoken;
        const {date}= req.body;
        if (!usertoken) {
          return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
        }
    
        // Validate token using JWT verify
          const decoded = jwt.verify(usertoken,process.env.USER_TOKEN); // Replace "vinay" with your actual secret key
          const userId = decoded._id;
    
          // Fetch user data using findOne()
          const user = await User.findOneById(userId);
          if (!user) {
            return res.status(404).json({ message: "User not found" }); // Use 404 for not found
          }
          else if(user.blocked){
            return res.status(405).json({
              "message": "Your Account is blocked"
            })
          }
        // here we are going to find out all the Events in the calendar on the particular date
        const events=await Calendar.find({userId: userId, date: date});
          if(!events && events.length==0 ){
            return res.status(404).json({"message": "Some Error while fetching all the Events"})
          }
          return res.status(200).json({"message": "All the evetns fetched Succesfully"})
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"})
    }
}

const DeleteEventController= async ()=>{
    try{
        const usertoken = req.cookies.usertoken;
        const {eventId}= req.params;
        if (!usertoken) {
          return res.status(401).json({ "message": "Unauthorized: Token not found" }); // Use 401 for unauthorized access
        }
        if(eventId){
          return res.status(401).json({"message": "Event Id is not defined"})
        }
        // Validate token using JWT verify
          const decoded = jwt.verify(usertoken, process.env.USER_TOKEN); // Replace "vinay" with your actual secret key
          const userId = decoded._id;
    
          // Fetch user data using findOne()
          const user = await User.findById(userId);
          if (!user) {
            return res.status(404).json({ message: "User not found" }); // Use 404 for not found
          }
          else if(user.blocked){
            return res.status(405).json({
              "message": "Your Account is blocked"
            })
          }
        // here we are going to find out all the Events in the calendar on the particular date
        const reault=await Calendar.findOneAndDelete({_id:eventId, userId: userId });
        if(!result){
            return res.status(500).json({"message": "internal Server Error"});
        }
        return res.status(200).json({"message": "Event Removed Successfully"})
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"})
    }
}

const GetAllEventInAmonthController= async()=>{
    try{
        const pageNo= req.params?.pageNo ??1;
        const skipLength= (pageNo-1)*10;
        const usertoken = req.cookies.usertoken;
        const {startingDate, endingDate}= req.body;
        if (!usertoken) {
          return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
        }
    
        // Validate token using JWT verify
          const decoded = jwt.verify(usertoken,process.env.USER_TOKEN); // Replace "vinay" with your actual secret key
          const userId = decoded._id;
    
          // Fetch user data using findOne()
          const user = await User.findById(userId);
          if (!user) {
            return res.status(404).json({ message: "User not found" }); // Use 404 for not found
          }
          else if(user.blocked){
            return res.status(405).json({
              "message": "Your Account is blocked"
            })
          }
        // here we are going to find out all the Events in the calendar on the particular date
        const events = await Calendar.find({
            userId: userID,
            // Assuming startDate and endDate are already defined as Date objects
            $and: [
              { startDate: { $lte: endingDate } },  // Find events where startDate is less than or equal to endingDate
              { endDate: { $gte: startingDate } }   // Find events where endDate is greater than or equal to startingDate
            ]
          }).skip(skipLength).limit(10);          
          if(!events && events.length==0 ){
            return res.status(404).json({"message": "Some Error while fetching all the Events"})
          }
          return res.status(200).json({"message": "All the events fetched Succesfully", data: events})
    }
    catch(err){
        return res.status(500).json({"message":"Internal Server Error"})
    }
}

module.exports= {PostEventsController, 
    GetAllEventsController,
     GetEventsByDateController,
      DeleteEventController,
     GetAllEventInAmonthController};
