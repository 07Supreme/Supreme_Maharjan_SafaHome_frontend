import React, { useState, useEffect } from "react";
import axios from "axios";
import Notification from "../Common/Notification";
import "./SetPrice.css";

function SetPrice() {
  const [providers, setProviders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  useEffect(() => {
    loadProviders();
  }, []);

  useEffect(() => {
    if (selected) {
      const provider = providers.find((p) => p._id === selected);
      setSelectedProvider(provider);
      if (provider?.providerDetails?.pricing) {
        const serviceType = provider.providerDetails.serviceType;
        const existingPricing = provider.providerDetails.pricing[serviceType] || {};
        
        // Initialize prices based on service type
        if (serviceType === "cleaning") {
          setPrices({
            cleaning: {
              perSofa: existingPricing.perSofa || "",
              perCarpet: existingPricing.perCarpet || "",
              perDay: existingPricing.perDay || "",
              perWaterTank: existingPricing.perWaterTank || ""
            }
          });
        } else if (serviceType === "plumbing") {
          setPrices({
            plumbing: {
              perJob: existingPricing.perJob || "",
              perHour: existingPricing.perHour || "",
              perFixture: existingPricing.perFixture || ""
            }
          });
        } else if (serviceType === "painting") {
          setPrices({
            painting: {
              perRoom: existingPricing.perRoom || "",
              perSqFt: existingPricing.perSqFt || "",
              perDay: existingPricing.perDay || ""
            }
          });
        } else if (serviceType === "electrical") {
          setPrices({
            electrical: {
              perInstallation: existingPricing.perInstallation || "",
              perRepair: existingPricing.perRepair || "",
              perHour: existingPricing.perHour || ""
            }
          });
        }
      } else {
        setPrices({});
      }
    } else {
      setSelectedProvider(null);
      setPrices({});
    }
  }, [selected, providers]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 5000);
  };

  const loadProviders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/providers");
      // Filter for approved providers - check both status and verified
      const approvedProviders = res.data.filter((p) => {
        return p.providerDetails && 
               (p.providerDetails.status === "approved") &&
               p.verified === true;
      });
      setProviders(approvedProviders);
      if (approvedProviders.length === 0 && res.data.length > 0) {
        showNotification("No approved providers found. Please approve providers first.", "info");
      }
    } catch (err) {
      console.error("Error loading providers:", err);
      showNotification("Failed to load providers. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const updatePricing = async (e) => {
    e.preventDefault();
    if (!selected) {
      showNotification("Please select a provider", "warning");
      return;
    }

    try {
      setUpdating(true);
      await axios.put(`http://localhost:5000/api/admin/approve/${selected}`, prices);
      showNotification("✅ Pricing updated successfully!", "success");
      await loadProviders();
    } catch (err) {
      console.error("Error updating pricing:", err);
      showNotification(err.response?.data?.message || "Failed to update pricing. Please try again.", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handlePriceChange = (serviceType, field, value) => {
    setPrices({
      ...prices,
      [serviceType]: {
        ...prices[serviceType],
        [field]: value
      }
    });
  };

  const renderPriceInputs = () => {
    if (!selectedProvider) return null;

    const serviceType = selectedProvider.providerDetails?.serviceType;
    const servicePrices = prices[serviceType] || {};

    if (serviceType === "cleaning") {
      return (
        <div className="price-inputs">
          <div className="price-input-group">
            <label>🧹 Per Sofa</label>
            <div className="input-wrapper">
              <span className="currency">Rs.</span>
              <input
                type="number"
                placeholder="Enter price per sofa"
                value={servicePrices.perSofa || ""}
                onChange={(e) => handlePriceChange("cleaning", "perSofa", e.target.value)}
                min="0"
                className="price-input"
              />
            </div>
          </div>

          <div className="price-input-group">
            <label>🧹 Per Carpet</label>
            <div className="input-wrapper">
              <span className="currency">Rs.</span>
              <input
                type="number"
                placeholder="Enter price per carpet"
                value={servicePrices.perCarpet || ""}
                onChange={(e) => handlePriceChange("cleaning", "perCarpet", e.target.value)}
                min="0"
                className="price-input"
              />
            </div>
          </div>

          <div className="price-input-group">
            <label>🧹 Per Day</label>
            <div className="input-wrapper">
              <span className="currency">Rs.</span>
              <input
                type="number"
                placeholder="Enter price per day"
                value={servicePrices.perDay || ""}
                onChange={(e) => handlePriceChange("cleaning", "perDay", e.target.value)}
                min="0"
                className="price-input"
              />
            </div>
          </div>

          <div className="price-input-group">
            <label>🧹 Per 1000L Water Tank</label>
            <div className="input-wrapper">
              <span className="currency">Rs.</span>
              <input
                type="number"
                placeholder="Enter price per 1000L tank"
                value={servicePrices.perWaterTank || ""}
                onChange={(e) => handlePriceChange("cleaning", "perWaterTank", e.target.value)}
                min="0"
                className="price-input"
              />
            </div>
          </div>
        </div>
      );
    } else if (serviceType === "plumbing") {
      return (
        <div className="price-inputs">
          <div className="price-input-group">
            <label>🔧 Per Job</label>
            <div className="input-wrapper">
              <span className="currency">Rs.</span>
              <input
                type="number"
                placeholder="Enter price per job"
                value={servicePrices.perJob || ""}
                onChange={(e) => handlePriceChange("plumbing", "perJob", e.target.value)}
                min="0"
                className="price-input"
              />
            </div>
          </div>

          <div className="price-input-group">
            <label>🔧 Per Hour</label>
            <div className="input-wrapper">
              <span className="currency">Rs.</span>
              <input
                type="number"
                placeholder="Enter price per hour"
                value={servicePrices.perHour || ""}
                onChange={(e) => handlePriceChange("plumbing", "perHour", e.target.value)}
                min="0"
                className="price-input"
              />
            </div>
          </div>

          <div className="price-input-group">
            <label>🔧 Per Fixture</label>
            <div className="input-wrapper">
              <span className="currency">Rs.</span>
              <input
                type="number"
                placeholder="Enter price per fixture"
                value={servicePrices.perFixture || ""}
                onChange={(e) => handlePriceChange("plumbing", "perFixture", e.target.value)}
                min="0"
                className="price-input"
              />
            </div>
          </div>
        </div>
      );
    } else if (serviceType === "painting") {
      return (
        <div className="price-inputs">
          <div className="price-input-group">
            <label>🖌️ Per Room</label>
            <div className="input-wrapper">
              <span className="currency">Rs.</span>
              <input
                type="number"
                placeholder="Enter price per room"
                value={servicePrices.perRoom || ""}
                onChange={(e) => handlePriceChange("painting", "perRoom", e.target.value)}
                min="0"
                className="price-input"
              />
            </div>
          </div>

          <div className="price-input-group">
            <label>🖌️ Per Square Foot</label>
            <div className="input-wrapper">
              <span className="currency">Rs.</span>
              <input
                type="number"
                placeholder="Enter price per sq ft"
                value={servicePrices.perSqFt || ""}
                onChange={(e) => handlePriceChange("painting", "perSqFt", e.target.value)}
                min="0"
                className="price-input"
              />
            </div>
          </div>

          <div className="price-input-group">
            <label>🖌️ Per Day</label>
            <div className="input-wrapper">
              <span className="currency">Rs.</span>
              <input
                type="number"
                placeholder="Enter price per day"
                value={servicePrices.perDay || ""}
                onChange={(e) => handlePriceChange("painting", "perDay", e.target.value)}
                min="0"
                className="price-input"
              />
            </div>
          </div>
        </div>
      );
    } else if (serviceType === "electrical") {
      return (
        <div className="price-inputs">
          <div className="price-input-group">
            <label>⚡ Per Installation</label>
            <div className="input-wrapper">
              <span className="currency">Rs.</span>
              <input
                type="number"
                placeholder="Enter price per installation"
                value={servicePrices.perInstallation || ""}
                onChange={(e) => handlePriceChange("electrical", "perInstallation", e.target.value)}
                min="0"
                className="price-input"
              />
            </div>
          </div>

          <div className="price-input-group">
            <label>⚡ Per Repair</label>
            <div className="input-wrapper">
              <span className="currency">Rs.</span>
              <input
                type="number"
                placeholder="Enter price per repair"
                value={servicePrices.perRepair || ""}
                onChange={(e) => handlePriceChange("electrical", "perRepair", e.target.value)}
                min="0"
                className="price-input"
              />
            </div>
          </div>

          <div className="price-input-group">
            <label>⚡ Per Hour</label>
            <div className="input-wrapper">
              <span className="currency">Rs.</span>
              <input
                type="number"
                placeholder="Enter price per hour"
                value={servicePrices.perHour || ""}
                onChange={(e) => handlePriceChange("electrical", "perHour", e.target.value)}
                min="0"
                className="price-input"
              />
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="set-price">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading providers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="set-price">
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: "", type: "" })}
        />
      )}

      <div className="price-header">
        <h2>Set Provider Pricing</h2>
        <p className="price-subtitle">Update pricing for approved service providers based on their service type</p>
      </div>

      {providers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>No approved providers found</p>
          <p className="empty-subtitle">Approve providers first to set their pricing</p>
        </div>
      ) : (
        <>
          <div className="provider-select-section">
            <label className="select-label">Select Provider</label>
            <select
              value={selected || ""}
              onChange={(e) => setSelected(e.target.value)}
              className="provider-select"
            >
              <option value="" disabled>
                Choose a provider...
              </option>
              {providers.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} - {p.providerDetails?.serviceType
                    ? p.providerDetails.serviceType.charAt(0).toUpperCase() +
                      p.providerDetails.serviceType.slice(1)
                    : "N/A"}
                </option>
              ))}
            </select>
          </div>

          {selectedProvider && (
            <div className="price-form-container">
              <div className="provider-info-card">
                <h3>Provider Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">👤 Name:</span>
                    <span>{selectedProvider.name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">📧 Email:</span>
                    <span>{selectedProvider.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">📞 Phone:</span>
                    <span>{selectedProvider.phone || "N/A"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">🔧 Service:</span>
                    <span className="service-tag">
                      {selectedProvider.providerDetails?.serviceType
                        ? selectedProvider.providerDetails.serviceType
                            .charAt(0)
                            .toUpperCase() +
                          selectedProvider.providerDetails.serviceType.slice(1)
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <form onSubmit={updatePricing} className="price-form">
                <h3>
                  Set {selectedProvider.providerDetails?.serviceType
                    ? selectedProvider.providerDetails.serviceType.charAt(0).toUpperCase() +
                      selectedProvider.providerDetails.serviceType.slice(1)
                    : "Service"} Pricing
                </h3>
                {renderPriceInputs()}

                <button
                  type="submit"
                  disabled={updating}
                  className="update-btn"
                >
                  {updating ? "Updating..." : "💾 Update Pricing"}
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SetPrice;
