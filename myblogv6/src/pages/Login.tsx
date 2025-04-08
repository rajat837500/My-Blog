import React from "react";
import { Login as LoginComponent } from "../components/index"; // Ensure correct path to Login component

const Login: React.FC = () => {
  return (
    <div className="py-8">
      <LoginComponent />
    </div>
  );
};

export default Login;
