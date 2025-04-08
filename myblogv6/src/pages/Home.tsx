import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks"; // Ensure correct hooks are imported
import { fetchPosts } from "../store/postSlice";
import { PostCard } from "../components/index"; // Ensure correct path to PostCard
import { Models } from "appwrite";

const Home: React.FC = () => {
    const dispatch = useAppDispatch();
    const { posts, status, error } = useAppSelector((state) => state.post);

    useEffect(() => {
        dispatch(fetchPosts()); // Fetch posts on component mount
    }, [dispatch]);

    if (status === "loading") {
        return (
            <div className="postDisplay">
                <h1 className="text-gray-100">Loading...</h1>
            </div>
        );
    }

    if (status === "failed") {
        return <h1 className="text-gray-100">Error: {error}</h1>;
    }

    return (
        <div className="relative min-h-screen w-full flex justify-center items-center py-10 mt-10">
            <div className="w-full max-w-5xl px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {posts?.map((post: Models.Document) => (
                    <div key={post.$id} className="w-full">
                        <PostCard
                            post={{
                                $id: post.$id,
                                title: post.title || "Untitled",
                                content: post.content || "No content available",
                                imageUrl: post.imageUrl,
                                youtubeUrl: post.youtubeUrl,
                                thumbnailUrl: post.thumbnailUrl,
                                userName: post.userName || "Anonymous",
                                userAvatar: post.userAvatar || "",
                                $createdAt: post.$createdAt,
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
