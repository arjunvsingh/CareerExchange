import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await api.jobs.getById(id);
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
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!job) {
    return <div>Job not found</div>;
  }

  return (
    <Container className="py-4">
      <Card>
        <Card.Body>
          <Card.Title className="h3 mb-4">{job.title}</Card.Title>
          
          <Row className="mb-4">
            <Col md={6}>
              <h5>Company</h5>
              <p>{job.company}</p>
            </Col>
            <Col md={6}>
              <h5>Posted by</h5>
              <p>{job.employer_name}</p>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <h5>Description</h5>
              <p>{job.description}</p>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <h5>Required Skills</h5>
              <p>{job.skills}</p>
            </Col>
            <Col md={6}>
              <h5>Timeline</h5>
              <p>{job.timeline}</p>
            </Col>
          </Row>

          {job.requirements && (
            <Row className="mb-4">
              <Col>
                <h5>Additional Requirements</h5>
                <p>{job.requirements}</p>
              </Col>
            </Row>
          )}

          <div className="d-flex justify-content-between align-items-center">
            <Button variant="secondary" onClick={() => navigate('/')}>
              Back to Jobs
            </Button>
            
            {user && user.role === 'applicant' && (
              <Button 
                variant="primary"
                onClick={() => navigate(`/jobs/${id}/bid`)}
              >
                Place Bid
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default JobDetailsPage; 