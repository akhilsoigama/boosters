import Post from '@/app/model/post/post';
import connectDB from '@/app/lib/connection';
import { NextResponse } from 'next/server';

// ✅ GET /api/post/[postId]
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { postId } = params;

    if (!postId) {
      return NextResponse.json({ message: 'Post ID is required' }, { status: 400 });
    }

    const post = await Post.findById(postId).populate('User_id', 'fullName email avatar');
    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({
      title: post.title,
      auther: post.auther,
      content: post.content,
      image: post.image,
      userId: post.User_id?._id || null,
      user: {
        fullName: post.User_id?.fullName || 'Unknown User',
        email: post.User_id?.email || 'No Email',
        avatar: post.User_id?.avatar || '',
      },
    });
  } catch (error) {
    console.error('GET /api/post/[postId]:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// ✅ PUT /api/post/[postId]
export async function PATCH(request, { params }) {
    try {
      await connectDB();
      const { postId } = params;
      const data = await request.json();
  
      if (!postId) {
        return NextResponse.json({ message: 'Post ID is required' }, { status: 400 });
      }
  
      const updatedPost = await Post.findByIdAndUpdate(postId, data, {
        new: true,
        runValidators: true,
      });
  
      if (!updatedPost) {
        return NextResponse.json({ message: 'Post not found' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Post updated successfully', post: updatedPost }, { status: 200 });
    } catch (error) {
      console.error('PATCH /api/post/[postId]:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }
  

// ✅ DELETE /api/post/[postId]
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { postId } = params;

    if (!postId) {
      return NextResponse.json({ message: 'Post ID is required' }, { status: 400 });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    await Post.findByIdAndDelete(postId);
    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/post/[postId]:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
