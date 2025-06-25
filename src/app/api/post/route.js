import Post from '@/app/model/post/post';
import connectDB from '@/app/lib/connection';
import { NextResponse } from 'next/server';


export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const User_Id = searchParams.get('User_Id'); 

    let query = {};
    if (User_Id) {
      query.User_id = User_Id;
    }

    const posts = await Post.find(query)
      .populate('User_id', 'fullName email') 

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
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
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
