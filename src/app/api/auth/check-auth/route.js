import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/app/model/users';
import connectDB from '@/app/lib/connection';

export async function GET(req) {
    await connectDB();
    try {
        const token = req.cookies.get('token')?.value;
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
        console.log('Auth check error:', err);
        return NextResponse.json({ isLoggedIn: false }, { status: 500 });
    }
}
