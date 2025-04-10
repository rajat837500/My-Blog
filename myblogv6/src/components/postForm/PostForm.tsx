import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input, RTE, Select } from "../index";
import appwriteService from "../../services/appwrite/postService";
import postService from "@/services/appwrite/postService";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import extractYouTubeThumbnail from "../../utils/ExtractYouTubeThmbnail";
import storageService from "../../services/appwrite/storageService";

// ✅ Define the validation schema using Zod
const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  status: z.enum(["Active", "Inactive"]),
  youtubeUrl: z.string().url("Enter a valid YouTube URL").optional().or(z.literal("")),
  image: z.any().optional(),
});

interface Post {
  $id: string;
  title: string;
  content: string;
  status: "Active" | "Inactive";
  youtubeUrl?: string | null;
  imageUrl?: string | null;
  thumbnailUrl?: string | null;
}

interface PostFormProps {
  post?: Post;
}

type FormData = z.infer<typeof postSchema>;

export default function PostForm({ post }: PostFormProps) {
  const navigate = useNavigate();
  const userData = useAppSelector((state: any) => state.auth.userData);
  const [mediaType, setMediaType] = useState<"photo" | "video">(
    post?.imageUrl ? "photo" : post?.youtubeUrl ? "video" : "photo"
  );
  const [youtubeUrl, setYoutubeUrl] = useState<string>(post?.youtubeUrl || "");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      status: post?.status || "Active",
      youtubeUrl: post?.youtubeUrl || "",
    },
  });

  // Watch mediaType to enforce correct media submission
  useEffect(() => {
    if (mediaType === "photo") {
      setValue("youtubeUrl", "");
    } else {
      setValue("image", '');
    }
  }, [mediaType, setValue]);

  // Handle form submission
  const submit = async (data: FormData) => {
    let imageUrl: string | null = null;
    let thumbnailUrl: string | null = null;
    let finalYouTubeUrl: string | null = null;

    // Handle image upload if selected
    if (mediaType === "photo" && data.image && data.image[0]) {
      const uploadedFile = await storageService.uploadImage(data.image[0]);
      if (uploadedFile) {
        imageUrl = uploadedFile.fileId; // Store image ID
      }
    }

    // Handle YouTube URL if selected
    if (mediaType === "video" && youtubeUrl) {
      finalYouTubeUrl = youtubeUrl;
      thumbnailUrl = extractYouTubeThumbnail(youtubeUrl);
    }

    const postData = {
      title: data.title,
      content: data.content,
      status: data.status,
      userId: userData.$id,
      userName: userData.name,
      userAvatar: userData.avatarUrl || `https://cloud.appwrite.io/v1/avatars/initials/${userData.name}`,
      imageUrl: mediaType === "photo" ? imageUrl : null,
      youtubeUrl: mediaType === "video" ? finalYouTubeUrl : null,
      thumbnailUrl: mediaType === "video" ? thumbnailUrl : null,
    };

    if (post) {
      console.log("Updating post with data:", postData);
      // Update existing post
      const updatedPost = await appwriteService.updatePost(post.$id, postData);
      if (updatedPost) {
        navigate("/my-posts", { state: { message: "Post updated successfully!" } });
      }
    } else {
      // Create new post
      console.log("Creating new post with data:", postData);
      const newPost = await appwriteService.createPost(postData);
      if (newPost) {
        navigate("/my-posts", { state: { message: "Post created successfully!" } });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      {/* Left Column */}
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title")}
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        {/* <Controller
          name="content"
          control={control}
          render={({ field }) => <RTE label="Content :" control={control} defaultValue={getValues('content')} {...field} />}
        /> */}
        <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
        {errors.content && <p className="text-red-500">{errors.content.message}</p>}
      </div>

      {/* Right Column */}
      <div className="w-1/3 px-2">
        <label className="block font-medium mb-2">Select Media Type:</label>
        <div className="flex gap-4 mb-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="photo"
              checked={mediaType === "photo"}
              onChange={() => setMediaType("photo")}
              className="mr-2"
            />
            Upload Photo
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="video"
              checked={mediaType === "video"}
              onChange={() => setMediaType("video")}
              className="mr-2"
            />
            YouTube URL
          </label>
        </div>

        {/* Conditional Media Inputs */}
        {mediaType === "photo" && (
          <Input
            label="Featured Image :"
            type="file"
            className="mb-4"
            accept="image/png, image/jpg, image/jpeg, image/gif"
            {...register("image")}
          />
        )}
        {mediaType === "video" && (
          <Input
            label="YouTube Video URL :"
            placeholder="Enter YouTube URL"
            className="mb-4"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
          />
        )}

        {/* Status Dropdown */}
        <Select
          options={["Active", "Inactive"]}
          label="Status"
          className="mb-4"
          {...register("status")}
        />

        {/* Submit Button */}
        <Button type="submit" className={`w-full ${post ? "bg-green-500" : ""}`}>
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}




// import { useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Button, Input, RTE, Select } from "../index";
// import appwriteService from "../../services/appwrite/storageService";
// import postService from "@/services/appwrite/postService";
// import { useNavigate } from "react-router-dom";
// import { useAppSelector } from "../../store/hooks";
// import extractYouTubeThumbnail from "../../utils/ExtractYouTubeThmbnail";

// // Define Zod Schema for validation
// const postSchema = z.object({
//   title: z.string().min(3, "Title must be at least 3 characters"),
//   content: z.string().min(3, "Content must be at least 10 characters"),
//   status: z.enum(["Active", "Inactive"]),
//   youtubeUrl: z.string().optional().refine((url) => !url || url.startsWith("https://www.youtube.com"), {
//     message: "Invalid YouTube URL",
//   }),
//   image: z.any().optional(),
//   userAvatar: z.string().optional(), // Add userAvatar field
// });

// type FormData = z.infer<typeof postSchema> & {
//   $id?: string; // Make $id optional
// };

// const PostForm = ({ post }: { post?: FormData }) => {
//   const navigate = useNavigate();
//   const userData = useAppSelector((state: any) => state.auth.userData);
//   const [mediaType, setMediaType] = useState<"photo" | "video">(post?.youtubeUrl ? "video" : "photo");
//   const [youtubeUrl, setYoutubeUrl] = useState(post?.youtubeUrl || "");

//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//   } = useForm<FormData>({
//     resolver: zodResolver(postSchema),
//     defaultValues: post || { title: "", content: "", status: "Active", youtubeUrl: "", userAvatar: userData?.avatar || "" },
//   });

//   const submit = async (data: FormData) => {
//     let imageUrl: string | null = null;
//     let thumbnailUrl: string | null = null;
//     let youtubeUrl: string | null = null;

//     if (mediaType === "photo" && data.image && data.image[0]) {
//       const file = await appwriteService.uploadImage(data.image[0]);
//       if (file) imageUrl = file.fileUrl;
//     } else if (mediaType === "video" && data.youtubeUrl) {
//       youtubeUrl = data.youtubeUrl;
//       thumbnailUrl = extractYouTubeThumbnail(data.youtubeUrl) || null;
//     }

//     const postData = {
//       ...data,
//       userId: userData.$id,
//       userName: userData.name, // Add userName property
//       imageUrl: imageUrl || null,
//       youtubeUrl: youtubeUrl || null,
//       thumbnailUrl,
//     };

//     if (post) {
//       if (post?.$id) {
//         await postService.updatePost(post.$id, { 
//           ...postData, 
//           status: postData.status.toLowerCase() as "active" | "inactive" });
//       } else {
//         console.error("Post ID is undefined");
//       }
//       navigate("/my-posts", { state: { message: "Post updated successfully!" } });
//     } else {
//       await postService.createPost({
//         ...postData,
//         status: postData.status.toLowerCase() as "active" | "inactive",
//       });
//       navigate("/my-posts", { state: { message: "Post created successfully!" } });
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(submit)} className="flex flex-wrap text-gray-100">
//       <div className="w-2/3 px-2">
//         <Input label="Title" placeholder="Enter title" {...register("title")} />
//         {errors.title && <p className="text-red-500">{errors.title.message}</p>}
//         <Controller
//           name="content"
//           control={control}
//           render={({ field }) => (
//             <>
//               <RTE label="Content" control={control} {...field} />
//               {errors.content && <p className="text-red-500">{errors.content.message}</p>}
//             </>
//           )}
//         />
//       </div>

//       <div className="w-1/3 px-2">
//         <label className="block font-medium mb-2">Select Media Type:</label>
//         <div className="flex gap-4 mb-4">
//           <label className="flex items-center">
//             <input type="radio" value="photo" checked={mediaType === "photo"} onChange={() => setMediaType("photo")} className="mr-2" />
//             Upload Photo
//           </label>
//           <label className="flex items-center">
//             <input type="radio" value="video" checked={mediaType === "video"} onChange={() => setMediaType("video")} className="mr-2" />
//             YouTube URL
//           </label>
//         </div>

//         {mediaType === "photo" && (
//           <Input label="Featured Image" type="file" accept="image/*" {...register("image")} />
//         )}
//         {mediaType === "video" && (
//           <Input label="YouTube Video URL" placeholder="Enter YouTube URL" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
//         )}

//         <Select options={["Active", "Inactive"]} label="Status" {...register("status")} />
//         {errors.status && <p className="text-red-500">{errors.status.message}</p>}

//         <Button type="submit" className="w-full">
//           {post ? "Update" : "Submit"}
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default PostForm;


// import { useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Button, Input, RTE, Select } from "../index";
// import appwriteService from "../../services/appwrite/storageService";
// import postService from "@/services/appwrite/postService";
// import { useNavigate } from "react-router-dom";
// import { useAppSelector } from "../../store/hooks";
// import extractYouTubeThumbnail from "../../utils/ExtractYouTubeThmbnail";

// // Define Zod Schema for validation
// const postSchema = z.object({
//   title: z.string().min(3, "Title must be at least 3 characters"),
//   content: z.string().min(10, "Content must be at least 10 characters"),
//   status: z.enum(["Active", "Inactive"]),
//   youtubeUrl: z.string().optional().refine((url) => !url || url.startsWith("https://www.youtube.com"), {
//     message: "Invalid YouTube URL",
//   }),
//   image: z.any().optional(),
//   userAvatar: z.string().optional(), // Add userAvatar field
// });

// type FormData = z.infer<typeof postSchema> & {
//   $id?: string; // Make $id optional
// };

// const PostForm = ({ post }: { post?: FormData }) => {
//   const navigate = useNavigate();
//   const userData = useAppSelector((state: any) => state.auth.userData);
//   const [mediaType, setMediaType] = useState<"photo" | "video">(post?.youtubeUrl ? "video" : "photo");
//   const [youtubeUrl, setYoutubeUrl] = useState(post?.youtubeUrl || "");

//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//   } = useForm<FormData>({
//     resolver: zodResolver(postSchema),
//     defaultValues: post || { title: "", content: "", status: "Active", youtubeUrl: "", userAvatar: userData?.avatar || "" },
//   });

//   const submit = async (data: FormData) => {
//     let imageUrl: string | undefined = undefined;
//     let thumbnailUrl: string | undefined = undefined;

//     if (mediaType === "photo" && data.image && data.image[0]) {
//       const file = await appwriteService.uploadImage(data.image[0]);
//       if (file) imageUrl = file.fileUrl;
//     } else if (mediaType === "video" && data.youtubeUrl) {
//       thumbnailUrl = extractYouTubeThumbnail(data.youtubeUrl) || undefined;
//     }

//     const postData = {
//       ...data,
//       userId: userData.$id,
//       userName: userData.name, // Add userName property
//       imageUrl,
//       youtubeUrl: mediaType === "video" ? data.youtubeUrl : "",
//       thumbnailUrl,
//     };

//     if (post) {
//       if (post?.$id) {
//         await postService.updatePost(post.$id, { ...postData, status: postData.status.toLowerCase() as "active" | "inactive" });
//       } else {
//         console.error("Post ID is undefined");
//       }
//       navigate("/my-posts", { state: { message: "Post updated successfully!" } });
//     } else {
//       await postService.createPost({
//         ...postData,
//         status: postData.status.toLowerCase() as "active" | "inactive",
//       });
//       navigate("/my-posts", { state: { message: "Post created successfully!" } });
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(submit)} className="flex flex-wrap text-gray-100">
//       <div className="w-2/3 px-2">
//         <Input label="Title" placeholder="Enter title" {...register("title")} />
//         {errors.title && <p className="text-red-500">{errors.title.message}</p>}
//         <Controller
//           name="content"
//           control={control}
//           render={({ field }) => (
//             <>
//               <RTE label="Content" control={control} {...field} />
//               {errors.content && <p className="text-red-500">{errors.content.message}</p>}
//             </>
//           )}
//         />
//       </div>

