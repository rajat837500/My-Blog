import React, { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({ children }) => {
  return (
    <div className="auth-card">
      <div className="mx-auto w-full max-w-lg rounded-xl p-8 bg-opacity-20">
        {children}
      </div>
    </div>
  );
};

export default AuthCard;
