import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await fetch(`https://job-backend-fdm2.onrender.com/api/jobs/user/${userId}/applied-jobs`);
        let data = await res.json();
        console.log(data)
        const filteredJobs = data.filter(job =>
          job.title && job.title.trim().toLowerCase() !== 'unknown'
        );
        data= filteredJobs

        if (!res.ok) {
          console.error(data.message);
          return;
        }

        setAppliedJobs(data);
      } catch (err) {
        console.error("Error fetching applied jobs:", err);
      }
    };

    if (userId) fetchAppliedJobs();
  }, [userId]);

  const handleCardClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <div className="applied-jobs-container">
      <h2>Jobs You've Applied To</h2>
      {appliedJobs.length === 0 ? (
        <p>No applied jobs found.</p>
      ) : (
        <div className="applied-jobs-list">
          {appliedJobs.map((job) => (
            <div
              key={job.jobId}
              className="job-card"
              onClick={() => handleCardClick(job.jobId)}
              style={{ cursor: 'pointer' }}
            >
              <h2 className="job-title">{job.title}</h2>

              <div className="job-details-row">
                <span><strong>Company:</strong> {job.company}</span>
                <span><strong>Recruiter:</strong> {job.recruiterName}</span>
              </div>

              <div className="job-details-row">
                <span><strong>Location:</strong> {job.location}</span>
                <span><strong>Status:</strong> <span style={{ fontWeight: "bold",
      color: job.status.toLowerCase() === "rejected" ? "red" : "green",}}>{job.status}</span></span>
              </div>

              
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;
