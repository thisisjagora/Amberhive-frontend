import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { loginUser } from "@/redux/slices/authSlice";

export default function GoogleLoginButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const GOOGLE_SECRET = "$amberuser123@@";

  const login = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });

        const profile = await res.json();

        const resultAction = await dispatch(
          loginUser({
            email: profile.email,
            password: GOOGLE_SECRET,
            googleId: profile.sub,
            role: "author",
          })
        );

        if (loginUser.fulfilled.match(resultAction)) {
          const userData = resultAction.payload;
          const authorId = userData?.user?.author_id;
          const royaltyPercentage = userData?.user?.royalty_percentage;

          if (authorId === null) {
            navigate("/profile-detail");
          } else if (royaltyPercentage === null) {
            navigate("/pricing");
          } else {
            navigate("/dashboard/overview");
          }

          toast.success("Signed in with Google!");
        } else {
          // ONLY show specific error message if it exists
          const errorPayload = resultAction.payload;
          if (typeof errorPayload === "string") {
            toast.error(errorPayload);
          } else if (errorPayload?.error) {
            toast.error(errorPayload.error);
          }
        }
      } catch (err) {
        console.error("Google login error:", err);
        toast.error(err?.message);
      }
    },
    onError: () => toast.error("Google Sign-In failed"),
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
