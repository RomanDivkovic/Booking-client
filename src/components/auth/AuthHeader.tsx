import React from "react";

interface AuthHeaderProps {
  invitationGroup: {
    name: string;
    description?: string;
  } | null;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ invitationGroup }) => {
  return (
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden">
        <img
          src="/famcal.png"
          alt="FamCaly Logo"
          className="w-full h-full object-cover"
        />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Welcome to FamCaly
      </h1>
      <p className="text-gray-600 mb-8">
        {invitationGroup
          ? `You're invited to join ${invitationGroup.name}!`
          : "The modern family calendar that brings everyone together"}
      </p>

      {invitationGroup && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Group Invitation</h3>
          <p className="text-blue-700 text-sm">
            <strong>{invitationGroup.name}</strong>
            {invitationGroup.description && (
              <span> - {invitationGroup.description}</span>
            )}
          </p>
          <p className="text-blue-600 text-sm mt-2">
            Sign in or create an account to join this group.
          </p>
        </div>
      )}
    </div>
  );
};
