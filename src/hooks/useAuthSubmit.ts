import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { AuthFormData } from "./useAuthForm";

export const useAuthSubmit = (isLogin: boolean) => {
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (formData: AuthFormData, from: string) => {
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (!error) {
          navigate(from, { replace: true });
        } else {
          toast({
            title: "Login failed",
            description:
              (error as Error)?.message || "Invalid email or password.",
            variant: "destructive"
          });
        }
      } else {
        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.fullName
        );
        if (!error) {
          toast({
            title: "Registration successful",
            description: "Your account has been created successfully!"
          });
          navigate(from, { replace: true });
        } else {
          toast({
            title: "Registration failed",
            description:
              (error as Error)?.message || "Failed to create account.",
            variant: "destructive"
          });
        }
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSubmit
  };
};
