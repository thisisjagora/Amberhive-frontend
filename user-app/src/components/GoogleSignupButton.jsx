import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { registerUser, loginUser } from "@/store/slice/authSlice";
import { toast } from "sonner";

export default function GoogleSignUpButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const GOOGLE_SECRET = "$amberuser123@@";

  const signUp = useGoogleLogin({
    flow: "implicit",
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

        // Try to register the user
        const registerResult = await dispatch(
          registerUser({
            name: profile.name,
            email: profile.email,
            password: GOOGLE_SECRET,
            googleId: profile.sub,
            role: "user",
          })
        );

        if (registerUser.fulfilled.match(registerResult)) {
          // Now login using the same credentials
          const loginResult = await dispatch(
            loginUser({
              email: profile.email,
              password: GOOGLE_SECRET,
              googleId: profile.sub,
              role: "user",
            })
          );

          if (loginUser.fulfilled.match(loginResult)) {
            toast.success("Signed up and logged in with Google!");
            navigate("/");
          } else {
            const payload = loginResult.payload;
            toast.error(
              typeof payload === "string"
                ? payload
                : payload?.message || payload?.error?.message
            );
          }
        } else {
          const payload = registerResult.payload;
          toast.error(
            typeof payload === "string"
              ? payload
              : payload?.message || payload?.error?.message
          );
        }
      } catch (err) {
        console.error("Google sign-up error:", err);
        toast.error("Google sign-up failed. Try again.");
      }
    },
    onError: () => toast.error("Google authentication failed."),
  });

  return (
    <div className="w-full max-w-4xl flex flex-col items-center justify-center">
      <Button
        variant="outline"
        onClick={() => signUp()}
        className="w-full flex items-center justify-center cursor-pointer gap-2 border border-gray-300 shadow-sm hover:bg-gray-100 transition-colors"
      >
        <FcGoogle className="text-xl" />
        <span className="text-base font-medium text-gray-700">
          Sign up with Google
        </span>
      </Button>
    </div>
  );
}
