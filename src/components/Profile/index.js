import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const Profile = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (!userId) return navigate("/");

    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${userId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch user");
        setUser(data);
        setUpdateData({
          name: data.name || "",
          number: data.number || "",
          resumeDescription: data.resumeDescription || "",
          companyDescription: data.companyDescription || "",
        });

        // If user is employer, fetch their posted jobs
        if (data.role === "employer") {
          const jobRes = await fetch(`http://localhost:5000/api/jobs/employer/${userId}`);
          const jobData = await jobRes.json();
          if (!jobRes.ok) throw new Error(jobData.message || "Failed to fetch jobs");
          setJobs(jobData);
        }
      } catch (err) {
        console.error(err);
        alert("Could not load user profile");
      }
    };

    fetchUser();
  }, [userId, navigate]);

  const handleChange = (e) => {
    setUpdateData({ ...updateData, [e.target.name]: e.target.value });
  };
  
  const handleUpdate = async () => {
    const filteredData = {};
    for (const key in updateData) {
      if (updateData[key] && user[key] !== updateData[key]) {
        filteredData[key] = updateData[key];
      }
    }

    if (Object.keys(filteredData).length === 0) {
      alert("No changes to update.");
      setEditMode(false);
      return;
    }

    try {
      const res = await fetch(`https://job-backend-fdm2.onrender.com/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filteredData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");
      alert("Profile updated successfully");
      setUser(data.user);
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  if (!user) return <div className="loading">Loading profile...</div>;
 
  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`https://job-backend-fdm2.onrender.com/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ employerId: user.id })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert(data.message);
        // remove job from UI
        setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
      } else {
        alert(data.message || "Failed to delete the job.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Server error while deleting job.");
    }
  };
                                                                       
  
  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <h2 className="profile-title">My Profile Details</h2>
        <p className="role-badge">{user.role.toUpperCase()}</p>

        {!editMode ? (
          <div className="profile-info">
            <div className="new"> 
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            </div>
            <div className="new_1"> 
            <p><strong>Phone Number:</strong> {user.number || "N/A"}</p>
            </div>
            {user.role === "jobseeker" && (
              <div>
                <p><strong>Resume Description:</strong></p>
                <p className="multi-line">{user.resumeDescription || "N/A"}</p>
              </div>
            )}
            {user.role === "employer" && (
              <div>
                <p><strong>Company Description:</strong></p>
                <p className="multi-line">{user.companyDescription || "N/A"}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="edit-form">
            <label>
              Name:
              <input
                name="name"
                value={updateData.name}
                onChange={handleChange}
              />
            </label>
            <label>
              Phone Number:
              <input
                name="number"
                value={updateData.number}
                onChange={handleChange}
              />
            </label>
            {user.role === "jobseeker" && (
              <label>
                Resume Description:
                <textarea
                  name="resumeDescription"
                  value={updateData.resumeDescription}
                  onChange={handleChange}
                />
              </label>
            )}
            {user.role === "employer" && (
              <label>
                Company Description:
                <textarea
                  name="companyDescription"
                  value={updateData.companyDescription}
                  onChange={handleChange}
                />
              </label>
            )}
          </div>
        )}

        <div className="profile-buttons">
          {editMode ? (
            <>
              <button className="btn primary" onClick={handleUpdate}>Save</button>
              <button className="btn" onClick={() => setEditMode(false)}>Cancel</button>
            </>
          ) : (
            <button className="btn primary" onClick={() => setEditMode(true)}>Edit</button>
          )}
          <button className="btn danger" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* JOB POSTS SECTION */}
{user.role === "employer" && jobs.length > 0 && (
  <div className="jobs-container profile-card" style={{ marginTop: "30px" }}>
    <h3 style={{ margin: "10px 0", color: "#2c3e50", width: "100%" }}>Your Job Posts</h3>
    {jobs.map((job) => (
      <div key={job.id} className="job-card">
        <h2 className="job-title">{job.title}</h2>
        <div className="job-details-row">
          <span><strong>Position:</strong> {job.position}</span>
          <span><strong>Company:</strong> {job.company}</span>
        </div>
        <div className="job-details-row">
          <span><strong>Location:</strong> {job.location || "N/A"}</span>
          <span><strong>Salary:</strong> {job.salary || "N/A"}</span>
        </div>
        <div className="job-details-row">
          <span><strong>Duration:</strong> {job.duration || "N/A"}</span>
          <span><strong>Recruiter:</strong> {job.recruiterName || "N/A"}</span>
        </div>
        
      
          <div className="job-buttons">
    <button
      className="btn secondary"
      onClick={() => navigate(`/applications/${job.id}`)}
    >
      View Applications
    </button>
    <button
      onClick={() => handleDelete(job.id)}
      className="btn danger"
    >
      Delete
    </button>
  </div>

      </div>
    ))}
  </div>
)}

    </div>
  );
};

export default Profile;
