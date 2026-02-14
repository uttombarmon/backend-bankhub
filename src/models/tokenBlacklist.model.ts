import mongoose from "mongoose";

const tokenBlacklistSchema = new mongoose.Schema({
    token:{
        type:String,
        required:true
    }
},{timestamps:true})
tokenBlacklistSchema.index({createdAt:1},{expireAfterSeconds:60*60*24})

export const TokenBlacklistModel = mongoose.model("TokenBlacklist",tokenBlacklistSchema)

    