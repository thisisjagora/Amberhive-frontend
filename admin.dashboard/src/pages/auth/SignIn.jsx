import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import Herobg from "@/assets/hero-bg.png";
import AmberHiveLogo from "@/assets/Amberhive.png";
import { loginUser } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const handleSignIn = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required.";
    if (!password) newErrors.password = "Password is required.";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    const resultAction = await dispatch(loginUser({ email, password }));
    setLoading(false);

    const payload = resultAction.payload;

    if (loginUser.fulfilled.match(resultAction)) {
      const user = payload.user;
      const role = user?.role?.toLowerCase();

      if (role === "admin") {
        toast.success(payload?.message || "Signed in successfully!", {
          position: "top-right",
        });
        navigate("/admin/overview");
      } else if (role === "super admin") {
        toast.success(payload?.message || "Signed in successfully!", {
          position: "top-right",
        });
        navigate("/super-admin/overview");
      } else {
        toast.error(
          payload?.message ||
            "Access denied: You do not have permission to login.",
          {
            position: "top-right",
          }
        );
      }
    } else if (loginUser.rejected.match(resultAction)) {
      let errorMessage = "";

      if (typeof payload === "string") {
        errorMessage = payload;
      } else if (typeof payload === "object" && payload !== null) {
        errorMessage = payload.message || payload.error || "";
      }

      if (errorMessage) {
        toast.error(errorMessage, { position: "top-right" });
      }
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between font-gilroy overflow-hidden">
      {/* Decorative BG Images */}
      <div className="hidden md:block absolute top-0 left-0">
        <img
          src={Herobg}
          alt="Bottom decorative graphic"
          className="w-[450px] object-contain"
        />
      </div>

      <header className="hidden md:block px-4 py-4 z-10 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img src={AmberHiveLogo} alt="Logo" className="w-36" />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 relative z-10">
        <Card className="w-full max-w-md p-6 bg-white/80 border-[1px]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">
              Sign into AmberHive
            </CardTitle>
            <CardDescription className="text-gray-500">
              Hey there! Welcome to AmberHive.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 mb-6">
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1">
                <Label htmlFor="email" className="font-semibold">
                  Email*
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  className={`placeholder:font-medium ${
                    errors.email
                      ? "border-red-600 focus:border-yellow-600 focus:ring-yellow-600"
                      : "focus:border-yellow-600 focus:ring-yellow-600"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <Label htmlFor="password" className="font-semibold">
                    Password*
                  </Label>
                  {/* <Link
                    to="/forgot-password"
                    className="text-yellow-600 hover:underline"
                  >
                    Forgot Password?
                  </Link> */}
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  className={`placeholder:font-medium ${
                    errors.password
                      ? "border-red-600 focus:border-yellow-600 focus:ring-yellow-600"
                      : "focus:border-yellow-600 focus:ring-yellow-600"
                  }`}
                />
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

         
          </CardContent>
{/* 
          <CardFooter className="pt-6 flex flex-col items-center">
            <p className="text-gray-600 text-sm">
              Privacy Policy | Terms & Conditions
            </p>
          </CardFooter> */}
        </Card>
      </main>

      <footer className=" text-center text-gray-600 text-sm py-4">
        &copy; {new Date().getFullYear()} AmberHive.
      </footer>
    </div>
  );
};

export default SignIn;
