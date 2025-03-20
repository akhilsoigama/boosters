import { NextResponse } from 'next/server';
import cookie from 'cookie';

export async function POST() {
  try {
    const response = NextResponse.json({ message: 'Logout successful' });

    response.headers.append('Set-Cookie', cookie.serialize('token', '', {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      expires: new Date(0), 
    }));

    return response;
  } catch (err) {
    console.error('Logout Error:', err);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
