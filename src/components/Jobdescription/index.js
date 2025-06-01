import React from "react";
import { useParams } from "react-router-dom";
import "./index.css";

const JobDetails = ({ jobs }) => {
  const { id } = useParams();

  const job = jobs.find((job) => String(job.id) === id);

  if (!job) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
        Job not found
      </div>
    );
  }

  const {
    title = "N/A",
    position = "N/A",
    company = "N/A",
    duration = "N/A",
    salary = "N/A",
    location = "N/A",
    jobDescription = "No description provided.",
    recruiterName = "N/A"
  } = job;

  const handleApply = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("You must be logged in as a jobseeker to apply.");
      return;
    }
    

    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to apply.");
        return;
      }

      alert("Successfully applied to the job!");
    } catch (err) {
      console.error("Error applying:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="job-details">
      <h2>{title}</h2>

      <div className="format">
        <p><strong>Position:</strong> {position}</p>
        <p><strong>Company:</strong> {company}</p>
      </div>

      <div className="format">
        <p><strong>Duration:</strong> {duration}</p>
        <p><strong>Salary:</strong> {salary}</p>
      </div>

      <div className="format">
        <p><strong>Location:</strong> {location}</p>
        <p><strong>Recruiter:</strong> {recruiterName}</p>
      </div>

      <p className="Jobdisc">
        <strong>Job Description:</strong><br />
        {jobDescription}
      </p>

      <button className="apply-btn" onClick={handleApply}>Apply</button>
    </div>
  );
};

export default JobDetails;
