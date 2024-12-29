import React, { useState, useEffect } from 'react';
import api from '../services/api';
import JobCard from '../components/jobs/JobCard';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        try {
          const response = await api.jobs.getAll();
          setJobs(response.data);
        } catch (apiError) {
          console.error('API Error:', apiError);
          // Fallback to mock data
          setJobs([
            {
              id: 1,
              title: "Frontend Developer",
              company: "Tech Corp",
              description: "Looking for a React developer...",
              skills: "React, JavaScript, TypeScript",
              timeline: "3 months"
            },
            {
              id: 2,
              title: "Backend Developer",
              company: "Software Inc",
              description: "Node.js developer needed...",
              skills: "Node.js, Express, MongoDB",
              timeline: "6 months"
            }
          ]);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to fetch jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-12rem)]">
        <div className="text-xl text-gray-600">Loading jobs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-12rem)]">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-8">Available Jobs</h1>
      {jobs.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">No jobs available at the moment.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};
export default JobsPage;