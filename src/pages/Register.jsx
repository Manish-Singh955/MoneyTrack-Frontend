import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        avatar: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await axios.post(
        `${API_BASE_URL}/api/auth/register`,
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
        "Registration failed"
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
              <h2>Create FinTrack Account</h2>
            </div>

            {message && (
              <div className="alert alert-danger">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="mb-3">

                <label className="form-label">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>


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

              <div className="mb-3">
                <label className="form-label">Upload Avatar Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleAvatarUpload}
                />
              </div>

              {formData.avatar && (
                <div className="mb-3 text-center">
                  <img
                    src={formData.avatar}
                    alt="Avatar preview"
                    className="avatar-preview"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-100"
              >
                Register
              </button>

            </form>


            <p className="text-center mt-3">

              Already have an account?

              <Link
                to="/login"
                className="ms-1"
              >
                Login
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;