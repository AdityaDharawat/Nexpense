import { nanoid } from "nanoid";
import { compareHash, hashValue } from "../utils/hash.util";
import { signAccessToken, signRefreshToken } from "../utils/jwt.util";
import prisma from "../prisma/client";

export const registerUser = async (name: string, email: string, password: string) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await hashValue(password);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  return user;
};

export const authenticateUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await compareHash(password, user.password);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  return user;
};

export const createTokenPair = async (user: { id: string; email: string; role: string; name?: string | null }) => {
  const payload = { id: user.id, email: user.email, role: user.role, name: user.name };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken,
      expiresAt,
    },
  });

  return { accessToken, refreshToken };
};

export const revokeRefreshToken = async (refreshToken: string) => {
  await prisma.session.deleteMany({ where: { refreshToken } });
};

export const locateSession = async (refreshToken: string) => {
  return prisma.session.findFirst({ where: { refreshToken, expiresAt: { gt: new Date() } }, include: { user: true } });
};

export const generatePasswordResetToken = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }

  const token = nanoid(32);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: {
      passwordResetToken: token,
      passwordResetExpires: expiresAt,
    },
  });

  return token;
};

export const resetPassword = async (token: string, password: string) => {
  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetExpires: { gt: new Date() },
    },
  });
  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  const hashedPassword = await hashValue(password);
  return prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });
};
