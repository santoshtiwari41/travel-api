import EventEmitter from "events";

export const emailEvent=new EventEmitter()
emailEvent.on('registration',async({email,otp})=>{
     console.log('the otp sending to this email and otp is ',email,otp)
})