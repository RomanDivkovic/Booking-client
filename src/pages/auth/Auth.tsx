import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuthForm } from "@/hooks/useAuthForm";
import { useInvitationHandler } from "@/hooks/useInvitationHandler";
import { useAuthSubmit } from "@/hooks/useAuthSubmit";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthToggle } from "@/components/auth/AuthToggle";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  // Custom hooks
  const { formData, updateFormData, resetForm } = useAuthForm();
  const { invitationGroup } = useInvitationHandler();
  const { loading, handleSubmit } = useAuthSubmit(isLogin);

  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(formData, from);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthHeader invitationGroup={invitationGroup} />

        <AuthForm
          isLogin={isLogin}
          formData={formData}
          onFormDataChange={updateFormData}
          onSubmit={onSubmit}
          loading={loading}
        />

        <AuthToggle isLogin={isLogin} onToggle={toggleMode} loading={loading} />
      </div>
    </div>
  );
}
