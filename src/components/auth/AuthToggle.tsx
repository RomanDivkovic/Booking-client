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
        className="relative text-blue-600 hover:text-blue-700 font-medium mt-1 transition-colors duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {isLogin ? "Sign up here" : "Sign in here"}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
      </button>
    </div>
  );
};
