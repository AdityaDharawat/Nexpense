import jwt from "jsonwebtoken";
import { config } from "../config/config";

export const signAccessToken = (payload: Record<string, any>) => {
  return jwt.sign(payload, config.jwtAccessSecret, {
    expiresIn: config.accessTokenExpiresIn,
  });
};

export const signRefreshToken = (payload: Record<string, any>) => {
  return jwt.sign(payload, config.jwtRefreshSecret, {
    expiresIn: config.refreshTokenExpiresIn,
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, config.jwtAccessSecret) as Record<string, any>;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.jwtRefreshSecret) as Record<string, any>;
};
