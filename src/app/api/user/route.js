import User from '@/app/model/users';
import connectDB from '@/app/lib/connection';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB();
  try {
    const users = await User.find().select('-password');
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching users', error: error.message }, { status: 500 });
  }
}
