// components/jobs/JobCard.jsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '../../context/authContext';
import BidForm from '../forms/BidForm';

const JobCard = ({ job }) => {
  const { isAuthenticated, isFreelancer } = useAuth();
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);

  const handleBidClick = () => {
    if (!isAuthenticated) {
      // You might want to redirect to login or show a login modal
      alert('Please login to submit a bid');
      return;
    }
    setIsBidModalOpen(true);
  };

  const handleBidSubmitted = () => {
    // You might want to refresh the job data or show a success message
    alert('Bid submitted successfully!');
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{job.title}</CardTitle>
          <CardDescription>{job.company}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <h4 className="font-semibold">Description</h4>
            <p className="text-sm text-gray-600">{job.description}</p>
          </div>
          <div>
            <h4 className="font-semibold">Required Skills</h4>
            <p className="text-sm text-gray-600">{job.skills}</p>
          </div>
          <div>
            <h4 className="font-semibold">Timeline</h4>
            <p className="text-sm text-gray-600">{job.timeline}</p>
          </div>
        </CardContent>
        <CardFooter>
          {isFreelancer && (
            <Button 
              className="w-full" 
              onClick={handleBidClick}
            >
              Place Bid
            </Button>
          )}
        </CardFooter>
      </Card>

      <BidForm
        job={job}
        isOpen={isBidModalOpen}
        onClose={() => setIsBidModalOpen(false)}
        onBidSubmitted={handleBidSubmitted}
      />
    </>
  );
};

export default JobCard;