import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from '../../services/api';

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostedJobs = async () => {
      try {
        const response = await api.jobs.getMyPostedJobs();
        setJobs(response.data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load your posted jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchPostedJobs();
  }, []);

  const viewBids = async (jobId) => {
    try {
      const response = await api.bids.getByJobId(jobId);
      setSelectedJob({
        ...jobs.find(job => job.id === jobId),
        bids: response.data
      });
    } catch (err) {
      console.error('Error fetching bids:', err);
      setError('Failed to load bids for this job');
    }
  };

  const handleDeleteJob = async (jobId, event) => {
    event.stopPropagation(); // Prevent triggering the viewBids click
    
    if (!window.confirm('Are you sure you want to delete this job posting?')) {
      return;
    }

    try {
      await api.jobs.delete(jobId);
      setJobs(jobs.filter(job => job.id !== jobId));
      if (selectedJob?.id === jobId) {
        setSelectedJob(null);
      }
    } catch (err) {
      console.error('Error deleting job:', err);
      setError('Failed to delete job posting');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Employer Dashboard</h1>
        <Button 
          onClick={() => navigate('/post-job')}
          className="bg-black hover:bg-gray-800"
        >
          Post New Job
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Jobs List */}
        <Card>
          <CardHeader>
            <CardTitle>Posted Jobs</CardTitle>
            <CardDescription>
              View and manage your job postings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobs.map(job => (
                <div 
                  key={job.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer relative"
                  onClick={() => viewBids(job.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="text-sm text-gray-500">{job.company}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{job.timeline}</Badge>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => handleDeleteJob(job.id, e)}
                        className="ml-2"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-600">
                      Posted: {new Date(job.created_at).toLocaleDateString()}
                    </span>
                    <Badge>
                      {job.total_bids || 0} Bids
                    </Badge>
                  </div>
                </div>
              ))}

              {jobs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  You haven't posted any jobs yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bids List */}
        <Card>
          <CardHeader>
            <CardTitle>Applicant Bids</CardTitle>
            <CardDescription>
              {selectedJob ? `Bids for ${selectedJob.title}` : 'Select a job to view bids'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedJob ? (
              <div className="space-y-4">
                {selectedJob.bids?.map(bid => (
                  <div key={bid.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">
                          Rate: ${bid.rate}/hr
                        </h4>
                        <p className="text-sm text-gray-600">
                          Available: {bid.availability}
                        </p>
                      </div>
                      <Badge 
                        variant={bid.status === 'pending' ? 'outline' : 'default'}
                      >
                        {bid.status}
                      </Badge>
                    </div>
                    <p className="text-sm mt-2">{bid.proposal}</p>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/applicants/${bid.user_id}`, '_blank')}
                      >
                        View Profile
                      </Button>
                      {bid.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => api.bids.updateStatus(selectedJob.id, bid.id, 'rejected')}
                          >
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            className="bg-black hover:bg-gray-800"
                            onClick={() => api.bids.updateStatus(selectedJob.id, bid.id, 'accepted')}
                          >
                            Accept
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {selectedJob.bids?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No bids received yet
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Select a job to view its bids
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployerDashboard; 