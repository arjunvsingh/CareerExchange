// pages/FreelancerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import api from '../services/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FreelancerDashboard = () => {
  const { user } = useAuth();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchBids = async () => {
      try {
        // In a real app, we'd filter by freelancer ID
        const response = await api.bids.getByFreelancerId(user.id);
        setBids(response.data);
      } catch (err) {
        setError('Failed to fetch bids');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [user.id]);

  const filteredBids = bids.filter(bid => 
    statusFilter === 'all' || bid.status === statusFilter
  );

  const getBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <h1 className="text-2xl font-bold">Your Bids</h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submitted Bids</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Bid Amount</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBids.map((bid) => (
                <TableRow key={bid.id}>
                  <TableCell>{bid.jobTitle}</TableCell>
                  <TableCell>{bid.company}</TableCell>
                  <TableCell>${bid.amount}</TableCell>
                  <TableCell>{bid.estimatedDuration}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getBadgeColor(bid.status)}`}>
                      {bid.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(bid.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredBids.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No bids found matching the selected filter
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FreelancerDashboard;