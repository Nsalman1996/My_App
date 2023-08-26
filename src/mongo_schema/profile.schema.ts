import { model, Schema } from "mongoose";
import { IProfile } from "../model/profile.model";

const profileScheme = new Schema({
    // profile_id:{ type: mongoose.Type,ObjectId, required: true, default: () => nanoid(7), index: { unique: true } },
    name:{type:String},
    password:{type:String},
    email:{type:String},
    mobile:{type:Number},
    profile_pic:{type:String,default:()=>""},
    create:{type: Date,immutable:true,default:()=>Date.now()},
    updated:{type:Date,default:()=> Date.now()}
})

export default model<IProfile>("profile",profileScheme,"profile");