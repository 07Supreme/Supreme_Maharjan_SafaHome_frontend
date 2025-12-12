import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Notification from "../Common/Notification";
import "./ProviderRequests.css";

function ProviderRequests() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [viewingCitizenship, setViewingCitizenship] = useState(null);

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 5000);
  }, []);

  const fetchProviders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://localhost:5000/api/admin/providers");
      setProviders(res.data);
    } catch (err) {
      console.error("Error fetching providers:", err);
      setError("Failed to load providers. Please try again.");
      showNotification("Failed to load providers. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const approveProvider = async (id) => {
    try {
      setActionLoading(id);
      // Get the provider to determine service type
      const provider = providers.find(p => p._id === id);
      const serviceType = provider?.providerDetails?.serviceType;
      
      // Initialize pricing structure based on service type
      const prices = {};
      
      if (serviceType === "cleaning") {
        prices.cleaning = {
          perSofa: 0,
          perCarpet: 0,
          perDay: 0,
          perWaterTank: 0
        };
      } else if (serviceType === "plumbing") {
        prices.plumbing = {
          perJob: 0,
          perHour: 0,
          perFixture: 0
        };
      } else if (serviceType === "painting") {
        prices.painting = {
          perRoom: 0,
          perSqFt: 0,
          perDay: 0
        };
      } else if (serviceType === "electrical") {
        prices.electrical = {
          perInstallation: 0,
          perRepair: 0,
          perHour: 0
        };
      }

      await axios.put(`http://localhost:5000/api/admin/approve/${id}`, prices);
      await fetchProviders();
      showNotification("Provider approved successfully! Email sent to provider.", "success");
    } catch (err) {
      console.error("Error approving provider:", err);
      const errorMsg = err.response?.data?.message || "Failed to approve provider. Please try again.";
      showNotification(errorMsg, "error");
    } finally {
      setActionLoading(null);
    }
  };

  const rejectProvider = async (id) => {
    if (!window.confirm("Are you sure you want to reject this provider?")) {
      return;
    }

    try {
      setActionLoading(id);
      await axios.put(`http://localhost:5000/api/admin/reject/${id}`);
      await fetchProviders();
      showNotification("Provider rejected successfully! Email sent to provider.", "success");
    } catch (err) {
      console.error("Error rejecting provider:", err);
      const errorMsg = err.response?.data?.message || "Failed to reject provider. Please try again.";
      showNotification(errorMsg, "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewCitizenship = (citizenship) => {
    if (!citizenship) {
      showNotification("Citizenship document not available", "warning");
      return;
    }
    setViewingCitizenship(citizenship);
  };

  const pendingProviders = providers.filter(
    (p) => p.providerDetails && (p.providerDetails.status === "pending" || !p.providerDetails.status)
  );

  if (loading) {
    return (
      <div className="provider-requests">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading providers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="provider-requests">
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchProviders} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="provider-requests">
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: "", type: "" })}
        />
      )}

      {viewingCitizenship && (
        <div className="citizenship-modal" onClick={() => setViewingCitizenship(null)}>
          <div className="citizenship-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="citizenship-modal-header">
              <h3>Citizenship Document</h3>
              <button className="close-modal-btn" onClick={() => setViewingCitizenship(null)}>
                ×
              </button>
            </div>
            <div className="citizenship-modal-body">
              {viewingCitizenship.startsWith("/uploads/") ? (
                <>
                  <div className="citizenship-image-container">
                    {viewingCitizenship.toLowerCase().endsWith(".pdf") ? (
                      <div className="pdf-viewer">
                        <p>📄 PDF Document</p>
                        <a 
                          href={`http://localhost:5000${viewingCitizenship}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="view-pdf-link"
                        >
                          Open PDF in New Tab
                        </a>
                      </div>
                    ) : (
                      <img 
                        src={`http://localhost:5000${viewingCitizenship}`} 
                        alt="Citizenship Document" 
                        className="citizenship-image"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "block";
                        }}
                      />
                    )}
                    <div className="image-error" style={{ display: "none" }}>
                      <p>⚠️ Unable to load image</p>
                      <a 
                        href={`http://localhost:5000${viewingCitizenship}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="view-link"
                      >
                        Open in New Tab
                      </a>
                    </div>
                  </div>
                  <div className="citizenship-actions">
                    <a 
                      href={`http://localhost:5000${viewingCitizenship}`} 
                      download
                      className="download-btn"
                    >
                      📥 Download File
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <p className="citizenship-filename">📄 {viewingCitizenship}</p>
                  <p className="citizenship-note">
                    Note: This appears to be a filename. The file may not be available.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="provider-header">
        <h2>Provider Requests</h2>
        <p className="provider-count">
          {pendingProviders.length} pending request{pendingProviders.length !== 1 ? "s" : ""}
        </p>
      </div>

      {pendingProviders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✅</div>
          <p>No pending provider requests</p>
          <p className="empty-subtitle">All provider applications have been processed</p>
        </div>
      ) : (
        <div className="providers-grid">
          {pendingProviders.map((p) => (
            <div key={p._id} className="provider-card">
              <div className="provider-info">
                <h3>{p.name}</h3>
                <div className="provider-details">
                  <div className="detail-item">
                    <span className="detail-label">📧 Email:</span>
                    <span>{p.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">📞 Phone:</span>
                    <span>{p.phone || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">🔧 Service:</span>
                    <span className="service-badge">
                      {p.providerDetails?.serviceType
                        ? p.providerDetails.serviceType.charAt(0).toUpperCase() +
                          p.providerDetails.serviceType.slice(1)
                        : "N/A"}
                    </span>
                  </div>
                  {p.providerDetails?.experience && (
                    <div className="detail-item">
                      <span className="detail-label">⭐ Experience:</span>
                      <span>{p.providerDetails.experience} years</span>
                    </div>
                  )}
                  {p.providerDetails?.address && (
                    <div className="detail-item">
                      <span className="detail-label">📍 Address/Skills:</span>
                      <span>{p.providerDetails.address}</span>
                    </div>
                  )}
                  {p.providerDetails?.citizenship && (
                    <div className="detail-item">
                      <span className="detail-label">📄 Citizenship:</span>
                      <button
                        className="citizenship-view-btn"
                        onClick={() => handleViewCitizenship(p.providerDetails.citizenship)}
                        title="Click to view citizenship document"
                      >
                        👁️ {p.providerDetails.citizenship}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="provider-actions">
                <button
                  onClick={() => approveProvider(p._id)}
                  disabled={actionLoading === p._id}
                  className="approve-btn"
                >
                  {actionLoading === p._id ? "Processing..." : "✓ Approve"}
                </button>
                <button
                  onClick={() => rejectProvider(p._id)}
                  disabled={actionLoading === p._id}
                  className="reject-btn"
                >
                  {actionLoading === p._id ? "Processing..." : "✗ Reject"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProviderRequests;
