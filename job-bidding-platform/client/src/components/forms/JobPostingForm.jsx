import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import api from '../../services/api';

const JobPostingForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    skills: '',
    timeline: '',
    requirements: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.jobs.create(formData);
      if (response.success) {
        navigate('/');
      } else {
        setError(response.error || 'Failed to create job posting');
      }
    } catch (err) {
      console.error('Error creating job:', err);
      setError(err.response?.data?.error || 'Failed to create job posting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full">
      <Card className="p-6 w-full">
        <h2 className="text-xl font-semibold mb-6 border-b pb-4">Post a New Job</h2>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Senior Frontend Developer"
                required
                className="mt-1.5"
              />
            </div>

            <div className="flex-1">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your Company Name"
                required
                className="mt-1.5"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the role and responsibilities..."
              rows={6}
              required
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="skills">Required Skills</Label>
            <Textarea
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="List the required skills..."
              rows={4}
              required
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="timeline">Expected Timeline</Label>
            <Input
              id="timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              placeholder="e.g. 3 months, 6 months"
              required
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="requirements">Additional Requirements</Label>
            <Textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="Any additional requirements or notes..."
              rows={4}
              className="mt-1.5"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-black hover:bg-gray-800"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Post Job'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default JobPostingForm;