//       <div className="w-1/3 px-2">
//         <label className="block font-medium mb-2">Select Media Type:</label>
//         <div className="flex gap-4 mb-4">
//           <label className="flex items-center">
//             <input type="radio" value="photo" checked={mediaType === "photo"} onChange={() => setMediaType("photo")} className="mr-2" />
//             Upload Photo
//           </label>
//           <label className="flex items-center">
//             <input type="radio" value="video" checked={mediaType === "video"} onChange={() => setMediaType("video")} className="mr-2" />
//             YouTube URL
//           </label>
//         </div>

//         {mediaType === "photo" && (
//           <Input label="Featured Image" type="file" accept="image/*" {...register("image")} />
//         )}
//         {mediaType === "video" && (
//           <Input label="YouTube Video URL" placeholder="Enter YouTube URL" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
//         )}

//         <Select options={["Active", "Inactive"]} label="Status" {...register("status")} />
//         {errors.status && <p className="text-red-500">{errors.status.message}</p>}

//         <Button type="submit" className="w-full">
//           {post ? "Update" : "Submit"}
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default PostForm;

// import React, { useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Button, Input, RTE, Select } from "../index";
// import appwriteService from "../../services/appwrite/storageService";
// import postService from "@/services/appwrite/postService";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import extractYouTubeThumbnail from "../../utils/ExtractYouTubeThmbnail";

