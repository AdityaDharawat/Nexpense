import dotenv from "dotenv";

dotenv.config();

const env = process.env;

export const config = {
  port: Number(env.PORT || 4000),
  nodeEnv: env.NODE_ENV || "development",
  databaseUrl: env.DATABASE_URL || "",
  jwtAccessSecret: env.JWT_ACCESS_SECRET || "change_this_access_secret",
  jwtRefreshSecret: env.JWT_REFRESH_SECRET || "change_this_refresh_secret",
  accessTokenExpiresIn: "15m",
  refreshTokenExpiresIn: "7d",
  cookieOptions: {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
  cloudinary: {
    cloudName: env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: env.CLOUDINARY_API_KEY || "",
    apiSecret: env.CLOUDINARY_API_SECRET || "",
  },
};
