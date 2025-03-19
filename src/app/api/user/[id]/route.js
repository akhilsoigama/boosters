import User from '@/app/model/users';
import connectDB from '@/app/lib/connection';
import { NextResponse } from 'next/server';

export async function GET(request, context) {
  await connectDB();
  const { id } = await context.params;  

  try {
    const user = await User.findById(id).select('-password');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
