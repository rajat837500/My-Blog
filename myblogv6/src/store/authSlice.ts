import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Models } from "appwrite";

// Extend the Appwrite User model to include avatarUrl
interface ExtendedUser extends Models.User<Models.Preferences> {
  avatarUrl?: string;
}

// Define the authentication state
interface AuthState {
  status: boolean; // Tracks if the user is logged in
  userData: ExtendedUser | null; // Stores user details including avatarUrl
}

// Initial authentication state
const initialState: AuthState = {
  status: false,
  userData: null,
};

// Define the payload structure for login action
interface LoginPayload {
  userData: ExtendedUser;
}

// Create the authentication slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login action: Stores user data and updates authentication status
    login: (state, action: PayloadAction<LoginPayload>) => {
      state.status = true;
      state.userData = action.payload.userData;
      console.log("AuthSlice - User Data:", state.userData?.avatarUrl);
    },

    // Logout action: Clears user data and resets authentication status
    logout: (state) => {
      state.status = false;
      state.userData = null;
    }
  }
});

// Export actions and reducer
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;



// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { Models } from "appwrite";

// // Extend the User model to include avatarUrl
// interface ExtendedUser extends Models.User<Models.Preferences> {
//   avatarUrl?: string;
// }

// // Define the AuthState interface
// interface AuthState {
//   status: boolean;
//   userData: ExtendedUser | null;
//   // avatarUrl: string | null;
// }

// // Initial state
// const initialState: AuthState = {
//   status: false,
//   userData: null,
//   // avatarUrl: null,
// };

// // Define the payload structure for login action
// interface LoginPayload {
//   userData: ExtendedUser;
//   // avatarUrl: string;
// }

// // Create the slice
// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     login: (state, action: PayloadAction<LoginPayload>) => {
//       state.status = true;
//       state.userData = action.payload.userData;
//       // state.avatarUrl = action.payload.avatarUrl; // Store avatarUrl separately
//       console.log("AuthSlice ", state.userData?.avatarUrl);
//     },

//     logout: (state) => {
//       state.status = false;
//       state.userData = null;
//       // state.avatarUrl = null;
//     }
//   }
// });

// // Export actions and reducer
// export const { login, logout } = authSlice.actions;
// export default authSlice.reducer;


// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { Models } from "appwrite";


// // Define the AuthState interface
// interface AuthState {
//   status: boolean;
//   userData: Models.User<Models.Preferences> | null;
//   avatarUrl: string | null;
// }

// // Initial state
// const initialState: AuthState = {
//   status: false,
//   userData: null,
//   avatarUrl: null,
// };

// // Define the payload structure for login action
// interface LoginPayload {
//   userData: Models.User<Models.Preferences>;
// }

// // Create the slice
// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     login: (state, action: PayloadAction<LoginPayload>) => {
//       state.status = true;
//       state.userData = action.payload.userData;
//       state.avatarUrl = action.payload.avatarUrl;
//       console.log("AuthSlice ", state.userData?.avatarUrl);
//     },

//     logout: (state) => {
//       state.status = false;
//       state.userData = null;
//     }
//   }
// });

// // Export actions and reducer
// export const { login, logout } = authSlice.actions;
// export default authSlice.reducer;


// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { Models } from "appwrite";

// interface AuthState {
//   status: boolean;
//   userData: Models.User<Models.Preferences> | null;
//   avatarUrl: string | null;
// }

// const initialState: AuthState = {
//   status: false,
//   userData: null,
//   avatarUrl: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     login: (state, action) => {
//       state.status = true;
//       state.userData = action.payload.userData;
//     },

//     logout: (state) => {
//       state.status = false;
//       state.userData = null;
//     }
//   }
// });

// export const { login, logout } = authSlice.actions;
// export default authSlice.reducer;


// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { Models } from "appwrite";

// interface AuthState {
//   user: Models.User<Models.Preferences> | null;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: AuthState = {
//   user: null,
//   loading: false,
//   error: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setUser: (state, action: PayloadAction<Models.User<Models.Preferences> | null>) => {
//       state.user = action.payload;
//       state.loading = false;
//       state.error = null;
//     },
//     logoutUser: (state) => {
//       state.user = null;
//       state.loading = false;
//       state.error = null;
//     },
//     setAuthLoading: (state, action: PayloadAction<boolean>) => {
//       state.loading = action.payload;
//     },
//     setAuthError: (state, action: PayloadAction<string | null>) => {
//       state.error = action.payload;
//     },
//   },
// });

// export const { setUser, logoutUser, setAuthLoading, setAuthError } = authSlice.actions;
// export default authSlice.reducer;
