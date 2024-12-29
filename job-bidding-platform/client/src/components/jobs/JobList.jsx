// components/jobs/JobList.jsx
import React, { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import JobCard from './JobCard';

const JobList = ({ jobs, onBidSubmitted }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterByTimeline, setFilterByTimeline] = useState('all');

  const filteredAndSortedJobs = useMemo(() => {
    let result = [...jobs];

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.skills.toLowerCase().includes(searchLower)
      );
    }

    // Filter by timeline
    if (filterByTimeline !== 'all') {
      result = result.filter(job => {
        const timeline = job.timeline.toLowerCase();
        switch (filterByTimeline) {
          case 'short':
            return timeline.includes('week') || 
                   (timeline.includes('month') && parseInt(timeline) <= 3);
          case 'medium':
            return timeline.includes('month') && 
                   parseInt(timeline) > 3 && 
                   parseInt(timeline) <= 6;
          case 'long':
            return timeline.includes('month') && parseInt(timeline) > 6 ||
                   timeline.includes('year');
          default:
            return true;
        }
      });
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      default:
        return result;
    }
  }, [jobs, searchTerm, sortBy, filterByTimeline]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterByTimeline} onValueChange={setFilterByTimeline}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by timeline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Timelines</SelectItem>
              <SelectItem value="short">Short Term (≤ 3 months)</SelectItem>
              <SelectItem value="medium">Medium Term (3-6 months)</SelectItem>
              <SelectItem value="long">Long Term (> 6 months)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedJobs.map((job) => (
          <JobCard 
            key={job.id} 
            job={job} 
            onBidSubmitted={onBidSubmitted}
          />
        ))}
      </div>

      {filteredAndSortedJobs.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No jobs found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default JobList;