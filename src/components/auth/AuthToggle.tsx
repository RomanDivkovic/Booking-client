import React from "react";

interface AuthToggleProps {
  isLogin: boolean;
  onToggle: () => void;
  loading: boolean;
}

export const AuthToggle: React.FC<AuthToggleProps> = ({
  isLogin,
  onToggle,
  loading
}) => {
  return (
    <div className="mt-6 text-center">
      <p className="text-gray-600">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
      </p>
      <button
        onClick={onToggle}
        className="text-blue-600 hover:text-blue-700 font-medium mt-1"
        disabled={loading}
      >
        {isLogin ? "Sign up here" : "Sign in here"}
      </button>
    </div>
  );
};
