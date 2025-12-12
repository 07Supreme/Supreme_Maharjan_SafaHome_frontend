import React from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../Auth/Assets/clean.jpeg";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      className="landing-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="overlay">
        <header className="navbar">
          <h1 className="logo">
            <span className="logo-icon">🏠</span>
            SafaHome
          </h1>
          <nav>
            <button onClick={() => navigate("/login")} className="nav-btn">
              <span>Login</span>
            </button>
            <button onClick={() => navigate("/signup")} className="nav-btn filled">
              <span>Sign Up</span>
            </button>
          </nav>
        </header>

        <main className="hero">
          <div className="hero-content">
            <h1 className="hero-title">Trusted Home Services, Just a Click Away</h1>
            <p className="hero-subtitle">
              Book skilled professionals for cleaning, plumbing, electrical
              repair, and painting services — anytime, anywhere. Experience the convenience of professional home services at your fingertips.
            </p>
            <div className="hero-buttons">
              <button
                onClick={() => navigate("/signup")}
                className="cta-button primary"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate("/login")}
                className="cta-button secondary"
              >
                Sign In
              </button>
            </div>
            <div className="hero-features">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Verified Professionals</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>24/7 Availability</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Affordable Pricing</span>
              </div>
            </div>
          </div>
        </main>

        <section className="about-section">
          <div className="about-content">
            <div className="about-text">
              <h2>Why Choose SafaHome?</h2>
              <p>
                SafaHome is your trusted partner for all home maintenance and service needs. 
                We connect you with verified, experienced professionals who are committed to 
                delivering exceptional results. Whether you need a quick fix or a complete 
                home makeover, our platform makes it easy to find the right service provider.
              </p>
              <p>
                Our mission is to bring cleanliness, comfort, and quality service to every home. 
                With transparent pricing, easy booking, and reliable professionals, SafaHome 
                ensures your home is in the best hands.
              </p>
            </div>
            <div className="about-image">
              <div className="image-placeholder">
                <span className="image-icon">🏡</span>
                <p>Professional Home Services</p>
              </div>
            </div>
          </div>
        </section>

        <section className="services">
          <div className="services-header">
            <h3>Our Popular Services</h3>
            <p className="services-subtitle">Choose from a wide range of professional home services</p>
          </div>
          <div className="service-grid">
            <div className="service-card">
              <div className="service-icon">🧹</div>
              <h4>Home Cleaning</h4>
              <p>Professional deep cleaning for your entire home. Sparkling clean results guaranteed. From regular maintenance to deep cleaning, we've got you covered.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🔧</div>
              <h4>Plumbing</h4>
              <p>Expert plumbers for any kind of household fix. Quick and reliable service. Leak repairs, installations, and maintenance - all handled professionally.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">⚡</div>
              <h4>Electrical</h4>
              <p>Certified electricians for repairs and installations. Safety first approach. From wiring to fixture installation, we ensure your home's electrical safety.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🖌️</div>
              <h4>Painting</h4>
              <p>Custom wall painting indoor or outdoor. Quality finishes that last. Transform your space with professional painting services.</p>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="features-content">
            <h2>What Makes Us Different</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-card-icon">🔒</div>
                <h4>Secure & Safe</h4>
                <p>All providers are background checked and verified for your peace of mind.</p>
              </div>
              <div className="feature-card">
                <div className="feature-card-icon">💰</div>
                <h4>Transparent Pricing</h4>
                <p>No hidden charges. See all costs upfront before booking any service.</p>
              </div>
              <div className="feature-card">
                <div className="feature-card-icon">⭐</div>
                <h4>Quality Guaranteed</h4>
                <p>We stand behind our work. Quality service guaranteed or your money back.</p>
              </div>
              <div className="feature-card">
                <div className="feature-card-icon">📱</div>
                <h4>Easy Booking</h4>
                <p>Book services in minutes through our user-friendly platform.</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-main">
            <div className="footer-section">
              <h3 className="footer-title">
                <span className="logo-icon">🏠</span>
                SafaHome
              </h3>
              <p className="footer-description">
                Your trusted partner for professional home services. 
                Bringing cleanliness, comfort, and quality to every home.
              </p>
              <div className="social-links">
                <a href="#" className="social-link">📘 Facebook</a>
                <a href="#" className="social-link">📷 Instagram</a>
                <a href="#" className="social-link">🐦 Twitter</a>
                <a href="#" className="social-link">💼 LinkedIn</a>
              </div>
            </div>

            <div className="footer-section">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-list">
                <li><a href="#home">Home</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-heading">Services</h4>
              <ul className="footer-list">
                <li><a href="#cleaning">Home Cleaning</a></li>
                <li><a href="#plumbing">Plumbing Services</a></li>
                <li><a href="#electrical">Electrical Services</a></li>
                <li><a href="#painting">Painting Services</a></li>
                <li><a href="#provider">Become a Provider</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-heading">Contact Us</h4>
              <ul className="footer-list">
                <li>📧 info@safahome.com</li>
                <li>📞 +977 9800000000</li>
                <li>📍 Kathmandu, Nepal</li>
                <li>🕒 Mon-Sun: 24/7 Available</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p>© 2025 SafaHome. All rights reserved.</p>
              <div className="footer-legal">
                <a href="#privacy">Privacy Policy</a>
                <span>|</span>
                <a href="#terms">Terms of Service</a>
                <span>|</span>
                <a href="#cookies">Cookie Policy</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default LandingPage;
