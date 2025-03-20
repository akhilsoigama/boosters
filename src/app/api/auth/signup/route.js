import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import connectDB from '@/app/lib/connection';
import User from '@/app/model/users';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await connectDB();
  try {
    const { fullName, email, password } = await request.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) return NextResponse.json({ message: 'User already exists' }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const response = NextResponse.json({ message: 'User registered successfully' });
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
