import mongoose, { model, models } from "mongoose";

const commentSchema=new mongoose.Schema({
    comment:{
        type:String,
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        required:true,
    }
},{timestamps:true});

const Comment=models.Comment || model("Comment",commentSchema);
export default Comment;