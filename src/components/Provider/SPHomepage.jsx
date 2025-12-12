import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../Auth/Assets/clean.jpeg";
import "./SPHomepage.css";

function SPHomepage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUserData();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      // Get user data from localStorage (set during login)
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } else {
        setUser({ name: "Provider", email: "provider@example.com" });
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case "cleaning":
        return "🧹";
      case "plumbing":
        return "🔧";
      case "painting":
        return "🖌️";
      case "electrical":
        return "⚡";
      default:
        return "👷";
    }
  };

  const getServiceName = (serviceType) => {
    if (!serviceType) return "N/A";
    return serviceType.charAt(0).toUpperCase() + serviceType.slice(1);
  };

  if (loading) {
    return (
      <div className="sp-home-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="overlay">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Get provider details from user data (would need to fetch from API in real scenario)
  const providerDetails = user?.providerDetails || {};
  const serviceType = providerDetails.serviceType || "";
  const status = providerDetails.status || "pending";

  return (
    <div
      className="sp-home-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="overlay">
        <header className="navbar">
          <h1 className="logo">
            <span className="logo-icon">🏠</span>
            SafaHome
          </h1>
          <nav>
            <span className="user-greeting">Welcome, {user?.name || "Provider"}!</span>
            <button onClick={handleLogout} className="nav-btn logout-btn">
              Logout
            </button>
          </nav>
        </header>

        <main className="hero">
          <div className="hero-content">
            <h1 className="hero-title">Service Provider Dashboard</h1>
            <p className="hero-subtitle">
              Manage your services and connect with customers
            </p>
          </div>
        </main>

        <section className="provider-status-section">
          <div className="status-card">
            <div className="status-header">
              <div className="service-icon-large">
                {getServiceIcon(serviceType)}
              </div>
              <div className="status-info">
                <h3>{getServiceName(serviceType)} Service Provider</h3>
                <span className={`status-badge ${status}`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
            </div>

            {status === "pending" && (
              <div className="status-message pending-message">
                <p>⏳ Your application is under review. You'll be notified once approved.</p>
              </div>
            )}

            {status === "approved" && (
              <div className="status-message approved-message">
                <p>✅ Your account has been approved! You can now receive service requests.</p>
              </div>
            )}

            {status === "rejected" && (
              <div className="status-message rejected-message">
                <p>❌ Your application has been rejected. Please contact support for more information.</p>
              </div>
            )}

            {status === "blocked" && (
              <div className="status-message blocked-message">
                <p>🚫 Your account has been blocked. Please contact support for assistance.</p>
              </div>
            )}
          </div>
        </section>

        {status === "approved" && (
          <>
            <section className="provider-info-section">
              <div className="info-grid">
                <div className="info-card">
                  <div className="info-icon">📧</div>
                  <h4>Email</h4>
                  <p>{user?.email || "N/A"}</p>
                </div>
                <div className="info-card">
                  <div className="info-icon">📞</div>
                  <h4>Phone</h4>
                  <p>{user?.phone || "N/A"}</p>
                </div>
                {providerDetails.experience && (
                  <div className="info-card">
                    <div className="info-icon">⭐</div>
                    <h4>Experience</h4>
                    <p>{providerDetails.experience} years</p>
                  </div>
                )}
                {providerDetails.address && (
                  <div className="info-card">
                    <div className="info-icon">📍</div>
                    <h4>Location</h4>
                    <p>{providerDetails.address}</p>
                  </div>
                )}
              </div>
            </section>

            <section className="features-section">
              <h3 className="section-title">Your Services</h3>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">📋</div>
                  <h4>View Requests</h4>
                  <p>Check and manage incoming service requests from customers</p>
                  <button className="feature-btn" disabled>
                    Coming Soon
                  </button>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">💰</div>
                  <h4>Pricing</h4>
                  <p>View your current pricing set by the admin</p>
                  <button className="feature-btn" disabled>
                    Coming Soon
                  </button>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">📊</div>
                  <h4>Analytics</h4>
                  <p>Track your performance and earnings</p>
                  <button className="feature-btn" disabled>
                    Coming Soon
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        <footer className="footer">
          <div className="footer-content">
            <p>© 2025 SafaHome | Service Provider Portal</p>
            <div className="footer-links">
              <a href="#support">Support</a>
              <a href="#help">Help</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default SPHomepage;

