// import { NextResponse } from 'next/server';

// const protectedRoutes = ['/', '/dashboard', '/profile'];

// export async function middleware(req) {
//   const { pathname } = req.nextUrl;

//   if (protectedRoutes.includes(pathname)) {
//     const token = req.cookies.get('token')?.value;
   
//     if (!token) {
//       return NextResponse.redirect(new URL('/Auth/signup', req.url));
//     }
//   }

//   return NextResponse.next();
// }