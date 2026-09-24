import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const encodedUser = searchParams.get("user");

    if (!token || !encodedUser) {
      navigate("/login?error=google", { replace: true });
      return;
    }

    try {
      localStorage.setItem("token", token);
      localStorage.setItem("user", encodedUser);
      navigate("/dashboard", {
        replace: true,
        state: { message: "Google login successful", type: "success" },
      });
    } catch (error) {
      navigate("/login?error=google", { replace: true });
    }
  }, [navigate, searchParams]);

  return (
    <div className="container mt-5 text-center">
      <p>Signing you in with Google...</p>
    </div>
  );
}

export default OAuthCallback;
