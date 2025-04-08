import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PostService from "../services/appwrite/postService";
import storageService from "@/services/appwrite/storageService";
import { Button } from "../components/index";
import parse from "html-react-parser";
import { useAppSelector } from "../store/hooks";


// Define Post Type
interface PostType {
  $id: string;
  title: string;
  content: string;
  userId: string;
  imageUrl?: string;
  youtubeUrl?: string;
}

export default function Post() {
  const [post, setPost] = useState<PostType | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const userData = useAppSelector((state) => state.auth.userData);

  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    if (slug) {
      PostService.getPost(slug).then((post) => {
        if (post) {
          const formattedPost: PostType = {
            $id: post.$id,
            title: post.title,
            content: post.content,
            userId: post.userId,
            imageUrl: post.imageUrl,
            youtubeUrl: post.youtubeUrl,
          };
          setPost(formattedPost);
        } else {
          navigate("/");
        }
      });
    } else {
      navigate("/");
    }
  }, [slug, navigate]);

  const deletePost = async () => {
    if (post) {
      await PostService.deletePost(post.$id);
      if (post.imageUrl) {
        if (post. imageUrl) {
          await storageService.deleteImage(post. imageUrl);
        }
        navigate("/");
      }
    }
  };

  // Function to get YouTube embed URL
  const getYouTubeEmbedUrl = (url?: string): string | null => {
    if (!url) return null;
    let videoId = "";
    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1]?.split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const embedUrl = getYouTubeEmbedUrl(post?.youtubeUrl);
  console.log("Embed URL:", post?. imageUrl);
  console.log("Embed After StorageSeervice:", storageService.getFilePreview(post?. imageUrl ? post. imageUrl : ""));

  return post ? (
    <div className="py-8 relative mt-10">

        {/* Post Image or YouTube Video */}
        <div className="w-full flex justify-center mb-4 relative rounded-xl p-2 min-h-[500px]">
          {embedUrl ? (
            <iframe
              className="rounded-xl w-full max-w-[800px] h-auto max-h-[500px] object-cover mx-auto"
              src={embedUrl}
              title="YouTube Video"
              allowFullScreen
            ></iframe>
          ) : (
            post. imageUrl && (
              <img
                src={storageService.getFilePreview(post. imageUrl)}
                alt={post.title}
                className="rounded-xl w-full max-w-[800px] h-auto max-h-[500px] object-cover mx-auto"
              />
            )
          )}

          {/* Edit & Delete Buttons (only for author) */}
          {isAuthor && (
            <div className="absolute right-6 top-6 flex flex-row space-x-3">
              <Link to={`/edit-post/${post.$id}`}>
                <Button className="px-6 bg-green-500">
                  Edit
                </Button>
              </Link>
              <Button className="p-4 bg-red-500" onClick={() => setShowConfirm(true)}>
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Post Title & Content */}
        <div className="w-full mb-6 px-4">
          <h1 className="text-2xl font-bold text-gray-100">{post.title}</h1>
        </div>
        <div className="browser-css text-gray-100 px-5">{parse(post.content)}</div>


      {/* Confirmation Popup */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg w-80 text-center border border-gray-300">
            <p className="mb-4 font-semibold text-lg">Are you sure you want to delete this post?</p>
            <div className="flex justify-between">
              <button
                onClick={() => {
                  deletePost();
                  setShowConfirm(false);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : null;
}
