// src/app/api/auth/[action]/route.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import connectDB from '@/app/lib/connection';
import User from '@/app/model/users';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  const { action } = params;
  console.log('API Called:', action);

  await connectDB();

  if (action === 'signup') return signup(request);
  if (action === 'login') return login(request);
  if (action === 'logout') return logout();

  return NextResponse.json({ message: 'Route not found' }, { status: 404 });
}

export async function GET(request, { params }) {
  const { action } = params;
  if (action === 'check-auth') return checkAuth(request);
  return NextResponse.json({ message: 'Route not found' }, { status: 404 });
}

const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in .env');
  }
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const signup = async (request) => {
  try {
    const { fullName, email, password } = await request.json();
    console.log('Signup Attempt:', email);

    const existingUser = await User.findOne({ email });
    if (existingUser) return NextResponse.json({ message: 'User already exists' }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, password: hashedPassword });
    await newUser.save();

    const token = generateToken(newUser);
    const response = NextResponse.json({ message: 'User registered successfully' });
    setTokenCookie(response, token);
    return response;
  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
};

const login = async (request) => {
  try {
    const { email, password } = await request.json();
    console.log('Login Attempt:', email);

    const user = await User.findOne({ email });
    console.log('User Found:', user?._id || 'No User Found');

    if (!user) return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });

    const token = generateToken(user);
    const response = NextResponse.json({ message: 'Login successful' });
    setTokenCookie(response, token);
    return response;
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
};

const logout = () => {
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.headers.append('Set-Cookie', cookie.serialize('token', '', {
    httpOnly: true,
    path: '/',
    maxAge: -1
  }));
  return response;
};

const checkAuth = async (request) => {
  try {
    const cookies = cookie.parse(request.headers.get('cookie') || '');
    const token = cookies.token;
    if (!token) return NextResponse.json({ isLoggedIn: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.json({ isLoggedIn: true, user: { id: decoded.id, email: decoded.email } });
  } catch (error) {
    console.error('JWT Error:', error);
    return NextResponse.json({ isLoggedIn: false });
  }
};

const setTokenCookie = (response, token) => {
  response.headers.append('Set-Cookie', cookie.serialize('token', token, {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
  }));
};
