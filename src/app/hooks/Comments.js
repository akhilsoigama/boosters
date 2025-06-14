import axios from 'axios';
import useSWR from 'swr';

const fetcher = (url) => axios.get(url).then(res => res.data);

export const useComments = (postId) => {
  const shouldFetch = Boolean(postId);
  const { data, error, mutate, isLoading } = useSWR(
    shouldFetch ? `${process.env.NEXT_PUBLIC_API}/comments/${postId}` : null,
    fetcher
  );

  return {
    comments: data?.comments || [],
    isLoading,
    isError: error,
    mutate,
  };
};

export const useAddComment = () => {
  const addComment = async ({ postId, comment, userId, userName }) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API}/comment`, {
      postId,
      comment,
      userId,
      userName,
    });
    return res.data;
  };

  return { addComment };
};

export const useUpdateComment = () => {
  const updateComment = async ({ commentId, content }) => {
    const res = await axios.put(`${process.env.NEXT_PUBLIC_API}/comment/${commentId}`, {
      content,
    });
    return res.data;
  };

  return { updateComment };
};

export const useDeleteComment = () => {
  const deleteComment = async (commentId) => {
    const res = await axios.delete(`${process.env.NEXT_PUBLIC_API}/comment/${commentId}`);
    return res.data;
  };

  return { deleteComment };
};

export const useLikeCount = (postId) => {
  const shouldFetch = Boolean(postId);
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `${process.env.NEXT_PUBLIC_API}/like-count/${postId}` : null,
    fetcher
  );

  return {
    count: data?.count || 0,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useToggleLike = () => {
  const toggleLike = async ({ postId, userId }) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API}/like`, {
      postId,
      userId,
    });
    return res.data; 
  };

  return { toggleLike };
};

export const useCommentCount = (postId) => {
  const shouldFetch = Boolean(postId);
  const { data, error, isLoading } = useSWR(
    shouldFetch ? `${process.env.NEXT_PUBLIC_API}/comment-count/${postId}` : null,
    fetcher
  );

  return {
    count: data?.count || 0,
    isLoading,
    isError: error,
  };
};