// // Define Zod Schema for validation
// const postSchema = z.object({
//   title: z.string().min(3, "Title must be at least 3 characters"),
//   content: z.string().min(10, "Content must be at least 10 characters"),
//   status: z.enum(["Active", "Inactive"]),
//   youtubeUrl: z.string().optional().refine((url) => !url || url.startsWith("https://www.youtube.com"), {
//     message: "Invalid YouTube URL",
//   }),
//   image: z.any().optional(),
// });

// interface FormData {
//   title: string;
//   content: string;
//   status: "Active" | "Inactive";
//   youtubeUrl?: string;
//   image?: FileList;
// }

// const PostForm = ({ post }: { post?: FormData }) => {
//   const navigate = useNavigate();
//   const userData = useSelector((state: any) => state.auth.userData);
//   const [mediaType, setMediaType] = useState<"photo" | "video">(post?.youtubeUrl ? "video" : "photo");
//   const [youtubeUrl, setYoutubeUrl] = useState(post?.youtubeUrl || "");

//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//   } = useForm<FormData>({
//     resolver: zodResolver(postSchema),
//     defaultValues: post || { title: "", content: "", status: "Active", youtubeUrl: "" },
//   });

//   const submit = async (data: FormData) => {
//     let imageUrl: string | null = null;
//     let thumbnailUrl: string | null = null;

