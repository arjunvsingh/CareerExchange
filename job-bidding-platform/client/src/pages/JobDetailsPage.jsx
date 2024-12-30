import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from '../services/api';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await api.jobs.getById(id);
        setJob(response.data);
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Failed to load job details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
          <Button onClick={() => navigate('/')}>Back to Job Board</Button>
        </div>
      </div>
    );
  }

  const skillsList = job.skills.split(',').map(skill => skill.trim());

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start mb-4">
            <div>
              <CardTitle className="text-3xl mb-2">{job.title}</CardTitle>
              <CardDescription className="text-xl">{job.company}</CardDescription>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-1">
              {job.timeline}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skillsList.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {job.requirements && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Additional Requirements</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{job.requirements}</p>
            </div>
          )}

          <div className="flex justify-between items-center pt-6">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
            >
              Back to Job Board
            </Button>
            <Button
              onClick={() => navigate(`/jobs/${id}/bid`)}
              className="bg-black hover:bg-gray-800"
            >
              Place Bid
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobDetailsPage; 