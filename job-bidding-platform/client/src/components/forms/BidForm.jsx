// components/forms/BidForm.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogButton } from "@/components/ui/dialog-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const BidForm = ({ job, isOpen, onClose, onBidSubmitted }) => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    rateMin: 20,
    rateMax: 50,
    proposal: '',
    startDate: '',
    weeklyHours: '',
    workingHours: '',
    timezone: '',
    milestones: '',
    technicalApproach: '',
    deliverables: '',
    relevantExperience: '',
    portfolioLinks: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRateChange = (values) => {
    setFormData(prev => ({
      ...prev,
      rateMin: values[0],
      rateMax: values[1]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Please login to submit a bid');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const bidData = {
        ...formData,
        jobId: job.id,
        freelancerId: user.id
      };
      
      await api.bids.create(job.id, bidData);
      onBidSubmitted();
      onClose();
    } catch (err) {
      setError('Failed to submit bid. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit a Bid</DialogTitle>
          <DialogDescription>
            Bid for: {job?.title}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basics" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basics">Basics</TabsTrigger>
              <TabsTrigger value="approach">Approach</TabsTrigger>
              <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
            </TabsList>

            <TabsContent value="basics" className="space-y-4">
              {/* Rate Range Slider */}
              <div className="space-y-2">
                <Label>Hourly Rate Range ($)</Label>
                <div className="pt-6">
                  <Slider
                    defaultValue={[formData.rateMin, formData.rateMax]}
                    max={200}
                    min={10}
                    step={5}
                    onValueChange={handleRateChange}
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>${formData.rateMin}/hr</span>
                    <span>${formData.rateMax}/hr</span>
                  </div>
                </div>
              </div>

              {/* Availability Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Available Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weeklyHours">Weekly Availability (hours)</Label>
                  <Input
                    id="weeklyHours"
                    name="weeklyHours"
                    type="number"
                    min="1"
                    max="60"
                    value={formData.weeklyHours}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workingHours">Preferred Working Hours</Label>
                  <Input
                    id="workingHours"
                    name="workingHours"
                    placeholder="e.g. 9 AM - 5 PM"
                    value={formData.workingHours}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Your Timezone</Label>
                  <Input
                    id="timezone"
                    name="timezone"
                    placeholder="e.g. UTC-5, EST"
                    value={formData.timezone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="approach" className="space-y-4">
              {/* Project Understanding Section */}
              <div className="space-y-2">
                <Label htmlFor="proposal">Cover Letter</Label>
                <Textarea
                  id="proposal"
                  name="proposal"
                  value={formData.proposal}
                  onChange={handleChange}
                  placeholder="Introduce yourself and explain why you're the best fit for this job..."
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="milestones">Project Milestones</Label>
                <Textarea
                  id="milestones"
                  name="milestones"
                  value={formData.milestones}
                  onChange={handleChange}
                  placeholder="Break down the project into key milestones and estimated completion dates..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="technicalApproach">Technical Approach</Label>
                <Textarea
                  id="technicalApproach"
                  name="technicalApproach"
                  value={formData.technicalApproach}
                  onChange={handleChange}
                  placeholder="Describe your technical approach, methodology, and tools you plan to use..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliverables">Deliverables</Label>
                <Textarea
                  id="deliverables"
                  name="deliverables"
                  value={formData.deliverables}
                  onChange={handleChange}
                  placeholder="List the specific deliverables you will provide..."
                  className="min-h-[100px]"
                />
              </div>
            </TabsContent>

            <TabsContent value="qualifications" className="space-y-4">
              {/* Qualifications Section */}
              <div className="space-y-2">
                <Label htmlFor="relevantExperience">Relevant Experience</Label>
                <Textarea
                  id="relevantExperience"
                  name="relevantExperience"
                  value={formData.relevantExperience}
                  onChange={handleChange}
                  placeholder="Describe your relevant experience and similar projects you've completed..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolioLinks">Portfolio Links</Label>
                <Textarea
                  id="portfolioLinks"
                  name="portfolioLinks"
                  value={formData.portfolioLinks}
                  onChange={handleChange}
                  placeholder="Share links to relevant portfolio items, GitHub repositories, or live projects..."
                  className="min-h-[100px]"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 pt-4">
            <DialogButton type="button" variant="outline" onClick={onClose}>
              Cancel
            </DialogButton>
            <DialogButton type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Bid'}
            </DialogButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BidForm;