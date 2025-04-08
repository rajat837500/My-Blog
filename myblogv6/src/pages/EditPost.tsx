import React, { useEffect, useState } from "react";
import { PostForm } from "../components/index";
import PostService from "../services/appwrite/postService";
import { useNavigate, useParams } from "react-router-dom";
import { Models } from "appwrite";

const EditPost: React.FC = () => {
  const [post, setPost] = useState<Models.Document | null>(null);
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) {
      navigate("/");
      return;
    }

    PostService.getPost(slug).then((post) => {
      if (post) setPost(post);
    });
  }, [slug, navigate]);

  return post ? (
    <div className="py-8 mt-10">
        <PostForm post={{ $id: post.$id, title: post.title, content: post.content, status: post.status }} />
    </div>
  ) : null;
};

export default EditPost;
