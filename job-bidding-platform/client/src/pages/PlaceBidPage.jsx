import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import BidForm from '../components/forms/BidForm';

const PlaceBidPage = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBidForm, setShowBidForm] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await api.jobs.getById(jobId);
        if (response.success) {
          setJob(response.data);
        }
      } catch (err) {
        setError('Failed to load job details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleBidSubmitted = () => {
    navigate('/applicant/dashboard');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!job) {
    return <div>Job not found</div>;
  }

  return (
    <Container className="py-4">
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Job Details</Card.Title>
          <div className="mb-3">
            <h5>{job.title}</h5>
            <p className="text-muted">{job.company}</p>
          </div>
          <div className="mb-3">
            <h6>Description</h6>
            <p>{job.description}</p>
          </div>
          <div className="mb-3">
            <h6>Required Skills</h6>
            <p>{job.skills}</p>
          </div>
          <div className="mb-3">
            <h6>Timeline</h6>
            <p>{job.timeline}</p>
          </div>
        </Card.Body>
      </Card>

      <BidForm 
        job={job}
        isOpen={showBidForm}
        onClose={() => navigate(`/jobs/${jobId}`)}
        onBidSubmitted={handleBidSubmitted}
      />
    </Container>
  );
};

export default PlaceBidPage; 