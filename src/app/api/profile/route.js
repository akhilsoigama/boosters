import connectDB from '@/app/lib/connection';
import Profile from '@/app/model/profiles';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function GET(req) {
    await connectDB();
  
    try {
      const { searchParams } = new URL(req.url);
      const User_Id = searchParams.get('User_Id'); 
  
      let query = {};
      if (User_Id) {
        query.User_id = User_Id;
      }
  
      const profile = await Profile.find(query)
        .populate('User_id', 'fullName email') 
  
      return NextResponse.json(profile, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }
export async function POST(request) {
    await connectDB();
    try {
        const body = await request.json();
        const { name,phoneNo, bio, gender, github, youtube, linkedin, address, dob, profilePicture, User_id } = body;
        const mongoose = require("mongoose");
        const userObjectId = mongoose.Types.ObjectId.isValid(User_id) ? new mongoose.Types.ObjectId(User_id) : null;
        if (!userObjectId) {
            return NextResponse.json({ message: "Invalid User ID format" }, { status: 400 });
        }

        const dobDate = new Date(dob);
        if (dobDate > new Date()) {
            return NextResponse.json({ message: "Date of birth cannot be in the future" }, { status: 400 });
        }

        const newProfile = new Profile({
            phoneNo,
            name,
            bio,
            gender,
            github,
            youtube,
            linkedin,
            address,
            dob: dobDate,
            profilePicture,
            User_id: userObjectId,
        });

        await newProfile.save();
        return NextResponse.json({ message: 'Profile has been created', newProfile }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}

export async function PATCH(request, { params }) {
  await connectDB();
  try {
      const body = await request.json();
      const { phoneNo, bio, gender, github, youtube, linkedin, address, dob, profilePicture } = body;
      const { name } = params; // Extracting `name` from URL params

      // Find user profile by name
      const updatedProfile = await Profile.findOneAndUpdate(
          { name }, // Match by `name` instead of `User_id`
          { $set: { phoneNo, bio, gender, github, youtube, linkedin, address, dob, profilePicture } },
          { new: true }
      );

      if (!updatedProfile) {
          return NextResponse.json({ message: "Profile not found" }, { status: 404 });
      }

      return NextResponse.json({ message: "Profile updated successfully", updatedProfile }, { status: 200 });
  } catch (error) {
      return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}
