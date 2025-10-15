import React from "react";
import { TermsOfServiceModal } from "./TermsOfServiceModal";

interface TermsInfoProps {
  isLogin: boolean;
}

export const TermsInfo: React.FC<TermsInfoProps> = ({ isLogin }) => {
  if (isLogin) return null;

  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
      <div className="text-center text-sm text-gray-600 mt-4">
        By signing up, you agree to our{" "}
        <TermsOfServiceModal>
          <button className="text-blue-600 hover:text-blue-700 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded">
            Terms of Service
          </button>
        </TermsOfServiceModal>{" "}
        and{" "}
        <button className="text-blue-600 hover:text-blue-700 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded">
          Privacy Policy
        </button>
        .
      </div>
    </div>
  );
};
