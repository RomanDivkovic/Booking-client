import React from "react";

interface TermsInfoProps {
  isLogin: boolean;
}

export const TermsInfo: React.FC<TermsInfoProps> = ({ isLogin }) => {
  if (isLogin) return null;

  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
      <div className="text-center text-sm text-gray-600 mt-4">
        By signing up, you agree to our Terms of Service and Privacy Policy.
      </div>
    </div>
  );
};
