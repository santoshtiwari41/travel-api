import { AppError } from "../utils/appError.js";

export const getUserProfile = async () => {
  const user = {
    id: 1,
    name: "John Doe",
    email: "john@gmail.com",
  };

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.email) {
    throw new AppError("User email missing", 400);
  }

  return user;
};
