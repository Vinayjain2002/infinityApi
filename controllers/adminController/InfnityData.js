const mongoose= require("mongoose");
const express= require("express");
const router= express.Router();
const Admin = require('../../models/admin');
const User= require("../../models/User");
const Blogger= require("../../models/Blogger");
const Blogs= require("../../models/Blogs");
const Bootcamps= require("../../models/BootCamp");
const Blogger = require("../../models/Blogger")
const Fests= require("../../models/Fest");
const Hackathon=require("../../models/postHackathon");
const Video= require('../../models/Videos');

const noOfUsersController= async (req,res,next)=>{
    try {
      const pageNo= req.params?.pageNo ?? 1;
        // Check for token presence
        const adminDetails=await AuthenticateAdmin(req);
        const {message, status}= adminDetails;
        if(status==200){
            const skipLength= (pageNo-1)*10;
            // now we are going to find the details of the users
            const noOfUsers= await User.find({}).count();
            const userDetails= await User.find({},{
              username: 1,
              bio: 1,
              profilePicture: 1
            }).skip(skipLength).limit(10);
            if(!noOfUsers){
                return res.status(404).json({"message": "UNable to find out the no of the Users"});
            }
            else{module.exports= router.get()

                return res.status(200).json({"message": "Users Data Fetched Succesfully","users": noOfUsers, "details": userDetails});
            }
        }
        else if(status!=200){
            //we are going to send the message to the admin
            return res.status(status).json({"message": message});
        }
      } catch (err) {
        console.error("Unhandled error in refetchUserController:", err);
        return res.status(500).json({ message: "Internal Server Error" }); // Generic error for unexpected issues at top level
      }
}

