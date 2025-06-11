import connectDB from '@/app/lib/connection';
import Profile from '@/app/model/profiles';
import User from '@/app/model/users';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const query = userId ? { userId } : {};

    const profiles = await Profile.find(query).populate(
      'userId',
      'fullName email'
    );
    return NextResponse.json(profiles, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await connectDB();

  try {
    const body = await request.json();
    const {
      name,
      phoneNo,
      bio,
      gender,
      github,
      youtube,
      linkedin,
      address,
      dob,
      avatar,
      userId,
    } = body;

    // Validate userId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: 'Invalid userId format' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check for existing profile
    const existingProfile = await Profile.findOne({ userId });
    if (existingProfile) {
      return NextResponse.json(
        { message: 'Profile already exists for this user' },
        { status: 409 }
      );
    }

    // Validate DOB
    const dobDate = dob ? new Date(dob) : null;
    if (dobDate && dobDate > new Date()) {
      return NextResponse.json(
        { message: 'DOB cannot be in the future' },
        { status: 400 }
      );
    }

    // Create new profile
    const newProfile = new Profile({
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
      userId,
    });

    await newProfile.save();

    // Populate userId for response
    const populatedProfile = await Profile.findById(newProfile._id).populate(
      'userId',
      'fullName email'
    );

    return NextResponse.json(
      { message: 'Profile has been created', newProfile: populatedProfile },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST error:', error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          message: 'Duplicate entry',
          error: error.keyPattern,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        message: 'Internal server error',
        error: error.message,
      },
      { status: 500 }
    );
  }
}