import User from '@/app/model/users';
import connectDB from '@/app/lib/connection';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(req, { params }) {
    await connectDB();

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    try {
        const user = await User.findById(id).select('-password');
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error('User fetch error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
