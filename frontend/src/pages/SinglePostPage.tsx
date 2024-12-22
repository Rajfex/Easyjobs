import { useParams } from "react-router-dom";
import { getPostById } from "../api";
import { useEffect, useState } from "react";
import { Post } from "../types";

export const SinglePostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPostById(Number(id));
        setPost(response.data);
      } catch (error: any) {
        setError("Failed to fetch the post. Please try again.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      {post ? (
        <div className="bg-white shadow-md rounded p-4">
          <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
          <p className="text-gray-700">{post.content}</p>
          
        </div>

      ) : (
        <div>Post not found.</div>
      )}
    </div>
  );
};
