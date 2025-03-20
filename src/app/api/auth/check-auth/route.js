import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/app/model/users';
import connectDB from '@/app/lib/connection';
import { cookies } from 'next/headers';

export async function GET() {
    await connectDB();
    try {
        const cookieStore = cookies();  // NEXT.JS helper for cookies
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ isLoggedIn: false }, { status: 200 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return NextResponse.json({ isLoggedIn: false }, { status: 200 });
        }

        return NextResponse.json({ isLoggedIn: true, user }, { status: 200 });
    } catch (err) {
        console.error('Auth check error:', err);
        return NextResponse.json({ isLoggedIn: false }, { status: 500 });
    }
}
