// here we are going to get the data of the events, Hackathons, fests, Bootcamps
const mongoose=require("mongoose");
const express= require("express");
const router= express.Router();
const Admin = require('../../models/admin');
const User= require("../../models/User")
const Blogger= require("../../models/Blogger");
const Blogs= require("../../models/Blogs");
const Bootcamps= require("../../models/BootCamp");
const Fests= require("../../models/Fest");
const Hackathon=require("../../models/postHackathon")

const noOfUsersController= async (req,res,next)=>{
    try {
        // Check for token presence
        const adminDetails=await AuthenticateAdmin(req);
        const {message, status}= adminDetails;
        if(status==200){
            const {adminId}= adminDetails;
            // now we are going to find the details of the users
            const noOfUsers= await User.find({}).count();
            if(!noOfUsers){
                return res.status(404).json({"message": "UNable to find out the no of the Users"});
            }
            else{
                return res.status(200).json({"message": "Users Data Fetched Succesfully","users": noOfUsers});
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

const RegisteredUserController= async(req,res,next)=>{
    try{
        const adminDetails=await AuthenticateAdmin(req);
        const {message, status}= adminDetails;
        if(status==200){
            const {adminId}= adminDetails;
            // now we are going to find the details of the users
            const userDetails= await User.find({});
            if(!userDetails){
                return res.status(404).json({"message": "Unable to find users Details"});
            }
            else{
                return res.status(200).json({"message": "Users Data Fetched Succesfully","users": userDetails});
            }
        }
        else if(status!=200){
            //we are going to send the message to the admin
            return res.status(status).json({"message": message});
        }  
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"})
    }
}

const RegisteredUserInMonthController = async (req, res, next) => {
    try{
        const adminDetails=await AuthenticateAdmin(req);
        const {message, status}= adminDetails;
        if(status==200){
            const {adminId}= adminDetails;
            // now we are going to find the details of the users
            const { month } = req.params;
        // Input Validation for Month Format
            const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/; // YYYY-MM format
            if (!month || !monthRegex.test(month)) {
                return res.status(400).json({ message: "Invalid month format. Use YYYY-MM (e.g., 2024-04)" });
            }
            // Efficient Month-Based Filtering with MongoDB Operators
            const startDate = new Date(month + '-01T00:00:00.000Z'); // Start of the month
            const endDate = new Date(month + '-31T23:59:59.999Z'); // End of the month (adjusted for days)
            const usersInMonth = await User.find({
                createdAt: { $gte: startDate, $lt: endDate } // Filter by createdAt within month range
            }).countDocuments(); // Use .countDocuments() for efficiency
            if(!usersInMonth){
                return res.status(500).json({
                    "message": "Error while fetching the no of the Users"
                })
            }
            res.status(200).json({
                message: `Number of users registered in ${month}: ${usersInMonth}`,
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
        const { adminId } = adminDetails;
        const { startMonth, endMonth, startYear, endYear, startingDate } = req.params;
  
        // Initialize variables
        let totalCount = 0;
        const countDict = {};
  
        // Validate Start Date
        const startDate = new Date(startYear, startMonth - 1, startingDate);
        if (!isValidDate(startDate)) {
          return res.status(400).json({ message: "Invalid Date format" });
        }
  
        // Loop through months
        for (let currentMonth = startMonth; currentMonth <= endMonth; currentMonth++) {
          // Calculate end date for the month (0 represents the last day of previous month)
          const endDate = new Date(endYear, currentMonth, 0);
  
          try {
            // Fetch user count for the month
            const monthCount = await registeredUserInRange(User, startDate, endDate);
            countDict[currentMonth] = monthCount;
            totalCount += monthCount;
          } catch (error) {
            console.error(`Error fetching user count for month ${currentMonth}:`, error);
            // Handle error gracefully (e.g., skip month or return partial data)
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
      const { message, status } = req.body;
  
      if (status === 200) {
        const { adminId } = adminDetails;
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
  

const registeredToday = async (req,res,next) => {
    try {
        const adminDetails = await AuthenticateAdmin(req);
        const { message, status } = req.body;
    
        if (status === 200) {
          const { adminId } = adminDetails;    
  
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
   if (startDate.getDate() === 31) {
     endDate.setDate(1); // Set to the first day of the next month
     endDate.setMonth(endDate.getMonth() + 1); // Move to next month
   }
      
      // Call the generic function with today's dates
      return await registeredUserInRange(model, startDate, endDate);
        }
        else {
            return res.status(500).json({ message: "Internal Server error" });
          }

    } catch (err) {
      console.log(err);
      return { message: "Internal Server Error", status: 500 };
    }
  };
  


const noOfFests= async(req,res,next)=>{
    try{
        // here we are going to find out the no of the fests total
        const adminDetails = await AuthenticateAdmin(req);
        const { message, status } = req.body;
    
        if (status === 200) {
          const { adminId } = adminDetails;
          const noOfFests= Fests.find({}).count();
          // so we had used to find out the all the elements of the Fests
          return res.status(200).json({
            message: "Fests Fetched Succesfully",
            noOfFests: noOfFests
          })
        }
        else {
            return res.status(500).json({ message: "Internal Server error" });
        }
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"});
    }
}
const todayPostedFests = async (req, res, next) => {
  try {
    const adminDetails = await AuthenticAdmin(req);
    const { message, status } = req.body;

    if (status === 200) {
      const { adminId } = adminDetails;

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
      if (startDate.getDate() === 31) {
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
      return res.status(200).json({
        message: "Fests Fetched Successfully",
        countOfFests: count, // Use a more descriptive variable name
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
    const adminDetails = await AuthenticAdmin(req); // Assuming authentication

    // Check request status code if needed (optional)
    // const { message, status } = req.body;
    // if (status !== 200) {
    //   return res.status(500).json({ message: "Internal Server Error" });
    // }

    const { adminId } = adminDetails;
    const { startYear, startMonth, endMonth, endYear } = req.params; // May not be used here

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

    return res.status(200).json({
      message: "Fests Fetched Successfully",
      nOfFests: count,
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

    const fests = await Fests.find(query); // Get all fest details
    const nOfFests = fests.length;

    return res.status(200).json({
      message: "Fests Fetched Succesfully",
      nOfFests,
      fests, // Include the actual fests data
    });
  } catch (err) {
    console.error(err); // Log the actual error
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


const FestUploadedInAMonth = async(req,res,next)=>{
    try{
        // here we are going to define a code that will show the no of the fests that are uploaded in a month
        const adminDetails = await AuthenticateAdmin(req);
      const { message, status } = req.body;
  
      if (status === 200) {
        const { adminId } = adminDetails;
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth(); // 0-based indexing
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
      return res.status(200).json({"message": "No of Fests of Previous Month Fetched Succesfully", countOfFests: count});
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
    const adminDetails = await AuthenticAdmin(req);
    const { message, status } = req.body;

    if (status === 200) {
      const { adminId } = adminDetails;
      const { startMonth, startYear, endMonth, endYear } = req.params;

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
      return res.status(200).json({
        message: "No of Fests Fetched Successfully",
        countOfFests: count, // Use a more descriptive variable name
      });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


const getNoOfFestsPerMonthController= async(req,res,next)=>{
}

const noOfHackathonsController=async(req,res,next)=>{
  try{
      // here we are going to define the no of the hacakathons posted till date
      const adminDetails = await AuthenticateAdmin(req);
    const { message, status } = req.body;

    if (status === 200) {
      const { adminId } = adminDetails;

      const count = await Hackathon.find({}).countDocuments();
      return res.status(200).json({
        message: "All Hackathons Fetched Successfully",
        countOfUsers: count,
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
    const adminDetails = await AuthenticAdmin(req);
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
        'lastDateToApply': {
          $gte: startDate,
          $lt: endDate,
        },
      };

      const count = await Hackathon.find(query).countDocuments();
      return res.status(200).json({
        message: "Today Posted Hackathons Fetched Successfully",
        countOfHackathons: count,
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
    const adminDetails = await AuthenticAdmin(req);
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
      return res.status(200).json({
        message: "Today Posted Hackathons Fetched Successfully",
        countOfHackathons: count,
      });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const HackathonsPostedInPreviousMonthController= async(req,res,next)=>{
  try {
    const adminDetails = await AuthenticAdmin(req);
    const { message, status } = adminDetails;

    if (status === 200) {
      const { adminId } = adminDetails;
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
      return res.status(200).json({
        message: "Today Posted Hackathons Fetched Successfully",
        countOfHackathons: count,
      });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

const HackathonPostedInARangeController= async(req,res,next)=>{
    
}
const noOfBloggers= ()=>{

}

const noOfBlogs= ()=>{

}
const noOfTodayPostedBlogs= ()=>{

}
const noOfVideo= ()=>{

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
      const decoded = jwt.verify(adminToken, "vinayadmin"); // Replace "vinay" with your actual secret key
      const adminId = decoded._id;

      // Fetch user data using findOne()
      const admin = await Admin.findById(adminId);
      if (!admin) {
        return {"message": "Admin not found", status: 404}; // Use 404 for not found
      }
      else if(admin.blocked){
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


module.exports= {noOfUsers,noOfBloggers,todayRegisteredUser ,noOfBlogs,noOfHackathons,todayPostedFests,todayLastDateOfFests ,noOfBlogs, noOfVideo, noOfFests, todayLastHackathons,todayPostedHackathon,noOfTodayPostedBlogs, }