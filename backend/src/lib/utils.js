import cloudinary from "./cloudinary.js";

export const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });

    return result.secure_url;
  } catch (error) {
    console.log("Error uploading file to Cloudinary: ", error);
    throw new error("Error uploading file to Cloudinary",error);
  }
};