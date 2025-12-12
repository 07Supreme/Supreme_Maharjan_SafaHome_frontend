import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, forgotPassword, resetPassword } from "../../services/api";
import backgroundImage from "./Assets/clean.jpeg";
import Notification from "../Common/Notification";
import Loader from "./Loader";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetStep, setResetStep] = useState("email"); // "email", "code", "password"
  const [resetForm, setResetForm] = useState({ email: "", code: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleResetChange = (e) => {
    setResetForm({ ...resetForm, [e.target.name]: e.target.value });
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login(form);

      if (!res.data.user.verified) {
        showNotification("Your email is not verified.", "error");
        setTimeout(() => {
          navigate(`/verify-email?email=${form.email}`);
        }, 2000);
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      showNotification("Login successful!", "success");

      setTimeout(() => {
        if (res.data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else if (res.data.user.role === "provider") {
          navigate("/sp-home");
        } else {
          navigate("/user-home");
        }
      }, 1500);
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Invalid credentials",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRequestResetCode = async (e) => {
    e.preventDefault();
    if (!resetForm.email) {
      showNotification("Please enter your email", "error");
      return;
    }

    setResetLoading(true);
    try {
      await forgotPassword({ email: resetForm.email });
      showNotification("Password reset code sent to your email", "success");
      // Move to code input step
      setResetStep("code");
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Failed to send reset code",
        "error"
      );
    } finally {
      setResetLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!resetForm.code || resetForm.code.length !== 6) {
      showNotification("Please enter a valid 6-digit code", "error");
      return;
    }

    
    setResetStep("password");
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (resetForm.newPassword !== resetForm.confirmPassword) {
      showNotification("Passwords do not match", "error");
      return;
    }
    if (resetForm.newPassword.length < 6) {
      showNotification("Password must be at least 6 characters", "error");
      return;
    }

    setResetLoading(true);
    try {
      await resetPassword({
        email: resetForm.email,
        code: resetForm.code,
        newPassword: resetForm.newPassword,
      });
      showNotification("Password reset successfully! Redirecting to login...", "success");
      setTimeout(() => {
        setShowResetPassword(false);
        setResetStep("email");
        setResetForm({ email: "", code: "", newPassword: "", confirmPassword: "" });
      }, 2000);
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Failed to reset password",
        "error"
      );
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />

      <button
        onClick={() => navigate("/")}
        className="back-button"
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          background: "rgba(85, 107, 47, 0.9)",
          color: "#fff",
          border: "none",
          padding: "10px 20px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          zIndex: 1000,
        }}
      >
        ← Back to Home
      </button>

      <div
        style={{
          background: "rgba(239,245,210,0.95)",
          padding: "40px",
          borderRadius: "12px",
          width: "400px",
          textAlign: "center",
          boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
        }}
      >
        <h2 style={{ color: "#556B2F" }}>Welcome Back to SafaHome</h2>

        {!showResetPassword ? (
          <>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              <button type="submit" style={buttonStyle} disabled={loading}>
                {loading ? <Loader size={18} /> : "Login"}
              </button>
            </form>

            <button
              onClick={() => setShowResetPassword(true)}
              style={{
                ...buttonStyle,
                background: "transparent",
                color: "#556B2F",
                border: "1px solid #556B2F",
                marginTop: "10px",
              }}
            >
              Forgot Password?
            </button>
          </>
        ) : (
          <div>
            <h3 style={{ color: "#556B2F", marginBottom: "20px" }}>Reset Password</h3>
            
            {/* Step 1: Email Input */}
            {resetStep === "email" && (
              <form onSubmit={handleRequestResetCode}>
                <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>
                  Enter your email address and we'll send you a reset code.
                </p>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={resetForm.email}
                  onChange={handleResetChange}
                  required
                  style={inputStyle}
                />
                <button type="submit" style={buttonStyle} disabled={resetLoading}>
                  {resetLoading ? <Loader size={18} /> : "Send Reset Code"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowResetPassword(false);
                    setResetStep("email");
                    setResetForm({ email: "", code: "", newPassword: "", confirmPassword: "" });
                  }}
                  style={{
                    ...buttonStyle,
                    background: "transparent",
                    color: "#556B2F",
                    border: "1px solid #556B2F",
                    marginTop: "10px",
                  }}
                >
                  Back to Login
                </button>
              </form>
            )}

            {/* Step 2: Code Input */}
            {resetStep === "code" && (
              <form onSubmit={handleVerifyCode}>
                <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>
                  We've sent a 6-digit code to <strong>{resetForm.email}</strong>. Please enter it below.
                </p>
                <input
                  type="text"
                  name="code"
                  placeholder="Enter 6-digit code"
                  value={resetForm.code}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    handleResetChange({ target: { name: "code", value } });
                  }}
                  maxLength={6}
                  required
                  style={{
                    ...inputStyle,
                    textAlign: "center",
                    fontSize: "20px",
                    letterSpacing: "6px",
                    fontWeight: "bold",
                  }}
                />
                <button type="submit" style={buttonStyle} disabled={resetLoading || resetForm.code.length !== 6}>
                  {resetLoading ? <Loader size={18} /> : "Verify Code"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setResetStep("email");
                    setResetForm({ ...resetForm, code: "" });
                  }}
                  style={{
                    ...buttonStyle,
                    background: "transparent",
                    color: "#556B2F",
                    border: "1px solid #556B2F",
                    marginTop: "10px",
                  }}
                >
                  Change Email
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setResetLoading(true);
                    try {
                      await forgotPassword({ email: resetForm.email });
                      showNotification("New reset code sent to your email", "success");
                    } catch (err) {
                      showNotification(
                        err.response?.data?.message || "Failed to resend code",
                        "error"
                      );
                    } finally {
                      setResetLoading(false);
                    }
                  }}
                  style={{
                    ...buttonStyle,
                    background: "transparent",
                    color: "#556B2F",
                    border: "1px solid #556B2F",
                    marginTop: "5px",
                  }}
                  disabled={resetLoading}
                >
                  Resend Code
                </button>
              </form>
            )}

            {/* Step 3: New Password Input */}
            {resetStep === "password" && (
              <form onSubmit={handleResetPassword}>
                <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>
                  Enter your new password below.
                </p>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={resetForm.newPassword}
                  onChange={handleResetChange}
                  required
                  style={inputStyle}
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={resetForm.confirmPassword}
                  onChange={handleResetChange}
                  required
                  style={inputStyle}
                />
                <button type="submit" style={buttonStyle} disabled={resetLoading}>
                  {resetLoading ? <Loader size={18} /> : "Reset Password"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setResetStep("code");
                    setResetForm({ ...resetForm, newPassword: "", confirmPassword: "" });
                  }}
                  style={{
                    ...buttonStyle,
                    background: "transparent",
                    color: "#556B2F",
                    border: "1px solid #556B2F",
                    marginTop: "10px",
                  }}
                >
                  Back to Code
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "10px 0",
  border: "1px solid #C6D870",
  borderRadius: "8px",
  boxSizing: "border-box",
};

const buttonStyle = {
  backgroundColor: "#556B2F",
  color: "#fff",
  padding: "10px",
  width: "100%",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "15px",
};

export default Login;
