import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import postsService from '../services/appwrite/postService';
import { Models } from 'appwrite';

// Define Post type (assuming Appwrite's default structure)
interface Post extends Models.Document {
  title: string;
  content: string;
  imageUrl?: string;
  youtubeUrl?: string;
  thumbnailUrl?: string;
  userId: string;
  userName: string;
  status: 'Active' | 'Inactive';
}

// Define State Type
interface PostsState {
  posts: Post[];
  myPosts: Post[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  myPosts: [],
  status: 'idle',
  error: null,
};

// Async thunk to fetch all posts
export const fetchPosts = createAsyncThunk<Post[]>('posts/fetchPosts', async () => {
  const documentList = await postsService.fetchActivePosts();
  return documentList.documents.map((doc) => ({
    ...doc,
    title: doc.title,
    content: doc.content,
    imageUrl: doc.imageUrl,
    youtubeUrl: doc.youtubeUrl,
    thumbnailUrl: doc.thumbnailUrl,
    userId: doc.userId,
    userName: doc.userName,
    status: doc.status as 'Active' | 'Inactive',
  }));
});

// Async thunk to fetch posts created by the current user
export const fetchMyPosts = createAsyncThunk<Post[], string>('posts/fetchMyPosts', async (userId) => {
  const documentList = await postsService.fetchUserPosts(userId);
  return documentList.documents.map((doc) => ({
    ...doc,
    title: doc.title,
    content: doc.content,
    imageUrl: doc.imageUrl,
    youtubeUrl: doc.youtubeUrl,
    thumbnailUrl: doc.thumbnailUrl,
    userId: doc.userId,
    userName: doc.userName,
    status: doc.status as 'Active' | 'Inactive',
  }));
});

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.status = 'succeeded';
        state.posts = action.payload || [];
        console.log('fetchPosts:', state.posts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch posts';
      })
      .addCase(fetchMyPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMyPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.status = 'succeeded';
        state.myPosts = action.payload || [];
        console.log('fetchMyPosts:', state.myPosts);
      })
      .addCase(fetchMyPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch user posts';
      });
  },
});

export default postSlice.reducer;


// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { Models } from "appwrite";

// // Define Post Type for strict typing
// interface Post extends Models.Document {
//   title: string;
//   content: string;
//   imageUrl?: string;
//   youtubeUrl?: string;
//   thumbnailUrl?: string;
//   userId: string;
//   userName: string;
//   status: "active" | "inactive";
// }

// interface PostState {
//   posts: Post[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: PostState = {
//   posts: [],
//   loading: false,
//   error: null,
// };

// const postSlice = createSlice({
//   name: "post",
//   initialState,
//   reducers: {
//     setPosts: (state, action: PayloadAction<Post[]>) => {
//       state.posts = [...new Map([...state.posts, ...action.payload].map(post => [post.$id, post])).values()];
//       state.loading = false;
//       state.error = null;
//     },
//     addPost: (state, action: PayloadAction<Post>) => {
//       if (!state.posts.find((post) => post.$id === action.payload.$id)) {
//         state.posts.unshift(action.payload);
//       }
//     },
//     deletePost: (state, action: PayloadAction<string>) => {
//       state.posts = state.posts.filter((post) => post.$id !== action.payload);
//     },
//     setPostLoading: (state, action: PayloadAction<boolean>) => {
//       state.loading = action.payload;
//     },
//     setPostError: (state, action: PayloadAction<string | null>) => {
//       state.error = action.payload;
//     },
//   },
// });

// export const { setPosts, addPost, deletePost, setPostLoading, setPostError } = postSlice.actions;
// export default postSlice.reducer;


// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { Models } from "appwrite";

// interface PostState {
//   posts: Models.Document[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: PostState = {
//   posts: [],
//   loading: false,
//   error: null,
// };

// const postSlice = createSlice({
//   name: "post",
//   initialState,
//   reducers: {
//     setPosts: (state, action: PayloadAction<Models.Document[]>) => {
//       state.posts = action.payload;
//       state.loading = false;
//       state.error = null;
//     },
//     addPost: (state, action: PayloadAction<Models.Document>) => {
//       state.posts.unshift(action.payload); // Add new post at the top
//     },
//     deletePost: (state, action: PayloadAction<string>) => {
//       state.posts = state.posts.filter((post) => post.$id !== action.payload);
//     },
//     setPostLoading: (state, action: PayloadAction<boolean>) => {
//       state.loading = action.payload;
//     },
//     setPostError: (state, action: PayloadAction<string | null>) => {
//       state.error = action.payload;
//     },
//   },
// });

// export const { setPosts, addPost, deletePost, setPostLoading, setPostError } = postSlice.actions;
// export default postSlice.reducer;
