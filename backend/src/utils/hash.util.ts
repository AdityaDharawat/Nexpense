import bcrypt from "bcryptjs";

export const hashValue = async (value: string) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(value, salt);
};

export const compareHash = async (value: string, hash: string) => {
  return bcrypt.compare(value, hash);
};
