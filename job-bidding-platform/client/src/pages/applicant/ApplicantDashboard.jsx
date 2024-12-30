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

const ApplicantDashboard = () => {
  const navigate = useNavigate();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyBids = async () => {
      try {
        const response = await api.bids.getByFreelancerId();
        setBids(response.data);
      } catch (err) {
        console.error('Error fetching bids:', err);
        setError('Failed to load your bids');
      } finally {
        setLoading(false);
      }
    };

    fetchMyBids();
  }, []);

  const getBadgeColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
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
        <h1 className="text-3xl font-bold">My Applications</h1>
        <Button 
          onClick={() => navigate('/')}
          className="bg-black hover:bg-gray-800"
        >
          Browse Jobs
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Bids</CardTitle>
            <CardDescription>
              Track the status of your job applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bids.map(bid => (
                <div key={bid.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{bid.job.title}</h3>
                      <p className="text-sm text-gray-500">{bid.job.company}</p>
                    </div>
                    <Badge className={getBadgeColor(bid.status)}>
                      {bid.status}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Your Proposal</p>
                      <p className="mt-1">{bid.proposal}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Details</p>
                      <div className="mt-1 space-y-1">
                        <p className="text-sm">Rate: ${bid.rate}/hr</p>
                        <p className="text-sm">Availability: {bid.availability}</p>
                        <p className="text-sm">
                          Submitted: {new Date(bid.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/jobs/${bid.job.id}`)}
                    >
                      View Job
                    </Button>
                    {bid.status === 'accepted' && (
                      <Button
                        className="bg-black hover:bg-gray-800"
                        onClick={() => navigate(`/messages/${bid.job.id}`)}
                      >
                        Contact Employer
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {bids.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  You haven't submitted any bids yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-2xl font-bold">{bids.length}</p>
                <p className="text-sm text-gray-600">Total Applications</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-2xl font-bold">
                  {bids.filter(bid => bid.status === 'accepted').length}
                </p>
                <p className="text-sm text-gray-600">Accepted</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-2xl font-bold">
                  {bids.filter(bid => bid.status === 'pending').length}
                </p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicantDashboard; 