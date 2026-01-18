import { db } from "../db/drizzle.js"
import { otps } from "../db/schema/otp.js"

// export const  saveOTP=async(userId:string,code:string)=>{

//     await db.insert(otps).values({userId,code,expiresAt:new Date(Date.now()+2*60*1000)});
// }