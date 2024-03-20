const mongoose= require("mongoose")

const applyForAdminController = async (req, res, next) => {
    try {
      const { email, password, ...data } = req.body;
  
      const existingAdmin = await Admin.findOne({ email: email }); // Assuming Admin model exists
      if (existingAdmin) {
        return res.status(409).json({ message: "You are already registered as an admin" }); // Use 409 for conflict
      }
  
      const saltRounds = 10; // Adjust based on security requirements (higher for more security)
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      const newAdmin = new Admin({
        ...data, // Assuming relevant data for Admin model
        email,
        password: hashedPassword,
      });
  
      await newAdmin.save(); // Assuming Admin model has a save() method
  
      res.status(201).json({ message: "Successfully applied for admin" });
    } catch (err) {
      console.error(err); // Log specific error for debugging
      res.status(err.statusCode || 500).json({ message: err.message || "Internal Server Error" });
    }
  };
  

module.exports= {applyForAdminController};