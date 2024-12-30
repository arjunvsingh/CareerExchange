// components/jobs/JobList.jsx
import React, { useState, useMemo } from 'react';
import JobCard from './JobCard';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const JobList = ({ jobs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterByTimeline, setFilterByTimeline] = useState('all');

  const filteredAndSortedJobs = useMemo(() => {
    let processedJobs = [...jobs];

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      processedJobs = processedJobs.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.skills.toLowerCase().includes(searchLower)
      );
    }

    // Filter by timeline
    if (filterByTimeline !== 'all') {
      processedJobs = processedJobs.filter(job => {
        const months = parseInt(job.timeline);
        switch (filterByTimeline) {
          case 'short':
            return months <= 3;
          case 'medium':
            return months > 3 && months <= 6;
          case 'long':
            return months > 6;
          default:
            return true;
        }
      });
    }

    // Sort jobs
    processedJobs.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        default:
          return 0;
      }
    });

    return processedJobs;
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
              <SelectItem value="long">Long Term (6 months)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedJobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
        {filteredAndSortedJobs.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No jobs found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default JobList;