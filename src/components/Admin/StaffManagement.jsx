import React, { useState, useEffect } from "react";
import axios from "axios";
import Notification from "../Common/Notification";
import "./StaffManagement.css";

function StaffManagement() {
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serviceFilter, setServiceFilter] = useState("all");
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [editingProvider, setEditingProvider] = useState(null);
  const [viewingProvider, setViewingProvider] = useState(null);
  const [confirmAction, setConfirmAction] = useState({ show: false, type: "", id: null, status: null });
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    serviceType: "",
    experience: "",
    address: "",
  });
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    filterProviders();
  }, [serviceFilter, providers]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://localhost:5000/api/admin/service-providers");
      setProviders(res.data);
    } catch (err) {
      console.error("Error fetching providers:", err);
      setError("Failed to load service providers. Please try again.");
      showNotification("Failed to load service providers. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const filterProviders = () => {
    if (serviceFilter === "all") {
      setFilteredProviders(providers);
    } else {
      setFilteredProviders(
        providers.filter(
          (p) => p.providerDetails?.serviceType === serviceFilter
        )
      );
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 5000);
  };

  const handleBlockProvider = async (id, currentStatus) => {
    setConfirmAction({
      show: true,
      type: "block",
      id,
      status: currentStatus
    });
  };

  const confirmBlockAction = async () => {
    const { id, status } = confirmAction;
    try {
      setActionLoading(id);
      await axios.put(`http://localhost:5000/api/admin/block-provider/${id}`);
      showNotification(
        `Provider ${status === "blocked" ? "unblocked and approved" : "blocked"} successfully`,
        "success"
      );
      setConfirmAction({ show: false, type: "", id: null, status: null });
      await fetchProviders();
    } catch (err) {
      console.error("Error blocking provider:", err);
      showNotification(
        err.response?.data?.message || "Failed to block/unblock provider",
        "error"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditProvider = (provider) => {
    setEditingProvider(provider._id);
    setEditForm({
      name: provider.name,
      phone: provider.phone || "",
      serviceType: provider.providerDetails?.serviceType || "",
      experience: provider.providerDetails?.experience || "",
      address: provider.providerDetails?.address || "",
    });
  };

  const handleUpdateProvider = async (id) => {
    try {
      setActionLoading(id);
      await axios.put(`http://localhost:5000/api/admin/update-provider/${id}`, editForm);
      showNotification("Provider updated successfully", "success");
      setEditingProvider(null);
      await fetchProviders();
    } catch (err) {
      console.error("Error updating provider:", err);
      showNotification(
        err.response?.data?.message || "Failed to update provider",
        "error"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const cancelEdit = () => {
    setEditingProvider(null);
    setEditForm({ name: "", phone: "", serviceType: "", experience: "", address: "" });
  };

  const getServiceType = (providerDetails) => {
    if (!providerDetails?.serviceType) return null;
    return providerDetails.serviceType.charAt(0).toUpperCase() + 
           providerDetails.serviceType.slice(1);
  };

  const renderPricingDetails = (pricing, serviceType) => {
    if (!pricing || !serviceType) return "Not set";
    
    const servicePricing = pricing[serviceType];
    if (!servicePricing || typeof servicePricing !== 'object') {
      return "Not set";
    }
    
    const priceItems = [];
    
    if (serviceType === "cleaning") {
      if (servicePricing.perSofa > 0) priceItems.push(`Per Sofa: Rs. ${servicePricing.perSofa}`);
      if (servicePricing.perCarpet > 0) priceItems.push(`Per Carpet: Rs. ${servicePricing.perCarpet}`);
      if (servicePricing.perDay > 0) priceItems.push(`Per Day: Rs. ${servicePricing.perDay}`);
      if (servicePricing.perWaterTank > 0) priceItems.push(`Per 1000L Tank: Rs. ${servicePricing.perWaterTank}`);
    } else if (serviceType === "plumbing") {
      if (servicePricing.perJob > 0) priceItems.push(`Per Job: Rs. ${servicePricing.perJob}`);
      if (servicePricing.perHour > 0) priceItems.push(`Per Hour: Rs. ${servicePricing.perHour}`);
      if (servicePricing.perFixture > 0) priceItems.push(`Per Fixture: Rs. ${servicePricing.perFixture}`);
    } else if (serviceType === "painting") {
      if (servicePricing.perRoom > 0) priceItems.push(`Per Room: Rs. ${servicePricing.perRoom}`);
      if (servicePricing.perSqFt > 0) priceItems.push(`Per Sq Ft: Rs. ${servicePricing.perSqFt}`);
      if (servicePricing.perDay > 0) priceItems.push(`Per Day: Rs. ${servicePricing.perDay}`);
    } else if (serviceType === "electrical") {
      if (servicePricing.perInstallation > 0) priceItems.push(`Per Installation: Rs. ${servicePricing.perInstallation}`);
      if (servicePricing.perRepair > 0) priceItems.push(`Per Repair: Rs. ${servicePricing.perRepair}`);
      if (servicePricing.perHour > 0) priceItems.push(`Per Hour: Rs. ${servicePricing.perHour}`);
    }
    
    return priceItems.length === 0 ? "Not set" : priceItems.join(", ");
  };

  if (loading) {
    return (
      <div className="staff-management">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading service providers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="staff-management">
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
    <div className="staff-management">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />

      {/* Confirmation Modal */}
      {confirmAction.show && (
        <div className="confirm-modal" onClick={() => setConfirmAction({ show: false, type: "", id: null, status: null })}>
          <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Action</h3>
            <p>
              Are you sure you want to {confirmAction.status === "blocked" ? "unblock" : "block"} this provider?
            </p>
            <div className="confirm-actions">
              <button
                onClick={confirmBlockAction}
                disabled={actionLoading === confirmAction.id}
                className="confirm-btn confirm-yes"
              >
                {actionLoading === confirmAction.id ? "Processing..." : "Yes"}
              </button>
              <button
                onClick={() => setConfirmAction({ show: false, type: "", id: null, status: null })}
                className="confirm-btn confirm-no"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Provider Details Modal */}
      {viewingProvider && (
        <div className="provider-details-modal" onClick={() => setViewingProvider(null)}>
          <div className="provider-details-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Provider Full Details</h3>
              <button className="close-modal-btn" onClick={() => setViewingProvider(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4>Personal Information</h4>
                <div className="detail-item-full">
                  <span className="detail-label">Name:</span>
                  <span>{viewingProvider.name}</span>
                </div>
                <div className="detail-item-full">
                  <span className="detail-label">Email:</span>
                  <span>{viewingProvider.email}</span>
                </div>
                <div className="detail-item-full">
                  <span className="detail-label">Phone:</span>
                  <span>{viewingProvider.phone || "N/A"}</span>
                </div>
                <div className="detail-item-full">
                  <span className="detail-label">Verified:</span>
                  <span className={viewingProvider.verified ? "verified-badge" : "unverified-badge"}>
                    {viewingProvider.verified ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Service Information</h4>
                <div className="detail-item-full">
                  <span className="detail-label">Service Type:</span>
                  <span className="service-badge">
                    {getServiceType(viewingProvider.providerDetails) || "N/A"}
                  </span>
                </div>
                <div className="detail-item-full">
                  <span className="detail-label">Experience:</span>
                  <span>{viewingProvider.providerDetails?.experience || "N/A"}</span>
                </div>
                <div className="detail-item-full">
                  <span className="detail-label">Address/Skills:</span>
                  <span>{viewingProvider.providerDetails?.address || "N/A"}</span>
                </div>
                <div className="detail-item-full">
                  <span className="detail-label">Status:</span>
                  <span className={`status-badge ${
                    viewingProvider.providerDetails?.status === "approved" ? "approved" :
                    viewingProvider.providerDetails?.status === "pending" ? "pending" :
                    viewingProvider.providerDetails?.status === "blocked" ? "blocked" : "rejected"
                  }`}>
                    {viewingProvider.providerDetails?.status?.charAt(0).toUpperCase() + 
                     viewingProvider.providerDetails?.status?.slice(1) || "N/A"}
                  </span>
                </div>
                {viewingProvider.providerDetails?.citizenship && (
                  <div className="detail-item-full">
                    <span className="detail-label">Citizenship:</span>
                    <span>{viewingProvider.providerDetails.citizenship}</span>
                  </div>
                )}
              </div>

              {viewingProvider.providerDetails?.pricing && (
                <div className="detail-section">
                  <h4>Pricing Information</h4>
                  <div className="detail-item-full">
                    <span className="detail-label">Pricing:</span>
                    <span>{renderPricingDetails(viewingProvider.providerDetails.pricing, viewingProvider.providerDetails.serviceType)}</span>
                  </div>
                </div>
              )}

              {viewingProvider.createdAt && (
                <div className="detail-section">
                  <h4>Account Information</h4>
                  <div className="detail-item-full">
                    <span className="detail-label">Joined:</span>
                    <span>{new Date(viewingProvider.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="staff-header">
        <h2>Service Provider Management</h2>
        <p className="staff-subtitle">
          View, manage, block, and update service providers
        </p>
        <div className="header-controls">
          <div className="staff-count">
            {filteredProviders.length} provider{filteredProviders.length !== 1 ? "s" : ""}
            {serviceFilter !== "all" && ` (${serviceFilter})`}
          </div>
          <div className="filter-section">
            <label className="filter-label">Filter by Service:</label>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="service-filter"
            >
              <option value="all">All Services</option>
              <option value="cleaning">🧹 Cleaning</option>
              <option value="plumbing">🔧 Plumbing</option>
              <option value="painting">🖌️ Painting</option>
              <option value="electrical">⚡ Electrical</option>
            </select>
          </div>
        </div>
      </div>

      {filteredProviders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👷</div>
          <p>
            {serviceFilter === "all"
              ? "No service providers found"
              : `No ${serviceFilter} providers found`}
          </p>
          <p className="empty-subtitle">
            {serviceFilter === "all"
              ? "Service providers will appear here once they register"
              : "Try selecting a different service type"}
          </p>
        </div>
      ) : (
        <div className="staff-grid">
          {filteredProviders.map((provider) => {
            const serviceType = getServiceType(provider.providerDetails);
            const isBlocked = provider.providerDetails?.status === "blocked";
            const isEditing = editingProvider === provider._id;
            
            return (
              <div key={provider._id} className={`staff-card provider-card ${isBlocked ? "blocked" : ""}`}>
                {isBlocked && (
                  <div className="blocked-banner">🚫 Blocked</div>
                )}
                
                <div className="staff-card-header">
                  <div className="staff-avatar provider-avatar">
                    {serviceType === "Cleaning" && "🧹"}
                    {serviceType === "Plumbing" && "🔧"}
                    {serviceType === "Painting" && "🖌️"}
                    {serviceType === "Electrical" && "⚡"}
                    {!serviceType && "👷"}
                  </div>
                  <div className="staff-name-section">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="edit-input"
                        placeholder="Name"
                      />
                    ) : (
                      <h3>{provider.name}</h3>
                    )}
                    <span className="role-badge provider-badge">
                      Service Provider
                    </span>
                  </div>
                </div>

                <div className="staff-details">
                  <div className="detail-row">
                    <span className="detail-icon">📧</span>
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{provider.email}</span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-icon">📞</span>
                    <span className="detail-label">Phone:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="edit-input"
                        placeholder="Phone"
                      />
                    ) : (
                      <span className="detail-value">{provider.phone || "N/A"}</span>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="detail-row">
                      <span className="detail-icon">🔧</span>
                      <span className="detail-label">Service:</span>
                      <select
                        value={editForm.serviceType}
                        onChange={(e) => setEditForm({ ...editForm, serviceType: e.target.value })}
                        className="edit-select"
                      >
                        <option value="">Select Service</option>
                        <option value="cleaning">Cleaning</option>
                        <option value="plumbing">Plumbing</option>
                        <option value="painting">Painting</option>
                        <option value="electrical">Electrical</option>
                      </select>
                    </div>
                  ) : (
                    serviceType && (
                      <div className="detail-row">
                        <span className="detail-icon">🔧</span>
                        <span className="detail-label">Service:</span>
                        <span className="service-badge">{serviceType}</span>
                      </div>
                    )
                  )}

                  {isEditing ? (
                    <div className="detail-row">
                      <span className="detail-icon">⭐</span>
                      <span className="detail-label">Experience:</span>
                      <input
                        type="text"
                        value={editForm.experience}
                        onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                        className="edit-input"
                        placeholder="Years"
                      />
                    </div>
                  ) : (
                    provider.providerDetails?.experience && (
                      <div className="detail-row">
                        <span className="detail-icon">⭐</span>
                        <span className="detail-label">Experience:</span>
                        <span className="detail-value">
                          {provider.providerDetails.experience} years
                        </span>
                      </div>
                    )
                  )}

                  {isEditing ? (
                    <div className="detail-row">
                      <span className="detail-icon">📍</span>
                      <span className="detail-label">Address:</span>
                      <textarea
                        value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        className="edit-textarea"
                        placeholder="Address/Skills"
                        rows="2"
                      />
                    </div>
                  ) : (
                    provider.providerDetails?.address && (
                      <div className="detail-row">
                        <span className="detail-icon">📍</span>
                        <span className="detail-label">Address/Skills:</span>
                        <span className="detail-value">{provider.providerDetails.address}</span>
                      </div>
                    )
                  )}

                  {provider.providerDetails?.status && (
                    <div className="detail-row">
                      <span className="detail-icon">📋</span>
                      <span className="detail-label">Status:</span>
                      <span
                        className={`status-badge ${
                          provider.providerDetails.status === "approved"
                            ? "approved"
                            : provider.providerDetails.status === "pending"
                            ? "pending"
                            : provider.providerDetails.status === "blocked"
                            ? "blocked"
                            : "rejected"
                        }`}
                      >
                        {provider.providerDetails.status.charAt(0).toUpperCase() +
                          provider.providerDetails.status.slice(1)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="provider-actions">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => handleUpdateProvider(provider._id)}
                        disabled={actionLoading === provider._id}
                        className="action-btn update-btn"
                      >
                        {actionLoading === provider._id ? "Saving..." : "💾 Save"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={actionLoading === provider._id}
                        className="action-btn cancel-btn"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setViewingProvider(provider)}
                        className="action-btn view-btn"
                      >
                        👁️ View Details
                      </button>
                      <button
                        onClick={() => handleEditProvider(provider)}
                        className="action-btn edit-btn"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleBlockProvider(provider._id, provider.providerDetails?.status)}
                        disabled={actionLoading === provider._id}
                        className={`action-btn ${isBlocked ? "unblock-btn" : "block-btn"}`}
                      >
                        {actionLoading === provider._id
                          ? "Processing..."
                          : isBlocked
                          ? "🔓 Unblock"
                          : "🚫 Block"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StaffManagement;
