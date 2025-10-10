import React from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: ""
  });

  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: "", password: "", fullName: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden">
            <img
              src="/final_circular_transparent_icon.webp"
              alt="FamCaly Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to FamCaly
          </h1>
          <p className="text-gray-600 mb-8">
            The modern family calendar that brings everyone together
          </p>
        </div>

        {/* Auth Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {isLogin ? "Sign In" : "Sign Up"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          fullName: e.target.value
                        }))
                      }
                      placeholder="Enter your full name"
                      className="pl-10"
                      required={!isLogin}
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value
                      }))
                    }
                    placeholder="Enter your email"
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value
                      }))
                    }
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {!isLogin && (
                  <p className="text-sm text-gray-500 mt-1">
                    Password must be at least 6 characters long
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>
                      {isLogin ? "Signing in..." : "Creating account..."}
                    </span>
                  </div>
                ) : (
                  <span>{isLogin ? "Sign In" : "Create Account"}</span>
                )}
              </Button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </p>
              <button
                onClick={toggleMode}
                className="text-blue-600 hover:text-blue-700 font-medium mt-1"
                disabled={loading}
              >
                {isLogin ? "Sign up here" : "Sign in here"}
              </button>
            </div>

            {/* Additional Info */}
            {!isLogin && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="text-center text-sm text-gray-600 mt-4">
                  By signing up, you agree to our Terms of Service and Privacy
                  Policy.
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
