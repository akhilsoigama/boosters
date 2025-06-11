import connectDB from '@/app/lib/connection';
import Profile from '@/app/model/profiles';
import { NextResponse } from 'next/server';

export async function PATCH(request, { params }) {
  await connectDB();

  try {
    const { id } = params;
    const body = await request.json();

    const updateData = {
      name: body.name,
      bio: body.bio,
      avatar: body.avatar,
      phoneNo: body.phoneNo,
      address: body.address,
      dob: body.dob,
      gender: body.gender,
      youtube: body.youtube,
      linkedin: body.linkedin,
      github: body.github,
    };

    Object.keys(updateData).forEach((key) => {
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
    console.error('PATCH error:', err);
    return NextResponse.json({ message: 'Error updating profile', error: err.message }, { status: 500 });
  }
}
