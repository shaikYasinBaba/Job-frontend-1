import React, { useEffect, useState } from 'react';
import './index.css';
import { useParams } from 'react-router-dom';

const JobApplicationsViewer = () => {
  const { jobId } = useParams(); 
  const [applicants, setApplicants] = useState([]);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const res = await fetch(`https://job-backend-fdm2.onrender.com/api/jobs/${jobId}/applications?employerId=${userId}`);
        if (!res.ok) throw new Error('Failed to load applications');
        const data = await res.json();
        setApplicants(data);
      } catch (err) {
        setError(err.message);
      }
    };
    if (jobId) fetchApplicants();
  }, [jobId]);

  const handleStatusChange = async (applicantId, newStatus, index) => {
    try {
      const res = await fetch(`https://job-backend-fdm2.onrender.com/api/jobs/${jobId}/applications/${applicantId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update status');
      }

      const updatedApplicants = [...applicants];
      updatedApplicants[index].status = newStatus;
      setApplicants(updatedApplicants);
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  if (error) return <p className="center error">{error}</p>;

  return (
    <div className="jobseeker-list-container">
      <h2 style={{ margin: "20px" }}>Applicants for Job</h2>
      <div className="card-grid">
        {applicants.length === 0 ? (
          <p className="center">No applications found.</p>
        ) : (
          applicants.map((applicant, index) => {
            const isExpanded = expanded === index;
            const summary = applicant.resumeDescription?.split('\n')[0] || 'N/A';

            return (
              <div key={applicant.applicantId} className="jobseeker-card">
                <div className="job-details-row">
                  <p><strong>Name:</strong> {applicant.name}</p>
                  <p><strong>Email:</strong> {applicant.email}</p>
                </div>
                <div className="job-details-row">
                  <div className="status-update-section">
                  <label htmlFor={`status-${index}`}><strong>Update Status:</strong></label>
                  <select
                    id={`status-${index}`}
                    value={applicant.status}
                    onChange={(e) => handleStatusChange(applicant.applicantId, e.target.value, index)}
                  >
                    <option value="applied">Applied</option>
                    <option value="viewed">Viewed</option>
                    <option value="selected for next step">Selected for Next Step</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div> <p>
                    <strong>Status:</strong>{' '}
                    <span className={applicant.status === 'rejected' ? 'status-rejected' : 'status-applied'}>
                      {applicant.status}
                    </span>
                   

                  </p> </div>
                </div>
                <div className="job-details-row">
                  <p><strong>Phone:</strong> {applicant.number}</p>
                 </div>
                

                <div className="resume-section">
                  <strong>Resume Summary:</strong>
                  <p style={{ textAlign: 'center' }}>
                    {isExpanded ? applicant.resumeDescription : summary}
                  </p>
                  {applicant.resumeDescription?.split('\n').length > 1 && (
                    <button
                      className="toggle-btn"
                      onClick={() => setExpanded(isExpanded ? null : index)}
                    >
                      {isExpanded ? 'Show Less' : 'Read More'}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default JobApplicationsViewer;
