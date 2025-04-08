import React, { useEffect, useState } from "react";
import { fetchMyPosts } from "../store/postSlice";
import { PostCard } from "../components/index";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Models } from "appwrite";

const MyPosts: React.FC = () => {
    const dispatch = useAppDispatch();
    const { myPosts, status, error } = useAppSelector((state) => state.post);
    const user = useAppSelector((state) => state.auth.userData);
    
    const location = useLocation();
    const [message, setMessage] = useState<string>(location.state?.message || "");

    useEffect(() => {
        if (user?.$id) {
            dispatch(fetchMyPosts(user.$id));
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    if (status === "loading") return <div className="postDisplay"><h1 className="text-gray-100">Loading...</h1></div>;
    if (status === "failed") return <div className="postDisplay"><h1 className="text-gray-100">Error: {error}</h1></div>;
    if (myPosts.length === 0) return <div className="postDisplay"><h1 className="text-gray-100">No Posts Found</h1></div>;

    return (
        <div className="postDisplay">
            {message && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
                    {message}
                </div>
            )}
            <div className="w-full max-w-5xl px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                {myPosts.map((post: Models.Document) => {
                    const formattedPost = {
                        $id: post.$id,
                        title: post.title || "Untitled",
                        content: post.content || "No content available",
                        imageUrl: post.imageUrl,
                        youtubeUrl: post.youtubeUrl,
                        thumbnailUrl: post.thumbnailUrl,
                        userName: post.userName || "Anonymous",
                        userAvatar: post.userAvatar || "",
                        $createdAt: post.$createdAt,
                    };
                    return (
                        <div key={formattedPost.$id} className="w-full">
                            <PostCard post={formattedPost} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MyPosts;
