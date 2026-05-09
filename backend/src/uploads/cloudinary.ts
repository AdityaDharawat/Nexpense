import { v2 as cloudinary } from "cloudinary";
import { config } from "../config/config";

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export const uploadReceipt = async (fileBuffer: Buffer, filename: string) => {
  return new Promise<{ url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "expense-tracker/receipts",
        public_id: filename,
        overwrite: true,
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Cloudinary upload failed"));
        }
        resolve({ url: result.secure_url });
      }
    );

    stream.end(fileBuffer);
  });
};
