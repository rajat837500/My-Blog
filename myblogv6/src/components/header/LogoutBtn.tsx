import { useAppDispatch } from "../../store/hooks";
import authService from "../../services/appwrite/authService";
import { logout } from "../../store/authSlice";

const LogoutBtn: React.FC = () => {
  const dispatch = useAppDispatch();

  const logoutHandler = async () => {
    try {
      await authService.logout();
      dispatch(logout());
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-1 rounded mt-2"
      onClick={logoutHandler}
    >
      Logout
    </button>
  );
};

export default LogoutBtn;


// import { useAppDispatch } from "../../store/hooks";
// import authService from '../../services/appwrite/authService'
// import {logout} from '../../store/authSlice'

// function LogoutBtn() {
//     const dispatch = useAppDispatch()
//     const logoutHandler = () => {
//         authService.logout().then(() => {
//             dispatch(logout())
//         })
//     }
//   return (
//     <button
//     // className='inline-block px-6 py-2 duration-200 text-gray-300 hover:text-blue-400 rounded-full'
//     className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-1 rounded mt-2"
//     onClick={logoutHandler}
//     >Logout</button>
//   )
// }

// export default LogoutBtn