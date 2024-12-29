// components/forms/BidForm.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from '../../context/authContext';
import api from '../../services/api';

const BidForm = ({ job, isOpen, onClose, onBidSubmitted }) => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    proposal: '',
    estimatedDuration: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      <DialogContent className="sm:max-w-[425px]">
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Bid Amount ($)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter your bid amount"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedDuration">Estimated Duration</Label>
            <Input
              id="estimatedDuration"
              name="estimatedDuration"
              value={formData.estimatedDuration}
              onChange={handleChange}
              placeholder="e.g. 2 weeks, 1 month"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proposal">Your Proposal</Label>
            <Textarea
              id="proposal"
              name="proposal"
              value={formData.proposal}
              onChange={handleChange}
              placeholder="Describe why you're the best fit for this job..."
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Bid'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BidForm;