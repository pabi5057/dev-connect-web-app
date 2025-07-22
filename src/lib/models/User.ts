import mongoose, { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    profilePicture: String,
    contact:String,
    dob:String,
}, { timestamps: true });

const User = models.User || model("User", userSchema);

export default User;