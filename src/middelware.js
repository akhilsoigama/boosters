import { NextResponse } from 'next/server';

export function middleware(req) {
    const token = req.cookies.get('token')?.value;
    
    console.log("🚀 Middleware Token:", token);

    if (!token) {
        return NextResponse.redirect(new URL('/Auth/signup', req.url));
    }

    return NextResponse.next();
}
