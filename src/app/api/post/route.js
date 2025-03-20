import Post from '@/app/model/post/post';
import connectDB from '@/app/lib/connection';
import { NextResponse } from 'next/server';

export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit')) || 10; 
    const skip = parseInt(searchParams.get('skip')) || 0; 
      
    const posts = await Post.find()
    .populate('User_id', 'fullName email') 
    .skip(skip)
    .limit(limit); 

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  await connectDB();
  const { title, content, auther, image, User_id } = await request.json();

  try {
    const existingPost = await Post.findOne({ auther });
    if (existingPost) {
      return NextResponse.json({ message: 'A post with this author already exists' }, { status: 400 });
    }

    const createPost = new Post({
      title,
      content,
      auther,
      image,
      User_id,
    });

    await createPost.save();
    return NextResponse.json({ message: 'Post has been created', createPost }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
