import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import storageService from "@/services/appwrite/storageService";
import parse from "html-react-parser";


interface PostCardProps {
    post: {
        $id: string;
        title: string;
        content: string;
        imageUrl?: string;
        youtubeUrl?: string;
        thumbnailUrl?: string;
        userName: string;
        userAvatar: string;
        $createdAt: string;
      };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  
  // Function to generate YouTube embed URL
  // const getYouTubeEmbedUrl = (url?: string): string | null => {
  //   if (!url) return null;
  //   let videoId = "";
  //   if (url.includes("youtube.com/watch?v=")) {
  //     videoId = url.split("v=")[1]?.split("&")[0];
  //   } else if (url.includes("youtu.be/")) {
  //     videoId = url.split("youtu.be/")[1]?.split("?")[0];
  //   }
  //   return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  // };

  // const embedUrl = getYouTubeEmbedUrl(post.youtubeUrl);
  console.log("Embed URL:", post.imageUrl);
  console.log("Embed After StorageSeervice:", storageService.getFilePreview(post.imageUrl? post.imageUrl : ""));

  return (

    <Card className="hover:shadow-xl hover:scale-[1.02] transition-transform duration-300 rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
  <Link to={`/post/${post.$id}`} className="block">
    {/* Header: User Info */}
    <div className="flex items-center gap-4 p-4 border-b dark:border-gray-700">
      <Avatar className="size-10 md:size-12">
        <AvatarImage src={post.userAvatar} alt={post.userName} />
        <AvatarFallback>{post.userName.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-semibold text-gray-900 dark:text-gray-100" style={{ fontSize: 'clamp(0.875rem, 1vw, 1.125rem)' }}>
          {post.userName.toLocaleUpperCase()}
        </p>
        <p className="text-gray-500 dark:text-gray-400" style={{ fontSize: 'clamp(0.75rem, 0.9vw, 1rem)' }}>
          {format(new Date(post.$createdAt), "PPpp")}
        </p>
      </div>
    </div>

    {/* Content */}
    <CardContent className="p-4 space-y-4">
      <h3 className="font-semibold text-gray-900 dark:text-white leading-snug line-clamp-1">
        {post.title}
      </h3>
      <p className="text-gray-700 dark:text-gray-300 line-clamp-1">
        {parse(post.content)}
      </p>

      {/* Image */}
      {post.imageUrl && (
        <img
          src={storageService.getFilePreview(post.imageUrl)}
          alt="Post"
          className="rounded-lg w-full object-cover h-40 sm:h-52 md:h-64 lg:h-72 transition-all duration-300"
        />
      )}

      {/* YouTube Thumbnail */}
      {post.thumbnailUrl && (
        <a href={post.youtubeUrl} target="_blank" rel="noopener noreferrer">
          <img
            src={post.thumbnailUrl}
            alt="YouTube Thumbnail"
            className="rounded-lg w-full object-cover h-40 sm:h-52 md:h-64 lg:h-72 hover:opacity-90 transition-all duration-300"
          />
        </a>
      )}
    </CardContent>
  </Link>
</Card>


//     <Card className="hover:shadow-lg hover:scale-[1.02] transition-transform duration-300 rounded-2xl overflow-hidden">
//   <Link to={`/post/${post.$id}`} className="block">
//     {/* Header: User Info */}
//     <div className="flex items-center gap-4 p-4 border-b">
//       <Avatar className="size-8 sm:size-10">
//         <AvatarImage src={post.userAvatar} alt={post.userName} />
//         <AvatarFallback>{post.userName.charAt(0)}</AvatarFallback>
//       </Avatar>
//       <div>
//         <p className="font-semibold text-gray-900 text-sm sm:text-base">{post.userName}</p>
//         <p className="text-xs sm:text-sm text-gray-500">{format(new Date(post.$createdAt), "PPpp")}</p>
//       </div>
//     </div>

//     {/* Content */}
//     <CardContent className="p-4 space-y-4">
//       <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{post.title}</h3>
//       <p className="text-gray-700 text-sm sm:text-base line-clamp-3">{post.content}</p>

//       {/* Image */}
//       {post.imageUrl && (
//         <img
//           src={storageService.getFilePreview(post.imageUrl)}
//           alt="Post"
//           className="rounded-lg w-full object-cover h-40 sm:h-52 md:h-64 transition-all duration-300"
//         />
//       )}

//       {/* YouTube Thumbnail */}
//       {post.thumbnailUrl && (
//         <a href={post.youtubeUrl} target="_blank" rel="noopener noreferrer">
//           <img
//             src={post.thumbnailUrl}
//             alt="YouTube Thumbnail"
//             className="rounded-lg w-full object-cover h-40 sm:h-52 md:h-64 hover:opacity-90 transition-all duration-300"
//           />
//         </a>
//       )}
//     </CardContent>
//   </Link>
// </Card>


// {/* <Card className="hover:shadow-lg hover:scale-105 transition-shadow duration-300 rounded-2xl overflow-hidden">
//   <Link to={`/post/${post.$id}`} className="block">
//     <div className="flex items-center gap-4 p-4 border-b">
//       <Avatar className="size-8">
//         <AvatarImage src={post.userAvatar} alt={post.userName} />
//         <AvatarFallback>{post.userName.charAt(0)}</AvatarFallback>
//       </Avatar>
//       <div>
//         <p className="font-semibold text-gray-900">{post.userName}</p>
//         <p className="text-sm text-gray-500">{format(new Date(post.$createdAt), "PPpp")}</p>
//       </div>
//     </div>

//     <CardContent className="p-4 space-y-3">
//       <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
//       <p className="text-gray-700 text-sm line-clamp-3">{post.content}</p>

//       {post.imageUrl && (
//         <img
//           src={storageService.getFilePreview(post.imageUrl)}
//           alt="Post"
//           className="rounded-lg w-full object-cover h-48"
//         />
//       )}

//       {post.thumbnailUrl && (
//         <a href={post.youtubeUrl} target="_blank" rel="noopener noreferrer">
//           <img
//             src={post.thumbnailUrl}
//             alt="YouTube Thumbnail"
//             className="rounded-lg w-full object-cover h-48 hover:opacity-90 transition"
//           />
//         </a>
//       )}
//     </CardContent>
//   </Link>
// </Card> */}


//     <Card>
//           <Link to={`/post/${post.$id}`}>
// <div className="flex items-center gap-3">
//         <Avatar>
//           <AvatarImage src={post.userAvatar} alt={post.userName} />
//           <AvatarFallback>{post.userName.charAt(0)}</AvatarFallback>
//         </Avatar>
//         <div>
//           <p className="font-semibold">{post.userName}</p>
//           <p className="text-sm text-gray-500">{format(new Date(post.$createdAt), "PPpp")}</p>
//         </div>
//       </div>

//       <CardContent className="mt-3 space-y-3">
//         <h3 className="text-lg font-semibold">{post.title}</h3>
//         <p className="text-gray-700">{post.content}</p>
        
        
//         {post.imageUrl && <img src={storageService.getFilePreview(post.imageUrl)} alt="Post" className="rounded-lg w-full" />}
//         {post.thumbnailUrl && (
//           <a href={post.youtubeUrl} target="_blank" rel="noopener noreferrer">
//             <img src={post.thumbnailUrl} alt="YouTube Thumbnail" className="rounded-lg w-full" />
//           </a>
//         )}
//       </CardContent>
//     </Link>
//     </Card>
  );
};

export default PostCard;
