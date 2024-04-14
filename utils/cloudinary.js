const { promises: fs } = require("fs"); // Use promises for asynchronous operations
const cloudinary= require("cloudinary")


cloudinary.config({
  cloud_name: 'dtfm26qxn',
  api_key: '828947776983971',
  api_secret: 'BSfzyjLEX5nwIQOBJ9_PRo5hc-U' // Replace with your actual credentials
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      throw new Error('No file path provided'); // Throw an error for missing file path
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto', // Automatically detect resource type
    });

    console.log("File uploaded successfully:", response.url);
    return response;
  } catch (error) {
    console.error("Error uploading file:", error.message);

    // try {
    //   // Attempt to delete the local file if upload fails (assuming it's a temporary file)
    //   await fs.unlink(localFilePath);
    //   console.log("Local file deleted (optional):", localFilePath);
    // } catch (deleteError) {
    //   console.error("Failed to delete local file:", deleteError.message);
    // }

    return null; // Return null to indicate upload failure
  }
};

module.exports = { uploadOnCloudinary };
