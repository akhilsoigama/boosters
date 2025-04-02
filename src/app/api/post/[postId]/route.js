import Post from '@/app/model/post/post';
import connectDB from '@/app/lib/connection';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
    await connectDB();

    try {
        const { postId } = params;

        if (!postId) {
            return NextResponse.json({ message: "Post ID is required" }, { status: 400 });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }

        await Post.findByIdAndDelete(postId);
        return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}


export async function GET(request, { params }) {
    try {
        const { postId } = params
        const post = await Post.findById(postId).populate("User_id", "fullName email avatar");
        return NextResponse.json({
            title: post.title,
            auther: post.auther,
            content: post.content,
            image: post.image,
            userId: post.User_id._id,
            user: {
                fullName: post.User_id?.fullName || "Unknown User",
                email: post.User_id?.email || "No Email",
                avatar: post.User_id?.avatar || "",
            }
        });

    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 404 })
    }

}


export async function PUT(request, { params }) {
    await connectDB();
    const { postId } = params
    const { title, content, image } = await request.json()

    try {

        const updatePost = await Post.findByIdAndUpdate(postId, { title, content, image }, { new: true })
        if (!updatePost) {
            return NextResponse.json({ messgae: 'Post not found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'Post updated successfully' }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 404 })
    }
}