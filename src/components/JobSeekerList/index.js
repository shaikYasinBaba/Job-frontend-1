import React, { useEffect, useState } from 'react';
import './index.css'; // Ensure this contains appropriate styles

const JobSeekerList = () => {
  const [search, setSearch] = useState('');
  const [allJobseekers, setAllJobseekers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedResumes, setExpandedResumes] = useState({}); // track show/hide state

  useEffect(() => {
    fetchJobseekers();
  }, []);

  const fetchJobseekers = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/users/');
      if (!res.ok) throw new Error('Failed to fetch jobseekers');
      const data = await res.json();
      setAllJobseekers(data.filter(user => user.role === 'jobseeker'));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const toggleResume = (id) => {
    setExpandedResumes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredJobseekers = allJobseekers.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    (user.resumeDescription && user.resumeDescription.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <p className="center">Loading...</p>;
  if (error) return <p className="center error">Error: {error}</p>;

  return (
    <div className="jobseeker-list-container">
      <h2>Job Seekers</h2>
      <input
        type="text"
        placeholder="Search by name or resume..."
        value={search}
        onChange={handleSearchChange}
        className="search-input"
      />
      <div className="card-grid">
        {filteredJobseekers.length > 0 ? (
          filteredJobseekers.map((user) => {
            const resume = user.resumeDescription || 'N/A';
            const isExpanded = expandedResumes[user.id];
            const summary = resume.split(' ').slice(0, 25).join(' ') + (resume.split(' ').length > 25 ? '...' : '');

            return (
              <div key={user.id} className="jobseeker-card">
                <h3>{user.name}</h3>
                <div className="job-details-row">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.number}</p>
                </div>
                <h4><strong>Resume:</strong></h4>
                <p style={{ textAlign: 'left' }}>{isExpanded ? resume : summary}</p>
                {resume.split(' ').length > 25 && (
                  <button
                    onClick={() => toggleResume(user.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#007bff",
                      cursor: "pointer",
                      padding: 0
                    }}
                  >
                    {isExpanded ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <p className="center">No job seekers found.</p>
        )}
      </div>
    </div>
  );
};

export default JobSeekerList;
