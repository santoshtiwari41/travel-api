import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
interface tokenPayload {
    userId: string;
    email?: string;
    fullName?: string;
    role?: string;
}
const JWT_SECRET = process.env.JWT_SECRET as string;

export const generateToken = (payload: tokenPayload, expiresIn: SignOptions['expiresIn'] = "15m") => {
 const options: SignOptions = {
    algorithm: "HS256",
    expiresIn: expiresIn,
  };
    const token = jwt.sign(payload, JWT_SECRET, options);
    return token;
}


export const verifyToken = <T = JwtPayload>(token: string): T => {
  return jwt.verify(token, JWT_SECRET) as T;
};