const RegisteredUserInMonthController = async (req, res, next) => {
  // here we are gonna to find the details of the user who regsitered in a particular month
    try{
      const { month } = req.body;

      const pageNo= req.params?.pageNo ?? 1;
      const skipLength= (pageNo-1)*10;
        const adminDetails=await AuthenticateAdmin(req);
        const {message, status}= adminDetails;
        if(status==200){
            const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/; // YYYY-MM format
            if (!month || !monthRegex.test(month)) {
                return res.status(400).json({ message: "Invalid month format. Use YYYY-MM (e.g., 2024-04)" });
            }
            // Efficient Month-Based Filtering with MongoDB Operators
            const startDate = new Date(month + '-01T00:00:00.000Z'); // Start of the month
            const endDate = new Date(month + '-31T23:59:59.999Z'); // End of the month (adjusted for days)
            const usersInMonth = await User.find({
                createdAt: { $gte: startDate, $lt: endDate } // Filter by createdAt within month range
            }).countDocuments();
            
            const userDetails= await User.find({
              createdAt: {$gte: startDate, $lt: endDate}
            }).skip(skipLength).limit(10);// Use .countDocuments() for efficiency
            if(!usersInMonth && !userDetails){
              if (err) {
                console.error("Error fetching users:", err);
                return res.status(500).json({ message: "Error retrieving user count" });
            } else {
                // No users found in the month range
                return res.status(200).json({ message: `No users registered in ${month}` });
            }
            }
            res.status(200).json({
                message: `Number of users registered in ${month}: ${usersInMonth}`,
                userDetails: userDetails
            });
        }
        else{
            //we are going to send the message to the admin
            return res.status(status).json({"message": message});
        }  
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"})
    }
  };


  const registeredUserInMonthRangeController = async (req, res, next) => {
    try {
      const adminDetails = await AuthenticateAdmin(req);
      const { message, status } = adminDetails;
  
      if (status === 200) {
        const { startMonth, endMonth, startYear, endYear } = req.body;
        if(!startMonth && !endMonth && !startYear && !endYear){
          return res.status(400).json({"message": "Please provide the all the dates"});
        }
        // Initialize variables
        let totalCount = 0;
        const countDict = {};
  
        // Validate Start Date
        const startDate = new Date(startYear, startMonth - 1, 1);
        if (!isValidDate(startDate)) {
          return res.status(400).json({ message: "Invalid Date format" });
        }
        // Loop through months
        for (let currentMonth = startMonth; currentMonth <= endMonth-1; currentMonth++) {
          // Calculate end date for the month (0 represents the last day of previous month)
          const endDate = new Date(endYear, currentMonth, 0);
          try {
            // Fetch user count for the month
            const monthCount = await registeredUserInRange(User, startDate, endDate);
            countDict[currentMonth] = monthCount;
            totalCount += monthCount;
          } catch (error) {
            console.error(`Error fetching user count for month ${currentMonth}:`, error);
          }
        }
  
        return res.status(200).json({
          message: "No of the Users fetched Successfully",
          data: countDict,
          totalCount: totalCount,
        });
      } else {
        return res.status(status).json({ message }); // Use message from adminDetails
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
const RegisteredUserInYearController = async (req, res, next) => {
    try {
      const adminDetails = await AuthenticateAdmin(req);
      const { message, status } = adminDetails;
  
      if (status === 200) {
        const { startYear, startMonth, endMonth, endYear } = req.body;
  
        // Initialize variables
        let totalCount = 0;
        let countDict = {};
  
        // Loop through years
        for (let currentYear = startYear; currentYear <= endYear; currentYear++) {
          // Calculate start and end dates for the year
          const startDate = new Date(currentYear, startMonth - 1, 1); // Adjust month (0-based)
          const endDate = new Date(currentYear, endMonth, 0);
  
          try {
            // Fetch user count for the year
            const yearCount = await registeredUserInRange(User, startDate, endDate);
            countDict[currentYear] = yearCount;
            totalCount += yearCount;
          } catch (error) {
            console.error(`Error fetching user count for ${currentYear}:`, error);
            // Handle error gracefully (e.g., skip year or return partial data)
          }
        }
  
        return res.status(200).json({
          message: "No of the Users fetched Successfully",
          data: countDict,
          totalCount: totalCount,
        });
      } else {
        return res.status(500).json({ message: "Internal Server error" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  const registeredTodayUsersCountController = async (req, res, next) => {
    try {
      const pageNo= req.params?.pageNo ?? 1;
      const skipLength= (pageNo-1)*10;
      const adminDetails = await AuthenticateAdmin(req);
      const { message, status } = adminDetails;
  
      if (status === 200) {
        const { adminId } = adminDetails;
  
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth(); // 0-based indexing
        const day = today.getDate();
  
        // Create start and end date for today (generic and handles month end)
        const startDate = new Date(year, month, day);
        startDate.setHours(0, 0, 0, 0); // Set to midnight (start of today)
  
        const endDate = new Date(startDate.getTime()); // Clone and set to tomorrow
        endDate.setDate(endDate.getDate() + 1); // Move to tomorrow
        endDate.setHours(0, 0, 0, 0); // Set to midnight (start of tomorrow)
  
        // Handle month overflow for end date (generic approach)
        if (endDate.getDate() === 1) { // Check if it overflows to the first day of next month
          endDate.setMonth(endDate.getMonth() + 1); // Move to next month
        }
  
        // Call the generic function with today's dates
        const userCount = await registeredUserInRange(User, startDate, endDate);
        const userDetails= await User.find({
          createdAt: {$gte: startDate, $lt: endDate}
        },{
           username: 1,
              bio: 1,
              profilePicture: 1
        }).skip(skipLength).limit(10);
        return res.status(200).json({ message: "Number of Users Registered Today", count: userCount, 'userDetails': userDetails });
      } else {
        return res.status(status).json({ message }); // Use message from adminDetails
      }
    } catch (err) {
      console.error("Error fetching user count:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
};
  


const noOfFestsControllers= async(req,res,next)=>{
    try{
      const pageNo= req.params?.pageNo ?? 1;
        // here we are going to find out the no of the fests total
        const adminDetails = await AuthenticateAdmin(req);
        const { message, status } = req.body;
        const skipLength= (pageNo-1)*10;
        if (status === 200) {
          const noOfFests= Fests.find({}).countDocuments();
          const festDetails= Fests.find({},{
            eventname: 1,
            mode: 1,
            description: 1,
            city: 1,
            image: 1
          }).skip(skipLength).limit(10);
          // so we had used to find out the all the elements of the Fests
          return res.status(200).json({
            "message": "Fests Fetched Succesfully",
            "noOfFests": noOfFests,
            "details": festDetails
          });
        }
        else {
            return res.status(500).json({ message: "Internal Server error" });
        }
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"});
    }
}

const todayPostedFestsController = async (req, res, next) => {
  try {
    const pageNo= req.params?.pageNo?? 1;
    const skipLength= (pageNo-1)*10;

    const adminDetails = await AuthenticateAdmin(req);
    const { message, status } = req.body;

    if (status === 200) {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth(); // 0-based indexing
      const day = today.getDate();

      // Create start and end date for today (optimized and handles month end)
      const startDate = new Date(year, month, day);
      startDate.setHours(0, 0, 0, 0); // Set to midnight (start of today)

      const endDate = new Date(startDate.getTime()); // Clone and set to tomorrow
      endDate.setDate(endDate.getDate() + 1); // Move to tomorrow
      endDate.setHours(0, 0, 0, 0); // Set to midnight (start of tomorrow)

      // Handle month overflow for end date (if today is the 31st)
      if (startDate.getDate() === 1) {
        endDate.setDate(1); // Set to the first day of the next month
        endDate.setMonth(endDate.getMonth() + 1); // Move to next month
      }

      const query = {
        'dateOfPosted': {
          $gte: startDate,
          $lt: endDate,
        },
      };

      const count = await Fests.find(query).countDocuments();
      const festDetails= await Fests.find(query,{
            eventname: 1,
            mode: 1,
            description: 1,
            city: 1,
            image: 1
      }).skip(skipLength).limit(10);
      return res.status(200).json({
        "message": "Fests Fetched Successfully",
        "countOfFests": count, // Use a more descriptive variable name
        "details": festDetails
      });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const todayLastDateToApplyFestController = async (req, res, next) => {
  try {
    const pageNo= req.params?.pageNo ?? 1;
    const skipLength= (pageNo-1)*10;

    const adminDetails = await AuthenticateAdmin(req); // Assuming authentication
    // Check request status code if needed (optional)
    const { message, status } = adminDetails;
    if (status !== 200) {
      return res.status(500).json({ message: message });
    }
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-based indexing
    const day = today.getDate();

    // Set start and end date for today, handling month overflow
    const startDate = new Date(year, month, day);
    const endDate = new Date(year, month, day + 1); // Initial attempt

    if (endDate.getDate() !== (day + 1)) {
      // Overflow occurred, adjust to next month's 1st day
      endDate.setDate(1);
      endDate.setMonth(endDate.getMonth() + 1);
    }

    const query = {
      'lastDateToApply': {
        $gte: startDate,
        $lt: endDate,
      },
    };

    const count = await Fests.find(query).countDocuments();
    const festDetails= await Fests.find(query,{
          eventname: 1,
            mode: 1,
            description: 1,
            city: 1,
            image: 1
    }).skip(skipLength).limit(10);
    return res.status(200).json({
      "message": "Fests Fetched Successfully",
      "nOfFests": count,
      "festDetails": festDetails
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};



// corrected till this
const LastWeekToApplyFestsController = async (req, res, next) => {
  try {
    const pageNo= req.params?.pageNo ??1;
    const skipLength= (pageNo-1)*10;
    const adminDetails = await AuthenticateAdmin(req); // Assuming authentication
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-based indexing
    const day = today.getDate();

    // Handle cases where day is close to month end (avoid overflow)
    let endDate = new Date(year, month, day + 6);
    if (endDate.getDate() !== (day + 6)) {
      // Adjust for month overflow
      endDate.setDate(0); // Set date to last day of previous month
      endDate.setMonth(endDate.getMonth() + 1); // Increment month
    }

    const startDate = new Date(year, month, day);
    const query = {
      'lastDateToApply': {
        $gte: startDate,
        $lt: endDate,
      },
    };

    const noOfFests = await Fests.find(query).countDocuments(); // Get all fest details
    const festDetails= await Fests.find(query,{eventname: 1,
      mode: 1,
      description: 1,
      city: 1,
      image: 1}).skip(skipLength).limit(10);

    return res.status(200).json({
      "message": "Fests Fetched Succesfully",
     "noOfFests": noOfFests,
      "details": festDetails
    });
  } catch (err) {
    console.error(err); // Log the actual error
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


const FestUploadedInAMonthController = async(req,res,next)=>{
    try{
      const pageNo= req.params?.pageNo ??1;
      const skipLength= (pageNo-1)*10;
      const {month,year}= req.body;
      if(!month && !year){
        const year = today.getFullYear();
        const month = today.getMonth();
      }
        // here we are going to define a code that will show the no of the fests that are uploaded in a month
        const adminDetails = await AuthenticateAdmin(req);
      const { message, status } = adminDetails;
      
      if (status === 200) {
      const today = new Date();
      const day = today.getDate();

    // Set start and end date for today
    const startDate = new Date(year, month-1, day);
    const endDate = new Date(year, month, day);
    const query = {
          'dateOfPosted': {
            $gte: startDate,
            $lt: endDate,
          },
        };
      const count=await Fests.find(query).countDocuments();
      const festDetails=await Fests.find(query,{
        eventname: 1,
            mode: 1,
            description: 1,
            city: 1,
            image: 1
      }).skip(skipLength).limit(10);
      return res.status(200).json({"message": "No of Fests of Previous Month Fetched Succesfully", countOfFests: count, "details": festDetails});
      }
      else {
          return res.status(500).json({ message: "Internal Server error" });
        }
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"});
    }
}

const TotalFestsInAParticularRangeController = async (req, res, next) => {
  try {
    const pageNo = req.params?.pageNo ?? 1;
    const skipLength= (pageNo-1)*10;
    const adminDetails = await AuthenticateAdmin(req);
    const { message, status } = req.body;

    if (status === 200) {
      const { adminId } = adminDetails;
      const { startMonth, startYear, endMonth, endYear } = req.params;
      if(!startMonth && !startYear && endMonth && !endYear){
        return res.status(401).json({"message": "Dates are not defined"});
      }
      // Calculate total number of months in the range (handles overflow)
      const numMonths = (endYear - startYear) * 12 + endMonth - startMonth + 1;

      // Set start and end date dynamically (only month and year)
      const startDate = new Date(startYear, startMonth - 1, 1);

      // Handle month overflow for end date (consider December)
      const endDate = new Date(endYear, endMonth === 11 ? 0 : endMonth, 1); // Set to the first day of the last month
      endDate.setDate(endDate.getDate() - 1); // Set to the last day of the month

      const query = {
        'dateOfPosted': {
          $gte: startDate,
          $lt: endDate,
        },
      };

      const count = await Fests.find(query).countDocuments();
      const festDetails= await Fests.find(query, {
            eventname: 1,
            mode: 1,
            description: 1,
            city: 1,
            image: 1
      }).skip(skipLength).limit(10);
      return res.status(200).json({
        "message": "No of Fests Fetched Successfully",
        "countOfFests": count, // Use a more descriptive variable name
        "details": festDetails
      });
    }
     else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


const noOfHackathonsController=async(req,res,next)=>{
  try{
    const pageNo= req.params?.pageNo ?? 1;
    const skipLength= (pageNo-1)*10;
      // here we are going to define the no of the hacakathons posted till date
      const adminDetails = await AuthenticateAdmin(req);
    const { message, status } = adminDetails;

    if (status === 200) {
      const hackathonDetail= await Hackathon.find({}, {
        name: 1,
        level: 1,
        mode: 1,
        location: 1
      }).skip(skipLength).limit(10);
      const count = await Hackathon.find({}).countDocuments();
      return res.status(200).json({
        "message": "All Hackathons Fetched Successfully",
        "countOfHackahtons": count,
        "details": hackathonDetail
      });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  catch(err){
      return res.status(500).json({
        "message": "Internal Server Error"
      });
  }
}

const todayLastDateToApplyHackathonController = async (req, res, next) => {
  try {
    const pageNo= req.params?.pageNo ?? 1;
    const skipLength= (pageNo-1)*10;
    const adminDetails = await AuthenticateAdmin(req);
    const { message, status } = adminDetails;

    if (status === 200) {
      const { adminId } = adminDetails;
      const today = new Date();

      // Create start and end date for today (optimized and handles month end)
      const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      startDate.setHours(0, 0, 0, 0); // Set to midnight (start of today)

      const endDate = new Date(startDate.getTime()); // Clone and set to tomorrow
      endDate.setDate(endDate.getDate() + 1); // Move to tomorrow
      endDate.setHours(0, 0, 0, 0); // Set to midnight (start of tomorrow)

      // Handle month overflow for end date (if today is the 31st)
      if (startDate.getDate() === 1) {
        endDate.setDate(1); // Set to the first day of the next month
        endDate.setMonth(endDate.getMonth() + 1); // Move to next month
      }

      const query = {
        'lastDateToApply': {
          $gte: startDate,
          $lt: endDate,
        },
      };

      const count = await Hackathon.find(query).countDocuments();
      const details= await Hackathon.find(query,{
        name: 1,
        level: 1,
        mode: 1,
        location: 1
      }).skip(skipLength).limit(10);
      return res.status(200).json({
        "message": "Today Posted Hackathons Fetched Successfully",
        "countOfHackathons": count,
        "details": details
      });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const LastweekToApplyHackathonController = async (req, res, next) => {
  try {
    const pageNo= req.params?.pageNo ?? 1;
    const skipLength= (pageNo-1)*10;
    const adminDetails = await AuthenticateAdmin(req);
    const { message, status } = adminDetails;

    if (status === 200) {
      const { adminId } = adminDetails;
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth(); // 0-based indexing
      const day = today.getDate();

      // Calculate start date for last week (considering month boundaries)
      const startDate = new Date(year, month, day - 7); // Subtract 7 days

      // Handle month overflow for end date
      const endDate = new Date(year, month, day + 6);
      if (endDate.getDate() !== (day + 6)) { // Check if overflow occurred
        endDate.setDate(0); // Set to the last day of the previous month
        endDate.setMonth(endDate.getMonth() + 1); // Move to next month
      }

      const query = {
        'lastDateToApply': {
          $gte: startDate,
          $lt: endDate,
        },
      };
      const details= await Hackathon.find(query,{
        name: 1,
        level: 1,
        mode: 1,
        location: 1
      }).skip(skipLength).limit(10);
      const count = await Hackathon.find(query).countDocuments();
      return res.status(200).json({
        message: "Today last Date To Apply Hackathon Fetched Successfully",
        countOfUsers: count,
      });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const todayPostedHackathonController = async (req, res, next) => {
  try {
    const pageNo= req.params?.pageNo ?? 1;
    const adminDetails = await AuthenticateAdmin(req);
    const { message, status } = adminDetails;

    if (status === 200) {
      const { adminId } = adminDetails;
      const today = new Date();

      // Create start and end date for today (optimized and handles month end)
      const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      startDate.setHours(0, 0, 0, 0); // Set to midnight (start of today)

      const endDate = new Date(startDate.getTime()); // Clone and set to tomorrow
      endDate.setDate(endDate.getDate() + 1); // Move to tomorrow
      endDate.setHours(0, 0, 0, 0); // Set to midnight (start of tomorrow)

      // Handle month overflow for end date (if today is the 31st)
      if (startDate.getDate() === 31) {
        endDate.setDate(1); // Set to the first day of the next month
        endDate.setMonth(endDate.getMonth() + 1); // Move to next month
      }

      const query = {
        'dateOfPosting': {
          $gte: startDate,
          $lt: endDate,
        },
      };

      const count = await Hackathon.find(query).countDocuments();
      const details= await Hackathon.find(query, {
        name: 1,
        level: 1,
        mode: 1,
        location: 1
      }).skip(skipLength).limit(10);
      return res.status(200).json({
        message: "Today Posted Hackathons Fetched Successfully",
        countOfHackathons: count,
        "details": details
      });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const HackathonsPostedInMonthController= async(req,res,next)=>{
  try {
    const pageNo= req.params?.pageNo ?? 1;
    const skipLength= (pageNo-1)*10;
    const adminDetails = await AuthenticateAdmin(req);
    const { message, status } = adminDetails;

    if (status === 200) {
      const today = new Date();
      // Create start and end date for today (optimized and handles month end)
      // Create start and end date for today (optimized and handles month end)
      const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      startDate.setHours(0, 0, 0, 0); // Set to midnight (start of today)

      const endDate = new Date(startDate.getTime()); // Clone and set to tomorrow
      endDate.setDate(endDate.getDate() + 1); // Move to tomorrow
      endDate.setHours(0, 0, 0, 0); // Set to midnight (start of tomorrow)

      // Handle month overflow for end date (if today is the 31st)
      if (startDate.getDate() === 31) {
        endDate.setDate(1); // Set to the first day of the next month
        endDate.setMonth(endDate.getMonth() + 1); // Move to next month
      }
      const query = {
        'dateOfPosting': {
          $gte: startDate,
          $lt: endDate,
        },
      };

      const count = await Hackathon.find(query).countDocuments();
      const details= await Hackathon.find(query, {
        name: 1,
        level: 1,
        mode: 1,
        location: 1
      }).skip(skipLength).limit(10);
      return res.status(200).json({
        "message": "Today Posted Hackathons Fetched Successfully",
        "countOfHackathons": count,
        "details": details
      });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

const HackathonPostedInARangeController= async(req,res,next)=>{
    try{

    }
    catch(err){
      return res.status(500).json({"messsage": "Internal Server Error"});
    }
}
const noOfBloggersController=async (req,res,next)=>{
  try{
    const pageNo = req.params?.pageNo ?? 1;
    const skipLength= (pageNo-1)*10;
    const adminDetails=await AuthenticateAdmin(req);
    const {message, status}= adminDetails;
    if(status==200){
        // now we are going to find the details of the users
        const noOfBloggers= await Blogger.find({}).countDocuments();
        const bloggerDetails= await Blogger.find({},{
          username: 1,
          name: 1,
          bio: 1
        }).skip(skipLength).limit(10);
        if(!noOfBloggers){
            return res.status(404).json({"message": "UNable to find out the no of the Users"});
        }
        else{
            return res.status(200).json({"message": "Users Data Fetched Succesfully","users": noOfBloggers});
        }
    }
    else if(status != 200){
        //we are going to send the message to the admin
        return res.status(status).json({"message": message});
    }
  }
  catch(err){
    return res.status(500).json({"messsage": "Internal Server Error"});
  }
}

// we need to define the seperate routes for the Blogs like the uSER

const registeredBloggerInMonthController = async (req, res, next) => {
  // here we are gonna to find the details of the user who regsitered in a particular month

    try{
      const pageNo= req.params?.pageNo ?? 1;
      const skipLength= (pageNo-1)*10;
        const adminDetails=await AuthenticateAdmin(req);
        const {message, status}= adminDetails;
        if(status==200){
            const { month } = req.params;
            const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/; // YYYY-MM format
            if (!month || !monthRegex.test(month)) {
                return res.status(400).json({ message: "Invalid month format. Use YYYY-MM (e.g., 2024-04)" });
            }
            // Efficient Month-Based Filtering with MongoDB Operators
            const startDate = new Date(month + '-01T00:00:00.000Z'); // Start of the month
            const endDate = new Date(month + '-31T23:59:59.999Z'); // End of the month (adjusted for days)
            const usersInMonth = await Blogger.find({
                createdAt: { $gte: startDate, $lt: endDate } // Filter by createdAt within month range
            }).countDocuments();
            
            const bloggerDetails= await Blogger.find({
              createdAt: {$gte: startDate, $lt: endDate}
            }).skip(skipLength).limit(10);// Use .countDocuments() for efficiency

            if(!bloggersInMonth && !bloggerDetails){
              if (err) {
                console.error("Error fetching Bloggers:", err);
                return res.status(500).json({ message: "Error retrieving user count" });
            } else {
                // No users found in the month range
                return res.status(200).json({ message: `No Blogs registered in ${month}` });
            }
            }
            res.status(200).json({
                message: `Number of bloggers registered in ${month}: ${usersInMonth}`,
                details: bloggerDetails
            });
        }
        else{
            //we are going to send the message to the admin
            return res.status(status).json({"message": message});
        }  
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"})
    }
  };


  const registeredBloggerInMonthRangeController = async (req, res, next) => {
    try {
      const adminDetails = await AuthenticateAdmin(req);
      const { message, status } = adminDetails;
  
      if (status === 200) {
        const { startMonth, endMonth, startYear, endYear } = req.params;
        if(!startMonth && !endMonth && !startYear && !endYear){
          return res.status(400).json({"message": "Please provide the all the dates"});
        }
        // Initialize variables
        let totalCount = 0;
        const countDict = {};
  
        // Validate Start Date
        const startDate = new Date(startYear, startMonth - 1, 1);
        if (!isValidDate(startDate)) {
          return res.status(400).json({ message: "Invalid Date format" });
        }
        // Loop through months
        for (let currentMonth = startMonth; currentMonth <= endMonth-1; currentMonth++) {
          // Calculate end date for the month (0 represents the last day of previous month)
          const endDate = new Date(endYear, currentMonth, 0);
          try {
            // Fetch user count for the month
            const monthCount = await registeredUserInRange(Blogger, startDate, endDate);
            countDict[currentMonth] = monthCount;
            totalCount += monthCount;
          } catch (error) {
            console.error(`Error fetching user count for month ${currentMonth}:`, error);
          }
        }
  
        return res.status(200).json({
          message: "No of the Bloggers fetched Successfully",
          data: countDict,
          totalCount: totalCount,
        });
      } else {
        return res.status(status).json({ message }); // Use message from adminDetails
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
const RegisteredBloggerInYearController = async (req, res, next) => {
    try {
      const adminDetails = await AuthenticateAdmin(req);
      const { message, status } = adminDetails;
  
      if (status === 200) {
        const { startYear, startMonth, endMonth, endYear } = req.params;
  
        // Initialize variables
        let totalCount = 0;
        let countDict = {};
  
        // Loop through years
        for (let currentYear = startYear; currentYear <= endYear; currentYear++) {
          // Calculate start and end dates for the year
          const startDate = new Date(currentYear, startMonth - 1, 1); // Adjust month (0-based)
          const endDate = new Date(currentYear, endMonth, 0);
  
          try {
            // Fetch user count for the year
            const yearCount = await registeredUserInRange(Blogger, startDate, endDate);
            countDict[currentYear] = yearCount;
            totalCount += yearCount;
          } catch (error) {
            console.error(`Error fetching Blogger count for ${currentYear}:`, error);
            // Handle error gracefully (e.g., skip year or return partial data)
          }
        }
  
        return res.status(200).json({
          message: "No of the Bloggers fetched Successfully",
          data: countDict,
          totalCount: totalCount,
        });
      } else {
        return res.status(500).json({ message: "Internal Server error" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  const registeredTodayBLoggersCountController = async (req, res, next) => {
    try {
      const pageNo= req.params?.pageNo ?? 1;
      const skipLength= (pageNo-1)*10;
      const adminDetails = await AuthenticateAdmin(req);
      const { message, status } = adminDetails;
  
      if (status === 200) {
        const { adminId } = adminDetails;
  
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth(); // 0-based indexing
        const day = today.getDate();
  
        // Create start and end date for today (generic and handles month end)
        const startDate = new Date(year, month, day);
        startDate.setHours(0, 0, 0, 0); // Set to midnight (start of today)
  
        const endDate = new Date(startDate.getTime()); // Clone and set to tomorrow
        endDate.setDate(endDate.getDate() + 1); // Move to tomorrow
        endDate.setHours(0, 0, 0, 0); // Set to midnight (start of tomorrow)
  
        // Handle month overflow for end date (generic approach)
        if (endDate.getDate() === 1) { // Check if it overflows to the first day of next month
          endDate.setMonth(endDate.getMonth() + 1); // Move to next month
        }
  
        // Call the generic function with today's dates
        const userCount = await registeredUserInRange(Blogger, startDate, endDate);
        const userDetails= await Blogger.find({
          createdAt: {$gte: startDate, $lt: endDate}
        },{
           username: 1,
              bio: 1,
              profilePicture: 1
        }).skip(skipLength).limit(10);
        return res.status(200).json({ message: "Number of Users Registered Today", count: userCount, 'details': userDetails });
      } else {
        return res.status(status).json({ message }); // Use message from adminDetails
      }
    } catch (err) {
      console.error("Error fetching user count:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
};
  


const noOfBlogsController= async (req,res,next)=>{
    try{
      const pageNo = req.params?.pageNo ?? 1;
      const skipLength= (pageNo-1)*10;
      const adminDetails=await AuthenticateAdmin(req);
      const {message, status}= adminDetails;
      if(status==200){
        const noOfBlogs= await Blogs.find({}).countDocuments;

        const BlogsDetails= await Blogs.find({},{
              blogTopic: 1,
              tags:1,
              createdBy:1
            }).skip(skipLength).limit(10);
            
        if(!noOfBlogs){
            return res.status(401).json({"message": "No Blogs are found"});
        }
        return res.status().json({"message": "Blogs are fetched Successfully", "blogDetails": BlogsDetails, "count": noOfBlogs});
      }
    }
    catch(err){
      return res.status(500).json({"message": "Internal Server Error"});
    }
}


const noOfTodayPostedBlogs= async(req,res,next)=>{
  try{
    const pageNo= req.params?.pageNo ?? 1;
    const adminDetails = await AuthenticateAdmin(req);
    const { message, status } = adminDetails;
    const skipLength= (pageNo-1)*10;
    if (status === 200) {
      const { adminId } = adminDetails;
      const today = new Date();

      // Create start and end date for today (optimized and handles month end)
      const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      startDate.setHours(0, 0, 0, 0); // Set to midnight (start of today)

      const endDate = new Date(startDate.getTime()); // Clone and set to tomorrow
      endDate.setDate(endDate.getDate() + 1); // Move to tomorrow
      endDate.setHours(0, 0, 0, 0); // Set to midnight (start of tomorrow)
      // Handle month overflow for end date (if today is the 31st)

      if (startDate.getDate() === 31) {
        endDate.setDate(1); // Set to the first day of the next month
        endDate.setMonth(endDate.getMonth() + 1); // Move to next month
      }

      const query = {
        'createdAt': {
          $gte: startDate,
          $lt: endDate,
        },
      };

      const count = await Blogs.find(query).countDocuments();
      const BlogsPosted= await Blogs.find(query,{
        blogTopic:1,
        blogImages: 1,
        level: 1,
        tags: 1
      }).skip(skipLength).limit(10);

      return res.status(200).json({
        message: "Today Posted Hackathons Fetched Successfully",
        countOfHackathons: count,
        data: BlogsPosted
      });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  catch(err){
    return res.status(500).json({"message": "Internal Server Error"});
  }
}

const noOfVideoController=async ()=>{
    try{
      const pageNo= req.params?.pageNo ?? 1;
      // Check for token presence
      const adminDetails=await AuthenticateAdmin(req);
      const {message, status}= adminDetails;
      if(status==200){
          const {adminId}= adminDetails;
          const skipLength= (pageNo-1)*10;
          // now we are going to find the details of the users
          const noOfVideo= await Video.find({}).count();
          const userVideo= await Video.find({},{
            title: 1,
            description:1,
            owner: 1
          }).skip(skipLength).limit(10);
          if(!noOfVideo){
              return res.status(404).json({"message": "Unable to find out the no of the Users"});
          }
          else{
              return res.status(200).json({"message": "Users Data Fetched Succesfully","no of Video": noOfVideo,"videos": userVideo });
          }
      }
      else if(status!=200){
          //we are going to send the message to the admin
          return res.status(status).json({"message": message});
      }
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"});
    }
}

const todayPostedVideoController= async()=>{
    try{
      const pageNo= req.params?.pageNo ?? 1;
      const skipLength= (pageNo-1)*10;
      const adminDetails = await AuthenticateAdmin(req);
      const { message, status } = adminDetails;
  
      if (status === 200) {
        const today = new Date();
  
        // Create start and end date for today (optimized and handles month end)
        const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        startDate.setHours(0, 0, 0, 0); // Set to midnight (start of today)
  
        const endDate = new Date(startDate.getTime()); // Clone and set to tomorrow
        endDate.setDate(endDate.getDate() + 1); // Move to tomorrow
        endDate.setHours(0, 0, 0, 0); // Set to midnight (start of tomorrow)
  
        // Handle month overflow for end date (if today is the 31st)
        if (startDate.getDate() === 31) {
          endDate.setDate(1); // Set to the first day of the next month
          endDate.setMonth(endDate.getMonth() + 1); // Move to next month
        }
  
        const query = {
          'createdAt': {
            $gte: startDate,
            $lt: endDate,
          },
        };
        const count = await Video.find(query).countDocuments();
        const videoDetail= await Video.find(query,{
          owner: 1,
          tags: 1,
          summary: 1,
          modifiedAt: 1
        }).skip(skipLength).limit(10);
        return res.status(200).json({
          "message": "Today Posted Hackathons Fetched Successfully",
          "countOfHackathons": count,
          "detail": videoDetail
        });
      } else {
        return res.status(500).json({ message: "Internal Server Error" });
      }
    }
    catch(err){
      return res.status(5000).json({"message": "Internal Server Error"})
    }
}

const videoPostedInAmonthController= async(req,res,next)=>{
  try{
    const adminDetails = await AuthenticateAdmin(req);
    const { message, status } = adminDetails;
    if (status === 200) {
      const today = new Date();

      const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      startDate.setHours(0, 0, 0, 0); // Set to midnight (start of today)

      const endDate = new Date(startDate.getTime()); // Clone and set to tomorrow
      endDate.setDate(endDate.getDate() + 1); // Move to tomorrow
      endDate.setHours(0, 0, 0, 0); // Set to midnight (start of tomorrow)

      // Handle month overflow for end date (if today is the 31st)
      if (startDate.getDate() === 31) {
        endDate.setDate(1); // Set to the first day of the next month
        endDate.setMonth(endDate.getMonth() + 1); // Move to next month
      }
      const query = {
        'createdAt': {
          $gte: startDate,
          $lt: endDate,
        },
      };

      const count = await Video.find(query).countDocuments();
      const videoDetail= await Video.find(query,{
        owner: 1,
        tags: 1,
        summary:1,
        createdAt: 1
      }).skip(skipLength).limit(10);
      return res.status(200).json({
        "message": "Today Posted Videos Fetched Successfully",
        "count": count,
        "details": videoDetail
      });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } 
  catch(err){
      return res.status(500).json({"message": "Interal Server Error"})
  }
}

const videoPostedLastYearController= async(req,res,next)=>{
  try{
      
  }
  catch(err){
      return res.status(500).json({"message": "Internal Server Error"});
  }
}


const registeredUserInRange= async(model, startDate, endDate)=>{
    try{
        // here we are going to find out the details of the users registered in a particular time period
        if(!model){
            return {"message": "Please Specify the model", status: 400};
        }
        if (!isValidDate(startDate) || !isValidDate(endDate)) {
            return {"message": "Date is not in valid Format", status: 400};
        }
        
        // now going to fetch the details in a particular month
        if (startDate > endDate) { 
            return {"message": "Start Date can't be greater then End Date"};
        }
        const query = {
            'createdAt': {
              $gte: startDate,
              $lt: endDate,
            },
          };
        const count=await model.find(query).countDocuments();
        return {"message": "Fetched Succesfully", status: 200, count:  count};
    }
    catch(err){
        console.log(err);
        return {"message": "Internal Server Error", status: 500};
    }
}

function isValidDate(date) {
    // Use a regular expression for stricter date format validation (YYYY-MM-DD) (e.g., 2024-04-14).')
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/; 
    return date instanceof Date && !isNaN(date.getTime()) && dateRegex.test(date.toISOString().slice(0, 10));
  }
  

const AuthenticateAdmin= async(req)=>{
    const adminToken = req.cookies.adminToken;
    if (!adminToken) {
      return {"message":"Token not found", status: 401} // Use 401 for unauthorized access
    }

    // Validate token using JWT verify
    try {
      const decoded = jwt.verify(adminToken, process.env.ADMIN_TOKEN); // Replace "vinay" with your actual secret key
      const adminId = decoded._id;

      // Fetch user data using findOne()
      const admin = await Admin.findById(adminId);
      if (!admin) {
        return {"message": "Admin not found", status: 404}; // Use 404 for not found
      }
      else if(admin.blocked && !admin.approvedadmin){
        return {"message": "You are no longer A admin", status: 405}
      }
      return {"message": "Welcome Admin",status: 200,"adminId": adminId};
     // we are going to get the data of the User extra
    } catch (err) {
      console.error("Error verifying token or fetching user:", err); // Log specific error details for debugging
      // Handle specific errors (e.g., token expiration, database errors)
      if (err.name === 'JsonWebTokenError') {
        return {"messsage": "Invalid Token", "status": 401}
      } else if (err.name === 'CastError') {
        return {"message": "InvalidId", status: 400};
      } else {
        return {"message": "Internal Server Error", status: 500} // Generic error for unexpected issues
      }
    }
}

module.exports={

  //user contrllers
  noOfUsersController,
  registeredUserInMonthRangeController,
  RegisteredUserInMonthController,
  RegisteredUserInYearController,
  registeredTodayUsersCountController,

// blogs controller  
  noOfTodayPostedBlogs,
  noOfBlogsController,


  //bloggers controller
  registeredTodayBLoggersCountController,
  RegisteredBloggerInYearController,
  noOfBloggersController,
  registeredBloggerInMonthRangeController,
  registeredBloggerInMonthController,


// fests controller
  noOfFestsControllers,
  todayPostedFestsController,
  todayLastDateToApplyFestController,
  LastWeekToApplyFestsController,  
  FestUploadedInAMonthController,
  TotalFestsInAParticularRangeController,

// hackathons controller
  HackathonsPostedInMonthController,
  noOfHackathonsController,
  todayLastDateToApplyHackathonController,
  LastweekToApplyHackathonController,
  HackathonPostedInARangeController,
  todayPostedHackathonController,

  //video controllers
  videoPostedInAmonthController,
  videoPostedLastYearController,
  noOfVideoController,
  todayPostedVideoController,

}
