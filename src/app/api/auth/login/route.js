import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import connectDB from '@/app/lib/connection';
import User from '@/app/model/users';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await connectDB();
  try {
    const { email, password } = await request.json();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const response = NextResponse.json({ message: 'Login successful' });
    response.headers.append('Set-Cookie', cookie.serialize('token', token, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60
    }));

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