//     if (mediaType === "photo" && data.image && data.image[0]) {
//       const file = await appwriteService.uploadImage(data.image[0]);
//       if (file) imageUrl = file.fileUrl;
//     } else if (mediaType === "video" && data.youtubeUrl) {
//       thumbnailUrl = extractYouTubeThumbnail(data.youtubeUrl);
//     }

//     const postData = {
//       ...data,
//       userId: userData.$id,
//       imageUrl,
//       youtubeUrl: mediaType === "video" ? data.youtubeUrl : "",
//       thumbnailUrl,
//     };

//     if (post) {
//       await postService.updatePost(post.$id, postData);
//       navigate("/my-posts", { state: { message: "Post updated successfully!" } });
//     } else {
//       await appwriteService.createPost(postData);
//       navigate("/my-posts", { state: { message: "Post created successfully!" } });
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(submit)} className="flex flex-wrap text-gray-100">
//       <div className="w-2/3 px-2">
//         <Input label="Title" placeholder="Enter title" {...register("title")} error={errors.title?.message} />
//         <Controller
//           name="content"
//           control={control}
//           render={({ field }) => <RTE label="Content" {...field} error={errors.content?.message} />}
//         />
//       </div>

//       <div className="w-1/3 px-2">
//         <label className="block font-medium mb-2">Select Media Type:</label>
//         <div className="flex gap-4 mb-4">
//           <label className="flex items-center">
//             <input type="radio" value="photo" checked={mediaType === "photo"} onChange={() => setMediaType("photo")} className="mr-2" />
//             Upload Photo
//           </label>
//           <label className="flex items-center">
//             <input type="radio" value="video" checked={mediaType === "video"} onChange={() => setMediaType("video")} className="mr-2" />
//             YouTube URL
//           </label>
//         </div>

