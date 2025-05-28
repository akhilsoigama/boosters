import connectDB from '@/app/lib/connection';
import Profile from '@/app/model/profiles';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    let query = {};
    if (userId) {
      query.userId = userId;
    }

    const profile = await Profile.find(query).populate('userId', 'fullName email');

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  await connectDB();

  try {
    const body = await request.json();
    const { name, phoneNo, bio, gender, github, youtube, linkedin, address, dob, avatar, userId } = body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid userId format" }, { status: 400 });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const existingProfile = await Profile.findOne({ userId: userObjectId });
    if (existingProfile) {
      return NextResponse.json({ message: 'Profile already exists for this user' }, { status: 409 });
    }

    const dobDate = dob ? new Date(dob) : null;
    if (dobDate && dobDate > new Date()) {
      return NextResponse.json({ message: 'Date of birth cannot be in the future' }, { status: 400 });
    }

    const newProfileData = {
      name,
      phoneNo,
      bio,
      gender,
      github,
      youtube,
      linkedin,
      address,
      dob: dobDate,
      avatar,
      userId: userObjectId,
    };

    const newProfile = new Profile(newProfileData);
    await newProfile.save();

    return NextResponse.json({ message: 'Profile has been created', newProfile }, { status: 201 });

  } catch (error) {
    console.error('Internal Server Error:', error);

    if (error.code === 11000) {
      return NextResponse.json({ message: 'Duplicate entry', error: error.keyValue }, { status: 409 });
    }

    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
