import axios from "axios";
import { AppError } from "./appError.js";

export async function verifyGoogleToken(idToken: string) {
  try {
    const response = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
    );

    const user = response.data;
    if (user.aud !== process.env.GOOGLE_CLIENT_ID) {
      throw new AppError("Invalid token audience", 401);
    }

    return {
      email: user.email,
      name: user.name,
      picture: user.picture,
    };
  } catch (error) {
    throw new AppError("Invalid Google Token", 401);
  }
}