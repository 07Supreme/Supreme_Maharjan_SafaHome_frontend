import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resendVerification, verifyCode } from "../../services/api";
import backgroundImage from "./Assets/clean.jpeg";
import Loader from "./Loader";
import Notification from "../Common/Notification";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
    serviceType: "",
    experience: "",
    address: "",
    citizenship: "",
  });
  const [citizenshipFile, setCitizenshipFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 5000);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCitizenshipFile(file);
      setForm({ ...form, citizenship: file.name });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResendMsg("");

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("phone", form.phone);
      formData.append("role", form.role);

      // If provider, include providerDetails
      if (form.role === "provider") {
        formData.append("serviceType", form.serviceType);
        formData.append("experience", form.experience);
        formData.append("address", form.address);
        
        // Append citizenship file if uploaded
        if (citizenshipFile) {
          formData.append("citizenship", citizenshipFile);
        }
      }

      // Use fetch for FormData (axios doesn't handle FormData well with files)
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Show verification pending state (combined UI)
      setPendingEmail(form.email);
      showNotification("Signup successful! Check your email for verification code.", "success");
    } catch (err) {
      console.error(err);
      showNotification(err.message || "Signup failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!pendingEmail) return;
    setResendLoading(true);
    setResendMsg("");
    setVerifyMsg("");
    try {
      await resendVerification({ email: pendingEmail });
      showNotification("Verification code resent. Check your inbox.", "success");
      setResendMsg("Verification code resent. Check your inbox.");
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.message || "Failed to resend. Try again.", "error");
      setResendMsg(err.response?.data?.message || "Failed to resend. Try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.length !== 6) {
      setVerifyMsg("Please enter a valid 6-digit code");
      return;
    }
    setVerifying(true);
    setVerifyMsg("");
    try {
      await verifyCode({ email: pendingEmail, code: verificationCode });
      showNotification("Email verified successfully! Redirecting to login...", "success");
      setVerifyMsg("✅ Email verified successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.message || "Invalid or expired code. Please try again.", "error");
      setVerifyMsg(err.response?.data?.message || "Invalid or expired code. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  // If pendingEmail is set, show verify panel instead of form (combined UI)
  if (pendingEmail) {
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
          <h2 style={titleStyle}>Verify Your Email</h2>

          <p style={{ color: "#556B2F" }}>
            A verification code has been sent to:
            <br />
            <b>{pendingEmail}</b>
          </p>

          <form onSubmit={handleVerifyCode} style={{ marginTop: 20 }}>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setVerificationCode(value);
                setVerifyMsg("");
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

            <p style={{ color: verifyMsg.includes("✅") ? "#8FA31E" : "#d32f2f", minHeight: 24, fontSize: 14, marginTop: 8 }}>
              {verifyMsg || resendMsg}
            </p>

            <button
              type="submit"
              disabled={verifying || verificationCode.length !== 6}
              style={{ ...buttonStyle, width: "100%", marginTop: 10 }}
            >
              {verifying ? <Loader size={18} /> : "Verify Code"}
            </button>
          </form>

          <button
            onClick={handleResend}
            disabled={resendLoading}
            style={{
              ...buttonStyle,
              width: "100%",
              backgroundColor: "transparent",
              color: "#556B2F",
              border: "1px solid #556B2F",
              marginTop: 10,
            }}
          >
            {resendLoading ? <Loader size={18} /> : "Resend Code"}
          </button>

          <p style={{ marginTop: 12, color: "#556B2F", fontSize: 13 }}>
            After verifying, you will be able to log in.
          </p>
        </div>
      </div>
    );
  }

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
        <h2 style={titleStyle}>Join SafaHome</h2>

        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name"
            value={form.name} onChange={handleChange} style={inputStyle} required />

          <input type="email" name="email" placeholder="Email"
            value={form.email} onChange={handleChange} style={inputStyle} required />

          <input type="password" name="password" placeholder="Password"
            value={form.password} onChange={handleChange} style={inputStyle} required />

          <input type="text" name="phone" placeholder="Phone Number"
            value={form.phone} onChange={handleChange} style={inputStyle} required />

          <select name="role" value={form.role} onChange={handleChange} style={inputStyle}>
            <option value="user">User</option>
            <option value="provider">Service Provider</option>
          </select>

          {form.role === "provider" && (
            <>
              <select name="serviceType" value={form.serviceType}
                onChange={handleChange} style={inputStyle}>
                <option value="">Select Service Type</option>
                <option value="cleaning">Cleaning</option>
                <option value="plumbing">Plumbing</option>
                <option value="painting">Painting</option>
                <option value="electrical">Electrical</option>
              </select>

              <input type="text" name="experience" placeholder="Years of Experience"
                value={form.experience} onChange={handleChange} style={inputStyle} />

              <textarea
                name="address"
                placeholder="Address / Skills"
                value={form.address}
                onChange={handleChange}
                style={{ ...inputStyle, height: "60px" }}
              ></textarea>

              <label style={{ display: "block", textAlign: "left", color: "#556B2F", marginTop: 6 }}>
                Upload Citizenship: <span style={{ color: "#d32f2f" }}>*</span>
              </label>
              <input 
                type="file" 
                onChange={handleFileUpload} 
                accept="image/*,.pdf"
                style={inputStyle}
                required
              />
              {citizenshipFile && (
                <p style={{ color: "#6b8e23", fontSize: "13px", marginTop: "4px", textAlign: "left" }}>
                  ✓ Selected: {citizenshipFile.name}
                </p>
              )}
            </>
          )}

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? <Loader size={18} /> : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* Styles (matched to your screenshot) */
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
  background: "rgba(242, 247, 203, 0.95)", // light translucent cream/green similar to screenshot
  padding: "40px",
  borderRadius: "12px",
  maxWidth: "640px",
  width: "560px",
  textAlign: "center",
  boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
};

const titleStyle = { color: "#556B2F", marginBottom: 20, fontSize: 26, fontWeight: "700" };

const inputStyle = {
  width: "100%",
  padding: "14px 12px",
  margin: "10px 0",
  border: "1px solid #C6D870",
  borderRadius: "8px",
  fontSize: 14,
  boxSizing: "border-box",
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

export default Signup;
