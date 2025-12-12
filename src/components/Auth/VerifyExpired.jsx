import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resendVerification, verifyCode } from "../../services/api";
import backgroundImage from "./Assets/clean.jpeg";
import Loader from "./Loader";
import Notification from "../Common/Notification";

function VerifyExpired() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [info, setInfo] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 5000);
  };

  const handleResend = async () => {
    if (!email) return setInfo("Enter your email");
    setLoading(true);
    setInfo("");
    try {
      await resendVerification({ email });
      showNotification("Verification code resent. Check your inbox.", "success");
      setInfo("Verification code resent. Check your inbox.");
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Failed to resend.";
      showNotification(errorMsg, "error");
      setInfo(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!email) return setInfo("Enter your email");
    if (!verificationCode || verificationCode.length !== 6) {
      setInfo("Please enter a valid 6-digit code");
      return;
    }
    setVerifying(true);
    setInfo("");
    try {
      await verifyCode({ email, code: verificationCode });
      showNotification("Email verified successfully! Redirecting to login...", "success");
      setInfo("✅ Email verified successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Invalid or expired code. Please try again.";
      showNotification(errorMsg, "error");
      setInfo(errorMsg);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div style={pageStyle(backgroundImage)}>
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
      <div style={cardStyle}>
        <h2 style={{ color: "#556B2F" }}>Code Expired</h2>
        <p style={{ color: "#556B2F" }}>Your verification code has expired or is invalid.</p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setInfo("");
          }}
          style={inputStyle}
        />

        {email && (
          <form onSubmit={handleVerifyCode}>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setVerificationCode(value);
                setInfo("");
              }}
              style={{
                ...inputStyle,
                textAlign: "center",
                fontSize: 24,
                letterSpacing: 8,
                fontWeight: "bold",
              }}
              maxLength={6}
              required
            />

            <button type="submit" style={buttonStyle} disabled={verifying || verificationCode.length !== 6}>
              {verifying ? <Loader size={18} /> : "Verify Code"}
            </button>
          </form>
        )}

        <button 
          onClick={handleResend} 
          style={{
            ...buttonStyle,
            backgroundColor: "transparent",
            color: "#556B2F",
            border: "1px solid #556B2F",
            marginTop: email ? 10 : 0,
          }} 
          disabled={loading || !email}
        >
          {loading ? <Loader size={18} /> : "Resend Code"}
        </button>

        <p style={{ 
          color: info.includes("✅") ? "#8FA31E" : info ? "#d32f2f" : "transparent", 
          marginTop: 10,
          minHeight: 24,
          fontSize: 14,
        }}>
          {info}
        </p>
      </div>
    </div>
  );
}

/* reuse similar styles as signup */
const pageStyle = (bg) => ({
  backgroundImage: `url(${bg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
});

const cardStyle = {
  background: "rgba(242,247,203,0.95)",
  padding: "36px",
  borderRadius: "12px",
  width: 480,
  textAlign: "center",
  boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  margin: "10px 0",
  border: "1px solid #C6D870",
  borderRadius: "8px",
};

const buttonStyle = {
  backgroundColor: "#556B2F",
  color: "#fff",
  padding: "12px",
  width: "100%",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "700",
  marginTop: 8,
};

export default VerifyExpired;
