// pages/EmployerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import api from '../services/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const EmployerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // In a real app, we'd filter by employer ID
        const response = await api.jobs.getAll();
        setJobs(response.data.filter(job => job.employerId === user.id));
      } catch (err) {
        setError('Failed to fetch jobs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user.id]);

  const fetchBidsForJob = async (jobId) => {
    try {
      const response = await api.bids.getByJobId(jobId);
      setBids(response.data);
      setSelectedJob(jobs.find(job => job.id === jobId));
    } catch (err) {
      console.error('Failed to fetch bids:', err);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Posted Jobs</h1>
        <Button onClick={() => navigate('/post-job')}>Post New Job</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Jobs List */}
        <Card>
          <CardHeader>
            <CardTitle>Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Bids</TableHead>
                  <TableHead>Posted Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>{job.title}</TableCell>
                    <TableCell>{job.bidCount || 0}</TableCell>
                    <TableCell>
                      {new Date(job.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        onClick={() => fetchBidsForJob(job.id)}
                      >
                        View Bids
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Bids for Selected Job */}
        {selectedJob && (
          <Card>
            <CardHeader>
              <CardTitle>Bids for {selectedJob.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Freelancer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bids.map((bid) => (
                    <TableRow key={bid.id}>
                      <TableCell>{bid.freelancerName}</TableCell>
                      <TableCell>${bid.amount}</TableCell>
                      <TableCell>{bid.estimatedDuration}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          onClick={() => {/* View bid details */}}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;