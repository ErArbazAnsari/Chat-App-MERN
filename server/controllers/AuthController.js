import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { renameSync, unlinkSync } from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, {
        expiresIn: maxAge,
    });
};

export const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("Email and password are required");
        }
        const user = await User.create({ email, password });
        // console.log({ user });
        res.cookie("jwt", createToken(email, user._id), {
            maxAge,
            secure: true,
            sameSite: "None",
        });
        return res.status(201).send({
            user: {
                id: user._id,
                email: user.email,
                profileSetup: user.profileSetup,
            },
        });
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal server error");
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("Email and password are required");
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found");
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).send("Invalid password");
        }
        res.cookie("jwt", createToken(email, password), {
            maxAge,
            secure: true,
            sameSite: "None",
        });
        return res.status(200).send({
            user: {
                id: user._id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color,
            },
        });
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal server error");
    }
};

export const getUserInfo = async (req, res, next) => {
    try {
        
        const userData = await User.findById(req.userId);
        if (!userData) {
            return res.status(404).send("User not found");
        }
        return res.status(200).send({
            id: userData._id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
        });
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal server error");
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const { firstName, lastName, color } = req.body;
        if (!firstName || !lastName || !color) {
            return res
                .status(400)
                .send("First name, last name, and color are required");
        }

        const userData = await User.findByIdAndUpdate(
            req.userId,
            {
                firstName,
                lastName,
                color,
                profileSetup: true,
            },
            { new: true, runValidators: true }
        );

        if (!userData) {
            return res.status(404).send("User not found");
        }
        return res.status(200).send({
            id: userData._id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
        });
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal server error");
    }
};

export const updateProfileImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send("Profile image are required");
        }

        const date = Date.now();
        let fileName = "uploads/profiles/" + date + req.file.originalname;
        renameSync(req.file.path, fileName); // move the image to the uploads folder

        const userData = await User.findByIdAndUpdate(
            req.userId,
            {
                image: fileName,
            },
            { new: true, runValidators: true }
        );

        return res.status(200).send({
            image: userData.image,
        });
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal server error");
    }
};

export const removeProfileImage = async (req, res, next) => {
    try {
        const userData = await User.findById(req.userId);
        if (!userData) {
            return res.status(404).send("User not found");
        }

        if (userData.image) {
            unlinkSync(userData.image); // remove the image from the server
        }
        userData.image = null; // remove the image from the user object
        await userData.save(); // save the changes to the database

        return res.status(200).send("Profile image removed successfully");
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal server error");
    }
};
