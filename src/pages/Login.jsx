import { useState } from "react";
import axios from "axios";
import {
  Link,
  useNavigate,
} from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const googleLoginUrl =
    "http://localhost:5000/api/auth/google";


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard", {
        state: { message: response.data.message, type: "success" },
      });

    } catch (error) {

      setMessage(
        error.response?.data?.message ||
        "Login failed"
      );

    }

  };


  return (
    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-5">

          <div className="card shadow p-4">

            <div className="auth-brand">
              <img src="/fintrack-logo.png" alt="FinTrack logo" className="auth-logo" />
              <h2>FinTrack</h2>
            </div>

            <h5 className="text-center mb-4">
              Login
            </h5>

            {message && (
              <div className="alert alert-danger">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="mb-3">

                <label className="form-label">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="mb-3">

                <label className="form-label">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

              </div>


              <button
                type="submit"
                className="btn btn-primary w-100"
              >
                Login
              </button>

            </form>

            <div className="login-divider">
              <span>or</span>
            </div>

            <a
              href={googleLoginUrl}
              className="google-login-button"
            >
              <span className="google-mark">G</span>
              Continue with Google
            </a>


            <p className="text-center mt-3">

              Don't have an account?

              <Link
                to="/register"
                className="ms-1"
              >
                Register
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;