//         {mediaType === "photo" && (
//           <Input label="Featured Image" type="file" accept="image/*" {...register("image")} />
//         )}
//         {mediaType === "video" && (
//           <Input label="YouTube Video URL" placeholder="Enter YouTube URL" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
//         )}

//         <Select options={["Active", "Inactive"]} label="Status" {...register("status")} error={errors.status?.message} />

//         <Button type="submit" className="w-full">
//           {post ? "Update" : "Submit"}
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default PostForm;


// import React, { useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Button, Input, RTE, Select } from "../index";
// import storageService from "../../services/appwrite/storageService";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import extractYouTubeThumbnail from "../../utils/ExtractYouTubeThmbnail";
// import postService from "@/services/appwrite/postService";

// const postSchema = z.object({
//   title: z.string().min(3, "Title must be at least 3 characters"),
//   content: z.string().min(10, "Content must be at least 10 characters"),
//   status: z.enum(["Active", "Inactive"]),
//   youtubeUrl: z.string().optional().refine((url) => !url || url.includes("youtube.com"), {
//     message: "Invalid YouTube URL",
//   }),
//   imageUrl: z.any().optional(),
// });

// interface FormData {
//   title: string;
//   content: string;
//   status: "Active" | "Inactive";
//   youtubeUrl?: string;
//   imageUrl?: FileList;
// }

// export default function PostForm({ post }: { post?: any }) {
//   const navigate = useNavigate();
//   const userData = useSelector((state: any) => state.auth.userData);
//   const [mediaType, setMediaType] = useState<"photo" | "video">(
//     post?.youtubeUrl ? "video" : "photo"
//   );
//   const [youtubeUrl, setYoutubeUrl] = useState(post?.youtubeUrl || "");
  
//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//   } = useForm<FormData>({
//     resolver: zodResolver(postSchema),
//     defaultValues: {
//       title: post?.title || "",
//       content: post?.content || "",
//       status: post?.status || "Active",
//       youtubeUrl: post?.youtubeUrl || "",
//     },
//   });

//   const submit = async (data: FormData) => {
//     let featuredImage: string | null = null;
//     let finalYoutubeUrl: string | null = youtubeUrl;
//     let thumbnailUrl: string | null = null;



//     const postData = {
//       ...data,
//       userId: userData.$id,
//       imageUrl: featuredImage,
//       youtubeUrl: finalYoutubeUrl,
//       thumbnailUrl,
//     };

//     if (post) {
//       await postService.(post.$id, postData);
//       navigate("/my-posts", { state: { message: "Post updated successfully!" } });
//     } else {
//       await appwriteService.createPost(postData);
//       navigate("/my-posts", { state: { message: "Post created successfully!" } });
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(submit)} className="flex flex-wrap text-gray-100">
//       <div className="w-2/3 px-2">
//         <Input label="Title:" placeholder="Title" {...register("title")} />
//         {errors.title && <p className="text-red-500">{errors.title.message}</p>}

//         <Controller
//           name="content"
//           control={control}
//           render={({ field }) => <RTE label="Content:" control={control} {...field} />}
//         />
//         {errors.content && <p className="text-red-500">{errors.content.message}</p>}
//       </div>

//       <div className="w-1/3 px-2">
//         <label className="block font-medium mb-2">Select Media Type:</label>
//         <div className="flex gap-4 mb-4">
//           <label className="flex items-center">
//             <input type="radio" value="photo" checked={mediaType === "photo"} onChange={() => setMediaType("photo")} className="mr-2" /> Upload Photo
//           </label>
//           <label className="flex items-center">
//             <input type="radio" value="video" checked={mediaType === "video"} onChange={() => setMediaType("video")} className="mr-2" /> YouTube URL
//           </label>
//         </div>

//         {mediaType === "photo" && (
//           <Input label="Featured Image:" type="file" accept="image/*" {...register("image")} />
//         )}

//         {mediaType === "video" && (
//           <Input label="YouTube Video URL:" placeholder="Enter YouTube URL" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
//         )}

//         <Select options={["Active", "Inactive"]} label="Status" {...register("status")} />

//         <Button type="submit" className="w-full">{post ? "Update" : "Submit"}</Button>
//       </div>
//     </form>
//   );
// }


