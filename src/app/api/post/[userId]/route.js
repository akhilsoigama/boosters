import Post from '@/app/model/post/post';
import connectDB from '@/app/lib/connection';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  await connectDB();
  const { userId } = params;

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit')) || 10; 

  try {
    const posts = await Post.find({ User_id: userId }).limit(limit);
    if (posts.length === 0) {
      return NextResponse.json({ message: 'No posts found for this user' }, { status: 404 });
    }
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
