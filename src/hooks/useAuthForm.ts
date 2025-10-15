import { useState } from "react";

export interface AuthFormData {
  email: string;
  password: string;
  fullName: string;
}

export const useAuthForm = () => {
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    fullName: ""
  });

  const updateFormData = (field: keyof AuthFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({ email: "", password: "", fullName: "" });
  };

  return {
    formData,
    updateFormData,
    resetForm
  };
};