// import React, { useState, useEffect } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { Button, Input, RTE, Select } from "../Index";
// import appwriteService from "../../appwrite/config";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// interface Post {
//   $id: string;
//   title: string;
//   content: string;
//   status: "Active" | "Inactive";
//   youtubeUrl?: string;
//   image?: string;
// }

// interface PostFormProps {
//   post?: Post;
// }

// interface FormData {
//   title: string;
//   content: string;
//   status: "Active" | "Inactive";
//   youtubeUrl?: string;
//   image?: FileList;
// }

// export default function PostForm({ post }: PostFormProps) {
//   const {
//     register,
//     handleSubmit,
//     control,
//     getValues,
//   } = useForm<FormData>({
//     defaultValues: {
//       title: post?.title || "",
//       content: post?.content || "",
//       status: post?.status || "Active",
//       youtubeUrl: post?.youtubeUrl || "",
//     },
//   });

//   const navigate = useNavigate();
//   const userData = useSelector((state: any) => state.auth.userData);
//   const [mediaType, setMediaType] = useState<"photo" | "video">(post?.mediaType || "photo");
//   const [youtubeUrl, setYoutubeUrl] = useState<string>(post?.youtubeUrl || "");





//   const submit = async (data: FormData) => {
//     let featuredImage: string | null = null;
//     let finalYoutubeUrl: string | null = null;

//     if (data.mediaType === "photo" && data.image && data.image[0]) {
//       const file = await appwriteService.uploadFile(data.image[0]);
//       if (file) {
//         featuredImage = file.$id;
//       }
//     } else if (data.mediaType === "video") {
//       finalYoutubeUrl = youtubeUrl; // Store YouTube URL
//     }

//     const postData = {
//       ...data,
//       userId: userData.$id,
//       featuredImage: data.mediaType === "photo" ? featuredImage : null,
//       youtubeUrl: data.mediaType === "video" ? finalYoutubeUrl : null,
//     };

//     if (post) {
//       const updatedPost = await appwriteService.updatePost(post.$id, postData);
//       if (updatedPost) {
//         navigate("/all-posts", { state: { message: "Post has been edited successfully!" } });
//       }
//     } else {
//       const newPost = await appwriteService.createPost(postData);
//       if (newPost) {
//         navigate("/all-posts", { state: { message: "Post has been created successfully!" } });
//       }
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(submit)} className="flex flex-wrap text-gray-100">
//       <div className="w-2/3 px-2">
//         <Input
//           label="Title :"
//           placeholder="Title"
//           className="mb-4"
//           {...register("title", { required: true })}
//         />
//         <Input
//           label="Slug :"
//           placeholder="Slug"
//           className="mb-4"
//           {...register("slug", { required: true })}
//           readOnly // Make slug field read-only
//         />
//         <Controller
//           name="content"
//           control={control}
//           defaultValue={getValues("content")}
//           render={({ field }) => <RTE label="Content :" {...field} />}
//         />
//       </div>

//       <div className="w-1/3 px-2">
//         <label className="block font-medium mb-2">Select Media Type:</label>
//         <div className="flex gap-4 mb-4">
//           <label className="flex items-center">
//             <input
//               type="radio"
//               value="photo"
//               {...register("mediaType")}
//               checked={mediaType === "photo"}
//               onChange={() => setMediaType("photo")}
//               className="mr-2"
//             />
//             Upload Photo
//           </label>
//           <label className="flex items-center">
//             <input
//               type="radio"
//               value="video"
//               {...register("mediaType")}
//               checked={mediaType === "video"}
//               onChange={() => setMediaType("video")}
//               className="mr-2"
//             />
//             YouTube URL
//           </label>
//         </div>

//         {mediaType === "photo" && (
//           <Input
//             label="Featured Image :"
//             type="file"
//             className="mb-4"
//             accept="image/png, image/jpg, image/jpeg, image/gif"
//             {...register("image", { required: mediaType === "photo" })}
//           />
//         )}

//         {mediaType === "video" && (
//           <Input
//             label="YouTube Video URL :"
//             placeholder="Enter YouTube URL"
//             className="mb-4"
//             value={youtubeUrl}
//             onChange={(e) => setYoutubeUrl(e.target.value)}
//           />
//         )}

//         <Select
//           options={["Active", "Inactive"]}
//           label="Status"
//           className="mb-4"
//           {...register("status", { required: true })}
//         />

//         <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
//           {post ? "Update" : "Submit"}
//         </Button>
//       </div>
//     </form>
//   );
// }
