import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { loginUser } from "@/store/slice/authSlice";
import { toast } from "sonner";

export default function GoogleLoginButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const GOOGLE_SECRET = "$amberuser123@@";

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const profile = await res.json();

        const resultAction = await dispatch(
          loginUser({
            email: profile.email,
            password: GOOGLE_SECRET,
            googleId: profile.sub,
            role: "user",
          })
        );

        if (loginUser.fulfilled.match(resultAction)) {
          toast.success("Signed in with Google!");
          navigate("/");
        } else {
          const errorPayload = resultAction.payload;
          const errorMessage =
            typeof errorPayload === "string"
              ? errorPayload
              : errorPayload?.error || "Login failed.";
          toast.error(errorMessage);
        }
      } catch (err) {
        console.error("Google login error:", err);
        toast.error("Google login failed. Try again.");
      }
    },
    onError: () => toast.error("Google Sign-In failed"),
    flow: "implicit",
  });

  return (
    <div className="w-full max-w-4xl flex flex-col items-center justify-center">
      <Button
        variant="outline"
        onClick={() => login()}
        className="w-full flex items-center justify-center cursor-pointer gap-2 border border-gray-300 shadow-sm hover:bg-gray-100 transition-colors"
      >
        <FcGoogle className="text-xl" />
        <span className="text-base font-medium text-gray-700">
          Sign in with Google
        </span>
      </Button>
    </div>
  );
}
