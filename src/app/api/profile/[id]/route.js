// src/app/api/profile/[id]/route.js
import connectDB from '@/app/lib/connection';
import Profile from '@/app/model/profiles';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function PATCH(request, { params }) {
  await connectDB();

  try {
    console.log("Params received in API:", params);
    const { id } = params;
    const profileId = String(id);

    console.log("Extracted ID:", profileId, "Type:", typeof profileId); 

    if (!profileId || !mongoose.Types.ObjectId.isValid(profileId)) {
      return NextResponse.json({ message: "Invalid profile ID" }, { status: 400 });
    }

    const body = await request.json();
    const { phoneNo, bio, gender, github, youtube, linkedin, address, dob, profilePicture } = body;

    console.log("Updating profile with ID:", profileId);
    console.log("Update Data:", body); 

    const updatedProfile = await Profile.findByIdAndUpdate(
      profileId,
      { $set: { phoneNo, bio, gender, github, youtube, linkedin, address, dob, profilePicture } },
      { new: true }
    );

    if (!updatedProfile) {
      return NextResponse.json({ message: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Profile updated successfully", updatedProfile }, { status: 200 });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}
