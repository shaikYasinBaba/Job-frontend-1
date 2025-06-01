import React, { useState } from "react";
import "./index.css";

const Footer = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({ name: "", passcode: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("https://job-backend-fdm2.onrender.com/api/admin/clear-db", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", passcode: "" });
      } else {
        setStatus("error");
        setErrorMsg(data.message || "Invalid credentials.");
      }
    } catch (err) {
      console.error("Clear DB error:", err);
      setStatus("error");
      setErrorMsg("Server error.");
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setStatus("idle");
    setFormData({ name: "", passcode: "" });
    setErrorMsg("");
  };

  return (
    <>
      <footer className="footer">
        <div className="footer-content">
          <p><strong>SHAIK YASIN BABA</strong></p>
          <p>Suryapet, Telangana, 508206</p>
          <p>📞 9381125634 | 📧 <a href="mailto:shaikyasinbaba6@gmail.com">shaikyasinbaba6@gmail.com</a></p>
          <p>
            🔗 <a href="https://www.linkedin.com/in/yasinbaba-shaik" target="_blank" rel="noopener noreferrer">LinkedIn</a> | 
            💻 <a href="https://github.com/shaikYasinBaba" target="_blank" rel="noopener noreferrer">GitHub</a> | 
            🧹 <span className="clear-db-link" onClick={() => setShowPopup(true)}>Clear DB</span>
          </p>
        </div>
      </footer>

      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-modal" onClick={(e) => e.stopPropagation()}>
            {status === "success" ? (
              <div className="success-message">
                ✅ All data cleared successfully!
                <button className="btn" onClick={closePopup}>Close</button>
              </div>
            ) : (
              <>
                <h3>Confirm Clear Database</h3>
                <form onSubmit={handleSubmit}>
                  <label>
                    Name:
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={status === "loading"}
                    />
                  </label>
                  <label>
                    Passcode:
                    <input
                      type="password"
                      name="passcode"
                      value={formData.passcode}
                      onChange={handleChange}
                      required
                      disabled={status === "loading"}
                    />
                  </label>
                  {errorMsg && <p className="error-text">❌ {errorMsg}</p>}
                  <div className="modal-buttons">
                    <button type="submit" className="btn danger" disabled={status === "loading"}>
                      {status === "loading" ? "Clearing..." : "Confirm"}
                    </button>
                    <button type="button" className="btn" onClick={closePopup} disabled={status === "loading"}>
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
