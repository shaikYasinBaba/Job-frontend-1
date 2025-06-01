// Jobcart.jsx
import React from "react";
import "./index.css";
import { Link } from "react-router-dom";

const Jobcart = ({ job }) => {
  const { id, title, position, company, duration, salary, location, recruiterName } = job;

  return (
    <div className="job-card">
      <Link to={`/jobs/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <h2 className="job-title">{title}</h2>
      </Link>
      <div className="job-details-row">
        <span><strong>Position:</strong> {position}</span>
        <span><strong>Company:</strong> {company}</span>
      </div>
      <div className="job-details-row">
        <span><strong>Duration:</strong> {duration}</span>
        <span><strong>Salary:</strong> {salary}</span>
      </div>
      <div className="job-details-row">
        <span><strong>Location:</strong> {location}</span>
        <span><strong>Recruiter:</strong> {recruiterName}</span>
      </div>
    </div>
  );
};

export default Jobcart;
