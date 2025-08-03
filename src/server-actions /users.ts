"use server";

import { connectMongoDB } from "<pages>/config/db";
import UserModel from "<pages>/models/user-model";
import { currentUser } from "@clerk/nextjs/server";
import { message } from "antd";
connectMongoDB();

export const GetCurrentUserFromMongoDB = async () => {
  try {
    const currentUserFromClerk = await currentUser();

    //check user is exist in the database and return the user data

    const user = await UserModel.findOne({
      clerkUserId: currentUserFromClerk?.id,
    });

    if (user) {
      return {
        success: true,
        data: JSON.parse(JSON.stringify(user)),
      };
    }

    //If user is not exist in the database then create a new user and return the user data}

    const newUser = new UserModel({
      name:
        currentUserFromClerk?.firstName + " " + currentUserFromClerk?.lastName,
      email: currentUserFromClerk?.emailAddresses[0].emailAddress,
      clerkUserId: currentUserFromClerk?.id,
      profilePic: currentUserFromClerk?.imageUrl,
      isActive: true,
      isAdmin: false,
    });

    await newUser.save();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newUser)),
    };
  } catch (error) {
    return {
      success: false,
      error: error,
      message: "Error while fetching from data from MongoDB",
    };
  }
};
