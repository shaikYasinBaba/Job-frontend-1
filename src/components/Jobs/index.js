import React, { useState } from "react";
import Jobcart from "../Jobcart/index.js";
import "./index.css";

const Jobs = ({ jobs, loading, error }) => {
  const [search, setSearch] = useState("");

  const filteredJobs = jobs.filter((job) => {
    const query = search.toLowerCase();
    return (
      job.title.toLowerCase().includes(query) ||
      job.position.toLowerCase().includes(query)
    );
  });

  if (loading) return <p style={{ padding: "20px", textAlign: "center" }}>Loading jobs...</p>;
  if (error) return <p style={{ padding: "20px", textAlign: "center", color: "red" }}>Error: {error}</p>;

  return (
    <div className="jobs-wrapper">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title or position..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="jobs-container">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => <Jobcart key={job.id} job={job} />)
        ) : (
          <p style={{ padding: "20px", textAlign: "center" }}>No jobs found.</p>
        )}
      </div>
    </div>
  );
};

export default Jobs;
