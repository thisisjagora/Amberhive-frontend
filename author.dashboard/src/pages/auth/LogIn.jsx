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
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import bgImage from "@/assets/l-bg-1.png";
import bgImage2 from "@/assets/l-bg-2.png";
import AmberHiveLogo from "@/assets/Amberhive.png";

const LogIn = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    if (errors[id]) {
      setErrors({ ...errors, [id]: "" });
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required.";
    if (!password) newErrors.password = "Password is required.";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const DEFAULT_EMAIL = "author@amberhive.com";
      const DEFAULT_PASSWORD = "amberhive123";

      if (email === DEFAULT_EMAIL && password === DEFAULT_PASSWORD) {
        toast.success("Login successfully!", {
          description: "Sign in with your detail",
          position: "top-right",
        });
        navigate("/sign-in");
      } else {
        toast.error("Invalid credentials", { position: "top-right" });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between font-gilroy overflow-hidden">
      <div className="hidden md:block absolute top-0 right-0 z-0">
        <img
          src={bgImage}
          alt="Background design"
          className="w-[900px] object-contain"
        />
      </div>

      <header className="hidden md:block px-4 py-4 z-10 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img src={AmberHiveLogo} alt="AmberHive Logo" className="w-36" />
          {/* <p className="text-sm text-gray-700">
            Need an account?{" "}
            <Link to="/sign-up" className="text-yellow-600 font-bold hover:underline">
              Sign Up
            </Link>
          </p> */}
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 relative z-10">
        <Card className="w-full md:max-w-md p-2 my-4 bg-white/80 border border-white/90">
          <CardHeader className="text-center">
            <CardTitle className="text-lg md:text-2xl font-semibold">
              Sign into AmberHive
            </CardTitle>
            <CardDescription className="text-gray-500 text-sm md:text-base">
              Hey there! Welcome to AmberHive.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email" className="font-semibold">
                  Email*
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`placeholder:font-medium ${
                    errors.email ? "border-red-600" : ""
                  } focus:border-yellow-600 focus:ring-yellow-600`}
                />
                {errors.email && (
                  <p className="text-red-600 text-xs">{errors.email}</p>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <Label htmlFor="password" className="font-semibold">
                    Password*
                  </Label>
                  {/* <Link to="/forgot-password" className="text-yellow-600 hover:underline text-sm">
                    Forgot Password?
                  </Link> */}
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`placeholder:font-medium ${
                    errors.password ? "border-red-600" : ""
                  } focus:border-yellow-600 focus:ring-yellow-600`}
                />
                {errors.password && (
                  <p className="text-red-600 text-xs">{errors.password}</p>
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

            <p className="text-center text-gray-700 text-sm md:hidden">
              Need an account?{" "}
              <Link to="/sign-up" className="text-yellow-600 hover:underline">
                Sign Up
              </Link>
            </p>

            <div className="flex items-center my-4">
              <Separator className="flex-1" />
              <span className="px-4 text-gray-500 text-sm">Or</span>
              <Separator className="flex-1" />
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <FcGoogle className="text-lg" /> Sign in with Google
              </Button>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <FaFacebook className="text-blue-600 text-lg" /> Sign in with
                Facebook
              </Button>
            </div>
          </CardContent>

          <CardFooter className="pt-6 flex flex-col items-center">
            <p className="text-gray-600 text-sm">
              Privacy Policy | Terms & Conditions
            </p>
          </CardFooter>
        </Card>
      </main>

      <footer className="text-center text-gray-600 text-sm py-4">
        &copy; {new Date().getFullYear()} AmberHive.
      </footer>

      <div className="hidden md:block absolute bottom-0 left-0">
        <img
          src={bgImage2}
          alt="Bottom decorative graphic"
          className="w-[450px] object-contain"
        />
      </div>
    </div>
  );
};

export default LogIn;
