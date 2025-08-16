import { Schema, model } from "mongoose";
import pkg from 'validator';
const { isEmail } = pkg;

const UserSchema = Schema({
    email : {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email!"]
    },
    district: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    }
})
const User = model('user', UserSchema, 'gcBackend')

export default User;