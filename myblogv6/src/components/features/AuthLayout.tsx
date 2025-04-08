import { useEffect, useState, ReactNode } from "react";
import { useAppSelector } from "../../store/hooks";
import { useNavigate } from "react-router-dom";

// Define Props Interface
interface ProtectedProps {
  children: ReactNode;
  authentication?: boolean;
}

const Protected: React.FC<ProtectedProps> = ({ children, authentication = true }) => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useAppSelector((state) => state.auth.status);

  useEffect(() => {
    if (authentication && authStatus !== authentication) {
      navigate("/login");
    } else if (!authentication && authStatus !== authentication) {
      navigate("/");
    }
    setLoader(false);
  }, [authStatus, navigate, authentication]);

  return loader ? <h1>Loading...</h1> : <>{children}</>;
};

export default Protected;



// import {useEffect, useState} from 'react'
// import {useAppSelector} from '../../store/hooks'
// import {useNavigate} from 'react-router-dom'

// import { ReactNode } from 'react';

// export default function Protected({children, authentication = true}: {children: ReactNode, authentication?: boolean}) {

//     const navigate = useNavigate()
//     const [loader, setLoader] = useState(true)
//     const authStatus = useAppSelector(state => state.auth.status)

//     useEffect(() => {
//         //TODO: make it more easy to understand

//         // if (authStatus ===true){
//         //     navigate("/")
//         // } else if (authStatus === false) {
//         //     navigate("/login")
//         // }
        
//         //let authValue = authStatus === true ? true : false

//         if(authentication && authStatus !== authentication){
//             navigate("/login")
//         } else if(!authentication && authStatus !== authentication){
//             navigate("/")
//         }
//         setLoader(false)
//     }, [authStatus, navigate, authentication])

//   return loader ? <h1>Loading...</h1> : <>{children}</>
// }
