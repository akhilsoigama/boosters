import Profile from '@/app/model/profiles';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

mongoose.connect(process.env.MONGODB_URI);

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const updateData = {
      name: body.name,
      bio: body.bio,
      avatar: body.avatar,
      phone: body.phoneNo,
      address: body.address,
      dateOfBirth: body.dob,
      gender: body.gender,  
      youTube: body.youtube,
      linkedIn: body.linkedin,
      github: body.github,
    };

    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === '') {
        delete updateData[key];
      }
    });

    const updatedProfile = await Profile.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProfile) {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProfile, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Error updating profile' }, { status: 500 });
  }
}
