import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react';

import Jobs from './components/Jobs';
import Navbar from './components/Nav';
import JobDetails from "./components/Jobdescription"
import Footer from './components/Footer';
import Login from './components/Login';
import Profile from './components/Profile';
import JobSeekerList from './components/JobSeekerList';
import AddJob from './components/Addjob';
import AppliedJobs from './components/AppliedJobs';
import JobApplicationsViewer from "./components/JobApplicationsViewer"

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch jobs once in App and share with all components
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/jobs");
        if (!res.ok) {
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Jobs jobs={jobs} loading={loading} error={error} />} />
          <Route path="/jobs/:id" element={<JobDetails jobs={jobs} />} /> {/* ✅ Add this */}
          <Route path='/login' element={<Login />} />
          <Route path='/profile' element={<Profile />} />
          <Route path="/applied-jobs" element={<AppliedJobs />} />

          <Route path='/addjob' element={<AddJob />} />
          <Route path='/jobseekers' element={<JobSeekerList />} />
          <Route path="/applications/:jobId" element={<JobApplicationsViewer />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
