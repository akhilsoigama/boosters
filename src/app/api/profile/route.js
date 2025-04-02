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
        const { name, phoneNo, bio, gender, github, youtube, linkedin, address, dob, profilePicture, User_id } = body;

        if (!User_id || !mongoose.Types.ObjectId.isValid(User_id)) {
            console.error("Invalid or missing User ID");
            return NextResponse.json({ message: "Invalid User ID format" }, { status: 400 });
        }
        const userObjectId = new mongoose.Types.ObjectId(User_id);

        console.log("Converted User ObjectId:", userObjectId);

        const existingProfile = await Profile.findOne({ User_id: userObjectId });
        console.log("Existing Profile:", existingProfile);

        if (existingProfile) {
            return NextResponse.json({ message: "Profile already exists for this user" }, { status: 409 });
        }

        const dobDate = dob ? new Date(dob) : null;
        if (dobDate && dobDate > new Date()) {
            return NextResponse.json({ message: "Date of birth cannot be in the future" }, { status: 400 });
        }

        const newProfileData = {
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
      };
      console.log("New Profile Data Before Save:", newProfileData);
      
      const newProfile = new Profile(newProfileData);
      
        await newProfile.save();
        return NextResponse.json({ message: "Profile has been created", newProfile }, { status: 201 });

    } catch (error) {
        console.error("Internal Server Error:", error);
        return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
    }
}

export async function PATCH(request, { params }) {
  await connectDB();
  try {
      const body = await request.json();
      const { phoneNo, bio, gender, github, youtube, linkedin, address, dob, profilePicture } = body;
      const { name } = params;

      const updatedProfile = await Profile.findOneAndUpdate(
          { name }, 
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
