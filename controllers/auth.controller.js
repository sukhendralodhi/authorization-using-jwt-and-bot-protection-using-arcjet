import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

export const signUp = async (req, res, next) => {
    // implementation of sign up logic here
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Extract user data from request body and create a new user
        const { name, email, password } = req.body;
        //check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error("User already exists");
            error.statusCode = 409;
            throw error;
        }
        //hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create a new user
        const newUsers = await User.create(
            [
                {
                    name,
                    email,
                    password: hashedPassword,
                }
            ], { session }
        );
        const token = jwt.sign(
            {
                userId: newUsers[0]._id
            },
            JWT_SECRET,
            {
                expiresIn: JWT_EXPIRES_IN
            });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                user: newUsers[0],
                token
            }
        });


    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }

}

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            const error = new Error("Email and password are required");
            error.statusCode = 400;
            throw error;
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const error = new Error("Invalid credentials");
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            {
                userId: user._id
            },
            JWT_SECRET,
            {
                expiresIn: JWT_EXPIRES_IN
            }
        )

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: {
                // user,
                token
            }
        });

    } catch (error) {
        next(error);
    }
}
export const signOut = async (req, res, next) => {
    try {
        res.clearCookie('token');
        
        return res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });
            
    } catch (error) {
        next(error);
    }

}