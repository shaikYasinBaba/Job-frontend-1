import React, { useState } from 'react';
import './index.css';
import axios from 'axios';

const AddJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    position: '',
    company: '',
    duration: '',
    salary: '',
    location: '',
    jobDescription: '',
    recruiterName: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const employerId = localStorage.getItem('userId');

    if (!employerId) {
      return setMessage('Employer ID not found. Please log in again.');
    }

    try {
      const response = await axios.post('https://job-backend-fdm2.onrender.com/api/jobs', {
        employerId,
        ...formData
      });
      setMessage(response.data.message);
      setFormData({
        title: '',
        position: '',
        company: '',
        duration: '',
        salary: '',
        location: '',
        jobDescription: '',
        recruiterName: ''
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'An error occurred while posting the job.'
      );
    }
  };

  return (
    <div className="add-job-container">
      <h2>Post a New Job</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="add-job-form">
        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Job Title" required />
        <input type="text" name="position" value={formData.position} onChange={handleChange} placeholder="Position" required />
        <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company Name" required />
        <input type="text" name="duration" value={formData.duration} onChange={handleChange} placeholder="Job Duration" />
        <input type="text" name="salary" value={formData.salary} onChange={handleChange} placeholder="Salary" />
        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" />
        <textarea name="jobDescription" value={formData.jobDescription} onChange={handleChange} placeholder="Job Description" />
        <input type="text" name="recruiterName" value={formData.recruiterName} onChange={handleChange} placeholder="Recruiter Name" />
        <button type="submit">Post Job</button>
      </form>
    </div>
  );
};

export default AddJob;
